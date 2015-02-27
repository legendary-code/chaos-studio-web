var Dispatcher = require('./Dispatcher');

class ChaosDispatcher extends Dispatcher {
    static dispatch(action, data) {
        data.action = action;
        super.dispatch(data);
    }
}

module.exports = new ChaosDispatcher();