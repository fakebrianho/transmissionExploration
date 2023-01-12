import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import { PARAMS, pane, orbit } from './controls'
import { resize } from './eventListeners'
import { MeshTransmissionMaterial } from './meshTransmissionMaterial'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import addLight from './lights'
import initFbo from './initFBO'
import background from './background'
import testVert from '/@/shaders/testVert.glsl'
import testFragment from '/@/shaders/testFragment.glsl'

THREE.ColorManagement.legacyMode = false
let fbo, time, canvas, mesh2
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
})
const scene = new THREE.Scene()
const clock = new THREE.Clock()
const envLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
)
gltfLoader.setDRACOLoader(dracoLoader)
init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	renderer.setClearColor(0x000000, 0)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.outputEncoding = THREE.sRGBEncoding
	canvas = renderer.domElement
	canvas.classList.add('webgl')
	document.body.appendChild(canvas)
	document.body.appendChild(renderer.domElement)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	glb()
	add()
	sampleMeshes()
	animate()
}

async function glb() {
	const [{ scene: gltfScene }, env] = await Promise.all([
		/*
		Author: glenatron (https://sketchfab.com/glenatron)
		License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
		Source: https://sketchfab.com/3d-models/gelatinous-cube-e08385238f4d4b59b012233a9fbdca21
		Title: Gelatinous Cube
		*/
		new Promise((res) => gltfLoader.load('/crystal_heart.glb', res)),
		new Promise((res) =>
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
		),
	])
	gltfScene.scale.set(10, 10, 10)
	gltfScene.position.set(0, -8, 0)
	console.log(gltfScene)
	// "pCone1_lambert1_0"
	const crystallize = gltfScene.getObjectByName(
		'Crystal_Heart_Crystal_Heart_Mat_0'
	)
	crystallize.material = Object.assign(new MeshTransmissionMaterial(10), {
		clearcoat: 1,
		clearcoatRoughness: 0,
		transmission: 1,
		chromaticAberration: 0.33,
		anisotropy: 0.1,
		// Set to > 0 for diffuse roughness
		roughness: 0,
		thickness: 0.5,
		ior: 4.5,
		// Set to > 0 for animation
		distortion: 0.1,
		distortionScale: 0.4,
		temporalDistortion: 0.3,
	})
	// console.log(cube1)
	// gltfScene.children[0].children[0].children[0].material = Object.assign(
	// 	new MeshTransmissionMaterial(10),
	// 	{
	// 		clearcoat: 1,
	// 		clearcoatRoughness: 0,
	// 		transmission: 1,
	// 		chromaticAberration: 0.03,
	// 		anisotropy: 0.1,
	// 		// Set to > 0 for diffuse roughness
	// 		roughness: 0,
	// 		thickness: 0.5,
	// 		ior: 4.5,
	// 		// Set to > 0 for animation
	// 		distortion: 0.1,
	// 		distortionScale: 0.4,
	// 		temporalDistortion: 0.3,
	// 	}
	// )

	scene.environment = env
	scene.environment.mapping = THREE.EquirectangularReflectionMapping
	scene.add(gltfScene)
}

function sampleMeshes() {
	const geometry = new THREE.OctahedronGeometry(0.5, 1)
	const material = new THREE.MeshStandardMaterial({ color: 'red' })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(0, 0, -1)
	scene.add(mesh)

	const pGeometry = new THREE.SphereGeometry(0.5, 10, 10)
	const pMaterial = new THREE.PointsMaterial({ color: 'blue', size: 0.1 })
	const points = new THREE.Points(pGeometry, pMaterial)
	scene.add(points)

	const geometry2 = new THREE.BoxGeometry(1, 1, 1)
	const material2 = new THREE.ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		side: THREE.DoubleSide,
		uniforms: {
			uTime: { type: 'f', value: 0 },
			resolution: { type: 'v4', value: new THREE.Vector4() },
			uvRate1: {
				value: new THREE.Vector2(1, 1),
			},
			displacementStrength: { type: 'f', value: 0.5 },
		},
		// wireframe: true,
		// transparent: true,
		vertexShader: testVert,
		fragmentShader: testFragment,
	})
	mesh2 = new THREE.Mesh(geometry2, material2)
	mesh2.position.set(2, 0, 0)
	scene.add(mesh2)
}

function add() {
	let light = addLight()
	scene.add(light)
	fbo = initFbo(renderer)
	const bg = background()
	scene.add(bg)
	scene.add(fbo.particles)
	console.log(scene)
}
function animate() {
	requestAnimationFrame(animate)
	time = clock.getElapsedTime()
	fbo.particles.rotation.x += 0.01
	fbo.particles.rotation.y += 0.005
	fbo.particles.rotation.z -= 0.012
	fbo.renderMaterial.uniforms.uPointSize.value = PARAMS.particleSize
	fbo.renderMaterial.uniforms.uOpacity.value = PARAMS.opacity
	fbo.simulationMaterial.uniforms.uCurlFreq.value = PARAMS.curl
	fbo.simulationMaterial.uniforms.uSpeed.value = PARAMS.particleSpeed
	mesh2.material.uniforms.uTime.value += 0.1

	fbo.update(time)
	renderer.render(scene, camera)
}
