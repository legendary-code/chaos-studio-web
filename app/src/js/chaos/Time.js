/* Time utility */
export default class Time {
    static now() {
        return Date.now ? Date.now() : new Date().getTime();
    }
}
