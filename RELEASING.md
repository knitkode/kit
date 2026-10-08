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

## One-time setup

Repository admins need to do these steps once. The first release has an extra bootstrap step, because npm can only configure trusted publishing for packages that already exist.

### GitHub

1. **Settings → Actions → General**: enable _Allow GitHub Actions to create and approve pull requests_. The Version Packages PR needs it.
2. **Settings → Environments**: create an environment named `npm`, optionally with required reviewers.
3. Install the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) on `knitkode/kit`. Without it the Preview workflow fails.
4. Optional: pull requests opened by the default `GITHUB_TOKEN` don't trigger CI, so the Version Packages PR shows no checks. The Release workflow re-runs the full verify gate before publishing anyway. If you want checks on that PR too, pass a GitHub App token to the `version` job ([how](https://changesets.dev/guide/automating#run-github-actions-for-version-prs)).

### npm

1. Make sure the [`knitkode` npm organization](https://www.npmjs.com/org/knitkode) exists and that you can publish to it.
2. **First release only (bootstrap).**
   1. On npmjs.com, create a granular access token: read and write access to the `@knitkode` scope, _Bypass two-factor authentication_ enabled, shortest expiration available. npm warns that bypass tokens are risky and points to trusted publishing: that is expected, trusted publishing can't be set up before the packages exist.
   2. Save it as the `NPM_TOKEN` secret of the `npm` environment, never of the repository, so only the `publish` job on `main` can read it: `gh secret set NPM_TOKEN --env npm -R knitkode/kit`.
   3. Merge the Version Packages PR for `3.0.0`. The `publish` job uses the token, still with provenance.
3. **Trusted publishing.** For each of the six packages, open _Settings → Trusted publishing_ on npmjs.com and add a GitHub Actions publisher:
   - organization or user: `knitkode`
   - repository: `kit`
   - workflow filename: `release.yml`
   - environment: `npm`
4. Delete the secret (`gh secret delete NPM_TOKEN --env npm -R knitkode/kit`) and revoke the token on npmjs.com. From now on npm authenticates the `publish` job through OIDC. Optionally, set each package to _Require two-factor authentication and disallow tokens_.

npm is phasing out 2FA-bypass tokens for direct publishing (around January 2027). Do the bootstrap before then, or publish the first version by hand with 2FA.

### Retiring `@koine/*`

Once `3.0.0` is out, point users of the old packages to the new ones:

```bash
for p in api browser dom node react utils; do
  npm deprecate "@koine/$p" "Moved to @knitkode/$p, see https://github.com/knitkode/kit/blob/main/docs/migrating-to-v3.md"
done
```

## When something goes wrong

- **The publish job failed** (npm outage, auth error): fix the cause and re-run the failed jobs of that workflow run. `changeset publish` skips versions that are already on npm, so a partial publish is completed on re-run.
- **CI fails on the Version Packages PR**: push a fix to `main`, the PR is regenerated.
- **A broken version was published**: don't unpublish. Merge a fix with a `patch` changeset and release again. If needed, `npm deprecate @knitkode/<name>@<version> "<reason>"`.
