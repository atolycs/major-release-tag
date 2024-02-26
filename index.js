// Loader


import core from "@actions/core"
import github from "@actions/github"

/* eslint-disable no-unused-vars */
import commit_infomaiton from "./types/commit_infomation.js" 
/* eslint-enable no-unused-vars */

import { run } from "./src/main.js"

const context = github.context
const octokit = github.getOctokit(core.getInput("token"))
const alias_version = core.getInput("alias_version")


/**
*  @type {commit_infomaiton}
*/

const commit_info = {
  commit_name: core.getInput("commit-name"),
  commit_email: core.getInput("commit-email")
}



try {
  run(core, octokit, context, alias_version, commit_info)
} catch (error) {
  core.setFailed(error.message)
}
