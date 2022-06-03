import * as core from "@actions/core";
import github from"@actions/github";
import { dirname } from 'path';
import { inspect } from "util";
import { handlePRUpdate } from "gitgitgadget/gitgitgadget-helper";
import findGit, { Git } from 'find-git-exec';

interface parmInterface {
    token: string;
    reactionToken: string;
    reactions: string;
    permission: string;
    repositoryDir: string;
    configRepositoryDir: string;
    configurationFile: string;
    config: string;
    configFromFile: string;
    repoOwner: string;
    repoName: string;
    repoBaseowner: string;
    pullRequestNumber: string;
    commentId: string;
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
        const octokit = parms.token ? github.getOctokit(parms.token) : null;
        let id = 0;

        if (octokit) {
            if (parms.commentId) {
                const response = await octokit.rest.reactions.createForIssueComment({
                    owner: parms.repoOwner,
                    repo: parms.repoName,
                    comment_id: parseInt(parms.commentId, 10),
                    content: "eyes",
                  });
                id = response.data.id;
            } else {
                const response = await octokit.rest.reactions.createForIssue({
                    owner: parms.repoOwner,
                    repo: parms.repoName,
                    issue_number: parseInt(parms.pullRequestNumber, 10),
                    content: "eyes",
                  });
                id = response.data.id;
            }
        }

        await handlePRUpdate({ ...parms });
        if (octokit) {
            if (parms.commentId) {
                await octokit.rest.reactions.deleteForPullRequestComment({
                    owner: parms.repoOwner,
                    repo: parms.repoName,
                    comment_id: parseInt(parms.commentId, 10),
                    reaction_id: id,
                  });
                await octokit.rest.reactions.createForIssueComment({
                    owner: parms.repoOwner,
                    repo: parms.repoName,
                    comment_id: parseInt(parms.commentId, 10),
                    content: "rocket",
                  });
            } else {
                await octokit.rest.reactions.deleteForIssue({
                    owner: parms.repoOwner,
                    repo: parms.repoName,
                    issue_number: parseInt(parms.pullRequestNumber, 10),
                    reaction_id: id,
                  });
            }
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
    const parms = {
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

    core.debug(`Inputs: ${inspect(parms)}`);

    // Check required inputs
    if (!parms.token) {
        throw new Error(`Missing required input 'token'.`);
    }

    if (!parms.action || !["comment", "push"].includes(parms.action)) {
        throw new Error(`Missing or invalid required input 'format'.`);
    }

    return parms;
}