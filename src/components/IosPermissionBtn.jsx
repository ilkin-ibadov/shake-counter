const IosPermissionBtn = (handleMotionEvent) => {
    const handlePermissionRequest = async () => {
        try {
            const response = await DeviceMotionEvent.requestPermission()
            if (response == "granted") {
                window.addEventListener("devicemotion", (event) => {
                    handleMotionEvent(event)
                })
            } else {
                alert("Permission not granted")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <button onClick={handlePermissionRequest} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Give permission</button>
    )
}

export default IosPermissionBtn