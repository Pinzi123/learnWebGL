

function  main() {
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.program = shaderProgram;
    useProgram(gl,gl.program);
    
    gl.clearColor(0, 0, 0, 1);
    
    var count = 10;
    var positions =[
        -1/count, 1/count, 0.0,
        -1/count, -1/count, 0.0,
        1/count, 1/count, 0.0,
        1/count, -1/count, 0.0,
    ];

    var colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 1.0, 1.0,
    ];

    var indices = [
        0.0,1.0,2.0,
        2.0,1.0,3.0
    ];

    setPosition(gl, positions, 3, gl.FLOAT, indices);
    // setOnecolor(gl,[1.0, 0.0, 1.0, 1.0],6);

    var offsetArray = [];
    for(var i = 0;i < count;i ++){
        for(var j = 0; j < count; j ++){
            var x = ((i + 1) - count/2) / count * 4;
            var y = ((j + 1) - count/2) / count * 4;
            var z = 0;
            offsetArray.push(x,y,z);
        }
    }
    console.log(offsetArray);
    

    var offsets = new Float32Array(offsetArray);
    var ext = gl.getExtension('ANGLE_instanced_arrays');
    var offsetBuffer = gl.createBuffer();
    var aOffsetLocation = gl.getAttribLocation(shaderProgram, 'aOffset');
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aOffsetLocation);
    gl.vertexAttribPointer(aOffsetLocation, 3, gl.FLOAT, false, 12, 0);
    ext.vertexAttribDivisorANGLE(aOffsetLocation, 1);
    // ////////////////
    // // DRAW
    // ////////////////
    gl.clear(gl.COLOR_BUFFER_BIT);// 清空颜色缓冲区
    ext.drawElementsInstancedANGLE(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0,count * count);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
main();
