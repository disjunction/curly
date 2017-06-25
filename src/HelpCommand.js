class HelpCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length === 1) {
      console.info(`
Usage:
  curly context              - print session context
  curly context my_context   - switch session to another context
  curly reset                - reset to default context
  curly [-Z context] edit    - edit context file
  curly [-Z context] URL     - run curl
`)
      return
    }

    switch (args[1]) {
    }
  }
}

module.exports = HelpCommand
