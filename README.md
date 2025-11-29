# 💍 Virtual Ring Try-On

An interactive web application that allows users to virtually try on rings using real-time hand tracking and augmented reality visualization.

## ✨ Features

- **Real-time Hand Detection**: Uses MediaPipe Hands for accurate finger tracking
- **Multi-Finger Support**: Try rings on index, middle, ring, or pinky fingers
- **Interactive Positioning**: Drag and adjust ring position along any finger
- **Photo Capture**: Capture and save your virtual try-on photos
- **Realistic Rendering**: High-quality ring visualization with shadows and lighting
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Full touch gesture support for mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A device with a camera
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd virtual-ring-tryon
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Add your ring image:

   - Place your ring image in the `src/assets/` folder
   - Name it `eing2.png` (or update the import path in the code)

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

### External Libraries (CDN)

- MediaPipe Hands
- MediaPipe Camera Utils

## 🎮 How to Use

1. **Allow Camera Access**: Grant camera permissions when prompted
2. **Show Your Hand**: Position your hand clearly in front of the camera
3. **Capture Photo**: Click the "📸 Capture Photo" button to freeze the frame
4. **Adjust Ring**:
   - Drag the ring to move it between fingers
   - Slide along a finger to adjust position
   - The ring automatically fits the finger width
5. **Try Different Fingers**: Drag to any finger (index, middle, ring, pinky)
6. **Restart**: Click "🔄 Restart Camera" to try again

## 🎨 Customization

### Canvas Size

Adjust the canvas resolution and display size:

```javascript
const CANVAS_SIZE = 1600; // Internal resolution (higher = better quality)
const CONTAINER_SIZE_CLASS = "max-w-[900px]"; // Display size
```

### Ring Size

Modify ring size multiplier:

```javascript
const ringW = width * 1.8; // Change 1.8 to adjust ring size
```

### Ring Shadow

Customize shadow appearance:

```javascript
ctx.shadowColor = "rgba(0,0,0,0.25)"; // Shadow darkness
ctx.shadowBlur = 30; // Shadow blur radius
ctx.shadowOffsetX = 2; // Horizontal offset
ctx.shadowOffsetY = 6; // Vertical offset
```

### Finger Detection Sensitivity

Adjust detection confidence:

```javascript
hands.setOptions({
  minDetectionConfidence: 0.7, // 0.0 to 1.0
  minTrackingConfidence: 0.7, // 0.0 to 1.0
});
```

## 🔧 Technical Details

### Architecture

- **Frontend Framework**: React with Hooks
- **Hand Tracking**: MediaPipe Hands ML model
- **Rendering**: HTML5 Canvas API
- **State Management**: React useState and useRef

### Key Components

#### Hand Detection

- Detects up to 1 hand at a time
- Tracks 21 hand landmarks in real-time
- Runs at 30+ FPS on modern devices

#### Ring Rendering

- Uses 2D canvas transformation for rotation
- Smooth angle interpolation for stable rendering
- Automatic size scaling based on finger width

#### Finger Mapping

```javascript
FINGER_MAP = {
  index: { base: 5, mid: 6, tip: 8 },
  middle: { base: 9, mid: 10, tip: 12 },
  ring: { base: 13, mid: 14, tip: 16 },
  pinky: { base: 17, mid: 18, tip: 20 },
};
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 14.3+)
- ⚠️ Requires HTTPS for camera access (except localhost)

## 🐛 Troubleshooting

### Camera Not Working

- Ensure camera permissions are granted
- Check if another app is using the camera
- Try refreshing the page
- Use HTTPS or localhost

### Hand Not Detected

- Ensure good lighting
- Keep hand within camera frame
- Show palm facing camera
- Avoid cluttered backgrounds

### Performance Issues

- Close other tabs/applications
- Reduce canvas size in code
- Use a device with better hardware
- Ensure good internet connection for CDN resources

## 🎯 Future Enhancements

- [ ] Multiple ring designs
- [ ] Custom ring upload
- [ ] Ring size recommendation
- [ ] Social media sharing
- [ ] AR filters and effects
- [ ] Save favorites
- [ ] Compare multiple rings

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the maintainer.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for hand tracking technology
- [React](https://react.dev/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

Made with ❤️ and React
