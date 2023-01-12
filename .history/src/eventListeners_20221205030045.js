export const resize = (camera) => {
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()
	})
}
