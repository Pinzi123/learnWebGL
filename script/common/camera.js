class Camera{
    constructor(gl,shaderProgram){
        this.gl = gl;
        this.fov = 45 * Math.PI / 180;   // in radians
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;

        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();

        this.programInfo = {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),

            eye: gl.getUniformLocation(shaderProgram, 'eye'),
            center: gl.getUniformLocation(shaderProgram, 'center'),
            up: gl.getUniformLocation(shaderProgram, 'up'),
            fov: gl.getUniformLocation(shaderProgram, 'fov'),
            aspect: gl.getUniformLocation(shaderProgram, 'aspect'),
            zNear: gl.getUniformLocation(shaderProgram, 'zNear'),
            zFar: gl.getUniformLocation(shaderProgram, 'zFar'),
            forward: gl.getUniformLocation(shaderProgram, 'forward'),
            right: gl.getUniformLocation(shaderProgram, 'right'),
        };

        this.rotation = 0;
        this.eye = [0.0,5.0,-6.0];
        this.center = [0.0,0.0,-1.0];
        this.up = [0.0,1.0,0.0];
    }


    setRotation(value){
        this.rotation = value;
        return this;
    }

    setEye(eye){
        this.eye = eye;
        return this;
    }

    setCenter(center){
        this.center = center;
        return this;
    }

    setUp(up){
        this.up = up;
        return this;
    }

    getForward(){
        let forward = [
            this.center[0]-this.eye[0],
            this.center[1]-this.eye[1],
            this.center[2]-this.eye[2],
        ];
        return forward;
    }

    getRight(){
        let forward = this.getForward();
        let right=[
            forward[1]*this.up[2] - forward[2]*this.up[1],
            forward[2]*this.up[0] - forward[0]*this.up[2],
            forward[0]*this.up[1] - forward[1]*this.up[0],
        ];
        return right;
    }

    update(){
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        const gl = this.gl;

        mat4.perspective(this.projectionMatrix,
            this.fov,
            this.aspect,
            this.zNear,
            this.zFar);
        
      
        mat4.rotate(this.modelMatrix,  // destination matrix
                    this.modelMatrix,  // matrix to rotate
                    this.rotation,     // amount to rotate in drawArrays
                    [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(this.modelMatrix,  // destination matrix
                    this.modelMatrix,  // matrix to rotate
                    this.rotation * 0.7,// amount to rotate in radians
                    [0, 1, 0]);       // axis to rotate around (X)
      
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.eye, this.center,this. up);

        
        if(this.programInfo.projectionMatrix){
            gl.uniformMatrix4fv(
                this.programInfo.projectionMatrix,
                false,
                this.projectionMatrix);
        }


        if(this.programInfo.normalMatrix){
            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, this.modelMatrix);
            mat4.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix4fv(
                this.programInfo.normalMatrix,
                false,
                normalMatrix);
          }

        mat4.multiply(this.modelViewMatrix,viewMatrix,this.modelMatrix);
        if(this.programInfo.modelViewMatrix){
            gl.uniformMatrix4fv(
                this.programInfo.modelViewMatrix,
                false,
                this.modelViewMatrix);
        }


        if(this.programInfo.viewMatrix){
            gl.uniformMatrix4fv(
                this.programInfo.viewMatrix,
                false,
                viewMatrix);
        }
      
        if(this.programInfo.normalMatrix){
          const normalMatrix = mat4.create();
          mat4.invert(normalMatrix, this.modelMatrix);
          mat4.transpose(normalMatrix, normalMatrix);
          gl.uniformMatrix4fv(
            this.programInfo.normalMatrix,
            false,
            normalMatrix);
        }
      
        if(this.programInfo.modelMatrix){
          gl.uniformMatrix4fv(
            this.programInfo.modelMatrix,
            false,
            this.modelMatrix);
        }
        this.updateCameraInfo();
    }

    updateCameraInfo(){
        const gl = this.gl;
        if(this.programInfo.eye){
            gl.uniform3f(
                this.programInfo.eye,
                ...this.eye);
        }
        if(this.programInfo.center){
            gl.uniform3f(
                this.programInfo.center,
                ...this.center);
        }
        if(this.programInfo.up){
            gl.uniform3f(
                this.programInfo.up,
                ...this.up);
        }

        if(this.programInfo.forward){
            gl.uniform3f(
                this.programInfo.forward,
                ...this.getForward());
        }
        if(this.programInfo.right){
            gl.uniform3f(
                this.programInfo.right,
                ...this.getRight());
        }
        if(this.programInfo.aspect){
            gl.uniform1f(
                this.programInfo.aspect,
                this.aspect);
        }
        if(this.programInfo.zNear){
            gl.uniform1f(
                this.programInfo.zNear,
                this.zNear);
        }
        if(this.programInfo.zFar){
            gl.uniform1f(
                this.programInfo.zFar,
                this.zFar);
        }
        if(this.programInfo.fov){
            gl.uniform1f(
                this.programInfo.fov,
                this.fov);
        }
    }
}