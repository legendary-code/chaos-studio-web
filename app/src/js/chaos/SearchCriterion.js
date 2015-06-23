var Component = require('./Component');

/* Implemented to define a search criterion used to filter out undesirable strange attractors */
class SearchCriterion extends Component {
    test(context, nextValue, nextValueNormalized) { }
    reset(context, initialValue) { }
}

module.exports = SearchCriterion;