import { useState, useEffect } from 'react';
import AdjustSlider from './components/AdjustSlider';
import Button from './components/Button';

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [isAccelerometerSupported, setIsAccelerometerSupported] = useState(true);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [iosDevice, setIosDevice] = useState(false)
  const [shakeThreshold, setShakeThreshold] = useState(25)
  const [shakeInProgress, setShakeInProgress] = useState(false)
  const [isSliderVisible, setIsSliderVisible] = useState(false)

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
        }
      }
    }
  }

  // Function to detect shake based on acceleration data
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

  // Request permission to access accelerometer (for iOS 13+)
  const handlePermissionRequest = async () => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setIsAccelerometerSupported(false)
      return;
    }

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
        } else {
          alert("Permission to access accelerometer was denied.");
        }
      } catch (err) {
        alert("Error requesting permission for accelerometer.");
      }
    } else {
      // For devices that don't require explicit permission (e.g., Android)
      setIsPermissionGranted(true);
    }
  };

  useEffect(() => {
    /* IOS 13+ requests us to put the permission asking action on an event like a click,
    so we check if the device is IOS 13 or later. If it is, a button is displayed and
    user is asked to click it. If it's not, request for permission happens automatically */

    checkIfIOS13OrLater()
  }, []);

  useEffect(() => {
    if (isPermissionGranted) {
      window.addEventListener('devicemotion', handleMotionEvent);
    }

    return () => {
      if (isPermissionGranted) {
        window.removeEventListener('devicemotion', handleMotionEvent);
      }
    };
  }, [isPermissionGranted, lastX, lastY, lastZ]);

  useEffect(() => {
    if (lastX !== null || lastY !== null || lastZ !== null) {
      setShakeInProgress(true);
      const timer = setTimeout(() => setShakeInProgress(false), 300);

      return () => clearTimeout(timer);
    }
  }, [lastX, lastY, lastZ])


  return (
    <div className={`w-full h-screen transition duration-300 ease-in-out ${shakeInProgress ? "bg-orange-400" : "bg-blue-300"} flex items-center justify-center`}>
      {
        isAccelerometerSupported ? (
          <div className='flex flex-col items-center gap-3'>
            <h1 className='text-4xl'>Shake count:</h1>
            <h3 className='text-8xl'>{shakeCount}</h3>

            {(!isPermissionGranted && iosDevice) &&
              <Button title="Give permission" action={
                () => {
                  handlePermissionRequest()
                }
              } />
            }

            <Button title="Reset Count" action={() => {
              setShakeCount(0)
              setIsSliderVisible(false)
              setShakeThreshold(25)
            }} />

            {
              isSliderVisible ? <AdjustSlider shakeThreshold={shakeThreshold} setShakeThreshold={setShakeThreshold} /> :
                <Button title="Adjust sensitivity" action={() => { setIsSliderVisible(true) }} />
            }
          </div>
        ) : (
          <p className='text-2xl text-red-600'>Accelerometer not supported on this device.</p>
        )
      }
    </div>
  );
}

export default App;
