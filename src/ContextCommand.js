const yaml = require('js-yaml')
const {spawnSync} = require('child_process')

class ContextCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length === 1) {
      console.info(yaml.safeDump(this.runtime.contextRepo.context))
      return
    }

    switch (args[1]) {
      case 'reset':
        this.runtime.contextRepo.context = {}
        break
      case 'list':
        const contexts = this.runtime.contextRepo.contexts
        contexts.forEach(name => console.info(name))
        break
      case 'edit':
        const editor = process.env.EDITOR || 'vi'
        const filename = this.runtime.contextRepo.getContextFilename()
        spawnSync(editor, [filename], {stdio: 'inherit'})
        break
      default:
        const contextName = args[1]
        if (!this.runtime.contextRepo.contexts.includes(contextName)) {
          console.warn('no context file found for:', contextName)
          console.warn('to create one call: scurl context edit')
        }
        this.runtime.sessionRepo.session.context = contextName
    }
  }
}

module.exports = ContextCommand
