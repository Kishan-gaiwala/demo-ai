// // src/components/VirtualRingTryOn.jsx
// import React, { useEffect, useRef } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { Camera } from '@mediapipe/camera_utils'
// import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from '@mediapipe/drawing_utils'
// import ringImg from './assets/ring1.png' // <-- put your ring image here

// const VirtualRingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const ringRef = useRef(null)

//   useEffect(() => {
//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     hands.onResults(onResults)

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         await hands.send({ image: videoRef.current })
//       },
//       width: 640,
//       height: 480,
//     })
//     camera.start()

//     function onResults(results) {
//       const canvasCtx = canvasRef.current.getContext('2d')
//       canvasCtx.save()
//       canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

//       // Draw camera frame
//       canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

//       if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//         for (const landmarks of results.multiHandLandmarks) {
//           // Draw landmarks (for debugging)
//           drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 })
//           drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 })

//           // Ring finger base landmark (landmark index 13)
//           const ringFingerBase = landmarks[14]
//           const ringFingerTip = landmarks[15]

//           const x = ringFingerBase.x * canvasRef.current.width
//           const y = ringFingerBase.y * canvasRef.current.height

//           const ringWidth = Math.abs(ringFingerBase.x - ringFingerTip.x) * canvasRef.current.width * 6
//           const ringHeight = ringWidth * 0.6

//           // Draw the ring image over the finger
//           const ringImgEl = ringRef.current
//           if (ringImgEl.complete) {
//             canvasCtx.drawImage(ringImgEl, x - ringWidth / 2, y - ringHeight / 2, ringWidth, ringHeight)
//           }
//         }
//       }

//       canvasCtx.restore()
//     }
//   }, [])

//   return (
//     <div className='relative flex justify-center items-center'>
//       {/* Video Feed */}
//       <video
//         ref={videoRef}
//         className='absolute'
//         style={{ transform: 'scaleX(-1)' }} // Mirror camera for natural hand movement
//         width='640'
//         height='480'
//         autoPlay
//       />

//       {/* Canvas Overlay */}
//       <canvas ref={canvasRef} width='640' height='640' className='absolute' style={{ transform: 'scaleX(-1)', zIndex: 2, objectFit: 'contain' }} />

//       {/* Hidden ring image (for drawing) */}
//       <img ref={ringRef} src={ringImg} alt='ring' style={{ display: 'none' }} />
//     </div>
//   )
// }

// export default VirtualRingTryOn

// with rear camera
// import React, { useEffect, useRef, useState } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from '@mediapipe/drawing_utils'
// import ringImg from './assets/ring1.png'

// const VirtualRingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const ringRef = useRef(null)
//   const [cameraFacing, setCameraFacing] = useState('environment') // default to rear
//   const handsRef = useRef(null)

//   useEffect(() => {
//     initMediapipe()
//     startCamera(cameraFacing)
//     return () => stopCamera()
//   }, [cameraFacing])

//   // Initialize Mediapipe Hands
//   const initMediapipe = () => {
//     if (handsRef.current) return
//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })
//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })
//     hands.onResults(onResults)
//     handsRef.current = hands
//   }

//   // Start camera manually
//   const startCamera = async (facing) => {
//     stopCamera() // stop previous stream

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: facing }, width: 640, height: 640 },
//         audio: false,
//       })
//       videoRef.current.srcObject = stream
//       await videoRef.current.play()

//       const hands = handsRef.current
//       const process = async () => {
//         if (videoRef.current && hands) {
//           await hands.send({ image: videoRef.current })
//         }
//         requestAnimationFrame(process)
//       }
//       requestAnimationFrame(process)
//     } catch (err) {
//       console.error('Camera access error:', err)
//       alert('Unable to access the rear camera. Using front camera instead.')
//       if (facing === 'environment') setCameraFacing('user')
//     }
//   }

//   // Stop camera tracks
//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
//       videoRef.current.srcObject = null
//     }
//   }

//   // Draw results
//   const onResults = (results) => {
//     const canvasCtx = canvasRef.current.getContext('2d')
//     canvasCtx.save()
//     canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
//     canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//       for (const landmarks of results.multiHandLandmarks) {
//         drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 })
//         drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 })

