const chalk = require('chalk')
const filterSkipped = require('./filterSkipped')
const info = (message) => console.log(chalk`{green ${message}}`)

const installationLog = ({ dependencies, peer, save }) => {
  const [installed, skipped] = filterSkipped(dependencies)

  console.log()
  if (installed.size) {
    info(`Successfully installed and/or updated packages: ${[...installed.keys()].sort().join(', ')}.`)
  } else {
    info(`Nothing was installed nor updated.`)
  }

  if (skipped.size) {
    console.log('Installation of some packages was skipped, see details above.')
  }

  if (!peer) {
    console.log('Peer dependencies were not installed.')
  }

  if (!save) {
    console.log('Installed packages were not saved to package.json.')
  }
}

module.exports = installationLog
