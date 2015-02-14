Rng = require '../Rng'

class DefaultRng extends Rng
  next: -> Math.random()

module.exports = DefaultRng