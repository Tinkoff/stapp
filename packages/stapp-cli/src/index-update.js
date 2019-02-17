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
const installationLog = require('./utils/installationLog')
const delay = (fn, ms) => (context, task) => minDelay(fn(context, task), ms)

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
  .then(installationLog)
  .catch(error => {
    console.error(error)
  })
