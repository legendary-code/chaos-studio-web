const Component = require('./Component'),
      Components = require('./Components');

/* Implemented to define a renderer that is capable of rendering colored vertices to a canvas */
class Renderer extends Component {
    /* Tests whether this renderer is supported by the browser */
    static checkSupported() {
        return true;
    }

    /* Returns a DOM element (canvas) that acts as the rendering surface */
    create(width, height) { }

    /* Destroys rendering surface and any additional state */
    destroy() { }

    /* Sets rendering data to be rendered */
    setRenderData(points) { }

    /* Render to surface */
    render(rotationX, rotationY) { }

    /* Resizes rendering surface.  The actual surface doesn't need to be resized,
       but the scene needs to know what size the surface is in order to render correctly. */
    resize(width, height) { }
}

Components.register(Renderer, Renderer, true);
module.exports = Renderer;