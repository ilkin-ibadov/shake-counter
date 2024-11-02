import { useState, useEffect } from 'react'
import IosPermissionBtn from './components/IosPermissionBtn';

const App = () => {
  const [shakeCount, setShakeCount] = useState(0)
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [error, setError] = useState(null); // To store any error messages
  const [iosDevice, setIosDevice] = useState(null)
  const shakeThreshold = 50;

  const handleMotionEvent = (event) => {
    const { acceleration } = event;

    if (acceleration) {
      const { x, y, z } = acceleration;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
          setShakeCount(prevCount => prevCount + 1);
        }
      }

      setLastX(x);
      setLastY(y);
      setLastZ(z);
    }
  };

  const findIfNewerThanIOS13 = async () => {
    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
      alert("IOS Version >13 detected", "In order for shake detection to work, please click the 'Give permission' button and accept the permission request")
      setIosDevice(true)
    }
  }

  useEffect(() => {
    findIfNewerThanIOS13();
  }, []);

  return (
    <div className='w-full h-screen bg-blue-300 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='text-4xl'>Shake count:</h1>
        <h3 className='text-8xl'>{shakeCount}</h3>

       {iosDevice ?? <IosPermissionBtn handleMotionEvent={handleMotionEvent}/>}

        <button onClick={() => { setShakeCount(0) }} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Reset Count</button>
        {error ?? (
          <p style={{ color: 'red' }}>{error}</p>
        )}
      </div>

    </div>
  )
}

export default App