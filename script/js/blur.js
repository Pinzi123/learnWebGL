 
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
    useProgram(gl,gl.program);
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
    initTextures(gl,"./img/zz.jpg").then((texture)=>{
      drawPlane(gl, texture);
    })

}


function drawScene(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);   
    gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    useProgram(gl, gl.program);
    gl.uniform1i(programInfo.uniformLocations.shadowMap, 0);

    setMVP(gl,0);
    drawPlane(gl);
}


const PlaneVertices = [
    2.0,  2.0, 0.0,
   -2.0,  2.0, 0.0,
    2.0, -2.0, 0.0,
   -2.0, -2.0, 0.0,
 ];


const PlaneTexture= [
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0, 
  ];

 
function drawPlane(gl, texture){
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null,PlaneTexture);
    setTexture(gl,texture);
    setMVP(gl, 0, [0.0,0.0,6.0], [0.0,0.0,-1.0],[0.0,1.0,0.0]);
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}