//         const ringBase = landmarks[14]
//         const ringTip = landmarks[15]
//         const x = ringBase.x * canvasRef.current.width
//         const y = ringBase.y * canvasRef.current.height

//         const fingerLength = Math.sqrt(Math.pow(ringBase.x - ringTip.x, 2) + Math.pow(ringBase.y - ringTip.y, 2))

//         const scaleFactor = 100 // Adjust for desired size
//         const ringWidth = (fingerLength * canvasRef.current.width * scaleFactor) / 100
//         const ringHeight = ringWidth * 0.65

//         const ringImgEl = ringRef.current
//         if (ringImgEl.complete) {
//           canvasCtx.drawImage(ringImgEl, x - ringWidth / 2, y - ringHeight / 2, ringWidth, ringHeight)
//         }
//       }
//     }

//     canvasCtx.restore()
//   }

//   const toggleCamera = () => {
//     setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
//   }

//   return (
//     <div className='flex flex-col items-center'>
//       <div className='relative'>
//         <video
//           ref={videoRef}
//           className='absolute'
//           width='640'
//           height='640'
//           autoPlay
//           playsInline
//           muted
//           style={{
//             transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//           }}
//         />
//         <canvas
//           ref={canvasRef}
//           width='640'
//           height='640'
//           className='absolute'
//           style={{
//             transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//             zIndex: 2,
//           }}
//         />
//         <img ref={ringRef} src={ringImg} alt='ring' style={{ display: 'none' }} />
//       </div>

//       <button onClick={toggleCamera} className='mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl shadow-md'>
//         Flip Camera
//       </button>
//     </div>
//   )
// }

// export default VirtualRingTryOn

// With capture button
// import { drawConnectors, HAND_CONNECTIONS } from '@mediapipe/drawing_utils'
// import { Hands } from '@mediapipe/hands'
// import { useEffect, useRef, useState } from 'react'
// import ringImg from './assets/ring1.png'

// const VirtualRingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const ringRef = useRef(null)
//   const [cameraFacing, setCameraFacing] = useState('environment') // Default to rear
//   const handsRef = useRef(null)

//   useEffect(() => {
//     initMediapipe()
//     startCamera(cameraFacing)
//     return () => stopCamera()
//   }, [cameraFacing])

//   // Initialize Mediapipe Hands
//   const initMediapipe = () => {
//     if (handsRef.current) return
//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })
//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })
//     hands.onResults(onResults)
//     handsRef.current = hands
//   }

//   // Start camera manually
//   const startCamera = async (facing) => {
//     stopCamera() // stop previous stream

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: facing }, width: 500, height: 480 },
//         audio: false,
//       })

//       videoRef.current.srcObject = stream

//       await new Promise((resolve) => {
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current.play()
//           resolve()
//         }
//       })

//       const hands = handsRef.current
//       const process = async () => {
//         if (videoRef.current && hands) {
//           await hands.send({ image: videoRef.current })
//         }
//         requestAnimationFrame(process)
//       }
//       requestAnimationFrame(process)
//     } catch (err) {
//       console.error('Camera access error:', err)
//       alert('Unable to access the rear camera. Using front camera instead.')
//       if (facing === 'environment') setCameraFacing('user')
//     }
//   }

//   // Stop camera tracks
//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach((t) => t.stop())
//       videoRef.current.srcObject = null
//     }
//   }

//   // Draw results on canvas
//   const onResults = (results) => {
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     ctx.save()
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     // Draw the video frame to canvas
//     if (results.image) {
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
//     }

//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//       for (const landmarks of results.multiHandLandmarks) {
//         drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
//           color: '#00FF00',
//           lineWidth: 2,
//         })
//         // drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 })

//         const ringBase = landmarks[14]
//         const ringTip = landmarks[15]

//         // 👇 Adjust these to move ring placement
//         const xOffset = +0.01 // + right, - left
//         const yOffset = +0.05 // + down, - up

//         const x = (ringBase.x + xOffset) * canvas.width
//         const y = (ringBase.y + yOffset) * canvas.height

//         const fingerLength = Math.sqrt(Math.pow(ringBase.x - ringTip.x, 2) + Math.pow(ringBase.y - ringTip.y, 2))

