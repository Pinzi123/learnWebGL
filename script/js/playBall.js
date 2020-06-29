
var OFFSCREEN_WIDTH = 512, OFFSCREEN_HEIGHT = 512,cubeRotation=0;
const lightPos =  [0.0, 14.0, -10.0];
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


    const render = (now) => {
        // cubeRotation +=0.01;
        drawScene(gl, ball, cubeRotation);
        // requestAnimationFrame(render);
    }

    let ball;
    loadObjFile("./obj/ballT.obj").then((data)=>{
        console.log(data);
        ball = data;
        requestAnimationFrame(render);
    })
    

}


function drawScene(gl,ball, rotation) { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    useProgram(gl, gl.program);

    setMVP(gl,0,[0.0,10.0,-32.0]);
    drawPlane(gl);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    setMVP(gl, rotation,[0.0,10.0,-32.0]);
    drawBall(ball,gl,true);
    gl.disable(gl.BLEND);

    drawBall(ball,gl);

}

// this.vertexCount=vertexCountIn; 
// this.vertices=verticesIn;
// this.texcoords=texcoordsIn;
// this.normals=normalsIn;  	  

function drawBall(ball, gl,mirror=false){
    let ap = 1.0;
    if(mirror){
        ap = 0.4;
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            true);
    }else{
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"hh"),
            false);
    }
    setPosition(gl,ball.vertices,3,gl.FLOAT,null,ball.normals);
    setOnecolor(gl,[1.0, 0.0, 0.0, ap],ball.vertexCount);
    setPointLight(gl,lightPos);
    
    gl.drawArrays(gl.TRIANGLES, 0, ball.vertexCount);

}


const PlaneVertices = [
    15.0, -5.0, -10.0,  15.0,  -5.0, 10.0,   -15.0, -5.0, -10.0, 
    15.0, -5.0,  10.0,  -15.0, -5.0, -10.0,  -15.0, -5.0,   10.0, 
  ];

const PlaneNormal = [
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
];
function drawPlane(gl){
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,PlaneNormal);
    setOnecolor(gl,[0.9, 0.9, 0.9, 1],6);
    setPointLight(gl,lightPos);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
