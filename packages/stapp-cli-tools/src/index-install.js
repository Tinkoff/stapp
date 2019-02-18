#!/usr/bin/env node
const chalk = require('chalk')
const exists = require('fs').existsSync
const Listr = require('listr')
const minDelay = require('p-min-delay')
const program = require('commander')
const dedent = require('dedent')

// Tasks
const parseInput = require('./tasks-install/parseInput')
const fetchPackages = require('./tasks/fetchInitialMeta')
const collectPeerDependencies = require('./tasks/collectPeerDependencies')
const checkExistingPackages = require('./tasks/checkExistingPackages')
const installDependencies = require('./tasks/installDependencies')

// Utils
const installationLog = require('./utils/installationLog')
const delay = (fn, ms) => (context, task) => minDelay(fn(context, task), ms)

program
  .description(dedent`
    Install one or more stapp packages and related dependencies.
    
    Automatically handles tags, versions and peerDependencies.
  `)
  .option('--no-peer', 'Skip peer dependencies installation.')
  .option('--no-save', 'Prevents saving to dependencies. Same as --no-save for npm-install.')
  .option('--no-reinstall', 'Do not reinstall existing packages if they satisfy corresponding ranges.')
  .option('-E, --save-exact', 'Saved dependencies will be configured with an exact version. Same as --save-exact for npm-install.')
  .option('-n, --next', 'Use @next instead of @latest as a default tag.')

program.on('--help', () => {
  console.log('')
  console.log(dedent`
    Examples:
    
      01. Automatically installs latest versions of provided packages and it's peer dependencies:
      $ stapp install stapp stapp-validate
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.6.0
        ✔ stapp-validate@2.6.0
        ✔ redux@4.0.1
        ✔ rxjs@6.4.0
        ✔ stapp-formbase@2.6.0
    
      02. Accepts shortnames: 
      $ stapp install formbase
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp-formbase@2.6.0
        ✔ reselect@4.0.0
        ✔ stapp@2.6.0
      
      03. Fixes typos (if answer is not "y"/"yes", package installation will be skipped):
      $ stapp install stap
        ⠦ Parsing packages
          → ? "stap" does not exist. Did you mean stapp? (Y)
          Fetching packages meta
          Collecting peer dependencies
          Checking existing packages
          Installing dependencies
          
      04. Skipping peer dependencies with --no-peer:
      $ stapp install stapp --no-peer
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.6.0
      
      ⚠ Peer dependencies check was skipped.
          
      05. Skipping already installed packages with --no-reinstall:
      $ stapp install stapp --no-reinstall
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      ℹ Nothing was installed nor updated.
      
      Installation of some packages was skipped, see details below.
        ℹ stapp@2.6.0:  Package stapp@2.6.0 already installed and is up to date
        ℹ redux@4.0.1:  Package redux@4.0.1 already installed and is up to date
        ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date      
      
      06. Providing package versions:
      $ stapp install stapp@2.4.2
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.4.2
        ✔ redux@3.7.2
        
      07. Using @next tag as default with --next:
      $ stapp install stapp --next
        ✔ Parsing packages
        ✔ Fetching packages meta
        ✔ Collecting peer dependencies
        ✔ Checking existing packages
        ✔ Installing dependencies
      
      Successfully installed and/or updated packages:
        ✔ stapp@2.7.0-beta.3
        ✔ redux@4.0.1
        ✔ rxjs@6.4.0
  `)
})

program.parse(process.argv)

if (!exists('./package.json')) {
  console.log(chalk.red('Stapp-cli is intended to be used inside node package directory.'))
  process.exit(1)
}

const tasks = new Listr([
  {
    title: 'Parsing packages',
    task: parseInput
  },
  {
    title: 'Fetching packages meta',
    task: delay(fetchPackages, 250)
  },
  {
    title: 'Collecting peer dependencies',
    task: delay(collectPeerDependencies, 250),
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
    type: 'install',
    packages: program.args,
    peer: program.peer,
    save: program.save,
    reinstall: program.reinstall,
    saveExact: program.saveExact,
    next: program.next,
    dependencies: new Map()
  })
  .then(installationLog)
  .catch(error => {
    console.error(error)
  })
