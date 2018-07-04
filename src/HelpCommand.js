class HelpCommand {
  constructor (runtime) {
    this.runtime = runtime
  }

  run () {
    const args = this.runtime.argv._
    if (args.length <= 1) {
      console.info(`
Usage:
  scurl select my_context            - select context for current session
  scurl reset                        - reset session to default context
  scurl rm the-name                  - remove context named 'the-name'
  scurl list                         - list available contexts

  scurl [-Z context] context         - print context file contents
  scurl [-Z context] edit            - edit context file
  scurl [-Z context] clone new-name  - clone current context as new-name

  scurl [-Z context] [options] URL   - run curl

  Options:
      --dry-run                      - print curl command instead of executing
      --raw-output                   - do not beautify output

      ... all native curl options will be passed through
`)
      return
    }

    switch (args[1]) {
    }
  }
}

module.exports = HelpCommand
