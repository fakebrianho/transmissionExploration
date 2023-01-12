export const resize = (camera) => {
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
