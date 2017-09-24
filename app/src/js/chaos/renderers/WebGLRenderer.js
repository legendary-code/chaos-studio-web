let m4 = require('../../utils/matrix'),
    Renderer = require('../Renderer'),
    Components = require('../Components'),
    Props = require('../Props');

const VERTEX_PROGRAM = `
uniform mat4 rotation;
uniform mat4 projection;
attribute vec4 position;
attribute vec4 color;

varying vec4 vColor;

void main() {
    gl_Position = projection * rotation * position;
    gl_PointSize = 1.0;
    vColor = color;
}
`;

const FRAGMENT_PROGRAM = `
precision mediump float;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}
`;

function degToRad(d) {
    return d * Math.PI / 180;
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createVertexShader(gl) {
    return createShader(gl, gl.VERTEX_SHADER, VERTEX_PROGRAM);
}

function createFragmentShader(gl) {
    return createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_PROGRAM);
}

function createShaderProgram(gl) {
    const program = gl.createProgram();
    gl.attachShader(program, createVertexShader(gl));
    gl.attachShader(program, createFragmentShader(gl));
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
}

class WebGLNativeRenderer extends Renderer {
    static get displayName() { return "WebGL Native Renderer"; }

    static get description() {
        return "Uses WebGL to render graphics";
    }

    static checkSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !! (canvas.getContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    create(viewport) {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
                   canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });

        const buffer = gl.createBuffer();
        const program = createShaderProgram(gl);
        const positionIndex = gl.getAttribLocation(program, 'position');
        const colorIndex = gl.getAttribLocation(program, 'color');

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 28, 0);
        gl.enableVertexAttribArray(positionIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 28, 12);
        gl.enableVertexAttribArray(colorIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.clearColor(0.88, 0.88, 0.88, 1.0);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        //const projectionMatrix = m4.translate(m4.perspective(degToRad(60), width / height, 0.0001, 100), 0, 0, -2.5);
        const orthographicMatrix = m4.orthographic(-1.5, 1.5, -1.5, 1.5, -2, 2);
        const projectionLocation = gl.getUniformLocation(program, 'projection');
        gl.uniformMatrix4fv(projectionLocation, false, orthographicMatrix);

        this._rotationLocation = gl.getUniformLocation(program, 'rotation');

        this._gl = gl;
        this._buffer = buffer;
        this.resize(viewport);

        return canvas;
    }

    setRenderData(points) {
        const gl = this._gl;
        const buffer = this._buffer;

        const floats = [];

        for (let point of points) {
            // position
            for (let i = 0; i < 3; ++i) {
                floats.push(point[i]);
            }

            // w
            //floats.push(1.0);

            // color
            for (let i = 0; i < 3; ++i) {
                if (point.length > 3) {
                    floats.push(point[i]);
                } else {
                    floats.push(0.0);
                }
            }

            // a
            if (point.length > 6) {
                floats.push(point[6]);
            } else {
                floats.push(0.1);
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floats), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._bufferSize = points.length;
    }

    destroy() {
    }

    resize(viewport) {
        const width = viewport.width * viewport.devicePixelRatio;
        const height = viewport.height * viewport.devicePixelRatio;
        this._gl.canvas.width = width;
        this._gl.canvas.height = height;
        this._gl.canvas.style.width = viewport.width + 'px';
        this._gl.canvas.style.height = viewport.height + 'px';
        this._gl.viewport(0, 0, width, height);
    }

    render(rotationX, rotationY) {
        const gl = this._gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const count = this._bufferSize || 0;

        if (count > 0) {
            const rotationMatrix = m4.xRotate(m4.yRotate(m4.identity(), rotationX), -rotationY);
            gl.uniformMatrix4fv(this._rotationLocation, false, rotationMatrix);
            gl.drawArrays(gl.POINTS, 0, count);
        }
    }
}

Components.register(Renderer, WebGLNativeRenderer, true);
module.exports = WebGLNativeRenderer;