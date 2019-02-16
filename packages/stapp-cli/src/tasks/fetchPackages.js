const packageJson = require('package-json')

module.exports = async (context) => {
  const promises = []

  context.packages.forEach(({ name, version, skip }) => {
    if (skip) {
      return
    }

    promises.push(async () => {
      const meta = await packageJson(name, { version })

      context.packages.set(name, {
        name,
        version: meta.version,
        peerDependencies: meta.peerDependencies ? Object.entries(meta.peerDependencies) : null
      })
    })
  })

  return Promise.all(promises.map(p => p()))
}
