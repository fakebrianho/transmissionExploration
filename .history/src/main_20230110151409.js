import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
// import { getRandomSpherePoint } from './getRandomSpherePoint'
import initFbo from './initFBO'
import background from './background'
// import FBO from './FBO'
// import simVertex from '/@/shaders/simulationVert.glsl'
// import simFragment from '/@/shaders/simulationFrag.glsl'
import frag from '/@/shaders/fragment.glsl'
import vert from '/@/shaders/vertex.glsl'
// import particlesFragment from '/@/shaders/particlesFragment.glsl'
// import particlesVertex from '/@/shaders/particlesVertex.glsl'
let renderer, scene, simulationMaterial, renderMaterial, fbo, time, bg, canvas
renderer = renderer = new THREE.WebGL1Renderer({
	antialias: true,
	alpha: true,
})
scene = new THREE.Scene()

canvas = null
const clock = new THREE.Clock()
init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	renderer.setClearColor(0x000000, 0)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
	canvas = renderer.domElement
	canvas.classList.add('webgl')
	document.body.appendChild(canvas)
	document.body.appendChild(renderer.domElement)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	add()
	animate()
}

function add() {
	fbo = initFbo(renderer)
	bg = background()
	scene.add(bg)
	scene.add(fbo.particles)
}

function animate() {
	requestAnimationFrame(animate)
	time = clock.getElapsedTime()
	fbo.update(time)
	renderer.render(scene, camera)
}
