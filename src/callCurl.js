const R = require('ramda')
const spawnSync = require('child_process').spawnSync
const ownBooleans = [
  '--dry-run'
]

function matchRule (runtime, rule) {
  if (typeof rule !== 'object' || !rule.match) {
    return false
  }
  if (rule.match === 'all') {
    return true
  }
  if (typeof rule.match === 'object') {
    if (rule.match.method && rule.match.method.includes(runtime.method.toLowerCase())) {
      return true
    }
  }
  return false
}

/**
 * try to beautify euristically, since we have no access
 * to returned ehaders
 */
function tryBeautify (subject) {
  let str = String(subject).trim()
  let prefix = ''

  // headers have been dumped - skip them first
  if (str.match(/^HTTP\/[\d.]+\s\d+\s/)) {
    const lines = str.split('\n')
    let i = 1
    let line = lines[0]
    do {
      prefix += line + '\n'
      line = lines[++i]
    } while (line.trim() !== '' && i < lines.length - 1)
    prefix += '\n'
    str = lines.slice(i).join('\n').trim()
  }

  // if contents looks like json, then try to beutify
  if (str.length > 3 && str.match(/^{.*}$/)) {
    try {
      const json = JSON.parse(str)
      str = JSON.stringify(json, null, 2) + '\n'
    } catch (e) {
      // do nothing
    }

    subject = prefix + str
  }

  // make sure there is a trailing linebreak to keep console nice
  if (subject && subject[subject.length - 1] !== '\n') {
    subject += '\n'
  }
  return subject
}

function collectInstructions (runtime) {
  const context = runtime.contextRepo.context
  if (!context.rules || !context.rules.length) {
    return {}
  }

  return context.rules.reduce((result, rule) => {
    return matchRule(runtime, rule)
      ? R.mergeDeepRight(result, R.omit(['match'], rule))
      : result
  }, {})
}

function applyInstructions (runtime, instructions) {
  if (instructions.headers) {
    R.forEachObjIndexed((value, name) => {
      runtime.newArgv = R.pipe(
        R.prepend(name + ': ' + value),
        R.prepend('-H')
      )(runtime.newArgv)
    }, instructions.headers)
  }
  if (instructions.auth) {
    runtime.newArgv = R.pipe(
      R.prepend(instructions.auth.user + ':' + instructions.auth.pass),
      R.prepend('-u')
    )(runtime.newArgv)
  }
  if (instructions.baseUrl) {
    runtime.argv._.forEach(value => {
      if (value && value[0] === '/') {
        runtime.newArgv = runtime.newArgv.map(
          newValue => (newValue === value ? instructions.baseUrl : '') + newValue
        )
      }
    })
  }
}

function escapeParameter (param) {
  return param.match(/[\s'!&?]+/) ?
    `"${param}"` : param;
}

module.exports = function (runtime) {
  const instructions = R.mergeDeepRight(
    collectInstructions(runtime),
    runtime.sessionRepo.session
  )
  applyInstructions(runtime, instructions)

  if (runtime.method && runtime.method !== 'GET') {
    runtime.newArgv = R.pipe(
      R.prepend(runtime.method),
      R.prepend('-X')
    )(runtime.newArgv)
  }

  runtime.newArgv = R.prepend('-sS', runtime.newArgv)
  runtime.newArgv = runtime.newArgv.filter(opt => !ownBooleans.includes(opt))

  if (runtime.argv['dry-run']) {
    const command = 'curl ' + runtime.newArgv.map(escapeParameter).join(' ')
    console.info(command)
  } else {
    const res = spawnSync('curl', runtime.newArgv)
    let stdout = res.stdout.toString()

    if (!instructions.rawOutput) {
      stdout = tryBeautify(stdout)
    }

    process.stdout.write(stdout)

    process.stderr.write(res.stderr.toString())
    runtime.exitCode = res.status
  }
}
