/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import tag_infomation from "../types/tag_info"
import commit_infomaiton from "../types/commit_infomation"

/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */

/**
 *
 * @param {import("@actions/core")} core
 * @param {import("@octokit/rest").Octokit} octokit
 * @param {import("@actions/github").context} context
 * @param {String} alias
 * @param {commit_infomaiton} commit_infomaiton
 */

export async function run(core, octokit, context, alias, commit_infomaiton) {

  // Get Major version tag
  const major_version_tag = alias.split(".")[0]

  // Get Link to Version Tag data
  core.info(`==> Getting ${alias} infomation...`)
  const alias_info = await availableTags(octokit, context, alias)

  // Get Major version Tag data
  core.info(`==> Detecting ${major_version_tag}`)
  const major_info = await availableTags(octokit, context, major_version_tag)


  /** @type {tag_infomation}  */
  const version_tags = {
    alias: {
      tag: alias,
      sha: alias_info.data.object.sha 
    },
    major: {
      tag: major_version_tag
    }
  }

  if (major_info) {
    core.info(`==> Link from: ${alias}`)
    core.info(`==> Major Tag: ${major_version_tag}`)
    core.info(`==> Overwriting Tag`)
  } else {
    core.info(`==> Creating Major tag ${major_version_tag}...`)
  }

  await createupdateTags(
    core,
    octokit,
    context,
    version_tags,
    commit_infomaiton
  )

}


/**
 * @param {import("@octokit/rest").Octokit} octokit
 * @param {import("@actions/github").context} context
 * @param {string} tags 
 * @returns 
 */


async function availableTags(octokit, context, tags) {
  return await octokit.rest.git.getRef({
    ...context.repo,
    ref: `tags/${tags}`
  })
}

/**
 * 
 * @param {import("@octokit/rest").Octokit} octokit
 * @param {import("@octokit/rest").Octokit} octokit
 * @param {import("@actions/github").context} context
 * @param {tag_infomation} tag_info
 * @param {commit_infomaiton} commit_info
 */

async function createupdateTags(core, octokit, context, tag_info, commit_info){
  const update_tags = await octokit.rest.git.createTag({
    ...context.repo,
    tag: tag_info.alias.tag,
    object: tag_info.alias.sha,
    type: 'commit',
    tagger: {
      name: commit_info.commit_name,
      email: commit_info.commit_email
    }
  })

  if (typeof tag_info.major.tag){ // eslint-disable-line
    await octokit.rest.git.createRef({
      ...context.repo,
      sha: update_tags.sha,
      ref: `refs/tags/${tag_info.major.tag}`
    })
  } else {
    await octokit.rest.git.updateRef({
      ...context.repo,
      sha: update_tags.sha,
      force: true
    })
  }
}