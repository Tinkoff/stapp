const semver = require('semver')
const dedent = require('dedent')
const packageJson = require('package-json')

const collectPeerDependencies = async (context) => {
  if (!context.peer) {
    return
  }

  const { dependencies } = context

  const promises = []

  dependencies.forEach(({ name, version, skip, peerDependencies }) => {
    if (skip) {
      return
    }

    if (!peerDependencies) {
      return
    }

    peerDependencies.forEach(([ peerName, peerVersion ]) => {
      promises.push(async () => {
        if (!dependencies.has(peerName)) {
          const meta = await packageJson(peerName, { version: peerVersion })

          dependencies.set(peerName, {
            name: peerName,
            version: meta.version
          })
        } else {
          const otherVersion = dependencies.get(peerName).version

          if (!semver.satisfies(otherVersion, peerVersion)) {
            throw new Error(dedent`
              Package "${name}@${version}" requires a peer dependency of ${peerName}@${peerVersion},
              but there is another version of this dependency in the dependency tree (${peerName}@${otherVersion}),
              which doesn't satisfy the provided range.
              
              Check versions of the requested packages, or skip them to install the latest version of each package.
            `)
          }
        }
      })
    })
  })

  return Promise.all(promises.map(p => p()))
}


module.exports = collectPeerDependencies
