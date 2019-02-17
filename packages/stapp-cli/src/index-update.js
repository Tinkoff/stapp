#!/usr/bin/env node
const chalk = require('chalk')
const exists = require('fs').existsSync
const Listr = require('listr')
const minDelay = require('p-min-delay')
const program = require('commander')

// Tasks
const getPackages = require('./tasks-update/getPackages')
const fetchInitialMeta = require('./tasks/fetchInitialMeta')
const collectPeerDependencies = require('./tasks/collectPeerDependencies')
const checkExistingPackages = require('./tasks/checkExistingPackages')
const installDependencies = require('./tasks/installDependencies')

// Utils
const filterSkipped = require('./utils/filterSkipped')
const delay = (fn, ms) => (context, task) => minDelay(fn(context, task), ms)
const info = (message) => console.log(chalk`{green ${message}}`)

if (!exists('./package.json')) {
  console.log(chalk.red('Stapp-cli is intended to be used inside node package directory.'))
  process.exit(1)
}

program
  .description('Install one or more stapp packages and related dependencies')
  .option('--no-peer', 'Skip peer dependencies installation')
  .option('--no-save', 'Prevents saving to dependencies')
  .option('-E, --save-exact', 'Saved dependencies will be configured with an exact version')
  .option('-n, --next', 'Use @next tag instead of @latest as a default version')
  .parse(process.argv)

const tasks = new Listr([
  {
    title: 'Checking packages',
    task: delay(getPackages, 250)
  },
  {
    title: 'Fetching packages meta',
    task: delay(fetchInitialMeta, 250)
  },
  {
    title: 'Collecting peer dependencies',
    task: delay(collectPeerDependencies, 250)
  },
  {
    title: 'Checking existing packages',
    task: delay(checkExistingPackages, 250)
  },
  {
    title: 'Installing and updating dependencies',
    task: installDependencies
  }
], {
  collapse: false
})

tasks
  .run({
    type: 'update',
    peer: program.peer,
    save: program.save,
    reinstall: false,
    saveExact: !!program.saveExact,
    next: !!program.next,
    dependencies: new Map()
  })
  .then(({ dependencies }) => {
    const [installed, skipped] = filterSkipped(dependencies)

    console.log()
    info(`Successfully installed and/or updated packages: ${[...installed.keys()].sort().join(', ')}`)

    if (skipped.size) {
      console.log('Installation of some packages was skipped, see details above.')
    }

    if (!program.peer) {
      console.log('Peer dependencies were not installed.')
    }

    if (!program.save) {
      console.log('Installed packages were not saved to package.json.')
    }
  })
  .catch(error => {
    console.error(error)
  })
