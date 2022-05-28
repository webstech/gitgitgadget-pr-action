import * as core from "@actions/core";
import { dirname } from 'path';
import { inspect } from "util";
import { processWork } from "gitgitgadget/gitgitgadget-helper";
import findGit, { Git } from 'find-git-exec';

async function run(): Promise<void> {
    try {
        const inputs = {
            token: core.getInput("token"),
            reactionToken: core.getInput("reaction-token"),
            reactions: core.getInput("reactions"),
            permission: core.getInput("permission"),
            repositoryDir: core.getInput("repository-dir"),
            configRepositoryDir: core.getInput("config-repository-dir"),
            configurationFile: core.getInput("configuration-file"),
            config: core.getInput("config"),
            configFromFile: core.getInput("config-from-file"),
            repoOwner: core.getInput("repo-owner"),
            repoName: core.getInput("repo-name"),
            repoBaseowner: core.getInput("repo-baseowner"),
            pullRequestNumber: core.getInput("pull-request-number"),
            commentId: core.getInput("comment-id"),
            action: core.getInput("action"),
            skipUpdate: core.getInput("skip-update"),
        };
        core.debug(`Inputs: ${inspect(inputs)}`);

        // Check required inputs
        if (!inputs.token) {
            throw new Error(`Missing required input 'token'.`);
        }

        await setupGitEnvironment();
        /*
        if (gitInfo === null) {
          throw new Error('External Git was not found on the host system.');
        }
        */

        await processWork({ ...inputs });
    } catch (err) {
        const error = err as Error;
        core.debug(inspect(error));
        const message: string = error.message;
        // Handle validation errors from workflow dispatch
        if (
            message.startsWith("Unexpected inputs provided") ||
            (message.startsWith("Required input") && message.endsWith("not provided")) ||
            message.startsWith("No ref found for:") ||
            message === `Workflow does not have 'workflow_dispatch' trigger`
        ) {
            core.setOutput("error-message", message);
            core.warning(message);
        } else {
            core.setFailed(error.message);
        }
    }
}

void run();

async function setupGitEnvironment(): Promise<Git> {
    const gitInfo = await findGit();

    if (gitInfo.path && gitInfo.execPath) {
      // Set the environment variables to be able to use an external Git.
      process.env.GIT_EXEC_PATH = gitInfo.execPath;
      process.env.LOCAL_GIT_DIRECTORY = dirname(dirname(gitInfo.path));
    }

    return gitInfo;
}