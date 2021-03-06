const R = require('ramda')
const callCurl = require('./callCurl')
const SessionRepo = require('./SessionRepo')
const ContextRepo = require('./ContextRepo')
const SessionCommand = require('./SessionCommand')
const ContextCommand = require('./ContextCommand')
const HelpCommand = require('./HelpCommand')

const runtime = {
  env: process.env,
  argv: require('optimist')
    .boolean('dry-run')
    .argv,
  newArgv: process.argv.slice(2),
  exitCode: 0,
  callCurl: false,
  opts: {}
}
runtime.sessionRepo = new SessionRepo(runtime)
runtime.contextRepo = new ContextRepo(runtime)

if (runtime.argv._.length) {
  switch (runtime.argv._[0]) {
    case 'session':
      (new SessionCommand(runtime)).run()
      break

    case 'help':
      (new HelpCommand(runtime)).run()
      break

    case 'delete':
    case 'get':
    case 'patch':
    case 'post':
    case 'put':
      runtime.newArgv = R.pipe(
        R.filter(v => v !== runtime.argv._[0])
      )(runtime.newArgv)
      runtime.method = runtime.argv._[0].toUpperCase()
      runtime.callCurl = true
      break

    default:
      const result = (new ContextCommand(runtime)).run()
      if (!result) {
        runtime.method = 'GET'
        runtime.callCurl = true
      }
  }

  if (runtime.callCurl) {
    callCurl(runtime)
  }

  runtime.sessionRepo.persist()
  process.exit(runtime.exitCode)
} else {
  ;(new HelpCommand(runtime)).run()
}
