import Rng from '../Rng';

export default class DefaultRng extends Rng {
    next() {
        return Math.random();
    }
}
