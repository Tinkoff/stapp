const execa = require('execa')
const Listr = require('listr')

module.exports = (context) => {
  const tasks = []

  context.dependencies.forEach(({ name, version, skip }) => {
    tasks.push({
      title: `${name}@${version}`,
      skip: () => {
        return skip
      },
      task: (_, task) => {
        const arguments = ['install', `${name}@${version}`]

        if (!context.save) {
          arguments.push('--no-save')
        }

        if (context.saveExact) {
          arguments.push('--save-exact')
        }

        return execa('npm', arguments)
          .then(({ stdout }) => {
            task.title = `Installed ${stdout.split('\n')[0].slice(2)}`
          })
      }
    })
  })

  return new Listr(tasks, { concurrent: true })
}
