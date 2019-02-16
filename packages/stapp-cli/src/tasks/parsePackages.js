const parseName = require('parse-package-name')
const validPackages = require('../stapp-packages')

const getName = (name) => name.startsWith('stapp') ? name : `stapp-${name}`

module.exports = async (context, task) => {
  context.program.args.forEach(arg => {
    const parsed = parseName(arg)
    const name = getName(parsed.name)
    const version = parsed.version || context.program.next ? 'next' : 'latest'
    let skipNotice

    if (name === 'stapp-rxjs') {
      skipNotice = 'Package "stapp-rxjs" is deprecated since 2.6.0'
    }

    if (!validPackages.includes(name)) {
      skipNotice = `Package "${name}" is not supported by stapp-cli yet`
    }

    context.packages.set(name, {
      name,
      version,
      skip: skipNotice
    })
  })
}
