const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

// Utils
const has = require('../utils/has')
const removeCaret = require('../utils/removeCaret')

const checkExistingPackages = async (context) => {
  const { dependencies } = JSON.parse(await readFile('./package.json', 'utf-8'))

  context.dependencies.forEach(({ name, version, skip }) => {
    if (skip) {
      return
    }

    if (!has(dependencies, name)) {
      return
    }

    const currentVersion = removeCaret(dependencies[name])

    if (currentVersion !== version) {
      return
    }

    if (context.reinstall) {
      return
    }

    context.dependencies.set(name, {
      name,
      version,
      skip: `Package ${name}@${version} already installed and is up to date`
    })
  })
}

module.exports = checkExistingPackages
