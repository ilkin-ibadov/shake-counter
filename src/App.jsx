import { useState, useEffect } from 'react'

const App = () => {
  const [shakeCount, setShakeCount] = useState(0)
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [lastZ, setLastZ] = useState(null);
  const [error, setError] = useState(null); // To store any error messages
  const shakeThreshold = 1;

  useEffect(() => {
    // navigator.permissions.query({ name: "accelerometer" }).then((result) => {
    //   if (result.state === "denied") {
    //     console.log("Permission to use accelerometer sensor is denied.");
    //     return;
    //   }
    //   // Use the sensor.
    // });

    // let accelerometer = null;
    // try {
    //   accelerometer = new Accelerometer({ referenceFrame: "device" });
    //   accelerometer.addEventListener("error", (event) => {
    //     // Handle runtime errors.
    //     if (event.error.name === "NotAllowedError") {
    //       // Branch to code for requesting permission.
    //     } else if (event.error.name === "NotReadableError") {
    //       console.log("Cannot connect to the sensor.");
    //     }
    //   });
    //   accelerometer.addEventListener("reading", () => reloadOnShake(accelerometer));
    //   accelerometer.start();
    // } catch (error) {
    //   // Handle construction errors.
    //   if (error.name === "SecurityError") {
    //     // See the note above about permissions policy.
    //     console.log("Sensor construction was blocked by a permissions policy.");
    //   } else if (error.name === "ReferenceError") {
    //     console.log("Sensor is not supported by the User Agent.");
    //   } else {
    //     throw error;
    //   }
    // }

    function handleOrientation(event) {
      var absolute = event.absolute;
      var alpha    = event.alpha;
      var beta     = event.beta;
      var gamma    = event.gamma;
      setLastX(alpha)
      setLastY(beta)
      setLastZ(gamma)
      // Do stuff with the new orientation data
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

  }, [])


  // useEffect(() => {
  //   let isSensorAvailable = true;

  //   // Function to detect shake based on acceleration data
  //   const handleMotionEvent = (event) => {
  //     const { acceleration } = event;

  //     if (acceleration) {
  //       const { x, y, z } = acceleration;

  //       if (lastX !== null && lastY !== null && lastZ !== null) {
  //         const deltaX = Math.abs(x - lastX);
  //         const deltaY = Math.abs(y - lastY);
  //         const deltaZ = Math.abs(z - lastZ);

  //         if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
  //           setShakeCount(prevCount => prevCount + 1);
  //         }
  //       }

  //       setLastX(x);
  //       setLastY(y);
  //       setLastZ(z);
  //     }
  //   };

  //   // Check for sensor support and permissions
  //   const initializeShakeDetection = async () => {
  //     if (typeof DeviceMotionEvent === 'undefined') {
  //       setError("Accelerometer not supported on this device.");
  //       isSensorAvailable = false;
  //       return;
  //     }

  //     if (typeof DeviceMotionEvent.requestPermission === 'function') {
  //       try {
  //         const permission = await DeviceMotionEvent.requestPermission();
  //         if (permission !== 'granted') {
  //           setError("Permission to access accelerometer was denied.");
  //           isSensorAvailable = false;
  //         }
  //       } catch (err) {
  //         setError("Error requesting permission for accelerometer.");
  //         isSensorAvailable = false;
  //       }
  //     }

  //     if (isSensorAvailable) {
  //       window.addEventListener('devicemotion', handleMotionEvent);
  //     }
  //   };

  //   initializeShakeDetection();

  //   return () => {
  //     if (isSensorAvailable) {
  //       window.removeEventListener('devicemotion', handleMotionEvent);
  //     }
  //   };

  // }, [lastX, lastY, lastZ]);

  return (
    <div className='w-full h-screen bg-blue-300 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='text-4xl'>Shake count:</h1>
        <h3 className='text-8xl'>{lastX} {lastY} {lastZ}</h3>
        <button onClick={() => { setShakeCount(0) }} className='px-5 py-3 bg-blue-600 rounded-2xl text-base text-white mt-2'>Reset Count</button>
        {error ?? (
          <p style={{ color: 'red' }}>{error}</p>
        )}
      </div>

    </div>
  )
}

export default App