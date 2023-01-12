import { DirectionalLight } from 'three'

const addLight = () => {
	let light = new DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export default addLight
