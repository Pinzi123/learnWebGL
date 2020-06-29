
var OFFSCREEN_WIDTH = 512, OFFSCREEN_HEIGHT = 512,cubeRotation=0;
const lightPos =  [0.0, 14.0, -10.0];
main();
let ball,texture1,texture2;
function main() {

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.program = shaderProgram;



    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const render = (now) => {
        cubeRotation +=0.01;
        drawScene(gl, ball, cubeRotation);
        requestAnimationFrame(render);
    }

    
    loadObjFile("./obj/ballT.obj").then((data)=>{
        console.log(data);
        ball = data;
        initTextures(gl,"./img/basketball.png").then((tex)=>{
            texture1 = tex;
            initTextures(gl,"./img/mdb1.png").then((tex)=>{
                texture2 = tex;
                requestAnimationFrame(render);
            })
            
        });
        
        
    })
    

}


function drawScene(gl,ball, rotation) { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    useProgram(gl, gl.program);

    gl.disable(gl.DEPTH_TEST);
    



    setMVP(gl,0,[0.0,10.0,-32.0]);
    drawPlane(gl);

    gl.uniform1i(
        gl.getUniformLocation(gl.program,"hh"),
        true);
    setMVP(gl, rotation,[0.0,10.0,-32.0]);
    drawBall(ball,gl);

    gl.enable(gl.DEPTH_TEST);
    gl.uniform1i(
        gl.getUniformLocation(gl.program,"hh"),
        false);
    
    setMVP(gl, rotation,[0.0,10.0,-32.0]);
    drawBall(ball,gl);

}

// this.vertexCount=vertexCountIn; 
// this.vertices=verticesIn;
// this.texcoords=texcoordsIn;
// this.normals=normalsIn;  	  

function drawBall(ball, gl){
    setPosition(gl,ball.vertices,3,gl.FLOAT,null,ball.normals,ball.texcoords);
    setTexture(gl,texture1);
    setPointLight(gl,lightPos);
    
    gl.drawArrays(gl.TRIANGLES, 0, ball.vertexCount);

}


const PlaneVertices = [
    15.0, -10.0, -10.0,  15.0,  -10.0, 10.0,   -15.0, -10.0, -10.0, 
    15.0, -10.0,  10.0,  -15.0, -10.0, -10.0,  -15.0, -10.0,   10.0, 
  ];

const PlaneNormal = [
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0,
];

const PlaneTexture= [
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0, 
    1.0,  0.0,
    0.0,  0.0,
  ];

function drawPlane(gl){
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,PlaneNormal,PlaneTexture);
    // setOnecolor(gl,[0.9, 0.9, 0.9, 1],6);
    setTexture(gl,texture2);
    setPointLight(gl,lightPos);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
