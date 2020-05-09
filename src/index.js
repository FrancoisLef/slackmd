const fs = require('fs')
const path = require('path')
const glob = require('glob')
const {Command, flags} = require('@oclif/command')
const slackifyMarkdown = require('slackify-markdown')

class SlackmdCommand extends Command {
  async run() {
    const {args: {pattern}, flags: {extension}} = this.parse(SlackmdCommand)

    glob(pattern, {ignore: ['**/node_modules/**', './node_modules/**', `**/*.${extension}`]}, (err, globFiles) => {
      if (err) return err

      globFiles.forEach(globFile => {
        const {dir, name} = path.parse(path.resolve(globFile))
        fs.readFile(globFile, 'utf8', (err, content) => {
          if (err) return err

          fs.writeFile(`${dir}/${name}.${extension}`, slackifyMarkdown(content), err => {
            if (err) return err
          })
        })
      })
    })
  }
}

SlackmdCommand.description = `Describe the command here
...
Extra documentation goes here
`

SlackmdCommand.args = [
  {name: 'pattern', required: true, description: 'glob pattern to find wanted markdown files', default: '**/*.md'},
]

SlackmdCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  extension: flags.string({char: 'e', description: 'output file extension', default: 'slack.md'}),
}

module.exports = SlackmdCommand
