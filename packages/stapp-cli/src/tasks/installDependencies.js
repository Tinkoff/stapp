const execa = require('execa')
const { Observable } = require('rxjs')

module.exports = (context) => {
  const tasks = ['install']
  const deps = []

  context.dependencies.forEach(({ name, version, skip }) => {
    if (skip) {
      return
    }

    deps.push(`${name}@${version}`)
  })

  if (!context.save) {
    tasks.push('--no-save')
  }

  if (context.saveExact) {
    tasks.push('--save-exact')
  }

  return new Observable((observer) => {
    observer.next(`${deps.join(', ')}`)

    execa('npm', [...tasks, ...deps])
      .then(() => {
        observer.next()
        observer.complete()
      })
      .catch((error) => observer.error(error))
  })
}
