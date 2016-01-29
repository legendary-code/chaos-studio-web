export default class Threading {
    static runAsync(generatorFunc) {
        let iter = generatorFunc();

        let repeat = function() {
            let next = iter.next();
            if (!next.done) {
                setTimeout(repeat, 0);
            }
        };

        setTimeout(repeat, 0);
    }
}
