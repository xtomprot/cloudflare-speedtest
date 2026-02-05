# Cloudflare Speedtest Demo Application

A professional Vue.js 3 single-page application that demonstrates the capabilities of the [@cloudflare/speedtest](https://www.npmjs.com/package/@cloudflare/speedtest) SDK. Test your network performance against Cloudflare's edge network with real-time metrics and quality scores.

## Features

- ✅ **Real-time Metrics**: Watch download/upload speeds, latency, jitter, and packet loss update live
- ✅ **Animated Progress Bars**: Visual indicators showing test progress
- ✅ **Quality Scores**: Get quality ratings for streaming, gaming, and real-time communications
- ✅ **Color-coded Results**: Visual badges showing network quality (bad/poor/average/good/great)
- ✅ **Manual Controls**: Start and stop tests on demand
- ✅ **Component-based Architecture**: Clean Vue.js 3 Composition API structure
- ✅ **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next-generation frontend build tool
- **@cloudflare/speedtest** - Official Cloudflare network testing SDK
- **CSS3** - Modern styling with animations and gradients

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Vue.js 3
- @cloudflare/speedtest SDK
- Vite build tool
- @vitejs/plugin-vue

### 2. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or next available port) and automatically open in your default browser.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## Project Structure

```
cloudflare-speedtest/
├── src/
│   ├── components/
│   │   ├── AppHeader.vue          # Header component
│   │   ├── AppFooter.vue          # Footer component
│   │   ├── SpeedTestControls.vue  # Start/Stop controls
│   │   ├── MetricsGrid.vue        # Real-time metrics display
│   │   ├── QualityScores.vue      # Quality score badges
│   │   └── SummaryDetails.vue     # Detailed results
│   ├── assets/
│   │   └── styles.css             # Global styles
│   ├── App.vue                    # Root component
│   └── main.js                    # Application entry point
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## How to Use

1. **Start the Application**: Run `npm run dev` and open `http://localhost:5173`
2. **Click "Start Test"**: Initiates the network speed test
3. **Watch Real-time Updates**: Observe metrics updating with animated progress bars
4. **View Results**: After completion (~30-60 seconds), see:
   - Final download/upload speeds
   - Latency and jitter measurements
   - Packet loss percentage
   - Quality scores for streaming, gaming, and RTC
5. **Run Multiple Tests**: Click "Start Test" again for consecutive tests
6. **Stop Test**: Click "Stop Test" to cancel an ongoing test

## What Gets Measured

### Network Metrics

- **Download Speed** (Mbps): Your download bandwidth
- **Upload Speed** (Mbps): Your upload bandwidth
- **Latency** (ms): Round-trip time to Cloudflare's network
  - Idle latency: No data transfer
  - Loaded latency: During download/upload
- **Jitter** (ms): Variation in latency measurements
  - Idle jitter: No data transfer
  - Loaded jitter: During download/upload
- **Packet Loss** (%): Percentage of packets that fail to reach destination

### Quality Scores

Each score includes points and classification (bad/poor/average/good/great):

- **Streaming**: Quality for video streaming services
- **Gaming**: Quality for online gaming
- **RTC (Real-Time Communications)**: Quality for video calls and VoIP

### Test Sequence

The speedtest performs measurements in this order:
1. Initial latency measurement (1 packet)
2. Small download test (100 KB × 8)
3. Extended latency test (20 packets)
4. Multiple download tests (100 KB, 1 MB, 10 MB)
5. Upload tests (100 KB × 8)
6. Packet loss test (1000 packets)
7. Large upload tests (1 MB, 10 MB)
8. Final large download test (25 MB × 4)

## Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Component Architecture

The application uses Vue 3 Composition API with the following component structure:

- **App.vue**: Root component managing state and SpeedTest instance
- **AppHeader.vue**: Static header with title
- **SpeedTestControls.vue**: Interactive controls (start/stop buttons, status)
- **MetricsGrid.vue**: Real-time metrics cards with progress bars
- **QualityScores.vue**: Quality score badges with color coding
- **SummaryDetails.vue**: Additional detailed results
- **AppFooter.vue**: Static footer with attribution

### Customization

#### Modify Test Configuration

Edit the `measurements` array in `src/App.vue` (line ~90):

```javascript
measurements: [
  { type: 'latency', numPackets: 1 },
  { type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true },
  // Add or modify measurements
]
```

#### Change Styling

Edit `src/assets/styles.css`:
- Color scheme: Lines 8, 31, etc.
- Progress bar colors: Lines 211-235
- Quality badge colors: Lines 240-264

#### Adjust Progress Bar Thresholds

Modify `getProgressWidth()` in `src/components/MetricsGrid.vue` to change max speed assumptions.

## Browser Requirements

This application requires a modern browser with support for:
- ES6 Modules
- Fetch API
- PerformanceResourceTiming API

**Recommended Browsers:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Troubleshooting

### Development Server Won't Start

- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is in use (Vite will auto-select another port)

### Test Won't Start

- Check browser console (F12) for errors
- Ensure you have an active internet connection
- Verify the SpeedTest SDK loaded: Check console for "SpeedTest instance created"

### Build Fails

- Run `npm install` to ensure all dependencies are installed
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript errors if you've modified components

## Performance Notes

- **Network Impact**: Running the test will consume bandwidth (up to ~100 MB)
- **Test Duration**: Typical test takes 30-60 seconds
- **Privacy**: Tests connect to Cloudflare's edge network
- **Packet Loss**: The public TURN server may be deprecated soon

## Resources

- [Cloudflare Speedtest NPM Package](https://www.npmjs.com/package/@cloudflare/speedtest)
- [Cloudflare Speedtest GitHub Repository](https://github.com/cloudflare/speedtest)
- [Official Cloudflare Speed Test](https://speed.cloudflare.com/)
- [How Cloudflare's Speed Test Works (Blog)](https://blog.cloudflare.com/how-does-cloudflares-speed-test-really-work/)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

## License

This demo application is provided as-is for educational purposes. The @cloudflare/speedtest SDK is subject to its own license terms.

## Support

For issues with:
- **This demo app**: Check the troubleshooting section above
- **Cloudflare SDK**: Visit the [GitHub repository](https://github.com/cloudflare/speedtest)
- **Vue.js**: Check the [Vue.js documentation](https://vuejs.org/)
- **Network issues**: Contact your ISP

---

Built with ❤️ using Vue.js 3 and Cloudflare's Speedtest SDK
