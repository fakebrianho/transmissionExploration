import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export const PARAMS = {
	displacementStrength: 0.5,
	particleSize: 1.0,
	opacity: 0.35,
	particleSpeed: 0.3,
	curl: 0.25,
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
	max: 4.0,
	step: 0.1,
})

folder.addInput(PARAMS, 'opacity', {
	min: 0.1,
	max: 1.0,
	step: 0.1,
})

export const orbit = (camera, renderer) => {
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
}
