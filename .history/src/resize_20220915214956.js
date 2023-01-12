window.addEventListener('resize', () => {
	/*------------------------------
  Update Sizes
  ------------------------------*/
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	/*------------e------------------
  Update Camera
  ------------------------------*/
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	/*------------------------------
  Update Renderer
  ------------------------------*/
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
