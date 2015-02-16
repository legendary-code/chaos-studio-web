Context = require './Context'
Bounds = require './Bounds'
Point = require './Point'

class AttractorFinder
  constructor: (@configuration, @onStatus, @onComplete) ->

  find: ->
    map = new @configuration.map
    rng = new @configuration.rng
    found = false
    dimensions = @configuration.map.dimensions
    numCoefficients = @configuration.map.coefficients
    criteria = @configuration.criteria.map (clazz) -> new clazz

    while !found
      coefficients = []
      initialValue = []
      value = []
      values = []

      rng.reset if Date.now then Date.now() else Date().getTime()
      @onStatus "Picking new coefficients..."

      for i in [1..numCoefficients] by 1
        coefficients.push rng.next() * 2 - 1

      for i in [1..dimensions] by 1
        initialValue.push rng.next() * 2 - 1
      value = initialValue[..]

      context = new Context(@configuration, map, rng, criteria, initialValue, coefficients)
      bounds = new Bounds
      abort = false

      # settle
      @onStatus "Settling potential attractor..."
      for i in [1..@configuration.settlingIterations] by 1
        value = map.apply(value, coefficients)
        if !Point.isValid(value)
          abort = true
          break

      continue if abort

      # search
      @onStatus "Applying search criteria..."

      for criterion in criteria
        criterion.reset(context, value)

      for i in [1..@configuration.searchIterations] by 1
        value = map.apply(value, coefficients)
        bounds.update(value)
        values.push value

        if !Point.isValid(value)
          abort = true
          break

        for criterion in criteria
          result = criterion.test(context, value)
          if !result
            abort = true
            break

        break if abort

      continue if abort

      @onStatus "Generating remaining points"

      remainingIterations = @configuration.totalIterations - @configuration.searchIterations
      for i in [1..remainingIterations] by 1
        value = map.apply(value, coefficients)
        bounds.update(value)
        values.push value

      @onStatus "Normalizing points"

      for i in [0...values.length]
        values[i] = bounds.normalize(values[i])

      @onComplete values
      found = true

module.exports = AttractorFinder