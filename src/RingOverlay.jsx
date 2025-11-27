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


import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

// Usage notes (put at top of file):
// 1) npm install @mediapipe/hands @mediapipe/camera_utils
// 2) Put a ring PNG (transparent background) in ./assets/ring.png and update the import path below
// 3) This component captures a single photo (not live) and runs MediaPipe Hands on that still image.
// 4) The ring is draggable / snappable to fingers (index, middle, ring). You can also adjust rotation & scale.

import ringPng from "./assets/eing2.png";// update path as needed

const FINGER_MAP = {
  index: { base: 5, mid: 6 },
  middle: { base: 9, mid: 10 },
  ring: { base: 13, mid: 14 },
};

const RingTryOn = () => {
  const videoRef = useRef(null); // temporary camera video for capture
  const photoCanvasRef = useRef(null); // captured photo canvas
  const overlayCanvasRef = useRef(null); // overlay where ring is drawn
  const ringImgRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [fingers, setFingers] = useState(null); // landmarks after detection
  const [selectedFinger, setSelectedFinger] = useState("ring");

  // ring transform state (in canvas coordinates)
  const [ringState, setRingState] = useState({ x: 200, y: 200, scale: 1, rotation: 0 });
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // load ring image
  useEffect(() => {
    const img = new Image();
    img.src = ringPng;
    img.onload = () => (ringImgRef.current = img);
  }, []);

  // helper to start camera and capture one frame
  const startAndCapture = async () => {
    setIsCapturing(true);
    setHasPhoto(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // draw a frame into the photo canvas
      const v = videoRef.current;
      const canvas = photoCanvasRef.current;
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

      // stop camera
      const tracks = stream.getTracks();
      tracks.forEach((t) => t.stop());
      v.srcObject = null;

      setHasPhoto(true);
      // run hand detection on that captured image
      await runHandDetection(canvas);
    } catch (e) {
      console.error(e);
      alert("Could not access camera. Try uploading an image instead.");
    } finally {
      setIsCapturing(false);
    }
  };

  // upload image handler
  const onUpload = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
      const canvas = photoCanvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setHasPhoto(true);
      await runHandDetection(canvas);
    };
    img.src = URL.createObjectURL(file);
  };

  // run MediaPipe Hands on a captured canvas
  const runHandDetection = async (canvas) => {
    // load MediaPipe Hands
    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    const resultsPromise = new Promise((resolve) => {
      hands.onResults((results) => {
        resolve(results);
      });
    });

    // send the captured canvas as an image
    await hands.send({ image: canvas });
    const results = await resultsPromise;

    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      alert("No hand detected. Try a clearer photo or different orientation.");
      setFingers(null);
      drawOverlay();
      return;
    }

    // landmarks are normalized [0..1] relative to image size
    const landmarks = results.multiHandLandmarks[0];
    const w = canvas.width;
    const h = canvas.height;
    const points = landmarks.map((lm) => ({ x: lm.x * w, y: lm.y * h }));
    setFingers(points);

    // initialize ring near selected finger
    const init = computeFingerTransform(points, selectedFinger);
    if (init) setRingState(init);

    drawOverlay(points, init);
  };

  // compute center / scale / rotation for a finger (returns ringState-like)
  const computeFingerTransform = (points, fingerKey) => {
    if (!points) return null;
    const map = FINGER_MAP[fingerKey];
    if (!map) return null;
    const base = points[map.base];
    const mid = points[map.mid];
    if (!base || !mid) return null;
    const cx = (base.x + mid.x) / 2;
    const cy = (base.y + mid.y) / 2;
    const dx = mid.x - base.x;
    const dy = mid.y - base.y;
    const angle = Math.atan2(dy, dx);
    const dist = Math.hypot(dx, dy);
    // scale heuristic: distance to pixels -> ring size
    const scale = Math.max(0.5, Math.min(2.5, dist / 60));
    return { x: cx, y: cy, scale, rotation: angle };
  };

  // draw overlay: photo + optional landmarks + ring
  const drawOverlay = (points = fingers, ring = ringState) => {
    const photo = photoCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!photo || !overlay) return;
    overlay.width = photo.width;
    overlay.height = photo.height;

    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // draw semi-transparent landmarks for debugging
    if (points) {
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.fillStyle = "rgba(255,0,0,0.2)";
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // draw ring
    const img = ringImgRef.current;
    if (!img) return;
    ctx.save();
    ctx.translate(ring.x, ring.y);
    ctx.rotate(ring.rotation);
    const baseSize = Math.min(overlay.width, overlay.height) * 0.12; // base ring size
    const w = baseSize * ring.scale;
    const h = w;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  };

  // rerender overlay when ringState or fingers change
  useEffect(() => {
    drawOverlay(fingers, ringState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingers, ringState]);

  // drag handlers
  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;

    const getEventPos = (ev) => {
      const rect = overlay.getBoundingClientRect();
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onDown = (ev) => {
      ev.preventDefault();
      const pos = getEventPos(ev);
      // check if pos within ring bounding box
      const dx = pos.x - ringState.x;
      const dy = pos.y - ringState.y;
      const dist = Math.hypot(dx, dy);
      const hitRadius = 80 * ringState.scale; // generous
      if (dist <= hitRadius) {
        draggingRef.current = true;
        dragOffsetRef.current = { x: dx, y: dy };
      }
    };
    const onMove = (ev) => {
      if (!draggingRef.current) return;
      const pos = getEventPos(ev);
      setRingState((s) => ({ ...s, x: pos.x - dragOffsetRef.current.x, y: pos.y - dragOffsetRef.current.y }));
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      // snap to nearest finger if close
      if (fingers) {
        let nearest = null;
        let nearestDist = Infinity;
        Object.keys(FINGER_MAP).forEach((key) => {
          const tm = computeFingerTransform(fingers, key);
          if (!tm) return;
          const d = Math.hypot(tm.x - ringState.x, tm.y - ringState.y);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = { key, tm };
          }
        });
        if (nearest && nearestDist < 120) {
          // snap
          setSelectedFinger(nearest.key);
          setRingState(nearest.tm);
        }
      }
    };

    overlay.addEventListener("mousedown", onDown);
    overlay.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      overlay.removeEventListener("mousedown", onDown);
      overlay.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringState, fingers]);

  // UI interactions for finger selection/adjustments
  const onFingerChange = (ev) => {
    const key = ev.target.value;
    setSelectedFinger(key);
    if (fingers) {
      const tm = computeFingerTransform(fingers, key);
      if (tm) setRingState(tm);
    }
  };

  const onRotateChange = (ev) => setRingState((s) => ({ ...s, rotation: parseFloat(ev.target.value) }));
  const onScaleChange = (ev) => setRingState((s) => ({ ...s, scale: parseFloat(ev.target.value) }));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-3">Virtual Ring Try-On</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="mb-2 flex gap-2">
            <button
              onClick={startAndCapture}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isCapturing}
            >
              {isCapturing ? "Capturing..." : "Take Photo"}
            </button>
            <label className="px-3 py-2 bg-gray-200 rounded cursor-pointer">
              Upload Image
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
            <select value={selectedFinger} onChange={onFingerChange} className="px-3 py-2 rounded border">
              <option value="index">Index</option>
              <option value="middle">Middle</option>
              <option value="ring">Ring</option>
            </select>
          </div>

          <div className="relative border rounded" style={{ width: "100%", overflow: "hidden" }}>
            <canvas ref={photoCanvasRef} style={{ display: hasPhoto ? "block" : "none", width: "100%" }} />
            <canvas
              ref={overlayCanvasRef}
              style={{ position: "absolute", left: 0, top: 0, pointerEvents: "auto", width: "100%", height: "100%" }}
            />
            {!hasPhoto && (
              <div className="p-8 text-center text-gray-500">No photo yet — take a photo or upload an image.</div>
            )}
          </div>

          {/* hidden video element for capture */}
          <video ref={videoRef} style={{ display: "none" }} />
        </div>

        <div style={{ width: 320 }}>
          <div className="mb-4">
            <label className="block text-sm">Rotate</label>
            <input
              type="range"
              min={-3.14}
              max={3.14}
              step={0.01}
              value={ringState.rotation}
              onChange={onRotateChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm">Scale</label>
            <input type="range" min={0.3} max={3} step={0.01} value={ringState.scale} onChange={onScaleChange} />
          </div>

          <div className="mb-4">
            <button
              onClick={() => {
                // reset transform
                setRingState({ x: 200, y: 200, scale: 1, rotation: 0 });
              }}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Reset Ring
            </button>
          </div>

          <div className="text-xs text-gray-600">
            Tip: Drag the ring to move it. Drop near another finger to snap. If MediaPipe fails to detect the hand, try a clearer photo with fingers separated from the palm.
          </div>
        </div>
      </div>
    </div>
  );
}

export default RingTryOn;






