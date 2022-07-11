import * as core from "@actions/core";
import { dirname } from "path";
import { inspect } from "util";
import { handleAction } from "gitgitgadget/lib/auth-action";
import findGit, { Git } from "find-git-exec";

interface parmInterface {
    token: string;
    repositoryDir: string;
    configRepositoryDir: string;
    config: string;
    repoOwner: string;
    repoName: string;
    appid: string;
    orgs: string[];
};

/**
 * Action to create app auth tokens.  The tokens will be saved as environment
 * variables with `.` replaced with `_`.  This is the form expected by GitHubGlue.
 * The variables remove the need to run other actions in a particular repo.
 */
async function run(): Promise<void> {
    try {
        const parms = getParms();

        await setupGitEnvironment();

        const tokens = await handleAction({ ...parms });

        for (const [key, value] of tokens) {
            const tokenVar = key.toUpperCase().replace(/\./, "_");
            core.exportVariable(tokenVar, value);
            core.setSecret(value);
        }

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
    const organizations = core.getInput("organizations");
    const orgs = organizations.split(",");

    const parms = {
        token: core.getInput("token"),
        repositoryDir: core.getInput("repository-dir"),
        configRepositoryDir: core.getInput("config-repository-dir"),
        config: core.getInput("config"),
        repoOwner: core.getInput("repo-owner"),
        repoName: core.getInput("repo-name"),
        appid: core.getInput("appid"),
        orgs
    };

    core.debug(`Inputs: ${inspect(parms)}`);

    // Check required inputs
    if (!parms.token) {
        throw new Error(`Missing required input 'token'.`);
    }

    return parms;
}
