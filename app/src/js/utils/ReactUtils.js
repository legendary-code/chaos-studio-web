let ReactUtils = {
    join(classes) {
        let result = "";
        for (let clazz of arguments) {
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