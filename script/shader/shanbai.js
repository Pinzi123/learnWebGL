
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
      float duration = 13.0;

      float progress = abs(sin(mod(Time,duration) * (PI / duration)));
      float alpha = progress;


      vec4 mask = vec4(0.0, 0.0, 0.0, 0.0);
      vec4 real = texture2D(uSampler, vTextureCoord);

      gl_FragColor = real*(1.0 - alpha) + mask*alpha;
      
    }
  `;