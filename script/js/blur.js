 
var OFFSCREEN_WIDTH = 512, OFFSCREEN_HEIGHT = 512;
main();

function main() {

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    const shaderProgram = initShaderProgram(gl, vsSource, BFsSource);
    gl.program = shaderProgram;
    
    const blurShaderProgram = initShaderProgram(gl, vsSource, BlurFsSource);
    gl.blurProgram = blurShaderProgram;

    const mShaderProgram = initShaderProgram(gl, vsSource, MFsSource);
    gl.mProgram = mShaderProgram;


    useProgram(gl,gl.program);
    // Initialize framebuffer object (FBO)  
    var fbo = initFramebufferObject(gl);
    var fbo2 = initFramebufferObject(gl);
    if (!fbo) {
        console.log('Failed to initialize frame buffer object');
        return;
    }
    gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
    gl.activeTexture(gl.TEXTURE1);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    initTextures(gl,"./img/f.jpg").then((texture)=>{
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            false);
        drawPlane(gl, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // drawPlane2(gl, fbo2.texture, texture, true);
        // bloom效果
        blur(fbo2.texture,texture);
        // 模糊效果
        // blur(texture);
        // drawPlane2(gl,texture,fbo.texture);
    })

    const blur=(texture,realT)=>{
        useProgram(gl,gl.blurProgram);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//要在清除前绑定
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            false);
        drawPlane(gl, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//要在清除前绑定
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            true);
        drawPlane(gl, fbo.texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//要在clear前bindFramebuffer
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            false);
        drawPlane(gl, fbo2.texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawPlane2(gl, fbo.texture, realT, true);
    }

}


const PlaneVertices = [
    2.5,  2.5, 0.0,
   -2.5,  2.5, 0.0,
    2.5, -2.5, 0.0,
   -2.5, -2.5, 0.0,
 ];


const PlaneTexture= [
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0, 
  ];

 
function drawPlane(gl, texture,flag = false){
    if(flag)
        setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null,PlaneTexture);
    else
        setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null,[
            1.0,  1.0,
            0.0,  1.0, 
            1.0,  0.0,
            0.0,  0.0,
          ]);
    setTexture(gl,texture);
    setMVP(gl, 0, [0.0,0.0,6.0], [0.0,0.0,-1.0],[0.0,1.0,0.0]);
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

function drawPlane2(gl, texture1,texture2){
    useProgram(gl,gl.mProgram);
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null,PlaneTexture);
    setTexture(gl,texture1,0);
    setTexture(gl,texture2,1);
    setMVP(gl, 0, [0.0,0.0,6.0], [0.0,0.0,-1.0],[0.0,1.0,0.0]);
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

