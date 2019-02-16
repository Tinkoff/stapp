const semver = require('semver')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

// Utils
const has = require('../utils/has')

module.exports = async (context) => {
  if (context.program.reinstall) {
    return
  }

  const { dependencies } = JSON.parse(await readFile('./package.json', 'utf-8'))

  context.dependencies.forEach(({ name, version, skip }) => {
    if (skip) {
      return
    }

    if (!has(dependencies, name)) {
      return
    }

    const currentVersion = dependencies[name]

    if (semver.satisfies(semver.coerce(currentVersion).version, version)) {
      context.dependencies.set(name, {
        name,
        version,
        skip: 'Package already exists'
      })
    }
  })

  context.deps = dependencies
}
