import { DirectionalLight } from 'three'

const addLight = (x = 1, y = 1, z = 1, scene) => {
	let light = new DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	// console.log(scene)
	scene.add(light)
}

export default addLight
