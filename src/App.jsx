import React, { useState, useEffect } from 'react';

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [error, setError] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [iosDevice, setIosDevice] = useState(false)
  const shakeThreshold = 15;

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
      setError("Accelerometer not supported on this device.");
      return;
    }

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
          setError(null); // Clear any previous error
        } else {
          setError("Permission to access accelerometer was denied.");
        }
      } catch (err) {
        setError("Error requesting permission for accelerometer.");
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

  return (
    <div className='w-full h-screen bg-blue-300 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='text-4xl'>Shake count:</h1>
        <h3 className='text-8xl'>{shakeCount}</h3>

        {(!isPermissionGranted && iosDevice) &&
          <button onClick={() => {
            handlePermissionRequest()
          }} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Give permission</button>
        }

        <button onClick={() => {
          setShakeCount(0)
        }} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Reset Count</button>
      </div>

    </div>
  );
}

export default App;
