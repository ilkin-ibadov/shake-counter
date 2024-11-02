import React, { useState, useEffect } from 'react';

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [error, setError] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const shakeThreshold = 15;

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
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Shake Detector</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>Shake Count: {shakeCount}</p>
      )}
      {!isPermissionGranted && (
        <button onClick={handlePermissionRequest} style={{ marginTop: '20px', padding: '10px' }}>
          Enable Shake Detection
        </button>
      )}
    </div>
  );
}

export default App;
