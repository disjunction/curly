const yaml = require('js-yaml')

class ContextCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length === 1) {
      console.info(yaml.safeDump(this.runtime.contextRepo.context))
    } else {
      switch (args[1]) {
        case 'reset':
          this.runtime.contextRepo.context = {}
          break
        default:
          this.runtime.sessionRepo.session.context = args[1]
      }
    }
  }
}

module.exports = ContextCommand
