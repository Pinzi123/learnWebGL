main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl2');

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      Time: gl.getUniformLocation(shaderProgram,"Time"),
    },
  };

 
  const buffers = initBuffers(gl,1,0,1);

  let texture;
  initTextures(gl,"./img/zz.jpg").then((tex)=>{
    texture= tex;
    requestAnimationFrame( render);
  })

  const render = (timestamp)=>{
    drawScene(gl, programInfo, buffers, texture);
    requestAnimationFrame(render);
  }
}

//
// Draw the scene.
//
let currentTime = 0;
function drawScene(gl, programInfo, buffers, texture) {
  clearMsceen(gl);

  setMVP(gl,programInfo);
  setPosition(gl,programInfo,buffers);
  setTextureCoord(gl,programInfo,buffers);
  setTexture(gl,programInfo,texture);
  gl.useProgram(programInfo.program);

  gl.uniform1f(programInfo.uniformLocations.Time, currentTime++);
  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}


