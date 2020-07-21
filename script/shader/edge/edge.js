//边缘检测（对屏幕图像进行边缘检测，实现描边的效果）
/**
 * 卷积操作指的是使用一个卷积核对一张图像中的每个像素进行一系列操作。
 * 卷积操作的神奇之处在于选择的卷积核。
 */

const vsSource = `#version 300 es
    precision mediump float;

    in vec4 aVertexPosition;
    in vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;


    out mediump vec2 vTextureCoord;
    out mediump vec2 vTextureUV[9];

    const float weight= 1.0/874.0;
    void main(void) {
      
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
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

    }
  `;

/**
 * 用于边缘检测的卷积核，叫做边缘检测算子，就是Gx和Gy。
 * 如果相邻像素之间存在明显的颜色、亮度、纹理等属性，我们就任务他们之间存在一条边界。
 * 这种相邻元素的差值用梯度来表示，不难想象，边缘处的梯度绝对值会比较大。
 */
const fsSource = `#version 300 es
    precision mediump float;

    in mediump vec2 vTextureCoord;
    in mediump vec2 vTextureUV[9];
    out vec4 ourColor;
    uniform sampler2D uSampler;

    
     float edgeOnly = 0.0;//调节这个加上原图的颜色
     vec4 edgeColor = vec4(0.0,0.0,0.0,1.0);
     vec4 BColor = vec4(1.0,1.0,1.0,1.0);

    const float Gx[9] = float[9](-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);
    const float Gy[9] =  float[9](-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);

    float lum(vec4 color){
        return 0.2125*color.r + 0.7154*color.g + 0.0721*color.b;
    }
    
    void main(void) {

        float edgeX = 0.0;
        float edgeY = 0.0;
        float texColor;

        for (int i=0; i<9; i++){
            texColor = lum(texture(uSampler, vTextureUV[i]));
            edgeX = edgeX + texColor * Gx[i];
            edgeY = edgeY + texColor * Gy[i];
        }
       float edge = 1.0 - abs(edgeX) - abs(edgeY);

       ourColor = mix(
        mix(edgeColor, texture(uSampler, vTextureUV[4]), edge),
        mix(edgeColor, BColor, edge),
        edgeOnly);
      
    }
  `;

