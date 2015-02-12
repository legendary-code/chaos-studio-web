SearchCriterion = require '../SearchCriterion'

class LyapunovExponent extends SearchCriterion
  innerSum = null
  precision = null
  samples = null
  attempts = null
  lyapunov = null
  prevValue = null
  nearValue = null

  test: (nextValue) ->
    nearValue = @

  reset: (initialValue) ->
    innerSum = 0
    delta = 1 / precision
    dimensions = @context.map.dimensions
    samples = 0
    attempts = 0

    dv = Math.sqrt(delta * delta / dimensions)
    nearValue = (v + dv for v in initialValue)


