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
    in vec3 eyeP;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uMvMatrixFromLight;

    uniform vec3 uLightColor;
    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLight;

    out vec4 vColor;
    out vec4 v_PositionFromLight;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      
      vec4 vertexPosition = uModelMatrix * aVertexPosition;
      vec3 eyeDirection = normalize(eyeP - vec3(vertexPosition));
      vec3 lightDirection = normalize(uLightPosition - vec3(vertexPosition));
      vec3 normal = normalize(vec3(uNormalMatrix * aNormal));

      vec3 diffuse = uLightColor * aVertexColor.rgb * max(dot(lightDirection,normal), 0.0);
      vec3 h = (eyeDirection + lightDirection)/length(eyeDirection + lightDirection);
      vec3 specular = uLightColor * aVertexColor.rgb * pow(max(dot(normal,h), 0.0),2.0);
      vec3 ambient = uAmbientLight * aVertexColor.rgb;
      vColor = vec4(ambient + diffuse + specular, aVertexColor.a);
      v_PositionFromLight = uProjectionMatrix * uMvMatrixFromLight * aVertexPosition;
    }
  `;

  // Fragment shader program

  const fsSource = `#version 300 es
    precision mediump float;
    
    in vec4 vColor;
    uniform sampler2D uShadowMap;
    in vec4 v_PositionFromLight;

    uniform vec4 uFogColor;
    uniform vec3 uFogInfo;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;

    out vec4 FragColor;
    void main(void) {
      mat4 mvp = inverse(uProjectionMatrix * uViewMatrix);    
      
      vec4 worldPos =  mvp * vec4((gl_FragCoord.xyz/gl_FragCoord.w)*2.0-1.0, 1.0);
      float fogDensity = (uFogInfo[2] - worldPos.y) / (uFogInfo[2] - uFogInfo[1]);
      fogDensity = clamp(fogDensity * uFogInfo[0], 0.0, 1.0); ;

      vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
      vec4 rgbaDepth = texture(uShadowMap, shadowCoord.xy);
      float depth =  rgbaDepth.r;
      float visibility = (shadowCoord.z > depth + 0.0005) ? 0.5 : 1.0;
      vec4 finalColor = vec4(vColor.rgb * visibility, vColor.a);

      FragColor = mix(finalColor,uFogColor, fogDensity);
    }
  `;