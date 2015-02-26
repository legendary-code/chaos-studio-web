var Component = require('./Component');

class SearchCriterion extends Component {
    get status() { }
    test(nextValue) { }
    reset(initialValue) { }
}

module.exports = SearchCriterion;