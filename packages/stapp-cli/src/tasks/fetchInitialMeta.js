const packageJson = require('package-json')

const fetchInitialMeta = async (context) => {
  const promises = []

  context.dependencies.forEach(({ name, version, skip }) => {
    if (skip) {
      return
    }

    promises.push(async () => {
      const meta = await packageJson(name, { version })

      context.dependencies.set(name, {
        name,
        version: meta.version,
        peerDependencies: meta.peerDependencies ? Object.entries(meta.peerDependencies) : null
      })
    })
  })

  return Promise.all(promises.map(p => p()))
}

module.exports = fetchInitialMeta
