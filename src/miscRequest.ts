import * as core from "@actions/core";
// import * as github from "@actions/github";
import { dirname } from "path";
import { inspect } from "util";
import { handleAction } from "gitgitgadget/lib/misc-action";
import findGit, { Git } from "find-git-exec";

interface parmInterface {
    token: string;
    repositoryDir: string;
    configRepositoryDir: string;
    config: string;
    repoOwner: string;
    repoName: string;
    action: string;
    skipUpdate: string;
};

async function run(): Promise<void> {
    try {
        const parms = getParms();

        await setupGitEnvironment();
        /*
        if (gitInfo === null) {
          throw new Error('External Git was not found on the host system.');
        }
        */
        // const octokit = parms.token ? github.getOctokit(parms.token) : null;

        await handleAction({ ...parms });

    } catch (err) {
        const error = err as Error;
        core.debug(inspect(error));
        core.setFailed(error.message);
    }
}

void run();

/**
 *  Set the environment variables to be able to use an external Git.
 */
async function setupGitEnvironment(): Promise<Git> {
    const gitInfo = await findGit();

    if (gitInfo.path && gitInfo.execPath) {
        process.env.GIT_EXEC_PATH = gitInfo.execPath;
        process.env.LOCAL_GIT_DIRECTORY = dirname(dirname(gitInfo.path));
    }

    return gitInfo;
}

function getParms(): parmInterface {
    const parms = {
        token: core.getInput("token"),
        repositoryDir: core.getInput("repository-dir"),
        configRepositoryDir: core.getInput("config-repository-dir"),
        config: core.getInput("config"),
        repoOwner: core.getInput("repo-owner"),
        repoName: core.getInput("repo-name"),
        action: core.getInput("action"),
        skipUpdate: core.getInput("skip-update"),
    };

    core.debug(`Inputs: ${inspect(parms)}`);

    // Check required inputs
    if (!parms.token) {
        throw new Error(`Missing required input 'token'.`);
    }

    if (!parms.action || !["update-open-prs", "update-commit-mappings",
        "handle-open-prs", "handle-new-mails"].includes(parms.action)) {
        throw new Error(`Missing or invalid required input 'action': <${parms.action}>.`);
    }

    return parms;
}
