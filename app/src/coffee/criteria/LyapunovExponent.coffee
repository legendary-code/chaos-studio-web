SearchCriterion = require '../SearchCriterion'
Point = require '../Point'

class LyapunovExponent extends SearchCriterion
  @_LOG2 = 0.69314718055994530941723212145819

  constructor: ->
    @max = 10.0
    @min = 0.015
    @precision = 1e11
    @minIterations = 100

  reset: (context, initialValue) ->
    @_innerSum = 0
    @_delta = 1 / @precision
    dimensions = context.configuration.map.dimensions
    @_samples = 0

    dv = Math.sqrt(@_delta * @_delta / dimensions)
    @_nearValue = (v + dv for v in initialValue)

  test: (context, nextValue) ->
    # transform our near point and compare against next value
    @_nearValue = context.map.apply(@_nearValue, context.coefficients)
    if (!Point.isValid(@_nearValue))
      return false

    dx = @_nearValue[0] - nextValue[0]
    dy = @_nearValue[1] - nextValue[1]
    dz = @_nearValue[2] - nextValue[2]
    distance = Math.sqrt(dx*dx + dy*dy + dz*dz)

    # TODO: how to handle a distance of 0
    if distance > 0.0
      @_innerSum += Math.log(distance / @_delta)
      # readjust near point
      @_nearValue = (nextValue[i] + @_delta * (nextValue[i] - @_nearValue[i]) / distance for i in [0..2])
      @_samples++

    @_lyapunov = LyapunovExponent._LOG2 * (@_innerSum / @_samples);

    if @_samples >= @minIterations && (@_lyapunov < @min || @_lyapunov > @max)
      console.log("Lyapunov: " + @_lyapunov)
      return false

    return true

module.exports = LyapunovExponent

