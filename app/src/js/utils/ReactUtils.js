let ReactUtils = {
    join(classes) {
        let result = "";

        // Allow polyfill to inject iterator behaviors
        let args = Array.apply(Array, arguments);

        for (let clazz of args) {
            if (typeof clazz === "string") {
                if (result) {
                    result += " ";
                }

                result += clazz;
            }
        }
        return result;
    }
};

module.exports = ReactUtils;