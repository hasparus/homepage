import { onCleanup, onMount } from "solid-js";

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec3 a_normal;
varying vec3 v_normal;
void main(void) {
    gl_Position = a_position;
    v_normal = a_normal;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 v_normal;
void main(void) {
    vec3 lightDirection = normalize(vec3(1.0, 1.0, -0.5));
    float lightIntensity = dot(normalize(v_normal), lightDirection);
    lightIntensity = clamp(lightIntensity, 0.1, 1.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * lightIntensity;
}
`;

export function SphereAndAxes() {
  let canvasRef!: HTMLCanvasElement;
  let gl: WebGLRenderingContext;
  let cleanup = () => {};

  onMount(() => {
    const side = Math.min(200, window.innerWidth - 32);

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(side * devicePixelRatio);
    const displayHeight = Math.floor(side * devicePixelRatio);

    canvasRef.width = displayWidth;
    canvasRef.height = displayHeight;

    // Set CSS size to original dimensions
    canvasRef.style.width = `${side}px`;
    canvasRef.style.height = `${side}px`;

    gl = canvasRef.getContext("webgl2", {
      premultipliedAlpha: false,
      antialias: true,
    })!;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvasRef.width, canvasRef.height);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "Vertex Shader Error: " + gl.getShaderInfoLog(vertexShader)
      );
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment Shader Error: " + gl.getShaderInfoLog(fragmentShader)
      );
      return;
    }

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Program Linking Error:",
        gl.getProgramInfoLog(shaderProgram)
      );
      return;
    }
    gl.useProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const sphere = createSphere(0.5, 100);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.normals, gl.STATIC_DRAW);

    const normalAttributeLocation = gl.getAttribLocation(
      shaderProgram,
      "a_normal"
    );
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const position = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

    cleanup = () => {
      gl.deleteBuffer(vertexBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(shaderProgram);
    };
  });

  onCleanup(() => {
    cleanup();
  });

  return <canvas class="mx-auto" ref={canvasRef} />;
}

function createSphere(radius: number, segments: number) {
  let vertices: number[] = [];
  let indices: number[] = [];
  let normals: number[] = [];

  for (let latNumber = 0; latNumber <= segments; latNumber++) {
    const theta = (latNumber * Math.PI) / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= segments; longNumber++) {
      const phi = (longNumber * 2 * Math.PI) / segments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      vertices.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
    }
  }

  for (let latNumber = 0; latNumber < segments; latNumber++) {
    for (let longNumber = 0; longNumber < segments; longNumber++) {
      const first = latNumber * (segments + 1) + longNumber;
      const second = first + segments + 1;

      indices.push(first);
      indices.push(second);
      indices.push(first + 1);

      indices.push(second);
      indices.push(second + 1);
      indices.push(first + 1);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    normals: new Float32Array(vertices),
  };
}
