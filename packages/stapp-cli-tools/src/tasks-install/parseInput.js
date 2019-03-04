const parseName = require('parse-package-name')
const semver = require('semver')
const { findBestMatch } = require('string-similarity')
const { Observable } = require('rxjs')
const through = require('through')
const inquirer = require('inquirer')
const validPackages = require('../stapp-packages')

const getBestMatch = (name) => {
  const ratingsA = findBestMatch(name, validPackages).ratings
  const ratingsB = findBestMatch(`stapp-${name}`, validPackages).ratings

  return ratingsA.concat(ratingsB).sort((a, b) => {
    return b.rating - a.rating
  })[0]
}

const parseInput = (context) => {
  return new Observable(async (observer) => {
    for (let arg of context.packages) {
      const parsed = parseName(arg)
      const name = parsed.name
      const version = parsed.version || (context.next ? 'next' : 'latest')

      if (
        (name === 'stapp-rxjs' || name === 'rxjs')
        && (version === 'latest' || version === 'next' || semver.gte(version, '2.6.0'))
      ) {
        context.dependencies.set('stapp-rxjs', {
          name,
          skip: 'Package "stapp-rxjs" is deprecated since 2.6.0.'
        })
        continue
      }

      if (validPackages.includes(name)) {
        context.dependencies.set(name, {
          name,
          version
        })
        continue
      }

      if (validPackages.includes(`stapp-${name}`)) {
        context.dependencies.set(`stapp-${name}`, {
          name: `stapp-${name}`,
          version
        })
        continue
      }

      const bestMatch = getBestMatch(name)

      if (bestMatch.rating < 0.6) {
        context.dependencies.set(name, {
          name,
          version,
          skip: `Package "${name}" does not exist or is not supported by stapp-cli yet.`
        })
        continue
      }

      let buffer = ''

      const outputStream = through(data => {
        if (/\u001b\[.*?(D|C)$/.test(data)) {
          if (buffer.length > 0) {
            observer.next(buffer)
            buffer = ''
          }
          return
        }

        buffer += data
      })

      const prompt = inquirer.createPromptModule({
        output: outputStream
      })

      const result = await prompt([{
        type: 'input',
        name: 'result',
        message: `"${name}" does not exist. Did you mean ${bestMatch.target}?`,
        default: 'Y'
      }]).then(a => String(a.result).trim())

      observer.next()

      if (/^(?:y|yes|true|1)$/i.test(result)) {
        context.dependencies.set(bestMatch.target, {
          name: bestMatch.target,
          version
        })
        continue
      }

      context.dependencies.set(name, {
        name,
        version,
        skip: `Package "${name}" does not exist or is not supported by stapp-cli yet.`
      })
    }

    setTimeout(() => {
      observer.complete()
    }, 200)
  })
}

module.exports = parseInput
