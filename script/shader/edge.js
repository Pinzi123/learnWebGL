//边缘检测

const vsSource = `
    precision mediump float;

    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;


    varying mediump vec2 vTextureCoord;
    varying mediump vec2 vTextureUV[9];

    const float weight= 1.0/874.0;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      vTextureUV[0] = vTextureCoord.xy + weight * vec2(-1,-1);
      vTextureUV[1] = vTextureCoord.xy + weight * vec2(0,-1);
      vTextureUV[2] = vTextureCoord.xy + weight * vec2(1,-1);
      vTextureUV[3] = vTextureCoord.xy + weight * vec2(-1,0);
      vTextureUV[4] = vTextureCoord.xy + weight * vec2(0, 0);
      vTextureUV[5] = vTextureCoord.xy + weight * vec2(1, 0);
      vTextureUV[6] = vTextureCoord.xy + weight * vec2(-1,-1);
      vTextureUV[7] = vTextureCoord.xy + weight * vec2(0, 1);
      vTextureUV[8] = vTextureCoord.xy + weight * vec2(1, 1);


    }
  `;

// Fragment shader program

const fsSource = `
    precision mediump float;

    varying mediump vec2 vTextureCoord;
    varying mediump vec2 vTextureUV[9];
    uniform sampler2D uSampler;

    const float edgeOnly = 1.0;
    const vec4 edgeColor = vec4(0.0,0.0,0.0,1.0);
    const vec4 BColor = vec4(1.0,1.0,1.0,1.0);

    float Gx[9];
    float Gy[9];

    float lum(vec4 color){
        return 0.2125*color.r + 0.7154*color.g + 0.0721*color.b;
    }
    
    void main(void) {
        Gx[0] = -1.0;
        Gx[1] = -2.0;
        Gx[2] = -1.0;

        Gx[3] = 0.0;
        Gx[4] = 0.0;
        Gx[5] = 0.0;

        Gx[6] = 1.0;
        Gx[7] = 2.0;
        Gx[8] = 1.0;

        Gy[0] = -1.0;
        Gy[1] = 0.0;
        Gy[2] = 1.0;

        Gy[3] = -2.0;
        Gy[4] = 0.0;
        Gy[5] = 2.0;

        Gy[6] = -1.0;
        Gy[7] = 0.0;
        Gy[8] = 1.0;

        float edgeX = 0.0;
        float edgeY = 0.0;
        float texColor;
        vec4 color = vec4(1.0,1.0,1.0,1.0);

        for (int i=0; i<9; i++){
            color = texture2D(uSampler, vTextureUV[i]);
            texColor = 0.2125*color.r + 0.7154*color.g + 0.0721*color.b;
            edgeX = edgeX + texColor * Gx[i];
            edgeY = edgeY + texColor * Gy[i];
        }
       float edge = 1.0 - abs(edgeX) - abs(edgeY);

       gl_FragColor = mix(
        mix(edgeColor, texture2D(uSampler, vTextureUV[4]),edge),
        mix(edgeColor, BColor, edge),
        edgeOnly);
      
    }
  `;

