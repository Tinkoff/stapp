const semver = require('semver')
const dedent = require('dedent')

module.exports = async (context) => {
  const { packages, dependencies } = context

  // add requested packages to dependencies
  packages.forEach(({ name, version, skip }) => {
    dependencies.set(name, { name, version, skip })
  })

  if (!context.program.peer) {
    return
  }

  // add peerDependencies to dependencies
  packages.forEach(({ name, version, skip, peerDependencies }) => {
    if (skip) {
      return
    }

    if (!peerDependencies) {
      return
    }

    peerDependencies.forEach(([peerName, peerVersion]) => {
      if (dependencies.has(peerName)) {
        const otherVersion = dependencies.get(peerName).version
        if (!semver.intersects(otherVersion, peerVersion)) {
          throw new Error(dedent`
            Required version of peer dependency ${peerName}@${peerVersion} mismatched with one or more dependencies (${peerName}@${otherVersion}).
            Check versions of the requested packages, or skip them to install the latest version of each package.
          `)
        }
      } else {
        dependencies.set(peerName, {
          name: peerName,
          version: peerVersion
        })
      }
    })
  })
}
