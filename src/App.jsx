import { useState, useEffect } from 'react'
import IosPermissionBtn from './components/IosPermissionBtn';

const App = () => {
  const [shakeCount, setShakeCount] = useState(0)
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [iosDevice, setIosDevice] = useState(null)
  const shakeThreshold = 20;

  function checkIfIOS13OrLater() {
    const userAgent = navigator.userAgent || window.opera;

    // Check if it is an iOS device
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Check for iOS version
      const match = userAgent.match(/OS (\d+)_/); // Extract version number
      if (match && match.length > 1) {
        const version = parseInt(match[1], 10);
        if (version >= 13) {
          setIosDevice(true)
          alert("Click button to give permission")
        } else {
          handlePermissionRequest()
        }

      }
    }
  }

  const resetCounter = () => {
    setShakeCount(0)
  }

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

  const handlePermissionRequest = async () => {
    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof (DeviceMotionEvent.requestPermission) === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission()
        if (response == "granted") {
          window.addEventListener("devicemotion", (event) => {
            handleMotionEvent(event)
          })
        } else {
          alert("Permission wasn't granted for Sensors API")
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      alert("Sensors API is not supported on the device")
    }
  }

  useEffect(() => {
    /* IOS 13+ requests us to put the permission asking action on an event like a click,
    so we check if the device is IOS 13 or later. If it is, a button is displayed and
    user is asked to click it. If it's not, request for permission happens automatically */

    checkIfIOS13OrLater()
  }, []);

  return (
    <div className='w-full h-screen bg-blue-300 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='text-4xl'>Shake count:</h1>
        <h3 className='text-8xl'>{shakeCount}</h3>

        {iosDevice &&
          <button onClick={handlePermissionRequest} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Give permission</button>
        }

        <button onClick={resetCounter} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Reset Count</button>
      </div>

    </div>
  )
}

export default App