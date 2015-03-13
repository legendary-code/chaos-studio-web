class Time {
    static now() {
        return Date.now ? Date.now() : new Date().getTime();
    }
}

module.exports = Time;