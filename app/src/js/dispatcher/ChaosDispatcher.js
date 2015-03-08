var Dispatcher = require('./Dispatcher');

class ChaosDispatcher extends Dispatcher {
    static dispatch(type, data) {
        super.dispatch({type: type, data: data});
    }
}

module.exports = new ChaosDispatcher();