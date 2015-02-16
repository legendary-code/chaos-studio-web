# exposes and imports various supported components

components = {}

# Maps
QuadraticMap = require './maps/QuadraticMap'
components.maps = [QuadraticMap]

# Rngs
MersenneTwister = require './rngs/MersenneTwister'
DefaultRng = require './rngs/DefaultRng'
components.rngs = [DefaultRng, MersenneTwister]

# Criteria
#FractalDimension = require './criteria/FractalDimension'
LyapunovExponent = require './criteria/LyapunovExponent'
components.criteria = [LyapunovExponent]

module.exports = components