
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

    const singleProgram = initShaderProgram(gl, vsSource, shaderSingleColor);
    gl.singleProgram = singleProgram;


    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.STENCIL_TEST);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);  
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const render = (now) => {
        cubeRotation += 0.01;
        drawScene(gl, cubeRotation);
    }
    requestAnimationFrame(render);

}


function drawScene(gl, rotation) { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.stencilMask(0x00);
    useProgram(gl, gl.program);

    setMVP(gl,0);
    drawPlane(gl);


    gl.stencilFunc(gl.ALWAYS, 1, 0xFF); 
    gl.stencilMask(0xFF); 
    setMVP(gl, rotation);
    drawCube(gl);

    gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
    gl.stencilMask(0x00); 
    // gl.disable(gl.DEPTH_TEST);
    useProgram(gl, gl.singleProgram);

    setMVP(gl, rotation);
    drawCube(gl,1.02);
    // gl.stencilMask(0xFF);
    // gl.enable(gl.DEPTH_TEST);
}

function drawCube(gl, scale=1){
    if(scale !== 1){
        let cube = [];
        for (let index = 0; index < CubeVertices.length; index++) {
            cube[index] = CubeVertices[index] * scale;
            
        }
        setPosition(gl,cube,3,gl.FLOAT,null,null);
        setOnecolor(gl,[1.0, 1.0, 1.0, 1.0],CubeVertices.length/3);
        setPointLight(gl,lightPos);

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }else{
        setPosition(gl,CubeVertices,3,gl.FLOAT,CubeVertexIndices,CubeNormals);
        setOnecolor(gl,[1.0, 1.0, 1.0, 1.0],CubeVertices.length/3);
        setPointLight(gl,lightPos);
            
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
    

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

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
