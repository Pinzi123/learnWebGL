
var OFFSCREEN_WIDTH = 512, OFFSCREEN_HEIGHT = 512,cubeRotation=0;
const lightPos =  [0.0, 14.0, 0.0];
main();

function main() {

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.program = shaderProgram;

    const shadowProgram = initShaderProgram(gl, svsSource, sfsSource);
    gl.shadowProgram = shadowProgram;

    // Initialize framebuffer object (FBO)  
    var fbo = initFramebufferObject(gl);
    if (!fbo) {
        console.log('Failed to initialize frame buffer object');
        return;
    }
    gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    const render = (now) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        drawShadow(gl,cubeRotation);
       
        drawScene(gl, cubeRotation);
        cubeRotation += 0.01;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


function drawScene(gl, rotation) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);   
    gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    useProgram(gl, gl.program);
    gl.uniform1i(programInfo.uniformLocations.shadowMap, 0);
    renderFog(gl);
    setMVP(gl, rotation);
    drawCube(gl);

    setMVP(gl,0);
    drawPlane(gl);
}

function drawCube(gl){
    setPosition(gl,CubeVertices,3,gl.FLOAT,CubeVertexIndices,CubeNormals);
    setOnecolor(gl,[1.0, 0.0, 0.0, 1.0],CubeVertices.length/3);
    setPointLight(gl,lightPos);
    
    mvBox&&gl.uniformMatrix4fv(
        programInfo.uniformLocations.mvMatrixFromLight ,
        false,
        mvBox);
        
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}


const PlaneVertices = [
    3.0, -2.0, -3.0,  3.0, -2.0, 3.0,  -3.0, -2.0, 3.0,
    3.0, -2.0, -3.0,  -3.0, -2.0, 3.0,  -3.0, -2.0, -3.0    
  ];

const PlaneNormal = [
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
];
function drawPlane(gl){
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,PlaneNormal);
    setOnecolor(gl,[1.0, 1.0, 1.0, 1.0],6);
    setPointLight(gl,lightPos);
    
    (mvPlane)&&gl.uniformMatrix4fv(
            programInfo.uniformLocations.mvMatrixFromLight ,
            false,
            mvPlane);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}


let mvPlane,mvBox;
function drawShadow(gl, rotation) {
    gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    useProgram(gl, gl.shadowProgram);
    
    mvBox = setMVP(gl, rotation, lightPos);
    drawCube(gl);

    mvPlane = setMVP(gl,0, lightPos);
    drawPlane(gl);
}

function renderFog(gl){
    const fogDesity = 0.5;
    const fogColor = [0.5, 0.2, 0.2, 1.0];
    const fogStart = 0.0;
    const fogEnd = 12.0;
    gl.uniform3fv(
        gl.getUniformLocation(gl.program, 'uFogInfo'),
        [fogDesity,fogStart,fogEnd]);

    gl.uniform4fv(
        gl.getUniformLocation(gl.program, 'uFogColor'),
        fogColor);
}