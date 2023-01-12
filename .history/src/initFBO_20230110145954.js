import simVertex from '/@/shaders/simulationVert.glsl'
import simFragment from '/@/shaders/simulationFrag.glsl'
import particlesFragment from '/@/shaders/particlesFragment.glsl'
import particlesVertex from '/@/shaders/particlesVertex.glsl'
import FBO from './FBO'

export default function initFbo() {
	// Set up the FBO
	const fboWidth = 256
	const fboHeight = 256
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
		vertexShader: particlesVertex,
		fragmentShader: particlesFragment,
		uniforms: {
			positions: { value: null },
			uTime: { value: 0 },
			uPointSize: { value: 2.2 },
			uOpacity: { value: 0.35 },
		},
		transparent: true,
		blending: THREE.AdditiveBlending,
	})
	const fbo = new FBO(
		fboWidth,
		fboHeight,
		renderer,
		simulationMaterial,
		renderMaterial
	)
	return fbo
	// scene.add(fbo.particles)
}
