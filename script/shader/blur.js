
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

// Fragment shader program

const fsSource = `
    precision highp float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform bool hh;

    const float weight= 0.227027;
    void main(void) {
      vec2 tc;
      float tex_offset = 1.0/512.0;
      tc = vec2(vTextureCoord.x, vTextureCoord.y);
      vec3 result = texture2D(uSampler, tc).rgb * weight;
      vec2 p1;
      vec2 p2; 
      vec2 p3;
      vec2 p4; 
      if(hh){
        p1 = vec2(0.0, tex_offset * 1.0);
        p2 = vec2(0.0, tex_offset * 2.0);
        p3 = vec2(0.0, tex_offset * 3.0);
        p4 = vec2(0.0, tex_offset * 4.0);
      }else{
        p1 = vec2(tex_offset * 1.0, 0.0);
        p2 = vec2(tex_offset * 2.0, 0.0);
        p3 = vec2(tex_offset * 3.0, 0.0);
        p4 = vec2(tex_offset * 4.0, 0.0);
      }
      
      result += texture2D(uSampler, tc + p1).rgb * 0.1945946;
      result += texture2D(uSampler, tc - p1).rgb * 0.1945946;

      result += texture2D(uSampler, tc + p2).rgb * 0.1216216;
      result += texture2D(uSampler, tc - p2).rgb * 0.1216216;

      result += texture2D(uSampler, tc + p3).rgb * 0.054054;
      result += texture2D(uSampler, tc - p3).rgb * 0.054054;

      result += texture2D(uSampler, tc + p4).rgb * 0.016216;
      result += texture2D(uSampler, tc - p4).rgb * 0.016216;

      gl_FragColor = vec4(result.rgb,1.0);
      
    }
  `;