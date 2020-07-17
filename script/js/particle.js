

function  main() {
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.program = shaderProgram;
    useProgram(gl,gl.program);
    
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    
    let texture=null,offsetArray=[0,0,0],count=500;
    initTextures(gl,"./img/snow.png").then((tex)=>{
        texture=tex;
        initOffser();
        animation();
    });

    
    const camera = new Camera(gl,gl.program);
    const initOffser = ()=>{
        for (let index = 0; index < count; index++) {
            let [k1,k2,k3]=[
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
            ]
            offsetArray[index*3+0] = k1*10;
            offsetArray[index*3+1] = k2*20;
            offsetArray[index*3+2] = k3*10;
        }
    }

    const render = ()=>{
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"isPlane"),
            false);
        const position = [
			-0.03, -0.03, 0, 
			0.03, -0.03, 0, 
			0.03, 0.03, 0, 
			-0.03, 0.03, 0,
        ];
        const uv =  [
			0, 0,
            1, 0,
            1, 1,
		    0, 1
        ];
        setPosition(gl,position,3,gl.FLOAT,[ 0, 1, 2,	0, 2, 3 ] ,null,uv);
        var offsets = new Float32Array(offsetArray);
        var offsetBuffer = gl.createBuffer();
        var aOffsetLocation = gl.getAttribLocation(shaderProgram, 'aOffset');
        gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aOffsetLocation);
        //告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据。
        gl.vertexAttribPointer(aOffsetLocation, 3, gl.FLOAT, false, 12, 0);
        //设置通用顶点属性前进的速率
        gl.vertexAttribDivisor(aOffsetLocation, 1);
        // ////////////////
        // // DRAW
        // ////////////////
        
        gl.drawElementsInstanced(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0,count);
    }

    animation = ()=>{
        for (let index = 0; index < count; index++) {
            offsetArray[index*3+1] -=0.03;
            if(offsetArray[index*3+1]<-20.0){
                offsetArray[index*3+1] = 2.0
            }
        }
        gl.clear(gl.COLOR_BUFFER_BIT);// 清空颜色缓冲区
        camera.setEye([0.0,-5.0,3.0]).update();
        drawPlane(gl);
        render();
        requestAnimationFrame(animation);
    }
}
main();


const PlaneVertices = [
    4.0,  4.0, -5.0,
   -4.0,  4.0, -5.0,
    4.0, -4.0, -5.0,
   -4.0, -4.0, -5.0,
 ];
 
function drawPlane(gl){
    setPosition(gl,PlaneVertices,3,gl.FLOAT,null,null);
    setOnecolor(gl,[1.0, 1.0, 1.0, 1.0],6);
    {
        gl.uniform1i(
            gl.getUniformLocation(gl.program,"isPlane"),
            true);
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}