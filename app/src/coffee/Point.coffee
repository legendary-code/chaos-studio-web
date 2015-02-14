class Point
  @isValid: (point) ->
    sum = point[0] + point[1] + point[2]
    return !isNaN(sum) && isFinite(sum)

module.exports = Point