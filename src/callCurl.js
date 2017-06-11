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

function collectInstructions (runtime) {
  const context = runtime.contextRepo.context
  if (!context.rules || !context.rules.length) {
    return {}
  }

  return context.rules.reduce((result, rule) => {
    if (matchRule(runtime, rule)) {
      return R.mergeDeepRight(result, R.omit(['match'], rule))
    } else {
      return result
    }
  }, {})
}

function applyInstructions (runtime, instructions) {
  if (instructions.headers) {
    R.forEachObjIndexed((value, name) => {
      runtime.newArgv = R.pipe(
        R.prepend("'" + name + ': ' + value + "'"),
        R.prepend('-H')
      )(runtime.newArgv)
    }, instructions.headers)
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

module.exports = function (runtime) {
  const instructions = R.mergeDeepRight(
    collectInstructions(runtime),
    runtime.sessionRepo.session
  )
  applyInstructions(runtime, instructions)

  if (runtime.method) {
    runtime.newArgv = R.pipe(
      R.prepend(runtime.method),
      R.prepend('-X')
    )(runtime.newArgv)
  }

  runtime.newArgv = R.prepend('-sS', runtime.newArgv)
  runtime.newArgv = runtime.newArgv.filter(opt => !ownBooleans.includes(opt))

  const command = 'curl ' + runtime.newArgv.join(' ')
  if (runtime.argv['dry-run']) {
    console.info(command)
  } else {
    const res = spawnSync('curl', runtime.newArgv)
    process.stdout.write(res.stdout.toString().slice(0, -1))
    console.error(res.stderr.toString().slice(0, -1))
    runtime.exitCode = res.status
  }
}
