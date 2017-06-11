const R = require('ramda')
const callCurl = require('./callCurl')
const SessionRepo = require('./SessionRepo')
const ContextRepo = require('./ContextRepo')
const SessionCommand = require('./SessionCommand')
const ContextCommand = require('./ContextCommand')

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

    case 'context':
      (new ContextCommand(runtime)).run()
      break

    case 'help':
      console.info('ok\n')
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
      runtime.method = 'GET'
      runtime.callCurl = true
  }

  if (runtime.callCurl) {
    callCurl(runtime)
  }

  runtime.sessionRepo.persist()
  process.exit(runtime.exitCode)
}
