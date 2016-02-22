export default class Threading {
    static runAsync(generatorFunc) {
        const iter = generatorFunc();

        const repeat = function() {
            const next = iter.next();
            if (!next.done) {
                setTimeout(repeat, 0);
            }
        };

        setTimeout(repeat, 0);
    }
}
