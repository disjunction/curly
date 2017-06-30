const fs = require('fs')
const makedir = require('make-dir')
const yaml = require('js-yaml')
const R = require('ramda')

class ContextRepo {
  constructor (opts) {
    this.opts = opts
    if (!opts.sessionRepo) {
      throw new Error('SessionRepo expects sessionRepo in opts')
    }
  }

  getContextPath () {
    const path = this.opts.contextPath || process.env.HOME + '/.scurl/contexts'
    return makedir.sync(path)
  }

  getContextFilename () {
    const session = this.opts.sessionRepo.session
    const name = session.context || 'default'
    const contextPath = this.getContextPath()
    return contextPath + '/' + name + '.yaml'
  }

  copy (from, to) {
    const contextPath = this.getContextPath()
    const fromFilename = contextPath + '/' + from + '.yaml'
    if (!fs.existsSync(fromFilename)) {
      throw new Error('file not found: ' + fromFilename)
    }
    const content = fs.readFileSync(fromFilename)
    const toFilename = contextPath + '/' + to + '.yaml'
    fs.writeFileSync(toFilename, content)
  }

  delete (contextName) {
    const contextPath = this.getContextPath()
    const filename = contextPath + '/' + contextName + '.yaml'
    return fs.unlinkSync(filename)
  }

  get contexts () {
    if (this._contexts) {
      return this._contexts
    }
    try {
      const filenames = fs.readdirSync(this.getContextPath())
      this._contexts = filenames
        .filter(R.match(/\.yaml$/))
        .map(R.replace(/\.yaml$/, ''))
    } catch (e) {
      console.error(e)
      this._contexts = []
    }
    return this._contexts
  }

  get context () {
    if (this._context) {
      return this._context
    }
    const session = this.opts.sessionRepo.session
    const name = session.context || 'default'
    const filePath = this.getContextFilename()
    this._context = fs.existsSync(filePath)
      ? yaml.safeLoad(fs.readFileSync(filePath))
      : {}
    this._context.name = name
    return this._context
  }
}

module.exports = ContextRepo
