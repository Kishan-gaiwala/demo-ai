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
// import { Camera } from '@mediapipe/camera_utils'
// import { Hands } from '@mediapipe/hands'
// import { useEffect, useRef, useState } from 'react'
// import ringImg from './assets/ring1.png' // your ring image

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)

//   const [useRearCamera, setUseRearCamera] = useState(true)

//   // Adjustable controls
//   const [xOffsetState, setXOffset] = useState(0)
//   const [yOffsetState, setYOffset] = useState(0)
//   const [scaleFactorState, setScaleFactor] = useState(120)
//   const [rotationAdjustState, setRotationAdjust] = useState(105)

//   const xOffset = useRef(0)
//   const yOffset = useRef(0)
//   const scaleFactor = useRef(60)
//   const rotationAdjust = useRef(0)

//   useEffect(() => {
//     xOffset.current = xOffsetState
//     yOffset.current = yOffsetState
//     scaleFactor.current = scaleFactorState
//     rotationAdjust.current = rotationAdjustState
//   }, [xOffsetState, yOffsetState, scaleFactorState, rotationAdjustState])

//   const prevPos = useRef({ x: 0, y: 0, angle: 0 })

//   useEffect(() => {
//     const videoEl = videoRef.current
//     const canvasEl = canvasRef.current
//     const ctx = canvasEl.getContext('2d')

//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     hands.onResults((results) => {
//       ctx.save()
//       ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
//       ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height)

//       if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//         const landmarks = results.multiHandLandmarks[0]
//         const ringBase = landmarks[14]
//         const ringTip = landmarks[15]

//         // Target coordinates
//         const targetX = ringBase.x * canvasEl.width
//         const targetY = ringBase.y * canvasEl.height

//         // Smoothing
//         const smoothX = prevPos.current.x * 0.85 + targetX * 0.15
//         const smoothY = prevPos.current.y * 0.85 + targetY * 0.15
//         prevPos.current.x = smoothX
//         prevPos.current.y = smoothY

//         // Calculate finger rotation
//         const dx = ringTip.x - ringBase.x
//         const dy = ringTip.y - ringBase.y
//         let angle = Math.atan2(dy, dx)

//         // Smooth angle too (avoids jumpy rotations)
//         prevPos.current.angle = 0.85 * prevPos.current.angle + 0.15 * angle
//         angle = prevPos.current.angle

//         // const fingerLength = Math.sqrt(dx * dx + dy * dy)
//         // const ringWidth = (fingerLength * canvasEl.width * scaleFactor.current) / 100

//         // Load image once
//         const img = new Image()
//         img.src = ringImg

//         hands.onResults((results) => {
//           ctx.save()
//           ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
//           ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height)

//           if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//             const landmarks = results.multiHandLandmarks[0]
//             const ringBase = landmarks[14]
//             const ringTip = landmarks[15]

//             const targetX = ringBase.x * canvasEl.width
//             const targetY = ringBase.y * canvasEl.height

//             // Smooth motion
//             const smoothX = prevPos.current.x * 0.9 + targetX * 0.1
//             const smoothY = prevPos.current.y * 0.9 + targetY * 0.1
//             prevPos.current.x = smoothX
//             prevPos.current.y = smoothY

//             const dx = ringTip.x - ringBase.x
//             const dy = ringTip.y - ringBase.y
//             let angle = Math.atan2(dy, dx)
//             prevPos.current.angle = 0.9 * prevPos.current.angle + 0.1 * angle
//             angle = prevPos.current.angle

//             const fingerLength = Math.sqrt(dx * dx + dy * dy)
//             const ringWidth = (fingerLength * canvasEl.width * scaleFactor.current) / 100

//             // ✅ Only draw when image is ready
//             if (img.complete && img.naturalWidth > 0) {
//               ctx.translate(smoothX + xOffset.current * canvasEl.width, smoothY + yOffset.current * canvasEl.height)
//               ctx.rotate(angle + (rotationAdjust.current * Math.PI) / 180)
//               ctx.drawImage(img, -ringWidth / 2, -ringWidth / 4, ringWidth, ringWidth)
//               ctx.setTransform(1, 0, 0, 1, 0, 0)
//             }
//           }

//           ctx.restore()
//         })
//       }

//       ctx.restore()
//     })

//     const camera = new Camera(videoEl, {
//       onFrame: async () => {
//         await hands.send({ image: videoEl })
//       },
//       width: 640,
//       height: 480,
//       facingMode: useRearCamera ? 'environment' : 'user',
//     })

//     camera.start()

//     return () => camera.stop()
//   }, [useRearCamera])

//   const handleCapture = () => {
//     const canvas = canvasRef.current
//     const imageUrl = canvas.toDataURL('image/png')
//     const a = document.createElement('a')
//     a.href = imageUrl
//     a.download = 'ring-tryon.png'
//     a.click()
//   }

//   const resetAdjustments = () => {
//     setXOffset(0)
//     setYOffset(0)
//     setScaleFactor(120)
//     setRotationAdjust(95)
//   }

//   // Arrow buttons for fine tuning
//   const moveRing = (dx, dy) => {
//     setXOffset((prev) => prev + dx)
//     setYOffset((prev) => prev + dy)
//   }

//   return (
//     <div
//       style={{
//         textAlign: 'center',
//         background: '#000',
//         color: '#fff',
//         minHeight: '100vh',
//         padding: '1rem',
//       }}
//     >
//       <h2 style={{ marginBottom: '1rem' }}>💍 Virtual Ring Try-On</h2>

//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <video ref={videoRef} style={{ display: 'none' }} />
//         <canvas
//           ref={canvasRef}
//           width='500'
//           height='500'
//           style={{
//             borderRadius: '12px',
//             background: '#000',
//           }}
//         />
//       </div>

//       <div style={{ marginTop: '1rem' }}>
//         <button onClick={() => setUseRearCamera((p) => !p)} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
//           Flip Camera
//         </button>
//         <button onClick={handleCapture} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
//           📸 Capture
//         </button>
//         <button onClick={resetAdjustments} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
//           🔄 Reset
//         </button>
//       </div>

//       {/* Arrow Controls */}
//       <div style={{ marginTop: '1rem' }}>
//         <div>
//           <button onClick={() => moveRing(0, -0.02)}>⬆️</button>
//         </div>
//         <div>
//           <button onClick={() => moveRing(-0.02, 0)}>⬅️</button>
//           <button onClick={() => moveRing(0.02, 0)}>➡️</button>
//         </div>
//         <div>
//           <button onClick={() => moveRing(0, 0.02)}>⬇️</button>
//         </div>
//       </div>

//       {/* Sliders */}
//       <div
//         style={{
//           marginTop: '1rem',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: '0.5rem',
//         }}
//       >
//         <label>
//           Scale:
//           <input
//             type='range'
//             min={20}
//             max={200}
//             step={1}
//             value={scaleFactorState}
//             onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
//             style={{ width: '300px' }}
//           />
//         </label>
//         <label>
//           Rotation:
//           <input
//             type='range'
//             min={-180}
//             max={180}
//             step={1}
//             value={rotationAdjustState}
//             onChange={(e) => setRotationAdjust(parseFloat(e.target.value))}
//             style={{ width: '300px' }}
//           />
//         </label>
//       </div>
//     </div>
//   )
// }

