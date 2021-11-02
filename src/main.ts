import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {context} from '@actions/github'
import {splitChangeLog} from './utils'

async function getChangeLog(
  octokit: Octokit,
  params: {path: string; repo: {owner: string; repo: string}; ref?: string}
): Promise<string | undefined> {
  const {path, ref, repo} = params
  try {
    const result = await octokit.repos.getContent({
      owner: repo.owner,
      repo: repo.repo,
      path,
      ref
    })
    if (result.data) {
      const base64Content = (result.data as any)?.content
      if (base64Content) {
        return Buffer.from(base64Content, 'base64').toString('utf-8')
      }
    }
  } catch (e) {
    return ''
  }
}

async function getReleaseBody(
  octokit: Octokit,
  params: {
    changeLogs: string[]
    repo: {owner: string; repo: string}
    ref?: string
    headLevel: string
    tagName: string
  }
): Promise<string> {
  const {changeLogs, repo, ref, headLevel, tagName} = params
  const requestList = changeLogs.map(async path =>
    getChangeLog(octokit, {path, repo, ref})
  )
  const allChangeLogs = await Promise.all(requestList)

  const headLevelNum = !isNaN(Number(headLevel)) ? Number(headLevel) : 2
  const headPrefix = new Array(headLevelNum || 2).fill('#').join('')

  const logList = []
  for (const changeLog of allChangeLogs) {
    if (changeLog) {
      logList.push(splitChangeLog({changeLog, headPrefix, tagName}))
    }
  }
  return logList.join('\n---\n')
}

async function run(): Promise<void> {
  const token = core.getInput('token')
  const {repo} = context

  const tagName = core.getInput('tagName')
  const headLevel = core.getInput('headLevel')
  const ref = core.getInput('ref')
  const changeLogs = core.getInput('changelogPaths').split(',')
  const octokit = new Octokit({auth: `token ${token}`})
  const releaseBody = await getReleaseBody(octokit, {
    repo,
    changeLogs,
    ref,
    tagName,
    headLevel
  })

  await octokit.repos.createRelease({
    repo: repo.repo,
    owner: repo.owner,
    body: releaseBody,
    tag_name: tagName
  })
}

run()
