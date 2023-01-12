import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import { addMeshes, addShader } from './addMeshes'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { getRandomSpherePoint } from './getRandomSpherePoint'
import FBO from './FBO'
import simVertex from '/@/shaders/simulationVert.glsl'
import simFragment from '/@/shaders/simulationFrag.glsl'
import ff from '/@/shaders/fullScreenFrag.glsl'
import fv from '/@/shaders/fullScreenVert.glsl'
import fragment from '/@/shaders/particlesFragment.glsl'
import vertex from '/@/shaders/particlesVertex.glsl'
let renderer,
	scene,
	simulationMaterial,
	renderMaterial,
	fbo,
	time,
	fullScreenQuad,
	canvas
renderer = renderer = new THREE.WebGL1Renderer({
	antialias: true,
	alpha: true,
})
scene = new THREE.Scene()

canvas = null
const meshes = {}
const lights = {}
const clock = new THREE.Clock()
init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	renderer.setClearColor(0x000000, 1)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
	canvas = renderer.domElement
	canvas.classList.add('webgl')
	document.body.appendChild(canvas)
	document.body.appendChild(renderer.domElement)
	// meshes.default = addMeshes()
	// meshes.shader = addShader()
	// lights.default = addLight()
	// scene.add(meshes.default)
	// scene.add(meshes.shader)
	// scene.add(lights.default)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	initFbo()
	createScreenQuad()
	animate()
}
function initFbo() {
	// Set up the FBO
	const fboWidth = 512
	const fboHeight = 512
	const fboParams = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
	}
	// fbo = new THREE.WebGLRenderTarget(fboWidth, fboHeight, fboParams)
	let length = fboWidth * fboHeight * 3
	let data = new Float32Array(length)
	for (let i = 0; i < length; i += 3) {
		// Random positions inside a sphere
		const point = getRandomSpherePoint()
		data[i + 0] = point.x
		data[i + 1] = point.y
		data[i + 2] = point.z
	}
	// Convert the data to a FloatTexture
	const positions = new THREE.DataTexture(
		data,
		fboWidth,
		fboHeight,
		THREE.RGBFormat,
		THREE.FloatType
	)
	positions.needsUpdate = true
	simulationMaterial = new THREE.ShaderMaterial({
		vertexShader: simVertex,
		fragmentShader: simFragment,
		uniforms: {
			positions: { value: positions },
			uTime: { value: 0 },
			uSpeed: { value: 0.3 },
			uCurlFreq: { value: 0.25 },
		},
	})
	renderMaterial = new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			positions: { value: null },
			uTime: { value: 0 },
			uPointSize: { value: 1.2 },
			uOpacity: { value: 0.35 },
		},
		transparent: true,
		blending: THREE.AdditiveBlending,
	})
	console.log(renderer)
	fbo = new FBO(
		fboWidth,
		fboHeight,
		renderer,
		simulationMaterial,
		renderMaterial
	)
	scene.add(fbo.particles)
}
function createScreenQuad() {
	const geometry = new THREE.PlaneGeometry(2, 2)
	const material = new THREE.ShaderMaterial({
		vertexShader: fv,
		fragmentShader: ff,
		uniforms: {
			uTime: { value: 0 },
			uResolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
		},
		depthTest: false,
		blending: THREE.AdditiveBlending,
	})
	fullScreenQuad = new THREE.Mesh(geometry, material)
}
function animate() {
	requestAnimationFrame(animate)
	time = clock.getElapsedTime()
	// console.log(time)
	fbo.update(time)
	// console.log(fbo)
	// console.log(camera)
	// fullScreenQuad.material.uniforms.uTime.value = time
	// meshes.shader.material.uniforms.uTime.value += 0.1
	// meshes.shader.material.uniforms.displacementStrength.value =
	// 	PARAMS.displacementStrength
	// meshes.shader.rotation.y -= 0.01
	// meshes.shader.rotation.z += 0.01
	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.y += 0.01
	renderer.render(scene, camera)
}