// export default RingTryOn

// import { Camera } from '@mediapipe/camera_utils'
// import { Hands } from '@mediapipe/hands'
// import { useEffect, useRef, useState } from 'react'
// import ringImg from './assets/ring1.png' // your ring image

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [useRearCamera, setUseRearCamera] = useState(true)
//   const [capturedImages, setCapturedImages] = useState([])

//   // Adjustable controls
//   const [xOffsetState, setXOffset] = useState(0)
//   const [yOffsetState, setYOffset] = useState(0)
//   const [scaleFactorState, setScaleFactor] = useState(120)
//   const [rotationAdjustState, setRotationAdjust] = useState(105)

//   const xOffset = useRef(0)
//   const yOffset = useRef(0)
//   const scaleFactor = useRef(60)
//   const rotationAdjust = useRef(0)

//   const prevPos = useRef({ x: 0, y: 0, angle: 0 })
//   const stabilityHistory = useRef([])
//   const [isStable, setIsStable] = useState(false)
//   const captureCount = useRef(0)

//   useEffect(() => {
//     xOffset.current = xOffsetState
//     yOffset.current = yOffsetState
//     scaleFactor.current = scaleFactorState
//     rotationAdjust.current = rotationAdjustState
//   }, [xOffsetState, yOffsetState, scaleFactorState, rotationAdjustState])

//   useEffect(() => {
//     const videoEl = videoRef.current
//     const canvasEl = canvasRef.current
//     const ctx = canvasEl.getContext('2d')

//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     const img = new Image()
//     img.src = ringImg

//     hands.onResults((results) => {
//       ctx.save()
//       ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
//       ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height)

//       if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//         const landmarks = results.multiHandLandmarks[0]
//         const ringBase = landmarks[14]
//         const ringTip = landmarks[15]

//         const targetX = ringBase.x * canvasEl.width
//         const targetY = ringBase.y * canvasEl.height

//         // Smooth hand movement
//         const smoothX = prevPos.current.x * 0.9 + targetX * 0.1
//         const smoothY = prevPos.current.y * 0.9 + targetY * 0.1
//         prevPos.current.x = smoothX
//         prevPos.current.y = smoothY

//         const dx = ringTip.x - ringBase.x
//         const dy = ringTip.y - ringBase.y
//         let angle = Math.atan2(dy, dx)
//         prevPos.current.angle = 0.9 * prevPos.current.angle + 0.1 * angle
//         angle = prevPos.current.angle

//         const fingerLength = Math.sqrt(dx * dx + dy * dy)
//         const ringWidth = (fingerLength * canvasEl.width * scaleFactor.current) / 100

//         // Stability detection (to auto capture)
//         stabilityHistory.current.push({ x: smoothX, y: smoothY })
//         if (stabilityHistory.current.length > 10) stabilityHistory.current.shift()

//         const movement = getMovement(stabilityHistory.current)
//         if (movement < 1.5) {
//           setIsStable(true)
//           if (captureCount.current < 2) {
//             capturePhoto(canvasEl)
//             captureCount.current++
//           }
//         } else {
//           setIsStable(false)
//           captureCount.current = 0
//         }

//         // Draw ring
//         if (img.complete && img.naturalWidth > 0) {
//           ctx.translate(smoothX + xOffset.current * canvasEl.width, smoothY + yOffset.current * canvasEl.height)
//           ctx.rotate(angle + (rotationAdjust.current * Math.PI) / 180)
//           ctx.drawImage(img, -ringWidth / 2, -ringWidth / 4, ringWidth, ringWidth)
//           ctx.setTransform(1, 0, 0, 1, 0, 0)
//         }
//       }

//       ctx.restore()
//     })

//     const camera = new Camera(videoEl, {
//       onFrame: async () => {
//         await hands.send({ image: videoEl })
//       },
//       width: 640,
//       height: 480,
//       facingMode: useRearCamera ? 'environment' : 'user',
//     })

//     camera.start()

//     return () => camera.stop()
//   }, [useRearCamera])

//   const getMovement = (positions) => {
//     if (positions.length < 2) return 10
//     const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length
//     const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length
//     const variance = positions.reduce((sum, p) => sum + (p.x - avgX) ** 2 + (p.y - avgY) ** 2, 0) / positions.length
//     return variance
//   }

//   const capturePhoto = (canvas) => {
//     const dataUrl = canvas.toDataURL('image/png')
//     setCapturedImages((prev) => [...prev, dataUrl])
//   }

//   const resetAdjustments = () => {
//     setXOffset(0)
//     setYOffset(0)
//     setScaleFactor(120)
//     setRotationAdjust(95)
//     setCapturedImages([])
//     captureCount.current = 0
//   }

//   // Arrow buttons
//   const moveRing = (dx, dy) => {
//     setXOffset((prev) => prev + dx)
//     setYOffset((prev) => prev + dy)
//   }

//   return (
//     <div
//       style={{
//         textAlign: 'center',
//         background: '#000',
//         color: '#fff',
//         minHeight: '100vh',
//         padding: '1rem',
//       }}
//     >
//       <h2>💍 Virtual Ring Try-On</h2>
//       <p style={{ color: isStable ? 'lime' : 'orange' }}>{isStable ? 'Hand Stable ✅ Capturing...' : 'Place hand steadily ✋'}</p>

//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <video ref={videoRef} style={{ display: 'none' }} />
//         <canvas
//           ref={canvasRef}
//           width='500'
//           height='500'
//           style={{
//             borderRadius: '12px',
//             background: '#000',
//             border: `4px solid ${isStable ? 'lime' : 'red'}`,
//             transition: 'border-color 0.3s ease',
//           }}
//         />
//       </div>

//       <div style={{ marginTop: '1rem' }}>
//         <button onClick={() => setUseRearCamera((p) => !p)} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
//           Flip Camera
//         </button>
//         <button onClick={resetAdjustments} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
//           🔄 Reset
//         </button>
//       </div>

//       {/* Arrow Controls */}
//       <div style={{ marginTop: '1rem' }}>
//         <div>
//           <button onClick={() => moveRing(0, -0.02)}>⬆️</button>
//         </div>
//         <div>
//           <button onClick={() => moveRing(-0.02, 0)}>⬅️</button>
//           <button onClick={() => moveRing(0.02, 0)}>➡️</button>
//         </div>
//         <div>
//           <button onClick={() => moveRing(0, 0.02)}>⬇️</button>
//         </div>
//       </div>

//       {/* Sliders */}
//       <div
//         style={{
//           marginTop: '1rem',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: '0.5rem',
//         }}
//       >
//         <label>
//           Scale:
//           <input
//             type='range'
//             min={20}
//             max={200}
//             step={1}
//             value={scaleFactorState}
//             onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
//             style={{ width: '300px' }}
//           />
//         </label>
//         <label>
//           Rotation:
//           <input
//             type='range'
//             min={-180}
//             max={180}
//             step={1}
//             value={rotationAdjustState}
//             onChange={(e) => setRotationAdjust(parseFloat(e.target.value))}
//             style={{ width: '300px' }}
//           />
//         </label>
//       </div>

