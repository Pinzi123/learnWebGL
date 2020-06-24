
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;

    const float PI = 3.1415926;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

// Fragment shader program

const fsSource = `
    precision mediump float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    const float weight= 0.227027;
    void main(void) {
      float tex_offset = 1.0/564.0;
      vec3 result = texture2D(uSampler, vTextureCoord).rgb * weight;
      result += texture2D(uSampler, vTextureCoord + vec2(tex_offset * 1.0, 0.0)).rgb * 0.1945946;
      result += texture2D(uSampler, vTextureCoord - vec2(tex_offset * 1.0, 0.0)).rgb * 0.1945946;

      result += texture2D(uSampler, vTextureCoord + vec2(tex_offset * 2.0, 0.0)).rgb * 0.1216216;
      result += texture2D(uSampler, vTextureCoord - vec2(tex_offset * 2.0, 0.0)).rgb * 0.1216216;

      result += texture2D(uSampler, vTextureCoord + vec2(tex_offset * 3.0, 0.0)).rgb * 0.054054;
      result += texture2D(uSampler, vTextureCoord - vec2(tex_offset * 3.0, 0.0)).rgb * 0.054054;


      result += texture2D(uSampler, vTextureCoord + vec2(tex_offset * 4.0, 0.0)).rgb * 0.016216;
      result += texture2D(uSampler, vTextureCoord - vec2(tex_offset * 4.0, 0.0)).rgb * 0.016216;

      gl_FragColor = vec4(result.rgb,1.0);
    }
  `;