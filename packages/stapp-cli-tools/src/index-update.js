#!/usr/bin/env node
const chalk = require('chalk')
const exists = require('fs').existsSync
const Listr = require('listr')
const minDelay = require('p-min-delay')
const dedent = require('dedent')
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

program
  .description('Update existing stapp packages.')
  .option('--no-peer', 'Skip peer dependencies installation.')
  .option('--no-save', 'Prevents saving to dependencies. Same as --no-save for npm-install.')
  .option('-E, --save-exact', 'Saved dependencies will be configured with an exact version. Same as --save-exact for npm-install.')
  .option('-n, --next', 'Use @next instead of @latest as a default tag.')

program.on('--help', () => {
  console.log('')
  console.log(dedent`
    Examples:
    
      01. Automatically updates existing stapp packages and it's peer dependencies:
      $ stapp update
        ✔ Checking packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing and updating dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.6.0
        ✔ redux@4.0.1
      
      Installation of some packages was skipped, see details below.
        ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date
          
      02. Skipping peer dependencies with --no-peer:
      $ stapp update --no-peer
        ✔ Checking packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing and updating dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.6.0
            
      ⚠ Peer dependencies check was skipped.
       
      03. Using @next tag with --next:
      $ stapp update --next
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.7.0-beta.3
        ✔ redux@4.0.1
        
      Installation of some packages was skipped, see details below.
        ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date
  `)
})

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