//       {/* Show auto-captured images */}
//       {capturedImages.length > 0 && (
//         <div style={{ marginTop: '1rem' }}>
//           <h3>🖼 Captured Photos:</h3>
//           <div
//             style={{
//               display: 'flex',
//               gap: '10px',
//               justifyContent: 'center',
//               flexWrap: 'wrap',
//               marginTop: '10px',
//             }}
//           >
//             {capturedImages.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`capture-${idx}`}
//                 style={{
//                   width: '150px',
//                   height: '120px',
//                   borderRadius: '8px',
//                   border: '2px solid #555',
//                   objectFit: 'cover',
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default RingTryOn

// auto size ring -- perfect fit
// import { useEffect, useRef, useState } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { Camera } from '@mediapipe/camera_utils'
// import ringImg from './assets/ring1.png'

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [isRearCamera, setIsRearCamera] = useState(true)
//   const [ringLoaded, setRingLoaded] = useState(false)
//   const [ringParams, setRingParams] = useState({
//     offsetX: 0,
//     offsetY: -10,
//     rotation: 90,
//   })
//   const ringImage = useRef(new Image())
//   const smoothFingerWidth = useRef(0)

//   // Load ring image
//   useEffect(() => {
//     ringImage.current.src = ringImg
//     ringImage.current.onload = () => setRingLoaded(true)
//   }, [])

//   // Setup Mediapipe + Camera
//   useEffect(() => {
//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })
//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     hands.onResults((results) => {
//       if (!results.multiHandLandmarks?.[0]) return
//       const landmarks = results.multiHandLandmarks[0]

//       ctx.save()
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

//       // ✅ Choose landmarks for ring position
//       const ringBase = landmarks[13] // lower joint of ring finger
//       const ringMid = landmarks[14] // upper joint
//       const pinkyBase = landmarks[17]

//       // Estimate width and center
//       const dx = (ringBase.x - pinkyBase.x) * canvas.width
//       const dy = (ringBase.y - pinkyBase.y) * canvas.height
//       const fingerWidth = Math.sqrt(dx * dx + dy * dy)
//       smoothFingerWidth.current = smoothFingerWidth.current * 0.8 + fingerWidth * 0.2

//       // ✅ Position ring slightly above base (where a ring actually sits)
//       const centerX = ((ringBase.x + ringMid.x) / 2) * canvas.width + ringParams.offsetX
//       const centerY = ((ringBase.y + ringMid.y) / 2) * canvas.height + ringParams.offsetY

//       // ✅ Smooth rotation angle based on finger slope
//       const angle = Math.atan2(ringBase.y - ringMid.y, ringBase.x - ringMid.x) + ringParams.rotation

//       if (ringLoaded) {
//         const ringW = smoothFingerWidth.current * 1.6 // adjust multiplier if needed
//         const ringH = ringW * (ringImage.current.height / ringImage.current.width)

//         ctx.translate(centerX, centerY)
//         ctx.rotate(angle)
//         ctx.drawImage(ringImage.current, -ringW / 2, -ringH / 2, ringW, ringH)
//         ctx.rotate(-angle)
//         ctx.translate(-centerX, -centerY)
//       }

//       ctx.restore()
//     })

//     const camera = new Camera(video, {
//       onFrame: async () => {
//         await hands.send({ image: video })
//       },
//       width: 500,
//       height: 500,
//       facingMode: isRearCamera ? 'environment' : 'user',
//     })
//     camera.start()

//     return () => {
//       camera.stop()
//     }
//   }, [isRearCamera, ringLoaded, ringParams])

//   // Adjust canvas size
//   useEffect(() => {
//     const canvas = canvasRef.current
//     canvas.width = 500
//     canvas.height = 500
//   }, [])

//   return (
//     <div className='flex flex-col items-center p-4 gap-4'>
//       <div className='relative w-[640px] h-[480px] border-2 border-dashed rounded-xl overflow-hidden'>
//         <video ref={videoRef} autoPlay playsInline muted className='absolute inset-0 w-full h-full object-cover' />
//         <canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />
//       </div>

//       <div className='flex gap-4 items-center'>
//         <button onClick={() => setIsRearCamera((prev) => !prev)} className='px-4 py-2 rounded-lg bg-blue-600 text-white'>
//           Flip Camera
//         </button>
//         <button onClick={() => setRingParams({ offsetX: 0, offsetY: 0, rotation: 0 })} className='px-4 py-2 rounded-lg bg-gray-600 text-white'>
//           Reset
//         </button>
//       </div>

//       <div className='flex flex-wrap justify-center gap-4 mt-2'>
//         <div className='flex flex-col items-center'>
//           <label>Move X</label>
//           <input
//             type='range'
//             min='-100'
//             max='100'
//             value={ringParams.offsetX}
//             onChange={(e) => setRingParams((p) => ({ ...p, offsetX: +e.target.value }))}
//           />
//         </div>
//         <div className='flex flex-col items-center'>
//           <label>Move Y</label>
//           <input
//             type='range'
//             min='-100'
//             max='100'
//             value={ringParams.offsetY}
//             onChange={(e) => setRingParams((p) => ({ ...p, offsetY: +e.target.value }))}
//           />
//         </div>
//         <div className='flex flex-col items-center'>
//           <label>Rotate</label>
//           <input
//             type='range'
//             min='-1'
//             max='1'
//             step='0.05'
//             value={ringParams.rotation}
//             onChange={(e) => setRingParams((p) => ({ ...p, rotation: +e.target.value }))}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RingTryOn

// auto size and auto capture
// import { useEffect, useRef, useState } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { Camera } from '@mediapipe/camera_utils'
// import ringImg from './assets/eing2.png'

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [isRearCamera, setIsRearCamera] = useState(true)
//   const [ringLoaded, setRingLoaded] = useState(false)
//   const [ringParams, setRingParams] = useState({
//     offsetX: 3,
//     offsetY: -10,
//     rotation: 90,
//   })
//   const [capturedImages, setCapturedImages] = useState([])
//   const [cameraStopped, setCameraStopped] = useState(false)

//   const ringImage = useRef(new Image())
//   const smoothFingerWidth = useRef(0)
//   const prevCenter = useRef({ x: 0, y: 0 })
//   const stableCounter = useRef(0)
//   const cameraRef = useRef(null)

//   // Load ring image
//   useEffect(() => {
//     ringImage.current.src = ringImg
//     ringImage.current.onload = () => setRingLoaded(true)
//   }, [])

//   useEffect(() => {
//     if (cameraStopped) return

//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })
//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     hands.onResults((results) => {
//       ctx.save()
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

//       if (results.multiHandLandmarks?.[0]) {
//         const landmarks = results.multiHandLandmarks[0]
//         const ringBase = landmarks[13]
//         const ringMid = landmarks[14]
//         const pinkyBase = landmarks[17]

//         const dx = (ringBase.x - pinkyBase.x) * canvas.width
//         const dy = (ringBase.y - pinkyBase.y) * canvas.height
//         const fingerWidth = Math.sqrt(dx * dx + dy * dy)
//         smoothFingerWidth.current = smoothFingerWidth.current * 0.8 + fingerWidth * 0.2

//         const centerX = ((ringBase.x + ringMid.x) / 2) * canvas.width + ringParams.offsetX
//         const centerY = ((ringBase.y + ringMid.y) / 2) * canvas.height + ringParams.offsetY

//         const angle = Math.atan2(ringBase.y - ringMid.y, ringBase.x - ringMid.x) + ringParams.rotation

