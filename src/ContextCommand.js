const yaml = require('js-yaml')
const {spawnSync} = require('child_process')

class ContextCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    switch (args[0]) {
      case 'context': {
        console.info(yaml.safeDump(this.runtime.contextRepo.context))
        return true
      }

      case 'reset': {
        this.runtime.contextRepo.context = {}
        return true
      }

      case 'ls':
      case 'list': {
        const contexts = this.runtime.contextRepo.contexts
        contexts.forEach(name => console.info(name))
        return true
      }

      case 'edit': {
        const editor = process.env.EDITOR || 'vi'
        const filename = this.runtime.contextRepo.getContextFilename()
        spawnSync(editor, [filename], {stdio: 'inherit'})
        return true
      }

      case 'clone': {
        const contextName = this.runtime.sessionRepo.session.context
        this.runtime.contextRepo.copy(contextName, args[1])
        this.runtime.sessionRepo.session.context = args[1]
        return true
      }

      case 'rm':
      case 'remove': {
        const contextName = this.runtime.sessionRepo.session.context
        this.runtime.contextRepo.delete(args[1])
        if (contextName === args[1]) {
          this.runtime.sessionRepo.session.context = 'default'
        }
        return true
      }

      case 'select': {
        const contextName = args[1]
        if (!this.runtime.contextRepo.contexts.includes(contextName)) {
          console.warn('no context file found for:', contextName)
          console.warn('to create one call: scurl context edit')
        }
        this.runtime.sessionRepo.session.context = contextName
        return true
      }
    }
  }
}

module.exports = ContextCommand
