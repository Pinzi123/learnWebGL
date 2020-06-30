
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
    

    const render = (now) => {
        cubeRotation +=0.01;
        drawScene(gl, ball, cubeRotation);
        requestAnimationFrame(render);
    }
    useProgram(gl, gl.program);
    
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

let time = 0,flag = 0.01;
function drawScene(gl,ball, rotation) { 
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.STENCIL_TEST);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);  

    //上升
    if(time>5) flag = -0.01;
    if(time<0) flag = 0.01;
    time+=flag;
    gl.uniform1f(
        gl.getUniformLocation(gl.program,"time"),
        time);
    //绘制地板
    gl.uniform1f(
        gl.getUniformLocation(gl.program,"hh"),
        0.0);
    gl.stencilFunc(gl.ALWAYS, 1, 1);
    setMVP(gl,0,[0.0,10.0,-32.0]);
    drawPlane(gl);

    //绘制镜像球
    gl.enable(gl.DEPTH_TEST);
    gl.stencilFunc(gl.EQUAL,1, 1); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(
        gl.getUniformLocation(gl.program,"hh"),
        1.0);
    setMVP(gl, rotation, [0.0,10.0,-32.0]);
    drawBall(ball,gl);

    //绘制真实的球
    gl.disable(gl.BLEND);
    gl.disable(gl.STENCIL_TEST);
    gl.uniform1f(
        gl.getUniformLocation(gl.program,"hh"),
        -1.0);
    setMVP(gl, rotation,[0.0,10.0,-32.0]);
    drawBall(ball,gl);
}

// this.vertexCount=vertexCountIn; 
// this.vertices=verticesIn;
// this.texcoords=texcoordsIn;
// this.normals=normalsIn;  	  

function drawBall(ball, gl){
    setPosition(gl,ball.vertices,3,gl.FLOAT,null,null,ball.texcoords);
    setTexture(gl,texture1);
    setPointLight(gl,lightPos);
    
    gl.drawArrays(gl.TRIANGLES, 0, ball.vertexCount);

}


const PlaneVertices = [
    25.0, -5.0, -10.0,  25.0,  -5.0, 10.0,   -25.0, -5.0, -10.0, 
    25.0, -5.0,  10.0,  -25.0, -5.0, -10.0,  -25.0, -5.0,   10.0, 
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
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null,PlaneTexture);
    // setOnecolor(gl,[0.9, 0.9, 0.9, 1],6);
    setTexture(gl,texture2);
    setPointLight(gl,lightPos);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
