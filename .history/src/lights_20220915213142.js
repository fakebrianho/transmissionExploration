import { DirectionalLight } from 'three'

const addLight = (x = 1, y = 1, z = 1, scene) => {
	let light = new DirectionalLight(0xffffff, 1)
	light.position.set(x, y, z)
	scene.add(light)
}

export default addLight
