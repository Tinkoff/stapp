const ncu = require('npm-check-updates')
const pSeries = require('p-series');
const getPackages = require('./getPackages')

const packages = getPackages()
const tasks = packages.map(p => () => ncu.run({
  packageFile: p.packagePath,
  upgrade: true,
  upgradeAll: true
}).then(() => console.log(p.name, 'updated')))


pSeries(tasks).then(() => console.log('All done!'))