//         // ✅ Draw ring
//         if (ringLoaded) {
//           const ringW = smoothFingerWidth.current * 1.6
//           const ringH = ringW * (ringImage.current.height / ringImage.current.width)

//           ctx.translate(centerX, centerY)
//           ctx.rotate(angle)
//           ctx.drawImage(ringImage.current, -ringW / 2, -ringH / 2, ringW, ringH)
//           ctx.rotate(-angle)
//           ctx.translate(-centerX, -centerY)
//         }

//         // ✅ Stability detection
//         const dxCenter = centerX - prevCenter.current.x
//         const dyCenter = centerY - prevCenter.current.y
//         const movement = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)

//         if (movement < 3) {
//           stableCounter.current += 1
//         } else {
//           stableCounter.current = 0
//         }
//         prevCenter.current = { x: centerX, y: centerY }

//         // If stable for ~1s (30 frames)
//         if (stableCounter.current > 30) {
//           stableCounter.current = 0
//           captureImages()
//         }
//       }

//       ctx.restore()
//     })

//     const cam = new Camera(video, {
//       onFrame: async () => {
//         await hands.send({ image: video })
//       },
//       width: 500,
//       height: 500,
//       facingMode: isRearCamera ? 'environment' : 'user',
//     })
//     cam.start()
//     cameraRef.current = cam

//     return () => {
//       cam.stop()
//     }
//   }, [isRearCamera, ringLoaded, ringParams, cameraStopped])

//   // Canvas setup
//   useEffect(() => {
//     const canvas = canvasRef.current
//     canvas.width = 500
//     canvas.height = 500
//   }, [])

//   // 📸 Capture 2 images automatically and stop camera
//   const captureImages = async () => {
//     const canvas = canvasRef.current
//     const imgs = []
//     for (let i = 0; i < 2; i++) {
//       imgs.push(canvas.toDataURL('image/png'))
//       await new Promise((res) => setTimeout(res, 500)) // half-second gap
//     }
//     setCapturedImages(imgs)
//     setCameraStopped(true)
//     cameraRef.current?.stop()
//   }

//   const reset = () => {
//     setCapturedImages([])
//     setCameraStopped(false)
//   }

//   return (
//     <div className='flex flex-col items-center p-4 gap-4'>
//       <div className='relative w-[640px] h-[480px] border-2 border-dashed rounded-xl overflow-hidden'>
//         <video ref={videoRef} autoPlay playsInline muted className='absolute inset-0 w-full h-full object-cover' />
//         <canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />
//       </div>

//       {!cameraStopped && (
//         <div className='flex gap-4 items-center'>
//           <button onClick={() => setIsRearCamera((prev) => !prev)} className='px-4 py-2 rounded-lg bg-blue-600 text-white'>
//             Flip Camera
//           </button>
//           <button onClick={() => setRingParams({ offsetX: 0, offsetY: 0, rotation: 0 })} className='px-4 py-2 rounded-lg bg-gray-600 text-white'>
//             Reset Ring
//           </button>
//         </div>
//       )}

//       {capturedImages.length > 0 && (
//         <div className='mt-4'>
//           <h3 className='text-lg font-semibold mb-2'>📷 Captured Photos:</h3>
//           <div className='flex gap-4 flex-wrap justify-center'>
//             {capturedImages.map((img, idx) => (
//               <img key={idx} src={img} alt={`capture-${idx}`} className='w-64 rounded-lg shadow-lg' />
//             ))}
//           </div>
//           <button onClick={reset} className='mt-4 px-4 py-2 bg-green-600 text-white rounded-lg'>
//             Restart Camera
//           </button>
//         </div>
//       )}

//       {!cameraStopped && (
//         <div className='flex flex-wrap justify-center gap-4 mt-2'>
//           <div className='flex flex-col items-center'>
//             <label>Move X</label>
//             <input
//               type='range'
//               min='-100'
//               max='100'
//               value={ringParams.offsetX}
//               onChange={(e) => setRingParams((p) => ({ ...p, offsetX: +e.target.value }))}
//             />
//           </div>
//           <div className='flex flex-col items-center'>
//             <label>Move Y</label>
//             <input
//               type='range'
//               min='-100'
//               max='100'
//               value={ringParams.offsetY}
//               onChange={(e) => setRingParams((p) => ({ ...p, offsetY: +e.target.value }))}
//             />
//           </div>
//           <div className='flex flex-col items-center'>
//             <label>Rotate</label>
//             <input
//               type='range'
//               min='-1'
//               max='1'
//               step='0.05'
//               value={ringParams.rotation}
//               onChange={(e) => setRingParams((p) => ({ ...p, rotation: +e.target.value }))}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default RingTryOn

// import { useEffect, useRef, useState } from "react";
// import { Hands } from "@mediapipe/hands";
// import { Camera } from "@mediapipe/camera_utils";
// import ringImg from "./assets/eing2.png";

// const FINGER_MAP = {
//   index: { base: 5, mid: 6 },
//   middle: { base: 9, mid: 10 },
//   ring: { base: 13, mid: 14 },
//   pinky: { base: 17, mid: 18 },
// };

// const RingTryOn = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const cameraRef = useRef(null);

//   const ringImage = useRef(new Image());
//   const [ringLoaded, setRingLoaded] = useState(false);

//   const [selectedFinger, setSelectedFinger] = useState("ring");
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [cameraStopped, setCameraStopped] = useState(false);

//   // smoothing refs
//   const prevCenter = useRef({ x: 0, y: 0 });
//   const stableCounter = useRef(0);
//   const smoothFingerWidth = useRef(0);
//   const prevAngle = useRef(0);

//   useEffect(() => {
//     ringImage.current.src = ringImg;
//     ringImage.current.onload = () => setRingLoaded(true);
//   }, []);

//   useEffect(() => {
//     if (cameraStopped) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     });

//     hands.onResults((results) => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       const lm = results.multiHandLandmarks?.[0];
//       if (!lm) return;

//       const { base, mid } = FINGER_MAP[selectedFinger];
//       const basePt = lm[base];
//       const midPt = lm[mid];

//       // center between base and mid joint
//       const centerX = ((basePt.x + midPt.x) / 2) * canvas.width;
//       const centerY = ((basePt.y + midPt.y) / 2) * canvas.height;

//       // finger width (distance between base and mid)
//       const rawFingerWidth = Math.hypot(
//         (basePt.x - midPt.x) * canvas.width,
//         (basePt.y - midPt.y) * canvas.height
//       );
//       // smooth width
//       smoothFingerWidth.current = smoothFingerWidth.current * 0.8 + rawFingerWidth * 0.2;

//       // angle along the finger axis (base -> mid)
//       let angle = Math.atan2(midPt.y - basePt.y, midPt.x - basePt.x);

//       // ROTATE 90deg to make the ring perpendicular to the finger axis
//       angle += Math.PI / 2;

//       // If your camera is mirrored (front camera) and the ring appears flipped,
//       // try inverting the angle: angle = -angle;  (uncomment if needed)
//       // angle = -angle;

//       // smooth the angle to reduce jitter
//       const smoothedAngle = prevAngle.current * 0.85 + angle * 0.15;
//       prevAngle.current = smoothedAngle;
//       const zTilt = 0.75;

