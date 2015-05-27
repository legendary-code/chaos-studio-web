/* Exposes and imports various supported components */
module.exports = {
    maps: [
        require('./maps/QuadraticMap')
    ],
    rngs: [
        require('./rngs/DefaultRng'),
        require('./rngs/LinearCongruentialGenerator')
    ],
    criteria: [
        require('./criteria/LyapunovExponent')
    ],
    renderers: [
        require('./renderers/WebGLRenderer')
    ],
    colorizers: [
        require('./colorizers/PencilSketch')
    ],
    projections: [
        require('./projections/Perspective')
    ]
};