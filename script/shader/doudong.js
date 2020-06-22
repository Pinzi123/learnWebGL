  // Vertex shader program

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
    
    void main(void) {
      float duration = 0.6;
      float maxoffset = 0.02;
      float maxScale = 1.1;

      float progress = abs(sin(mod(Time,duration) * (PI / duration)));
      vec2 offset = vec2(maxoffset,maxoffset) * progress;
      float scale = 1.0 + (maxScale-1.0) * progress;

      float maskX = 0.5 + (vTextureCoord.x - 0.5)/scale;
      float maskY = 0.5 + (vTextureCoord.y - 0.5)/scale;
      vec2 realPos = vec2(maskX,maskY);

      vec4 rgb1 = texture2D(uSampler, realPos+offset);
      vec4 rgb2 = texture2D(uSampler, realPos-offset);
      vec4 real = texture2D(uSampler, realPos);

      gl_FragColor = vec4(rgb1.r,real.g,rgb2.b,real.a);
    }
  `;

