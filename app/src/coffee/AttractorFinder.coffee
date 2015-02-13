Context = require 'Context'

class AttractorFinder
    constructor: (@configuration, @onStatus, @onComplete) ->
    find: ->
        map = configuration.map
        rng = configuration.rng
        found = false

        while !found
            coefficients = []
            initialValue = []
            value = []
            values = []

            # TODO: use time as seed
            rng.reset 0

            onStatus "Picking new coefficients..."

            for i in [1..map.coefficients]
                coefficients.push rng.next * 2 - 1

            for d in [1..map.dimensions]
                initialValue.push rng.next * 2 - 1
            value = initialValue[:]

            context = new Context(configuration, initialValue, coefficients)

            # settle
            onStatus "Settling potential attractor..."
            for i in [1..configuration.settlingIterations]
                value = map.apply(value, coefficients)
                # TODO: check out of bounds

            for criterion in configuration.criteria
                criterion.reset value

            # search
            onStatus "Applying search criteria..."
            abort = false

            for i in [1..configuration.searchIterations]
                value = map.apply(value, coefficients)
                values.push value
                # TODO: continue computing bounds
                for criterion in configuration.criteria
                    result = criterion.test value
                    if !result
                        abort = true
                        break

                if abort
                    break

            if abort
                continue

            onStatus "Generating remaining points"

            for i in [1..configuration.totalIterations - configuration.searchIterations]
                value = map.apply(value, coefficients)
                values.push value

            onComplete values