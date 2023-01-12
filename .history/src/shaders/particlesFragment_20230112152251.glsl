uniform float uOpacity;

void main() {
   // gl_FragColor = vec4(vec3(1.0), 0.25);
  // vec3 finalColor = vec3(1.0);
  // gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), uOpacity);
  // if(p.x < -bounds || p.x > bounds || p.y > bounds || p.y < -bounds || p.z < -bounds || p.z > bounds){
  //   finalColor = p;
  // }

  vec3 sunset = vec3(255.0 / 255.0, 100.0 / 255.0, 10.0/255.0);
  gl_FragColor = vec4(sunset, uOpacity);
}