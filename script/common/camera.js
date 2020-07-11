class Camera{
    constructor(gl){
        this.fov = 45 * Math.PI / 180;   // in radians
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNearzNear = 0.1;
        this.zFar = 100.0;
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
    }

    init(gl,programInfo,rotation=0, eye=[0.0,5.0,-6.0], center=[0.0,0.0,-1.0], up=[0.0,1.0,0.0]){
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();

        mat4.perspective(this.projectionMatrix,
            this.fov,
            this.aspect,
            this.zNear,
            this.zFar);
        
      
        mat4.rotate(this.modelMatrix,  // destination matrix
                    this.modelMatrix,  // matrix to rotate
                    rotation,     // amount to rotate in drawArrays
                    [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(this.modelMatrix,  // destination matrix
                    this.modelMatrix,  // matrix to rotate
                    rotation * 0.7,// amount to rotate in radians
                    [0, 1, 0]);       // axis to rotate around (X)
      
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, eye, center, up);
      
        mat4.multiply(this.modelViewMatrix,viewMatrix,this.modelMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);
      
        if(programInfo.uniformLocations.normalMatrix){
          const normalMatrix = mat4.create();
          mat4.invert(normalMatrix, this.modelMatrix);
          mat4.transpose(normalMatrix, normalMatrix);
          gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);
        }
      
        if(programInfo.uniformLocations.modelMatrix){
          gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelMatrix,
            false,
            this.modelMatrix);
        }
      
        if(programInfo.attribLocations.eyePosition){
          gl.uniform3f(programInfo.uniformLocations.eyePosition, ...eye);
        }
    }
}