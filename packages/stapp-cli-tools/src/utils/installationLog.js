const chalk = require('chalk')
const { success, info, warning } = require('log-symbols')
const filterSkipped = require('./filterSkipped')

const installationLog = ({ dependencies, peer, save }) => {
  const [installed, skipped] = filterSkipped(dependencies)

  console.log()

  if (installed.size) {
    console.log(chalk.green('Successfully installed and/or updated packages:'))
    for (let [name, { version }] of installed) {
      console.log(' ', success, `${name}@${version}`)
    }
  } else {
    console.log(info, chalk.green('Nothing was installed nor updated.'))
  }

  if (skipped.size) {
    console.log()
    console.log('Installation of some packages was skipped, see details below.')
    for (let [name, { version, skip }] of skipped) {
      console.log(' ', info, `${name}@${version}: `, chalk.gray(skip))
    }
  }

  console.log()

  if (!peer) {
    console.log(warning, chalk.yellow('Peer dependencies check was skipped.'))
  }

  if (!save) {
    console.log(warning, chalk.yellow('Installed packages were not saved to package.json.'))
  }
}

module.exports = installationLog
