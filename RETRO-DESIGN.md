# Retro Citroën CX Speedometer Design

## Overview
This project has been transformed with a retro 1970s-80s Citroën CX "drum" speedometer aesthetic, featuring:

## Key Features

### 🎨 Visual Design
- **Dark retro color scheme**: Black backgrounds with orange (#ff6600) accents
- **Citroën CX branding**: Period-appropriate typography and styling
- **Vintage scanline effects**: CRT-style visual filters
- **Retro warning lights**: Animated LED-style indicators

### 🥁 Drum Speedometer Components

#### DrumSpeedometer.vue
The main speedometer component mimicking the iconic Citroën CX rotating drum display:
- **Continuous scrolling digits**: 0-999 range with smooth transitions
- **Green LED-style display**: Classic digital readout with glow effects
- **Orange indicator line**: Center reference marker with arrows
- **Active state animations**: Pulsing glow effect during testing
- **Retro housing**: Dark metallic appearance with inset shadows

Features:
- Displays speed in real-time as the test progresses
- Smooth cubic-bezier transitions for natural drum rotation
- Scanline overlay for authentic CRT appearance
- Configurable for download/upload speeds

#### RetroSpeedTest.vue
Main dashboard component containing:
- **Dual drum speedometers**: Download and Upload side-by-side
- **Secondary LED displays**: Red LED-style readouts for Latency, Jitter, Packet Loss
- **Warning light panel**: Three indicator lights (Testing/Complete/Error)
- **Citroën branding**: CX Speedtest logo and "L'innovation automobile" tagline
- **Year badge**: "1975-1989" period indicator

### 🎛️ Retro UI Elements

#### Buttons
- **3D pressed effect**: Physical button feel with shadow depth
- **Orange primary buttons**: Gradient from #ff8800 to #ff6600
- **Uppercase bold text**: 1970s style typography
- **Active state**: Button "presses" down when clicked

#### Status Indicators
- **LED-style borders**: Glowing colored borders (green/blue)
- **Monospace text**: Courier New for digital readout feel
- **Box shadows**: Inner and outer glows for depth

#### Typography
- **Headers**: Arial Black with orange glow and letter-spacing
- **Labels**: Courier New monospace for technical feel
- **Body**: Mix of sans-serif and monospace fonts

### 🎨 Color Palette

```css
Primary Orange: #ff6600
Accent Orange: #ff8800
Dark Background: #1a1a1a, #0d0d0d
Dark Gray: #2a2a2a
LED Green: #00ff00
LED Red: #ff3300
LED Blue: #0066ff
Text Gray: #666, #999, #ccc
Border Gray: #333, #444
```

### ⚡ Animations
- **Pulse glow**: Testing indicator breathing effect
- **Blink effects**: Green (1s) and red (0.5s) warning light blinks
- **Shimmer**: Subtle opacity variations
- **Drum rotation**: Smooth 0.6s cubic-bezier transitions

## File Structure

```
src/
├── components/
│   ├── DrumSpeedometer.vue       # Rotating drum display component
│   ├── RetroSpeedTest.vue        # Main retro dashboard
│   ├── AppHeader.vue             # Updated with retro styling
│   ├── AppFooter.vue             # Updated with retro styling
│   ├── SpeedTestControls.vue    # (kept, styled via global CSS)
│   ├── QualityScores.vue         # (kept original)
│   └── SummaryDetails.vue        # (kept original)
├── assets/
│   └── styles.css                # Updated global retro styles
└── App.vue                        # Updated to use RetroSpeedTest
```

## Design Inspiration

The design is inspired by the iconic **Citroën CX (1975-1991)** dashboard, specifically:

1. **Rotating Drum Speedometer**: The CX featured a unique speedometer where numbers rotated vertically in a drum behind a window, rather than a traditional needle gauge
2. **Orange Illumination**: Period-correct dashboard lighting in warm orange/amber
3. **Minimalist Futurism**: Clean, functional design that was futuristic for its era
4. **Digital Aesthetic**: Early digital displays with LED/LCD-style readouts
5. **Warning Lights**: Simple colored indicator lights for system status

## Technical Implementation

### Real-time Updates
- Speed values update smoothly as the test progresses
- Drum position calculated dynamically: `(value * 60px) - baseOffset`
- CSS transforms handle the vertical scrolling animation

### Performance
- `will-change: transform` for optimized drum animations
- Minimal repaints with scoped styles
- Hardware-accelerated CSS transitions

### Responsive Design
- Flexbox layout adapts to different screen sizes
- Drums stack vertically on mobile devices
- Touch-friendly button sizes

## Usage

The retro speedometer automatically displays during testing:
1. Click "START TEST" button
2. Watch drum speedometers rotate as speeds increase
3. LED displays update with latency, jitter, and packet loss
4. Warning lights indicate test status

## Future Enhancements

Potential additions to enhance the retro aesthetic:
- [ ] Analog needle gauge option
- [ ] Vintage sound effects (click/whir)
- [ ] CRT warmup animation
- [ ] More Citroën-specific design elements
- [ ] Customizable color themes (green, amber, white LEDs)
- [ ] Retro graph/chart displays for historical data
