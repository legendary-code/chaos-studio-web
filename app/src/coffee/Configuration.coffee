# Configuration required for finding attractors

class Configuration

  constructor: (@map, @rng, @criteria) ->
    @settlingIterations = 1000
    @searchIterations = 1000
    @totalIterations = 1000000

module.exports = Configuration