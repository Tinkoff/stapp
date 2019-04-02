#!/usr/bin/env node
const chalk = require('chalk')
const exists = require('fs').existsSync
const Listr = require('listr')
const minDelay = require('p-min-delay')
const program = require('commander')
const { success, info, warning } = require('log-symbols')

// Tasks
const getPackages = require('./tasks-update/getPackages')
const fetchInitialMeta = require('./tasks/fetchInitialMeta')
const collectPeerDependencies = require('./tasks/collectPeerDependencies')
const checkExistingPackages = require('./tasks/checkExistingPackages')

// Utils
const delay = (fn, ms) => (context, task) => minDelay(fn(context, task), ms)

program
  .description('Checks existing stapp packages.')
  .option('--no-peer', 'Skip peer dependencies check.')
  .option('-n, --next', 'Use @next instead of @latest as a default tag.')

program.parse(process.argv)

if (!exists('./package.json')) {
  console.log(chalk.red('Stapp-cli is intended to be used inside node package directory.'))
  process.exit(1)
}

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
  }
], {
  collapse: false
})

const checkLog = ({ dependencies, peer }) => {
  console.log()
  console.log('Results: ')
  if (!peer) {
    console.log(warning, chalk.yellow('Peer dependencies check was skipped.'))
  }

  dependencies.forEach(({ name, version, currentVersion, skip }) => {
    if (skip) {
      console.log(success, `Package ${name}@${currentVersion} is up to date.`)
      return
    }

    if (!currentVersion) {
      console.log(info, `Package ${name} is not installed. Run 'stapp update' or 'npm install ${name}@${version} to install.`)
      return
    }

    console.log(info, `Package ${name}@${currentVersion} needs to be updated to ${version}. Run 'stapp update' or 'npm install ${name}@${version} to install.`)
  })
}

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
  .then(checkLog)
  .catch(error => {
    console.error(error)
  })
