const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

// Utils
const validPackages = require('../stapp-packages')

const getPackages = async (context) => {
  const dependencies = Object.entries(JSON.parse(await readFile('./package.json', 'utf-8')).dependencies || {})

  dependencies.forEach(([name]) => {
    if (name === 'stapp-rxjs') {
      context.dependencies.set(name, {
        name,
        skip: 'Package "stapp-rxjs" is deprecated since 2.6.0.'
      })

      return
    }

    if (validPackages.includes(name)) {
      context.dependencies.set(name, {
        name,
        version: context.next ? 'next' : 'latest'
      })
    }
  })

  if (context.dependencies.size === 0) {
    throw new Error('Failed to find any stapp package')
  }
}

module.exports = getPackages
