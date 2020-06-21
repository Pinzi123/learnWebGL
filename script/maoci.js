
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
    precision highp float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float Time;

    const float PI = 3.1415926;

    float rand(float n) {
      return fract(sin(n) * 43758.5453123);
    }
    
    void main(void) {
      float duration = 17.0;
      float maxoffset = 0.03;

      float progress = abs(sin(mod(Time,duration) * (PI / duration)));
      float offset = progress<0.98?0.001*progress:maxoffset * progress;

      float random = rand(vTextureCoord.y)*2.0 - 1.0;
      float X1 = vTextureCoord.x - random*offset;
      float X2 = random<0.8?vTextureCoord.x :X1;

      vec4 rgb1 = texture2D(uSampler, vec2(X2-0.01,vTextureCoord.y));
      vec4 rgb2 = texture2D(uSampler, vec2(X2+0.0125,vTextureCoord.y));
      vec4 real = texture2D(uSampler, vec2(X2,vTextureCoord.y));

      gl_FragColor = vec4(rgb1.r,real.g,rgb2.b,real.a);
      
    }
  `;