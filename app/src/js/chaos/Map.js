import Component from './Component';

/* Implemented to define a transform/system from one point to another */
export default class Map extends Component {
    get dimensions() { return 3; }
    get coefficients() { }
    apply(val, coefficients) { }
}