//         // Adjust ring size scale
//         const scaleFactor = 125 // increase if too small
//         const ringWidth = (fingerLength * canvas.width * scaleFactor) / 100
//         const ringHeight = ringWidth * 0.65

//         const ringImgEl = ringRef.current
//         if (ringImgEl.complete) {
//           ctx.drawImage(ringImgEl, x - ringWidth / 2, y - ringHeight / 2, ringWidth, ringHeight)
//         }
//       }
//     }

//     ctx.restore()
//   }

//   // Flip between front and rear
//   const toggleCamera = () => {
//     setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
//   }

//   // 📸 Capture current canvas
//   const capturePhoto = () => {
//     const canvas = canvasRef.current
//     const link = document.createElement('a')
//     link.download = 'ring-preview.png'
//     link.href = canvas.toDataURL('image/png')
//     link.click()
//   }

//   return (
//     <div className='flex flex-col items-center'>
//       <div className='relative'>
//         {/* Video feed (hidden under canvas) */}
//         <video
//           ref={videoRef}
//           className='absolute'
//           width='500'
//           height='480'
//           autoPlay
//           playsInline
//           muted
//           style={{
//             transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//             display: 'none', // hide raw video, we draw on canvas
//           }}
//         />

//         {/* Canvas where everything is rendered */}
//         <canvas
//           ref={canvasRef}
//           width='500'
//           height='480'
//           className='absolute border-2 border-gray-400 rounded-lg'
//           style={{
//             transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//             zIndex: 2,
//           }}
//         />

//         {/* Hidden ring image */}
//         <img ref={ringRef} src={ringImg} alt='ring' style={{ display: 'none' }} />
//       </div>

//       {/* Controls */}
//       <div className='mt-4 flex gap-3'>
//         <button onClick={toggleCamera} className='px-4 py-2 bg-teal-600 text-white rounded-xl shadow-md'>
//           Flip Camera
//         </button>
//         <button onClick={capturePhoto} className='px-4 py-2 bg-green-600 text-white rounded-xl shadow-md'>
//           Capture Photo
//         </button>
//       </div>
//     </div>
//   )
// }

// export default VirtualRingTryOn

//With rotation and arrow button
import { Camera } from '@mediapipe/camera_utils'
import { Hands } from '@mediapipe/hands'
import { useEffect, useRef, useState } from 'react'
import ringImg from './assets/ring1.png' // your ring image

