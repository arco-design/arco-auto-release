export function splitChangeLog(params: {
  changeLog: string
  headPrefix: string
  tagName: string
}): string {
  const {changeLog, headPrefix, tagName} = params
  const lines = changeLog.split('\n')

  const changeLogWithTag = []
  let splitStart = false

  const currentVersion = `${headPrefix} ${tagName}`
  const timeReg = /^\d{4}-\d{2}-\d{2}$/
  for (const currentLine of lines) {
    if (currentLine.startsWith(currentVersion)) {
      splitStart = true
    } else if (splitStart) {
      if (!currentLine.startsWith(`${headPrefix} `)) {
        if (!timeReg.test(currentLine)) {
          changeLogWithTag.push(currentLine)
        }
      } else {
        break
      }
    }
  }
  return changeLogWithTag.join('\n')
}