//       // ring size (smaller multiplier for natural look)
//       const ringW = smoothFingerWidth.current * 0.7; // <- tweak this multiplier if you want smaller/bigger
//       const ringH = ringW * (ringImage.current.height / ringImage.current.width) * zTilt;

//       if (ringLoaded) {
//         ctx.save();
//         ctx.translate(centerX, centerY);
//         ctx.rotate(smoothedAngle);
//         ctx.drawImage(ringImage.current, -ringW / 2, -ringH / 2, ringW, ringH);
//         ctx.restore();
//       }

//       // stability detection (same as before)
//       const dx = centerX - prevCenter.current.x;
//       const dy = centerY - prevCenter.current.y;
//       const movement = Math.hypot(dx, dy);

//       if (movement < 3) stableCounter.current += 1;
//       else stableCounter.current = 0;

//       prevCenter.current = { x: centerX, y: centerY };

//       if (stableCounter.current > 30) {
//         stableCounter.current = 0;
//         captureImages();
//       }
//     });

//     const cam = new Camera(video, {
//       onFrame: async () => {
//         await hands.send({ image: video });
//       },
//       width: 500,
//       height: 500,
//     });

//     cam.start();
//     cameraRef.current = cam;

//     return () => cam.stop();
//   }, [selectedFinger, ringLoaded, cameraStopped]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = 500;
//     canvas.height = 500;
//   }, []);

//   const captureImages = async () => {
//     const canvas = canvasRef.current;
//     const imgs = [];

//     for (let i = 0; i < 2; i++) {
//       imgs.push(canvas.toDataURL("image/png"));
//       await new Promise((res) => setTimeout(res, 500));
//     }

//     setCapturedImages(imgs);
//     setCameraStopped(true);
//     cameraRef.current?.stop();
//   };

//   const reset = () => {
//     setCapturedImages([]);
//     setCameraStopped(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-4 gap-4">
//       <div className="relative w-[500px] h-[500px] border rounded-xl overflow-hidden">
//         <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
//         <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
//       </div>

//       {!cameraStopped && (
//         <div className="flex items-center gap-4">
//           <select
//             value={selectedFinger}
//             onChange={(e) => setSelectedFinger(e.target.value)}
//             className="p-2 border rounded-lg"
//           >
//             <option value="index">Index Finger</option>
//             <option value="middle">Middle Finger</option>
//             <option value="ring">Ring Finger</option>
//             <option value="pinky">Pinky Finger</option>
//           </select>
//         </div>
//       )}

//       {capturedImages.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold mb-2">📸 Captured Photos:</h3>
//           <div className="flex gap-4 flex-wrap justify-center">
//             {/* {capturedImages.map((img, idx) => ( */}
//             <img src={capturedImages[0]?.img} className="w-64 rounded-lg shadow-lg" />
//             {/* ))} */}
//           </div>
//           <button onClick={reset} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
//             Restart Camera
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RingTryOn;

// currenty best --- 18/11
// import { useEffect, useRef, useState } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { Camera } from '@mediapipe/camera_utils'
// import ringImg from './assets/eing2.png'

// const FINGER_MAP = {
//   index: { base: 6, mid: 8 },
//   middle: { base: 10, mid: 12 },
//   ring: { base: 14, mid: 16 },
//   // pinky: { base: 18, mid: 20 },
// }

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const cameraRef = useRef(null)
//   const handsRef = useRef(null)

//   const imageRef = useRef(new Image())
//   const selectedFingerRef = useRef('ring')
//   const lastLandmarks = useRef(null)

//   const [selectedFinger, setSelectedFinger] = useState('ring')
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [ringLoaded, setRingLoaded] = useState(false)
//   const [cameraStopped, setCameraStopped] = useState(false)

//   const smoothAngle = useRef(0)

//   useEffect(() => {
//     imageRef.current.src = ringImg
//     imageRef.current.onload = () => setRingLoaded(true)
//   }, [])

//   useEffect(() => {
//     selectedFingerRef.current = selectedFinger
//     if (cameraStopped) redrawRing()
//   }, [selectedFinger])

//   // ✅ Init MediaPipe once
//   useEffect(() => {
//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     handsRef.current = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })

//     handsRef.current.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     handsRef.current.onResults((results) => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

//       const lm = results.multiHandLandmarks?.[0]
//       if (!lm) return

//       lastLandmarks.current = lm
//     })

//     const cam = new Camera(video, {
//       onFrame: async () => {
//         await handsRef.current.send({ image: video })
//       },
//       width: 500,
//       height: 500,
//       facingMode: 'environment',
//     })

//     cam.start()
//     cameraRef.current = cam
//     return () => cam.stop()
//   }, [])

//   useEffect(() => {
//     canvasRef.current.width = 500
//     canvasRef.current.height = 500
//   }, [])

//   const capturePhoto = () => {
//     const img = canvasRef.current.toDataURL('image/png')
//     setCapturedImage(img)
//     setCameraStopped(true)
//     cameraRef.current?.stop()
//     redrawRing(true)
//   }

//   const redrawRing = (force = false) => {
//     if (!cameraStopped && !force) return
//     if (!lastLandmarks.current || !ringLoaded || !capturedImage) return

//     const lm = lastLandmarks.current
//     const ctx = canvasRef.current.getContext('2d')
//     const canvas = canvasRef.current

//     const img = new Image()
//     img.src = capturedImage

//     img.onload = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

//       drawRing(lm)
//     }
//   }

//   // Replace your existing drawRing() with this
//   const drawRing = (lm) => {
//     const finger = selectedFingerRef.current
//     const ctx = canvasRef.current.getContext('2d')
//     const { base, mid } = FINGER_MAP[finger]

//     const basePt = lm[base]
//     const midPt = lm[mid]

//     // ✅ FINAL real knuckle placement (moved closer to knuckle)
//     const POSITION_MAP = {
//       index: 0.35,
//       middle: 0.38,
//       ring: 0.38,
//     }

//     const t = POSITION_MAP[finger]

//     const x = (basePt.x + (midPt.x - basePt.x) * t) * canvasRef.current.width
//     const y = (basePt.y + (midPt.y - basePt.y) * t) * canvasRef.current.height

//     // ✅ Proper width
//     const width = Math.hypot((basePt.x - midPt.x) * canvasRef.current.width, (basePt.y - midPt.y) * canvasRef.current.height)

//     // ✅ Correct orientation with index finger angle adjustment
//     let angle = Math.atan2(midPt.y - basePt.y, midPt.x - basePt.x) + Math.PI / 2

//     // Fix index finger angle (reduce rightward tilt)
//     if (finger === 'index') {
//       angle -= 0.13 // Adjust by ~8.6 degrees counterclockwise
//     }

//     smoothAngle.current = smoothAngle.current * 0.75 + angle * 0.25

//     if (!ringLoaded) return

//     // ✅ Finger-based sizing
//     const SIZE_MAP = {
//       index: 0.55,
//       middle: 0.55,
//       ring: 0.55,
//     }

//     const ringW = width * SIZE_MAP[finger]
//     const ringH = ringW * (imageRef.current.height / imageRef.current.width)

//     ctx.save()
//     ctx.translate(x, y)
//     ctx.rotate(smoothAngle.current)
//     ctx.drawImage(imageRef.current, -ringW / 2, -ringH / 2, ringW, ringH)
//     ctx.restore()
//   }

