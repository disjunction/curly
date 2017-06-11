const yaml = require('js-yaml')

class SessionCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length === 1) {
      console.info(yaml.safeDump(this.runtime.sessionRepo.session))
    } else {
      switch (args[1]) {
        case 'reset':
          this.runtime.sessionRepo.session = {}
          break
        case 'context':
          this.runtime.sessionRepo.session.context = args[2]
          break
      }
    }
  }
}

module.exports = SessionCommand
