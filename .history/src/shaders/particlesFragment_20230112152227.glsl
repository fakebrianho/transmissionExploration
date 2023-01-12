uniform float uOpacity;
uniform float bounds;
varying vec3 p;

void main() {
  float b = bounds;
  b*=0.5; 
   // gl_FragColor = vec4(vec3(1.0), 0.25);
  // vec3 finalColor = vec3(1.0);
  vec3 finalColor = p;
  // gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), uOpacity);
  // if(p.x < -bounds || p.x > bounds || p.y > bounds || p.y < -bounds || p.z < -bounds || p.z > bounds){
  //   finalColor = p;
  // }
  if(p.x < -b || p.x > b || p.y > b || p.y < -b || p.z < -b || p.z > b){
    finalColor = vec3(1.0);
  }
  vec3 sunset = vec3(255.0 / 255.0, 100.0 / 255.0, 10.0/255.0);
  gl_FragColor = vec4(sunset, uOpacity);
}