var svsSource = `#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

// Fragment shader program for generating a shadow map
var sfsSource =`#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    out vec4 FragColor;
    void main() {
        FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);
    }
`;


  const vsSource = `#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec4 aVertexColor;
    in vec4 aNormal;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uMvMatrixFromLight;

    uniform vec3 uLightColor;
    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLight;
    uniform mat4 uViewMatrix;

    uniform vec3 eye;

    out vec4 vColor;
    out vec4 v_PositionFromLight;
    out vec4 v_Position;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      
      vec4 vertexPosition = uModelMatrix * aVertexPosition;
      vec3 eyeDirection = normalize(eye - vec3(vertexPosition));
      vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));
      vec3 normal = normalize(vec3(uNormalMatrix * aNormal));

      vec3 diffuse = uLightColor * aVertexColor.rgb * max(dot(lightDirection,normal), 0.0);
      vec3 h = (eyeDirection + lightDirection)/length(eyeDirection + lightDirection);
      vec3 specular = uLightColor * aVertexColor.rgb * pow(max(dot(normal,h), 0.0),2.0);
      vec3 ambient = uAmbientLight * aVertexColor.rgb;
      vColor = vec4(ambient + diffuse + specular, aVertexColor.a);
      v_PositionFromLight = uProjectionMatrix * uMvMatrixFromLight * aVertexPosition;
      v_Position = gl_Position;
    }
  `;

  // Fragment shader program

  const fsSource = `#version 300 es
    precision mediump float;
    
    in vec4 vColor;
    uniform sampler2D uShadowMap;
    in vec4 v_PositionFromLight;

    uniform bool isShadow;
    uniform vec4 uFogColor;
    uniform float uFogInfo[3];

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;

    out vec4 FragColor;
    in vec4 v_Position;
    void main(void) {
      mat4 vp = inverse(uProjectionMatrix * uViewMatrix);  
      vec4 worldPos =  vp * v_Position;
      worldPos = worldPos/worldPos.w;

      float fogDensity = abs(uFogInfo[2] - worldPos.y) / (uFogInfo[2] - uFogInfo[1]);
      if(worldPos.y<uFogInfo[1] || worldPos.y>uFogInfo[2])
        fogDensity = 0.0;
      else
        fogDensity = clamp(uFogInfo[0]*fogDensity,0.0,fogDensity);

      vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
      vec4 rgbaDepth = texture(uShadowMap, shadowCoord.xy);
      float depth =  rgbaDepth.r;
      float visibility = 1.0;
      if(isShadow) visibility = (shadowCoord.z > depth ) ? 0.4 : 1.0;
      vec4 finalColor = vec4(vColor.rgb * visibility, vColor.a);
      // FragColor = mix(finalColor,uFogColor, fogDensity);
      FragColor = finalColor;
    }
  `;