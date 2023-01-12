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

THREE.ColorManagement.legacyMode = false
let fbo, time, canvas
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
		new Promise((res) => gltfLoader.load('/crystal.glb', res)),
		new Promise((res) =>
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
		),
	])
	gltfScene.scale.set(0.3, 0.3, 0.3)
	gltfScene.position.set(-0.1, -0.5, 0)
	console.log(gltfScene)
	// "pCone1_lambert1_0"
	const cube1 = gltfScene.getObjectByName('pCon1_lamber1_0')
	gltfScene.children[0].children[0].children[0].material = Object.assign(
		new MeshTransmissionMaterial(10),
		{
			clearcoat: 1,
			clearcoatRoughness: 0,
			transmission: 1,
			chromaticAberration: 0.03,
			anisotropy: 0.1,
			// Set to > 0 for diffuse roughness
			roughness: 0,
			thickness: 4.5,
			ior: 1.5,
			// Set to > 0 for animation
			distortion: 0.1,
			distortionScale: 0.2,
			temporalDistortion: 0.2,
		}
	)
	// console.log(gltfScene.children[0].children[0].children[0])
	// gltfScene.children[0].material = Object.assign(
	// 	new MeshTransmissionMaterial(10),
	// 	{
	// 		clearcoat: 1,
	// 		clearcoatRoughness: 0,
	// 		transmission: 1,
	// 		chromaticAberration: 0.03,
	// 		anisotropy: 0.1,
	// 		// Set to > 0 for diffuse roughness
	// 		roughness: 0,
	// 		thickness: 4.5,
	// 		ior: 1.5,
	// 		// Set to > 0 for animation
	// 		distortion: 0.1,
	// 		distortionScale: 0.2,
	// 		temporalDistortion: 0.2,
	// 	}
	// )

	scene.environment = env
	scene.environment.mapping = THREE.EquirectangularReflectionMapping
	scene.add(gltfScene)
}

function sampleMeshes() {
	const geometry = new THREE.OctahedronGeometry(1, 1)
	const material = new THREE.MeshStandardMaterial({ Color: 'red' })
	const mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)
}

function add() {
	let light = addLight()
	scene.add(light)
	fbo = initFbo(renderer)
	const bg = background()
	scene.add(bg)
	scene.add(fbo.particles)
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
	fbo.update(time)
	renderer.render(scene, camera)
}
