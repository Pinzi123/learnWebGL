
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

    const render = (now) => {
        drawScene(gl, ball, cubeRotation);
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

    setMVP(gl,0);
    drawPlane(gl);


    setMVP(gl, rotation);
    drawBall(ball,gl);

}

// this.vertexCount=vertexCountIn;
// this.vertices=verticesIn;
// this.texcoords=texcoordsIn;
// this.normals=normalsIn;  	  

function drawBall(ball, gl){
    setPosition(gl,ball.vertices,3,gl.FLOAT,null,ball.normals);
    setOnecolor(gl,[1.0, 0.0, 0.0, 1.0],ball.vertexCount);
    setPointLight(gl,lightPos);
    
    gl.drawElements(gl.TRIANGLES, ball.vertexCount, gl.UNSIGNED_SHORT, 0);

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
