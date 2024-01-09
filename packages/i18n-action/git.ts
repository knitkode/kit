/**
 * @file
 *
 * All the git part is heavily taken and simplified from
 * https://github.com/EndBug/add-and-commit
 */
import * as core from "@actions/core";
import { simpleGit } from "simple-git";

type ActionOutputTypes = {
  committed: "true" | "false";
  commit_sha: string | undefined;
  pushed: "true" | "false";
};

function log(err: any | Error, data?: any) {
  if (data) console.log(data);
  if (err) core.error(err);
}

export class Git {
  baseDir: string;
  afterFetch: () => Promise<any>;
  outputs: ActionOutputTypes;
  errors: Error[] = [];

  constructor(baseDir: string, afterFetch: () => Promise<any>) {
    this.baseDir = baseDir;
    this.afterFetch = afterFetch;

    this.outputs = {
      committed: "false",
      commit_sha: undefined,
      pushed: "false",
    };

    // setup default output values
    Object.entries(this.outputs).forEach(([name, value]) =>
      core.setOutput(name, value),
    );
  }

  async run() {
    const git = simpleGit({ baseDir: this.baseDir });
    const branch = process.env["GITHUB_REF"]?.substring(11) || "main";

    core.info(`Running in folder ${this.baseDir}...`);

    // TODO: maybe this only needs to be used when run locally on a user machine?
    core.info("> Pulling from remote...");
    await git.fetch(undefined, log).pull(undefined, undefined, undefined, log);

    await this.afterFetch();

    core.info("> Checking for uncommitted changes in the git working tree...");

    const changedFiles = (await git.status()).files.length;

    if (changedFiles) {
      core.info(`> Found ${changedFiles} changed files.`);

      await git
        .addConfig("user.name", "github-actions[bot]", undefined, log)
        .addConfig(
          "user.email",
          "github-actions[bot]@users.noreply.github.com",
          undefined,
          log,
        );

      await git.fetch(["--tags", "--force"], log);

      // core.info('> Checkout branch...')
      // await git.checkoutLocalBranch(branch, log)

      // core.info('> Pulling from remote...')
      // await git.fetch(undefined, log).pull(undefined, undefined, undefined, log)

      core.info("> Re-staging files...");
      await git.add(".").catch((e: Error) => {
        if (
          e.message.includes("fatal: pathspec") &&
          e.message.includes("did not match any files")
        ) {
          this.errors.push(new Error(`Add command did not match any file`));
        } else throw e;
      });

      core.info("> Creating commit...");
      await git.commit(
        "chore(action): auto commit",
        undefined,
        {},
        (err, data) => {
          if (data) {
            this.setOutput("committed", "true");
            this.setOutput("commit_sha", data.commit);
          }
          return log(err, data);
        },
      );

      core.info("> Pushing commit to repo...");
      await git.push(
        "origin",
        branch,
        { "--set-upstream": null },
        (err, data?) => {
          if (data) this.setOutput("pushed", "true");
          return log(err, data);
        },
      );

      core.endGroup();
      core.info("> Task completed!!!");
    } else {
      core.endGroup();
      core.info("> Working tree clean. Nothing to commit.");
    }
  }

  setOutput<T extends keyof ActionOutputTypes>(
    name: T,
    value: ActionOutputTypes[T],
  ) {
    this.outputs[name] = value;
    core.setOutput(name, value);
  }

  logOutputs() {
    core.startGroup("Outputs");
    for (const key in this.outputs) {
      core.info(`${key}: ${this.outputs[key as keyof ActionOutputTypes]}`);
    }
    core.endGroup();
  }

  success() {
    if (this.errors.length === 1) {
      throw this.errors[0];
    } else if (this.errors.length > 1) {
      this.errors.forEach((e) => core.error(e));
      throw "There have been multiple runtime errors.";
    }

    this.logOutputs();
  }

  error(e: Error) {
    core.endGroup();
    this.logOutputs();
    core.setFailed(e);
  }
}
