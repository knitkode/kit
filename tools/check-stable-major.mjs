// kit stays on its current major version (see RELEASING.md), this fails when:
// - a changeset asks for a `major` bump
// - an entry point published on npm (a key of `exports`) is missing locally
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

const errors = [];

for (const file of readdirSync(".changeset")) {
  if (!file.endsWith(".md") || file === "README.md") continue;
  const content = readFileSync(`.changeset/${file}`, "utf8");
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  for (const line of frontmatter.split("\n")) {
    if (/:\s*major\s*$/.test(line)) {
      errors.push(`.changeset/${file} asks for a major bump: ${line.trim()}`);
    }
  }
}

for (const dir of readdirSync("packages")) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(`packages/${dir}/package.json`, "utf8"));
  } catch {
    continue;
  }
  if (pkg.private) continue;

  let published;
  try {
    const out = execFileSync(
      "npm",
      ["view", `${pkg.name}@latest`, "exports", "--json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    published = out.trim() ? JSON.parse(out) : {};
  } catch (error) {
    // never published (E404): nothing to compare with yet
    if (!String(error.stderr).includes("E404")) {
      console.warn(`Could not read the published ${pkg.name}:`, error.message);
    }
    continue;
  }

  for (const key of Object.keys(published)) {
    if (!(key in (pkg.exports ?? {}))) {
      errors.push(`${pkg.name} no longer exports the published "${key}"`);
    }
  }
}

if (errors.length) {
  console.error(
    `${errors.join("\n")}\n\nkit stays on its current major: deprecate instead of removing, see RELEASING.md#versioning-policy`,
  );
  process.exit(1);
}

console.log("No breaking release: no major changeset, no removed entry point");
