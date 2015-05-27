var Component = require('./Component');

/* Implemented to define a search criterion used to filter out undesirable strange attractors */
class SearchCriterion extends Component {
    get status() { }
    test(nextValue) { }
    reset(initialValue) { }
}

module.exports = SearchCriterion;