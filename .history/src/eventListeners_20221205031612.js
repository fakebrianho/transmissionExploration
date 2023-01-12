export const resize = (camera, renderer, sizes) => {
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()
	})
}