//   const reset = () => {
//     setCapturedImage(null)
//     setCameraStopped(false)
//     cameraRef.current?.start()
//   }

//   return (
//     <div className='flex flex-col items-center gap-3 p-4'>
//       <div className='relative w-[500px] h-[500px] border rounded-xl'>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           className='hidden'
//           style={{
//             display: 'none',
//           }}
//         />
//         <canvas ref={canvasRef} className='w-full h-full' />
//       </div>

//       {!cameraStopped && (
//         <button onClick={capturePhoto} className='bg-blue-600 text-white p-2 rounded'>
//           Capture
//         </button>
//       )}

//       {cameraStopped && (
//         <>
//           <select className='border p-2' value={selectedFinger} onChange={(e) => setSelectedFinger(e.target.value)}>
//             <option value='index'>Index</option>
//             <option value='middle'>Middle</option>
//             <option value='ring'>Ring</option>
//           </select>

//           <button onClick={reset} className='bg-green-600 text-white p-2 rounded'>
//             Restart
//           </button>
//         </>
//       )}
//     </div>
//   )
// }

// export default RingTryOn

// drag and drop ring horizontally
import { useEffect, useRef, useState } from 'react'
import { Hands } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'
import ringImg from './assets/eing2.png'

const FINGER_MAP = {
  index: { base: 6, mid: 8 },
  middle: { base: 10, mid: 12 },
  ring: { base: 14, mid: 16 },
}

