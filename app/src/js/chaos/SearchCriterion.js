let Component = require('./Component');

/* Implemented to define a search criterion used to filter out undesirable strange attractors */
class SearchCriterion extends Component {
    get requiresSettling() { return true; }
    test(context, nextValue, nextValueNormalized) { }
    renderStats() {}
    reset(context, initialValue) { }
}

module.exports = SearchCriterion;