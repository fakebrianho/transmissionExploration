import frag from '/@/shaders/fragment.glsl'
import vert from '/@/shaders/vertex.glsl'
import {
	PlaneGeometry,
	ShaderMaterial,
	Vector2,
	Mesh,
	AdditiveBlending,
} from 'three'
export default function background() {
	const geometry = new PlaneGeometry(2, 2)
	const material = new ShaderMaterial({
		vertexShader: vert,
		fragmentShader: frag,
		uniforms: {
			uTime: { value: 0 },
			uResolution: {
				value: new Vector2(window.innerWidth, window.innerHeight),
			},
		},
		depthTest: false,
		blending: AdditiveBlending,
	})
	fullScreenQuad = new Mesh(geometry, material)
	scene.add(fullScreenQuad)
}
