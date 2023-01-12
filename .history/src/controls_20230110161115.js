import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export const PARAMS = {
	displacementStrength: 0.5,
	particleSize: 1.4,
	opacity: 0.35,
	particleSpeed: 3.0,
	curl: 0.55,
}

export const pane = new Pane()

const folder = pane.addFolder({
	title: 'Parameters',
})

folder.addInput(PARAMS, 'displacementStrength', {
	min: 0.1,
	max: 1.0,
	step: 0.1,
})

folder.addInput(PARAMS, 'particleSize', {
	min: 1.0,
	max: 5.0,
	step: 0.1,
})

folder.addInput(PARAMS, 'opacity', {
	min: 0.01,
	max: 1.0,
	step: 0.01,
})

folder.addInput(PARAMS, 'particleSpeed', {
	min: 0.1,
	max: 3.0,
	step: 0.1,
})

folder.addInput(PARAMS, 'curl', {
	min: 0.1,
	max: 1.0,
	step: 0.01,
})

export const orbit = (camera, renderer) => {
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
}
