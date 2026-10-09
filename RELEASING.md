# Releasing

Releases are automated with [Changesets](https://changesets.dev) and GitHub Actions. Nobody publishes from their machine.

## How it works

- **Fixed versioning.** All six `@knitkode/*` packages always share the same version. Any changeset bumps all of them to the same next version. The private `@knitkode/test` package is never versioned or published.
- **Changesets in pull requests.** Every PR that changes a published package adds a changeset file (`pnpm changeset`), with a semver bump type and a summary written for users. The [Changeset status](.github/workflows/changeset-status.yml) workflow comments on each PR whether one is present.
- **A "Version Packages" pull request.** On every push to `main`, the [Release](.github/workflows/release.yml) workflow collects the pending changesets into one pull request, titled `chore(release): version packages`. It bumps the versions and updates each package's `CHANGELOG.md` with PR and author links. New changesets merged to `main` update the same PR.
- **Merging that PR releases.** The next run finds no pending changesets but unpublished versions. It runs the full verify gate (`pnpm verify`), packs the packages, and publishes them to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements). It then creates one `@knitkode/<name>@<version>` git tag and GitHub release per package.
- **Least privilege.** Only the `publish` job can mint the OIDC token npm uses for [trusted publishing](https://docs.npmjs.com/trusted-publishers), and it runs in the `npm` environment. Add required reviewers to that environment to approve each publish by hand.
- **Previews without npm.** The [Preview](.github/workflows/preview.yml) workflow publishes every PR and `main` commit to [pkg.pr.new](https://pkg.pr.new), so changes can be installed and tested before a release.

## Prereleases

To ship a series of prereleases (e.g. `3.1.0-next.0`, `3.1.0-next.1`) on the `next` npm dist-tag:

```bash
pnpm changeset pre enter next   # commit the generated .changeset/pre.json
```

Merge as usual: each Version Packages PR now produces a `-next.N` version, published with the `next` tag. When the release is ready:

```bash
pnpm changeset pre exit         # the next Version Packages PR is the stable release
```

See the [Changesets prerelease guide](https://changesets.dev/guide/prereleases) for the details.

## Repository setup

These settings are already in place. They're listed here so they can be checked or recreated.

### GitHub

- **Settings → Actions → General**: _Allow GitHub Actions to create and approve pull requests_ is enabled (the Version Packages PR needs it) and the default workflow token is read-only (each workflow declares its own permissions).
- **Settings → Environments**: the `npm` environment only accepts deployments from `main`. Add required reviewers to it to approve each publish by hand.
- **Settings → Pages**: the source is _GitHub Actions_, used by the [Docs](.github/workflows/docs.yml) workflow.
- The [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) is installed. Without it the Preview workflow fails.
- No secrets: npm authenticates the `publish` job through OIDC.
- Pull requests opened by the default `GITHUB_TOKEN` don't trigger CI, so the Version Packages PR shows failed or missing checks. The Release workflow re-runs the full verify gate before publishing anyway. If you want real checks on that PR, pass a GitHub App token to the `version` job ([how](https://changesets.dev/guide/automating#run-github-actions-for-version-prs)).

### npm

Each package on npmjs.com has a trusted publisher (_Settings → Trusted publishing_) of type GitHub Actions:

- organization or user: `knitkode`
- repository: `kit`
- workflow filename: `release.yml`
- environment: `npm`
- allowed actions: `npm publish` only (Changesets can't drive staged publishing yet, and the workflow never runs `npm dist-tag`)

Renaming `release.yml` or the `npm` environment breaks publishing until the trusted publishers are updated.

### Adding a package

npm can only attach a trusted publisher to a package that already exists, so a new `@knitkode/<name>` needs one manual publish first:

1. Publish a placeholder from your machine, authenticating with your own 2FA:

   ```bash
   mkdir /tmp/placeholder && cd /tmp/placeholder
   echo '{ "name": "@knitkode/<name>", "version": "0.0.0-bootstrap", "description": "Placeholder, install a real version", "license": "MIT" }' > package.json
   npm publish --access public --tag bootstrap
   ```

2. Add the trusted publisher described above to the new package.
3. Add the package to the `fixed` group in [.changeset/config.json](.changeset/config.json), to [typedoc.config.js](typedoc.config.js), to the [Preview](.github/workflows/preview.yml) workflow and to the table in [README.md](README.md).
4. Release it with a changeset as usual, then clean up the placeholder:

   ```bash
   npm dist-tag rm @knitkode/<name> bootstrap
   npm deprecate @knitkode/<name>@0.0.0-bootstrap "Placeholder, install a real version"
   ```

### Retiring `@koine/*`

Once `3.0.0` is out, point users of the old packages to the new ones:

```bash
for p in api browser dom node react utils; do
  npm deprecate "@koine/$p" "Moved to @knitkode/$p, see https://github.com/knitkode/kit/blob/main/docs/migrating-to-v3.md"
done
```

## When something goes wrong

- **The publish job failed** (npm outage, auth error): fix the cause and re-run the failed jobs of that workflow run. `changeset publish` skips versions that are already on npm, so a partial publish is completed on re-run.
- **npm answers `E404 Not Found - PUT`**: npm rejected the authentication for that package. Check that its trusted publisher matches the repository, `release.yml` and the `npm` environment exactly.
- **Packages are missing on npm right after a successful publish**: brand new packages can take a few minutes to appear in the registry.
- **CI fails on the Version Packages PR**: push a fix to `main`, the PR is regenerated.
- **A broken version was published**: don't unpublish. Merge a fix with a `patch` changeset and release again. If needed, `npm deprecate @knitkode/<name>@<version> "<reason>"`.
