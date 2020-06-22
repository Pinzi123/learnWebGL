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

    void main(void) {
      float duration = 0.7;
      float maxAlpha = 0.4;
      float maxScale = 1.8;

      float progress = mod(Time,duration)/duration;
      float alpha = maxAlpha * progress;
      float scale = 1.0 + (maxScale-1.0) * progress;

      float maskX = 0.5 + (vTextureCoord.x - 0.5)/scale;
      float maskY = 0.5 + (vTextureCoord.y - 0.5)/scale;

      vec4 mask = texture2D(uSampler, vec2(maskX,maskY));
      vec4 real = texture2D(uSampler, vTextureCoord);

      gl_FragColor = real*(1.0-alpha) + mask*alpha;
    }
  `;