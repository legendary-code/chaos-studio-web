# Configuration required for finding attractors

class Configuration
    constructor: (@map, @rng, @criteria) ->

    @settlingIterations = 1000
    @searchIterations = 10000