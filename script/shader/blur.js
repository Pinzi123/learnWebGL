const vsSource = `#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    out vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

//片段着色器

/**
 * 提取较量区域
 */
const BFsSource =`#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;

out vec4 FragColor;

const float luminanceThreshold = 0.2;

float luminance(vec4 color){
  return 0.2125*color.r + 0.7154*color.g + 0.0721*color.b;
}

void main(void) {
  vec4 result = texture(uSampler, vTextureCoord);
  float val = clamp(luminance(result)-luminanceThreshold, 0.0, 1.0); 
  FragColor = result*vec4(val);
}
`;

/**
 * 高斯模糊 基于高斯方程 它很好的模拟了领域每个像素对当前处理像素的影响程度---距离越近，影响越大
 * 采用9*9大小的高斯核对原图像进行模型，同时他将二维的高斯核拆成一维的，
 * 先后使用竖直方向和水平方向的一维的高斯核对对象进行滤波，这叫两步高斯模糊
 * 高斯滤波应用的次数越多，图像越模糊
 */
const BlurFsSource = `#version 300 es
    precision mediump float;

    in vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform bool hh;

    out vec4 FragColor;

    const float weight[5]= float[5](0.227027, 0.1945949, 0.1216216, 0.054054, 0.016216);
    void main(void) {
      vec2 tc = vec2(vTextureCoord.x, vTextureCoord.y);
      vec2 tex_offset = vec2(1.0/512.0, 1.0/512.0);
      vec3 result = texture(uSampler, tc).rgb * weight[0];
      if(hh){
        for(int i = 1;i < 5; ++i){
          result += texture(uSampler, tc + vec2(tex_offset.x * float(i), 0.0) ).rgb * weight[i];
          result += texture(uSampler, tc - vec2(tex_offset.x * float(i), 0.0) ).rgb * weight[i];
        }
      }else{
        for(int i = 1;i < 5; ++i){
          result += texture(uSampler, tc + vec2(0.0, tex_offset.y * float(i)) ).rgb * weight[i];
          result += texture(uSampler, tc - vec2(0.0, tex_offset.y * float(i)) ).rgb * weight[i];
        }
      }
      

      FragColor = vec4(result.rgb,1.0);
      
    }
  `;

/**
 * Bloom特性，就是将画面上较亮的部分扩散到周围区域
 * 
 * 我们首先根据一个阙值提取出图像中较亮的区域，把他们存储到一张渲染纹理中
 * 再利用高斯模糊对这张渲染纹理进行模糊处理，模拟光线扩展的效果
 * 最够将其与原图像进行混合
 */
const MFsSource = `#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler1;

uniform bool hh;

out vec4 FragColor;
void main(void) {

  FragColor =  texture(uSampler, vTextureCoord) + texture(uSampler1, vTextureCoord);
  
}
`;