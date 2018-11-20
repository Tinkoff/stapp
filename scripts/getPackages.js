const fs = require('fs')
const path = require('path')
const glob = require("glob")

const readJSONFile = file => JSON.parse(fs.readFileSync(file))

const flatMap = (arr, fn) => {
  return arr.reduce((r, n) => {
    return r.concat(fn(n))
  }, [])
}

module.exports = () => {
  const lernaConfig = readJSONFile(path.join(process.cwd(), 'lerna.json'))
  const { packages } = lernaConfig

  return flatMap(packages, p => glob.sync(`${p}/package.json`))
    .map(packagePath => {
      const packageJson = readJSONFile(packagePath)

      return {
        name: packageJson.name,
        version: packageJson.version,
        private: packageJson.private,
        packagePath,
        dirPath: path.dirname(packagePath)
      }
    })
}
