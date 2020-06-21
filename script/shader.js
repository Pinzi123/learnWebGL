
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
    const float duration = 27.0;

    vec2 getMaskPos(float the, float offset) {
      return vec2(cos(the), sin(the)) * offset;
    }

    float getThe(float time){
      return mod(time,duration) * (2.0 * PI / duration);
    }

    vec4 getAlpha(float n, float time){
      float pro = mod(time,duration);
      if(n<pro) return vec4(0.0, 0.0, 0.0, 0.0);
      if(floor(n-pro)==1.0) return vec4(0.9,0.1,0.1,(1.0/6.0) * 3.0);
      if(floor(n-pro)==3.0) return vec4(0.1,0.1,0.9,(1.0/6.0) * 2.0);
      if(floor(n-pro)==7.0) return vec4(0.1,0.9,0.1,(1.0/6.0) * 1.0);
      return vec4(0.0, 0.0, 0.0, 0.0);
    }
    
    void main(void) {
      vec2 offset;
      vec4 color;
      vec4 maskColor;
      float alpha = 0.0;

      float time = mod(floor(Time/11.0),duration);

      for(float f = 0.0; f < (duration * 2.0); f+=1.0){
        if(f<time || f>(duration + time)) continue;
        offset = getMaskPos(getThe(f),0.07);
        color  = texture2D(uSampler, vTextureCoord + offset);
        maskColor += color * getAlpha(f,time);
      }

      gl_FragColor = maskColor;
      
    }
  `;