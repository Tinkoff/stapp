const parseName = require('parse-package-name')
const semver = require('semver')
const { findBestMatch } = require('string-similarity')
const { Observable } = require('rxjs')
const through = require('through')
const inquirer = require('inquirer')
const validPackages = require('../stapp-packages')

const getBestMatch = (name) => {
  const { ratings } = findBestMatch(name, Object.keys(validPackages))

  const { rating, target } = ratings.sort((a, b) => {
    return b.rating - a.rating
  })[0]

  return {
    rating,
    target: validPackages[target]
  }
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
        context.dependencies.set(validPackages[name], {
          name: validPackages[name],
          version
        })
        continue
      }

      const bestMatch = getBestMatch(name)

      if (bestMatch.rating < 0.6) {
        context.dependencies.set(name, {
          name,
          version,
          skip: `Package "${name}" does not exist or is not supported by stapp-cli-tools yet.`
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
        skip: `Package "${name}" does not exist or is not supported by stapp-cli-tools yet.`
      })
    }

    setTimeout(() => {
      observer.complete()
    }, 200)
  })
}

module.exports = parseInput
