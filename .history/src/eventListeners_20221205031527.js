export const resize = (camera, renderer) => {
	window.addEventListener('resize', () => {
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
