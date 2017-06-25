class HelpCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length === 1) {
      console.info(`
Usage:
  scurl context              - print session context
  scurl context my_context   - switch session to another context
  scurl reset                - reset to default context
  scurl [-Z context] edit    - edit context file
  scurl [-Z context] URL     - run curl
`)
      return
    }

    switch (args[1]) {
    }
  }
}

module.exports = HelpCommand
