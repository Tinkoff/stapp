#!/usr/bin/env node
'use strict'

const program = require('commander')
const { version } = require('../package')

program
  .version(version)
  .description('Stapp command line tools')
  .command('install [name]', 'Installs one or more stapp packages and related dependencies.').alias('i')
  .command('check', 'Checks existing stapp packages.').alias('c')
  .command('update', 'Updates existing stapp packages.').alias('u')
  .parse(process.argv)
