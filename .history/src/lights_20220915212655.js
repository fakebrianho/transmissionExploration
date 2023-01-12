import { DirectionalLight } from 'three'

export const addLight = (x, y, z, scene) => {
	let light = new DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
}

export default lights
