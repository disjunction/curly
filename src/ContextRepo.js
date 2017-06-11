const fs = require('fs')
const makedir = require('make-dir')
const yaml = require('js-yaml')

class ContextRepo {
  constructor (opts) {
    this.opts = opts
    if (!opts.sessionRepo) {
      throw new Error('SessionRepo expects sessionRepo in opts')
    }
  }

  getContextPath () {
    const path = this.opts.contextPath || process.env.HOME + '/.curly/contexts'
    return makedir.sync(path)
  }

  get contexts () {
    if (this._contexts) {
      return this._contexts
    }
    try {
      this._sessions = require(this.getStorePath())
    } catch (e) {
      this._sessions = {}
    }
    return this._sessions
  }

  get context () {
    if (this._context) {
      return this._context
    }
    const session = this.opts.sessionRepo.session
    const name = session.context || 'default'
    const contextPath = this.getContextPath()
    const filePath = contextPath + '/' + name + '.yaml'
    this._context = fs.existsSync(filePath)
      ? yaml.safeLoad(fs.readFileSync(filePath))
      : {}
    this._context.name = name
    return this._context
  }
}

module.exports = ContextRepo
