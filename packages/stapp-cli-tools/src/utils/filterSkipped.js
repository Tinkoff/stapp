module.exports = (packages) => {
  const notSkipped = new Map()
  const skipped = new Map()

  packages.forEach(p => {
    p.skip ? skipped.set(p.name, p) : notSkipped.set(p.name, p)
  })

  return [notSkipped, skipped]
}
