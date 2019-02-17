#!/usr/bin/env node
'use strict'

const program = require('commander')
const { version } = require('../package')

program
  .version(version)
  .description('Stapp command line utilities')
  .command('install [name]', 'install one or more stapp packages and related dependencies').alias('i')
  .command('update', 'update existing stapp packages').alias('u')
  .parse(process.argv)
