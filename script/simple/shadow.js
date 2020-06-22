main();

//
// Start here
//
function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

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
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            mvMatrixFromLight: gl.getUniformLocation(shaderProgram, 'uMvMatrixFromLight'),

            lightColor: gl.getUniformLocation(shaderProgram, 'uLightColor'),
            lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
            ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
            shadowMap: gl.getUniformLocation(shaderProgram, 'uShadowMap'),
        },
    };
    gl.program = shaderProgram;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    const shadowProgram = initShaderProgram(gl, svsSource, sfsSource);
    const shadowProgramInfo = {
        program: shadowProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shadowProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shadowProgram, "aTextureCoord")
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shadowProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shadowProgram, 'uModelViewMatrix'),
        },
    };
    gl.shadowProgram = shadowProgram;

      // Initialize framebuffer object (FBO)  
        var fbo = initFramebufferObject(gl);
        if (!fbo) {
            console.log('Failed to initialize frame buffer object');
            return;
        }
        gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    const buffers = initBuffers(gl, CubeVertices, 1, 0);

    const render = (now) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        drawShadow(gl, shadowProgramInfo, buffers, cubeRotation);
        drawScene(gl, programInfo, buffers, cubeRotation);
        cubeRotation += 0.01;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


var cubeRotation = 0.0;
//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, rotation) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);   
    clearMsceen(gl);
    gl.useProgram(gl.program);
    drawPlane(gl, programInfo);

    setPosition(gl, programInfo, buffers);
    setColor(gl, programInfo, buffers);
    initArrayBuffer(gl, 'aNormal', CubeNormals, 3, gl.FLOAT)
    setPointLight(gl, programInfo);
    gl.uniform1i(programInfo.uniformLocations.shadowMap, 0);
    setMVP(gl, programInfo, rotation);
    
    mv&&gl.uniformMatrix4fv(
        programInfo.uniformLocations.mvMatrixFromLight ,
        false,
        mv);
        
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

function drawPlane(gl, programInfo){
    const buffers = initBuffers(gl,[
        3.0, -2.0, -3.0,  3.0, -2.0, 3.0,  -3.0, -2.0, 3.0,
        3.0, -2.0, -3.0,  -3.0, -2.0, 3.0,  -3.0, -2.0, -3.0    
      ],[
        1.0, 1.0, 1.0,1.0,    1.0, 1.0, 1.0,1.0,  1.0, 1.0, 1.0,1.0,   
        1.0, 1.0, 1.0,1.0,    1.0, 1.0, 1.0,1.0,  1.0, 1.0, 1.0,1.0,
      ],0);
    setPosition(gl, programInfo, buffers);
    setColor(gl, programInfo, buffers);
    initArrayBuffer(gl, 'aNormal', new Float32Array([
        0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0,
        0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0,
  ]), 3, gl.FLOAT);
    setPointLight(gl, programInfo);
    if(programInfo.uniformLocations.shadowMap)gl.uniform1i(programInfo.uniformLocations.shadowMap, 0); 
    setMVP(gl, programInfo);
    if(mv){
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.mvMatrixFromLight ,
            false,
            mv);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}


let mv;
function drawShadow(gl, programInfo, buffers, rotation) {
    clearMsceen(gl);
    gl.useProgram(gl.shadowProgram);

    let buffers2 = initBuffers(gl,[
        3.0, -2.0, -3.0,  3.0, -2.0, 3.0,  -3.0, -2.0, 3.0,
        3.0, -2.0, -3.0,  -3.0, -2.0, 3.0,  -3.0, -2.0, -3.0    
      ],0,0);
    setPosition(gl, programInfo, buffers2);
    mv = setMVP(gl, programInfo, rotation,);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    setPosition(gl, programInfo, buffers);
    mv = setMVP(gl, programInfo, rotation);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);  
}


function setPointLight(gl, programInfo){
  // Set the light color (white)
  gl.uniform3f(programInfo.uniformLocations.lightColor, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(programInfo.uniformLocations.lightPosition, 0.0, 14.0, 0.0);
  // Set the ambient light
  gl.uniform3f(programInfo.uniformLocations.ambientLight, 0.2, 0.2, 0.2);
}