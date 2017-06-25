const uuid = require('uuid')
const fs = require('fs')

class SessionRepo {
  constructor (runtime) {
    this.runtime = runtime

    if (!runtime.env.CURLY_PPID) {
      throw new Error('CURLY_PPID expected in env. Not running as child of curly.sh?')
    }
    this.ppid = String(runtime.env.CURLY_PPID)
  }

  getStorePath () {
    return this.runtime.opts.sessionStore || '/tmp/curly_sessions.json'
  }

  get sessions () {
    if (this._sessions) {
      return this._sessions
    }
    try {
      this._sessions = require(this.getStorePath())
    } catch (e) {
      this._sessions = {}
    }
    return this._sessions
  }

  persist () {
    const content = JSON.stringify(this.sessions, null, 2) + '\n'
    fs.writeFileSync(this.getStorePath(), content)
  }

  set session (session) {
    this._session = Object.assign({
      ppid: this.ppid,
      id: uuid.v1(),
      context: 'default'
    }, session)
    this.sessions[this.ppid] = this._session
  }

  get session () {
    if (this._session) {
      return this._session
    }
    const mySession = this.sessions[this.ppid]
    if (mySession) {
      this._session = mySession
    } else {
      this.session = {}
      this.sessions[this.ppid] = this._session
    }
    return this._session
  }
}

module.exports = SessionRepo