const RingTryOn = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [useRearCamera, setUseRearCamera] = useState(true)

  // Adjustable controls
  const [xOffsetState, setXOffset] = useState(0)
  const [yOffsetState, setYOffset] = useState(0)
  const [scaleFactorState, setScaleFactor] = useState(60)
  const [rotationAdjustState, setRotationAdjust] = useState(0)

  const xOffset = useRef(0)
  const yOffset = useRef(0)
  const scaleFactor = useRef(60)
  const rotationAdjust = useRef(0)

  useEffect(() => {
    xOffset.current = xOffsetState
    yOffset.current = yOffsetState
    scaleFactor.current = scaleFactorState
    rotationAdjust.current = rotationAdjustState
  }, [xOffsetState, yOffsetState, scaleFactorState, rotationAdjustState])

  const prevPos = useRef({ x: 0, y: 0, angle: 0 })

  useEffect(() => {
    const videoEl = videoRef.current
    const canvasEl = canvasRef.current
    const ctx = canvasEl.getContext('2d')

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    })

    hands.onResults((results) => {
      ctx.save()
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        const ringBase = landmarks[14]
        const ringTip = landmarks[15]

        // Target coordinates
        const targetX = ringBase.x * canvasEl.width
        const targetY = ringBase.y * canvasEl.height

        // Smoothing
        const smoothX = prevPos.current.x * 0.85 + targetX * 0.15
        const smoothY = prevPos.current.y * 0.85 + targetY * 0.15
        prevPos.current.x = smoothX
        prevPos.current.y = smoothY

        // Calculate finger rotation
        const dx = ringTip.x - ringBase.x
        const dy = ringTip.y - ringBase.y
        let angle = Math.atan2(dy, dx)

        // Smooth angle too (avoids jumpy rotations)
        prevPos.current.angle = 0.85 * prevPos.current.angle + 0.15 * angle
        angle = prevPos.current.angle

        // const fingerLength = Math.sqrt(dx * dx + dy * dy)
        // const ringWidth = (fingerLength * canvasEl.width * scaleFactor.current) / 100

        // Load image once
        const img = new Image()
        img.src = ringImg

        hands.onResults((results) => {
          ctx.save()
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
          ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height)

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]
            const ringBase = landmarks[14]
            const ringTip = landmarks[15]

            const targetX = ringBase.x * canvasEl.width
            const targetY = ringBase.y * canvasEl.height

            // Smooth motion
            const smoothX = prevPos.current.x * 0.9 + targetX * 0.1
            const smoothY = prevPos.current.y * 0.9 + targetY * 0.1
            prevPos.current.x = smoothX
            prevPos.current.y = smoothY

            const dx = ringTip.x - ringBase.x
            const dy = ringTip.y - ringBase.y
            let angle = Math.atan2(dy, dx)
            prevPos.current.angle = 0.9 * prevPos.current.angle + 0.1 * angle
            angle = prevPos.current.angle

            const fingerLength = Math.sqrt(dx * dx + dy * dy)
            const ringWidth = (fingerLength * canvasEl.width * scaleFactor.current) / 100

            // ✅ Only draw when image is ready
            if (img.complete && img.naturalWidth > 0) {
              ctx.translate(smoothX + xOffset.current * canvasEl.width, smoothY + yOffset.current * canvasEl.height)
              ctx.rotate(angle + (rotationAdjust.current * Math.PI) / 180)
              ctx.drawImage(img, -ringWidth / 2, -ringWidth / 4, ringWidth, ringWidth)
              ctx.setTransform(1, 0, 0, 1, 0, 0)
            }
          }

          ctx.restore()
        })
      }

      ctx.restore()
    })

    const camera = new Camera(videoEl, {
      onFrame: async () => {
        await hands.send({ image: videoEl })
      },
      width: 640,
      height: 480,
      facingMode: useRearCamera ? 'environment' : 'user',
    })

    camera.start()

    return () => camera.stop()
  }, [useRearCamera])

  const handleCapture = () => {
    const canvas = canvasRef.current
    const imageUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'ring-tryon.png'
    a.click()
  }

  const resetAdjustments = () => {
    setXOffset(0)
    setYOffset(0)
    setScaleFactor(60)
    setRotationAdjust(0)
  }

  // Arrow buttons for fine tuning
  const moveRing = (dx, dy) => {
    setXOffset((prev) => prev + dx)
    setYOffset((prev) => prev + dy)
  }

  return (
    <div
      style={{
        textAlign: 'center',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>💍 Virtual Ring Try-On</h2>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas
          ref={canvasRef}
          width='640'
          height='480'
          style={{
            borderRadius: '12px',
            background: '#000',
          }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setUseRearCamera((p) => !p)} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
          Flip Camera
        </button>
        <button onClick={handleCapture} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
          📸 Capture
        </button>
        <button onClick={resetAdjustments} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
          🔄 Reset
        </button>
      </div>

      {/* Arrow Controls */}
      <div style={{ marginTop: '1rem' }}>
        <div>
          <button onClick={() => moveRing(0, -0.02)}>⬆️</button>
        </div>
        <div>
          <button onClick={() => moveRing(-0.02, 0)}>⬅️</button>
          <button onClick={() => moveRing(0.02, 0)}>➡️</button>
        </div>
        <div>
          <button onClick={() => moveRing(0, 0.02)}>⬇️</button>
        </div>
      </div>

      {/* Sliders */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <label>
          Scale:
          <input
            type='range'
            min={20}
            max={200}
            step={1}
            value={scaleFactorState}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            style={{ width: '300px' }}
          />
        </label>
        <label>
          Rotation:
          <input
            type='range'
            min={-180}
            max={180}
            step={1}
            value={rotationAdjustState}
            onChange={(e) => setRotationAdjust(parseFloat(e.target.value))}
            style={{ width: '300px' }}
          />
        </label>
      </div>
    </div>
  )
}

export default RingTryOn
