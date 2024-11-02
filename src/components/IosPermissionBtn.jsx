const IosPermissionBtn = (handlePermissionRequest) => {
    return (
        <button onClick={handlePermissionRequest} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Give permission</button>
    )
}

export default IosPermissionBtn