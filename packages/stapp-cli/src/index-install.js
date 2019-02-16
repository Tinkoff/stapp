#!/usr/bin/env node
const chalk = require('chalk')
const exists = require('fs').existsSync
const Listr = require('listr')
const minDelay = require('p-min-delay')
const program = require('commander')

// Tasks
const checkExistingPackages = require('./tasks/checkExistingPackages')
const collectDependencies = require('./tasks/collectDependencies')
const fetchPackages = require('./tasks/fetchPackages')
const installDependencies = require('./tasks/installDependencies')
const parsePackages = require('./tasks/parsePackages')

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
  .option('--no-reinstall', 'Do not reinstall existing packages if they satisfy corresponding ranges')
  .option('-E, --save-exact', 'Saved dependencies will be configured with an exact version')
  .option('-n, --next', 'Use @next tag instead of @latest as a default version')
  .parse(process.argv)

const tasks = new Listr([
  {
    title: 'Parsing packages',
    task: delay(parsePackages, 250)
  },
  {
    title: 'Fetching packages meta',
    task: delay(fetchPackages, 250)
  },
  {
    title: 'Collecting peer dependencies',
    task: delay(collectDependencies, 250),
  },
  {
    title: 'Checking existing packages',
    task: delay(checkExistingPackages, 250)
  },
  {
    title: 'Installing dependencies',
    task: installDependencies
  }
], {
  collapse: false
})

tasks
  .run({
    program,
    packages: new Map(),
    dependencies: new Map()
  })
  .then(({ dependencies }) => {
    const [installed, skipped] = filterSkipped(dependencies)

    console.log()
    info(`Successfully installed packages: ${[...installed.keys()].sort().join(', ')}`)

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