const RingTryOn = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraRef = useRef(null)
  const handsRef = useRef(null)

  const imageRef = useRef(new Image())
  const selectedFingerRef = useRef('ring')
  const lastLandmarks = useRef(null)

  const [selectedFinger, setSelectedFinger] = useState('ring')
  const [capturedImage, setCapturedImage] = useState(null)
  const [ringLoaded, setRingLoaded] = useState(false)
  const [cameraStopped, setCameraStopped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const smoothAngle = useRef(0)

  useEffect(() => {
    // Use a placeholder ring if image fails to load
    imageRef.current.src = ringImg
    imageRef.current.onload = () => {
      console.log('Ring image loaded successfully')
      setRingLoaded(true)
    }
    imageRef.current.onerror = () => {
      console.error('Failed to load ring image, using fallback')
      // Create a simple colored ring as fallback
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')

      // Draw gold ring
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(100, 100, 80, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(100, 100, 60, 0, Math.PI * 2)
      ctx.fill()

      imageRef.current.src = canvas.toDataURL()
      setRingLoaded(true)
    }
  }, [])

  useEffect(() => {
    selectedFingerRef.current = selectedFinger
    if (cameraStopped) redrawRing()
  }, [selectedFinger])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    handsRef.current = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    handsRef.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    })

    handsRef.current.onResults((results) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

      const lm = results.multiHandLandmarks?.[0]
      if (!lm) return

      lastLandmarks.current = lm

      // Draw ring in real-time
      if (!cameraStopped && ringLoaded) {
        drawRing(lm)
      }
    })

    const cam = new Camera(video, {
      onFrame: async () => {
        await handsRef.current.send({ image: video })
      },
      width: 500,
      height: 500,
      facingMode: 'environment',
    })

    cam.start()
    cameraRef.current = cam
    return () => cam.stop()
  }, [])

  useEffect(() => {
    canvasRef.current.width = 500
    canvasRef.current.height = 500
  }, [])

  const capturePhoto = () => {
    if (!lastLandmarks.current) {
      console.error('No hand detected')
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Capture current frame
    const img = canvas.toDataURL('image/png')
    setCapturedImage(img)
    setCameraStopped(true)
    cameraRef.current?.stop()

    // Immediately redraw with ring
    setTimeout(() => {
      const imgElement = new Image()
      imgElement.src = img
      imgElement.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height)
        if (lastLandmarks.current && ringLoaded) {
          drawRing(lastLandmarks.current)
        }
      }
    }, 100)
  }

  const redrawRing = (force = false) => {
    if (!cameraStopped && !force) return
    if (!lastLandmarks.current || !ringLoaded) return

    const lm = lastLandmarks.current
    const ctx = canvasRef.current.getContext('2d')
    const canvas = canvasRef.current

    if (capturedImage) {
      const img = new Image()
      img.src = capturedImage

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawRing(lm)
      }
    } else {
      // If no captured image yet, just draw the ring
      drawRing(lm)
    }
  }

  const drawRing = (lm) => {
    const finger = selectedFingerRef.current
    const ctx = canvasRef.current.getContext('2d')
    const { base, mid } = FINGER_MAP[finger]

    const basePt = lm[base]
    const midPt = lm[mid]

    const POSITION_MAP = {
      index: 0.35,
      middle: 0.38,
      ring: 0.38,
    }

    const t = POSITION_MAP[finger]

    const x = (basePt.x + (midPt.x - basePt.x) * t) * canvasRef.current.width
    const y = (basePt.y + (midPt.y - basePt.y) * t) * canvasRef.current.height

    const width = Math.hypot((basePt.x - midPt.x) * canvasRef.current.width, (basePt.y - midPt.y) * canvasRef.current.height)

    let angle = Math.atan2(midPt.y - basePt.y, midPt.x - basePt.x) + Math.PI / 2

    if (finger === 'index') {
      angle -= 0.13
    }

    smoothAngle.current = smoothAngle.current * 0.75 + angle * 0.25

    if (!ringLoaded) return

    const SIZE_MAP = {
      index: 0.55,
      middle: 0.55,
      ring: 0.55,
    }

    const ringW = width * SIZE_MAP[finger]
    const ringH = ringW * (imageRef.current.height / imageRef.current.width)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(smoothAngle.current)
    ctx.drawImage(imageRef.current, -ringW / 2, -ringH / 2, ringW, ringH)
    ctx.restore()
  }

  const getRingPosition = (finger, lm) => {
    const { base, mid } = FINGER_MAP[finger]
    const basePt = lm[base]
    const midPt = lm[mid]

    const POSITION_MAP = {
      index: 0.35,
      middle: 0.38,
      ring: 0.38,
    }

    const t = POSITION_MAP[finger]
    const x = (basePt.x + (midPt.x - basePt.x) * t) * canvasRef.current.width
    const y = (basePt.y + (midPt.y - basePt.y) * t) * canvasRef.current.height

    return { x, y }
  }

  const findClosestFinger = (mouseX, mouseY) => {
    if (!lastLandmarks.current) return null

    const lm = lastLandmarks.current
    let minDist = Infinity
    let closestFinger = null

    Object.keys(FINGER_MAP).forEach((finger) => {
      const pos = getRingPosition(finger, lm)
      const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y)

      if (dist < minDist) {
        minDist = dist
        closestFinger = finger
      }
    })

    return minDist < 80 ? closestFinger : null
  }

  const handleMouseDown = (e) => {
    if (!cameraStopped || !lastLandmarks.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
    const dist = Math.hypot(mouseX - currentPos.x, mouseY - currentPos.y)

    if (dist < 50) {
      setIsDragging(true)
      setDragStart({ x: mouseX, y: mouseY })
      canvasRef.current.style.cursor = 'grabbing'
    }
  }

  const handleMouseMove = (e) => {
    if (!cameraStopped || !lastLandmarks.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    if (isDragging) {
      const closestFinger = findClosestFinger(mouseX, mouseY)
      if (closestFinger && closestFinger !== selectedFingerRef.current) {
        setSelectedFinger(closestFinger)
      }
    } else {
      const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
      const dist = Math.hypot(mouseX - currentPos.x, mouseY - currentPos.y)
      canvasRef.current.style.cursor = dist < 50 ? 'grab' : 'default'
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    canvasRef.current.style.cursor = 'default'
  }

  const handleTouchStart = (e) => {
    if (!cameraStopped || !lastLandmarks.current) return
    e.preventDefault()

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const touchX = touch.clientX - rect.left
    const touchY = touch.clientY - rect.top

    const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
    const dist = Math.hypot(touchX - currentPos.x, touchY - currentPos.y)

    if (dist < 50) {
      setIsDragging(true)
      setDragStart({ x: touchX, y: touchY })
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !lastLandmarks.current) return
    e.preventDefault()

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const touchX = touch.clientX - rect.left
    const touchY = touch.clientY - rect.top

    const closestFinger = findClosestFinger(touchX, touchY)
    if (closestFinger && closestFinger !== selectedFingerRef.current) {
      setSelectedFinger(closestFinger)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const reset = () => {
    setCapturedImage(null)
    setCameraStopped(false)
    setIsDragging(false)
    cameraRef.current?.start()
  }

  return (
    <div className='flex flex-col items-center gap-3 p-4'>
      <div className='relative w-[500px] h-[500px] border rounded-xl'>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className='hidden'
          style={{
            display: 'none',
          }}
        />
        <canvas
          ref={canvasRef}
          className='w-full h-full'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        />
      </div>

      {!cameraStopped && (
        <button onClick={capturePhoto} className='bg-blue-600 text-white px-4 py-2 rounded'>
          Capture Photo
        </button>
      )}

      {cameraStopped && (
        <div className='flex gap-3'>
          <div className='bg-gray-100 px-4 py-2 rounded border'>
            Current: <span className='font-bold capitalize'>{selectedFinger}</span> Finger
          </div>
          <button onClick={reset} className='bg-green-600 text-white px-4 py-2 rounded'>
            Restart Camera
          </button>
        </div>
      )}

      {cameraStopped && <div className='text-sm text-gray-600 text-center'>💡 Click and drag the ring to move it between fingers</div>}
    </div>
  )
}

export default RingTryOn

// drag and drop ring vertically
// import { useEffect, useRef, useState } from 'react'
// import { Hands } from '@mediapipe/hands'
// import { Camera } from '@mediapipe/camera_utils'
// import ringImg from './assets/eing2.png'

// const FINGER_MAP = {
//   index: { base: 6, mid: 8 },
//   middle: { base: 10, mid: 12 },
//   ring: { base: 14, mid: 16 },
// }

// const RingTryOn = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const cameraRef = useRef(null)
//   const handsRef = useRef(null)

//   const imageRef = useRef(new Image())
//   const selectedFingerRef = useRef('ring')
//   const lastLandmarks = useRef(null)

//   const [selectedFinger, setSelectedFinger] = useState('ring')
//   const [capturedImage, setCapturedImage] = useState(null)
//   const [ringLoaded, setRingLoaded] = useState(false)
//   const [cameraStopped, setCameraStopped] = useState(false)
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [ringPosition, setRingPosition] = useState({
//     index: 0.25,
//     middle: 0.28,
//     ring: 0.28,
//   })

//   const smoothAngle = useRef(0)

//   useEffect(() => {
//     // Use a placeholder ring if image fails to load
//     imageRef.current.src = ringImg
//     imageRef.current.onload = () => {
//       console.log('Ring image loaded successfully')
//       setRingLoaded(true)
//     }
//     imageRef.current.onerror = () => {
//       console.error('Failed to load ring image, using fallback')
//       // Create a simple colored ring as fallback
//       const canvas = document.createElement('canvas')
//       canvas.width = 200
//       canvas.height = 200
//       const ctx = canvas.getContext('2d')

//       // Draw gold ring
//       ctx.fillStyle = '#FFD700'
//       ctx.beginPath()
//       ctx.arc(100, 100, 80, 0, Math.PI * 2)
//       ctx.fill()
//       ctx.fillStyle = '#000'
//       ctx.beginPath()
//       ctx.arc(100, 100, 60, 0, Math.PI * 2)
//       ctx.fill()

//       imageRef.current.src = canvas.toDataURL()
//       setRingLoaded(true)
//     }
//   }, [])

//   useEffect(() => {
//     selectedFingerRef.current = selectedFinger
//     if (cameraStopped) redrawRing()
//   }, [selectedFinger])

//   useEffect(() => {
//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     handsRef.current = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     })

//     handsRef.current.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.7,
//     })

//     handsRef.current.onResults((results) => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

//       const lm = results.multiHandLandmarks?.[0]
//       if (!lm) return

//       lastLandmarks.current = lm

//       // Draw ring in real-time
//       if (!cameraStopped && ringLoaded) {
//         drawRing(lm)
//       }
//     })

//     const cam = new Camera(video, {
//       onFrame: async () => {
//         await handsRef.current.send({ image: video })
//       },
//       width: 500,
//       height: 500,
//       facingMode: 'environment',
//     })

//     cam.start()
//     cameraRef.current = cam
//     return () => cam.stop()
//   }, [])

//   useEffect(() => {
//     canvasRef.current.width = 500
//     canvasRef.current.height = 500
//   }, [])

//   const capturePhoto = () => {
//     if (!lastLandmarks.current) {
//       console.error('No hand detected')
//       return
//     }

//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     // Capture current frame
//     const img = canvas.toDataURL('image/png')
//     setCapturedImage(img)
//     setCameraStopped(true)
//     cameraRef.current?.stop()

//     // Immediately redraw with ring
//     setTimeout(() => {
//       const imgElement = new Image()
//       imgElement.src = img
//       imgElement.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height)
//         if (lastLandmarks.current && ringLoaded) {
//           drawRing(lastLandmarks.current)
//         }
//       }
//     }, 100)
//   }

//   const redrawRing = (force = false) => {
//     if (!cameraStopped && !force) return
//     if (!lastLandmarks.current || !ringLoaded) return

//     const lm = lastLandmarks.current
//     const ctx = canvasRef.current.getContext('2d')
//     const canvas = canvasRef.current

//     if (capturedImage) {
//       const img = new Image()
//       img.src = capturedImage

//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
//         drawRing(lm)
//       }
//     } else {
//       // If no captured image yet, just draw the ring
//       drawRing(lm)
//     }
//   }

//   const drawRing = (lm) => {
//     const finger = selectedFingerRef.current
//     const ctx = canvasRef.current.getContext('2d')
//     const { base, mid } = FINGER_MAP[finger]

//     const basePt = lm[base]
//     const midPt = lm[mid]

//     const t = ringPosition[finger]

//     const x = (basePt.x + (midPt.x - basePt.x) * t) * canvasRef.current.width
//     const y = (basePt.y + (midPt.y - basePt.y) * t) * canvasRef.current.height

//     const width = Math.hypot((basePt.x - midPt.x) * canvasRef.current.width, (basePt.y - midPt.y) * canvasRef.current.height)

//     let angle = Math.atan2(midPt.y - basePt.y, midPt.x - basePt.x) + Math.PI / 2

//     if (finger === 'index') {
//       angle -= 0.13
//     }

//     smoothAngle.current = smoothAngle.current * 0.75 + angle * 0.25

//     if (!ringLoaded) return

//     const SIZE_MAP = {
//       index: 0.55,
//       middle: 0.55,
//       ring: 0.55,
//     }

//     const ringW = width * SIZE_MAP[finger]
//     const ringH = ringW * (imageRef.current.height / imageRef.current.width)

//     ctx.save()
//     ctx.translate(x, y)
//     ctx.rotate(smoothAngle.current)
//     ctx.drawImage(imageRef.current, -ringW / 2, -ringH / 2, ringW, ringH)
//     ctx.restore()
//   }

//   const getRingPosition = (finger, lm) => {
//     const { base, mid } = FINGER_MAP[finger]
//     const basePt = lm[base]
//     const midPt = lm[mid]

//     const t = ringPosition[finger]
//     const x = (basePt.x + (midPt.x - basePt.x) * t) * canvasRef.current.width
//     const y = (basePt.y + (midPt.y - basePt.y) * t) * canvasRef.current.height

//     return { x, y }
//   }

//   const findClosestFinger = (mouseX, mouseY) => {
//     if (!lastLandmarks.current) return null

//     const lm = lastLandmarks.current
//     let minDist = Infinity
//     let closestFinger = null

//     Object.keys(FINGER_MAP).forEach((finger) => {
//       const pos = getRingPosition(finger, lm)
//       const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y)

//       if (dist < minDist) {
//         minDist = dist
//         closestFinger = finger
//       }
//     })

//     return minDist < 80 ? closestFinger : null
//   }

//   const adjustRingPositionOnFinger = (mouseX, mouseY) => {
//     if (!lastLandmarks.current) return

//     const finger = selectedFingerRef.current
//     const lm = lastLandmarks.current
//     const { base, mid } = FINGER_MAP[finger]

//     const basePt = lm[base]
//     const midPt = lm[mid]

//     // Calculate finger line
//     const fingerX1 = basePt.x * canvasRef.current.width
//     const fingerY1 = basePt.y * canvasRef.current.height
//     const fingerX2 = midPt.x * canvasRef.current.width
//     const fingerY2 = midPt.y * canvasRef.current.height

//     // Project mouse position onto finger line
//     const fingerDx = fingerX2 - fingerX1
//     const fingerDy = fingerY2 - fingerY1
//     const fingerLength = Math.hypot(fingerDx, fingerDy)

//     const mouseDx = mouseX - fingerX1
//     const mouseDy = mouseY - fingerY1

//     // Calculate projection (t parameter)
//     let t = (mouseDx * fingerDx + mouseDy * fingerDy) / (fingerLength * fingerLength)

//     // Clamp between 0.1 (base) and 0.7 (near tip)
//     t = Math.max(-0.4, Math.min(0.8, t))

//     setRingPosition((prev) => ({
//       ...prev,
//       [finger]: t,
//     }))

//     redrawRing(true)
//   }

//   const handleMouseDown = (e) => {
//     if (!cameraStopped || !lastLandmarks.current) return

//     const rect = canvasRef.current.getBoundingClientRect()
//     const mouseX = e.clientX - rect.left
//     const mouseY = e.clientY - rect.top

//     const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
//     const dist = Math.hypot(mouseX - currentPos.x, mouseY - currentPos.y)

//     if (dist < 50) {
//       setIsDragging(true)
//       setDragStart({ x: mouseX, y: mouseY })
//       canvasRef.current.style.cursor = 'grabbing'
//     }
//   }

//   const handleMouseMove = (e) => {
//     if (!cameraStopped || !lastLandmarks.current) return

//     const rect = canvasRef.current.getBoundingClientRect()
//     const mouseX = e.clientX - rect.left
//     const mouseY = e.clientY - rect.top

//     if (isDragging) {
//       // Check if dragging to another finger
//       const closestFinger = findClosestFinger(mouseX, mouseY)
//       if (closestFinger && closestFinger !== selectedFingerRef.current) {
//         setSelectedFinger(closestFinger)
//       } else {
//         // Drag along current finger
//         adjustRingPositionOnFinger(mouseX, mouseY)
//       }
//     } else {
//       const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
//       const dist = Math.hypot(mouseX - currentPos.x, mouseY - currentPos.y)
//       canvasRef.current.style.cursor = dist < 50 ? 'grab' : 'default'
//     }
//   }

//   const handleMouseUp = () => {
//     setIsDragging(false)
//     canvasRef.current.style.cursor = 'default'
//   }

//   const handleTouchStart = (e) => {
//     if (!cameraStopped || !lastLandmarks.current) return
//     e.preventDefault()

//     const rect = canvasRef.current.getBoundingClientRect()
//     const touch = e.touches[0]
//     const touchX = touch.clientX - rect.left
//     const touchY = touch.clientY - rect.top

//     const currentPos = getRingPosition(selectedFingerRef.current, lastLandmarks.current)
//     const dist = Math.hypot(touchX - currentPos.x, touchY - currentPos.y)

//     if (dist < 50) {
//       setIsDragging(true)
//       setDragStart({ x: touchX, y: touchY })
//     }
//   }

//   const handleTouchMove = (e) => {
//     if (!isDragging || !lastLandmarks.current) return
//     e.preventDefault()

//     const rect = canvasRef.current.getBoundingClientRect()
//     const touch = e.touches[0]
//     const touchX = touch.clientX - rect.left
//     const touchY = touch.clientY - rect.top

//     const closestFinger = findClosestFinger(touchX, touchY)
//     if (closestFinger && closestFinger !== selectedFingerRef.current) {
//       setSelectedFinger(closestFinger)
//     } else {
//       adjustRingPositionOnFinger(touchX, touchY)
//     }
//   }

//   const handleTouchEnd = () => {
//     setIsDragging(false)
//   }

//   const reset = () => {
//     setCapturedImage(null)
//     setCameraStopped(false)
//     setIsDragging(false)
//     cameraRef.current?.start()
//   }

//   return (
//     <div className='flex flex-col items-center gap-3 p-4'>
//       <div className='relative w-[500px] h-[500px] border rounded-xl'>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           className='hidden'
//           style={{
//             display: 'none',
//           }}
//         />
//         <canvas
//           ref={canvasRef}
//           className='w-full h-full'
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           style={{ touchAction: 'none' }}
//         />
//       </div>

//       {!cameraStopped && (
//         <button onClick={capturePhoto} className='bg-blue-600 text-white px-4 py-2 rounded'>
//           Capture Photo
//         </button>
//       )}

//       {cameraStopped && (
//         <div className='flex gap-3'>
//           <div className='bg-gray-100 px-4 py-2 rounded border'>
//             Current: <span className='font-bold capitalize'>{selectedFinger}</span> Finger
//           </div>
//           <button onClick={reset} className='bg-green-600 text-white px-4 py-2 rounded'>
//             Restart Camera
//           </button>
//         </div>
//       )}

//       {cameraStopped && <div className='text-sm text-gray-600 text-center'>💡 Click and drag the ring to move between fingers or slide up/down</div>}
//     </div>
//   )
// }

// export default RingTryOn
