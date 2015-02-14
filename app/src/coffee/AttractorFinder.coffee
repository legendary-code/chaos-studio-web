Context = require './Context'
Bounds = require './Bounds'

class AttractorFinder
  constructor: (@configuration, @onStatus, @onComplete) ->

  find: ->
    map = @configuration.map
    rng = @configuration.rng
    found = false

    while !found
      coefficients = []
      initialValue = []
      value = []
      values = []

      rng.reset if Date.now then Date.now() else Date().getTime()
      @onStatus "Picking new coefficients..."

      for i in [1..map.coefficients()] by 1
        coefficients.push rng.next() * 2 - 1

      for i in [1..map.dimensions()] by 1
        initialValue.push rng.next() * 2 - 1
      value = initialValue[..]

      context = new Context(@configuration, initialValue, coefficients)
      bounds = new Bounds
      abort = false

      console.log(context)
      # settle
      @onStatus "Settling potential attractor..."
      for i in [1..@configuration.settlingIterations] by 1
        value = map.apply(value, coefficients)
        bounds.update(value)
        if !bounds.isValid()
          abort = true
          break

      continue if abort

      # search
      @onStatus "Applying search criteria..."
      criteria = @configuration.criteria.map (clazz) -> new clazz(context)

      for criterion in criteria
        criterion.reset value

      for i in [1..@configuration.searchIterations] by 1
        value = map.apply(value, coefficients)
        values.push value

        bounds.update(value)

        if !bounds.isValid()
          abort = true
          break

        for criterion in criteria
          result = criterion.test value
          if !result
            abort = true
            break

        break if abort

      continue if abort

      @onStatus "Generating remaining points"

      remainingIterations = @configuration.totalIterations - @configuration.searchIterations
      for i in [1..remainingIterations] by 1
        value = map.apply(value, coefficients)
        values.push value

      @onStatus "Normalizing points"

      for i in [0...values.length]
        values[i] = bounds.normalize(values[i])

      @onComplete values
      found = true

module.exports = AttractorFinder