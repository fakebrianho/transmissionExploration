export const resize = (camera, renderer) => {
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
