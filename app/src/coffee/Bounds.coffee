Point = require './Point'

class Bounds
  constructor: ->
    @min = [Infinity, Infinity, Infinity]
    @max = [-Infinity, -Infinity, -Infinity]

  update: (point) ->
    for i in [0..2] by 1
      if point[i] < @min[i]
        @min[i] = point[i]
      if point[i] > @max[i]
        @max[i] = point[i]

  normalize: (point) ->
    return [
      (point[0] - @min[0]) / (@max[0] - @min[0]),
      (point[1] - @min[1]) / (@max[1] - @min[1]),
      (point[2] - @min[2]) / (@max[2] - @min[2])
    ]

  isValid: ->
    Point.isValid(@min) && Point.isValid(@max)

module.exports = Bounds