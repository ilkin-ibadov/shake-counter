const AdjustSlider = ({shakeThreshold, setShakeThreshold}) => {
    return (
        <>
            <label htmlFor="sensitivity">Adjust shake sensitivity</label>
            <input onChange={(e) => {
                setShakeThreshold(e.target.value)
            }} name='sensitivity' type="range" min="15" max="50" value={shakeThreshold} />
        </>
    )
}

export default AdjustSlider