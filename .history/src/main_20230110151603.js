import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import initFbo from './initFBO'
import background from './background'
let scene, fbo, time, bg, canvas
const renderer = new THREE.WebGL1Renderer({
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
