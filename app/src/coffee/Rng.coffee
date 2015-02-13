class Rng
  constructor: ->
  reset: (seed) ->
    @seed = seed
  next: ->

module.exports = Rng