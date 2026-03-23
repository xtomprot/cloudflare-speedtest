# Component Inventory - Detailed Breakdown

**Last Updated**: 2026-03-23

## Component Overview

Total Components: 9
- Structural: 2 (Header, Footer)
- Interactive: 2 (Controls, Overlay)
- Display: 5 (Speedometers, Metrics, Scores)

---

## 1. App.vue (Root Component)

**Type**: Root Container
**Lines of Code**: 228
**Complexity**: High

### Purpose
Application orchestrator managing speedtest lifecycle, state, and child component coordination.

### Responsibilities
- SpeedTest SDK instance management
- Global state management (reactive refs)
- Event handler coordination
- Child component rendering

### State Management
```javascript
// Reactive State
speedTest: ref(null)           // SDK instance (markRaw wrapper)
isRunning: ref(false)          // Test execution status
showOverlay: ref(false)        // Easter egg visibility
results: ref({                 // Real-time metrics
  download, upload, latency, jitter,
  downloadLatency, downloadJitter,
  uploadLatency, uploadJitter, packetLoss
})
scores: ref(null)              // Quality scores object
summary: ref(null)             // Final summary object
```

### Computed Properties
- `statusText`: Status message based on test state
- `statusClass`: CSS class for status indicator

### Methods
- `startTest()`: Initialize and start speedtest
- `stopTest()`: Pause speedtest execution
- `handleCorrectAnswer()`: Hide easter egg overlay

### Event Handlers
- `onRunningChange`: SDK running state updates
- `onResultsChange`: Real-time metric updates
- `onFinish`: Test completion callback

### Dependencies
- @cloudflare/speedtest SDK
- All child components
- Vue 3 Composition API (ref, computed, markRaw)

### Notes
- Uses `markRaw()` to prevent Vue reactivity on SDK private fields
- Implements measurement sequence with specific byte counts
- Shows overlay 500ms after test starts

---

## 2. AppHeader.vue

**Type**: Presentation Component
**Lines of Code**: 43
**Complexity**: Low

### Purpose
Static header with retro branding and title.

### Template Structure
```html
<header>
  <div class="retro-badge">EST. 1975</div>
  <h1>SPEEDTEST CX</h1>
  <p class="subtitle">Network Performance Analysis System</p>
  <div class="vintage-line"></div>
</header>
```

### Styling Features
- Courier New badge (EST. 1975)
- Orange gradient separator line
- Centered layout
- Retro color scheme

### Props: None
### Events: None
### Dependencies: None

---

## 3. AppFooter.vue

**Type**: Presentation Component
**Lines of Code**: 50
**Complexity**: Low

### Purpose
Static footer with attribution and tagline.

### Template Structure
```html
<footer>
  <div class="vintage-line"></div>
  <p class="powered-by">
    POWERED BY <a href="...">CLOUDFLARE SPEEDTEST</a>
  </p>
  <p class="retro-tagline">
    « Digital Performance Engineering Since 1975 »
  </p>
</footer>
```

### Styling Features
- Matching gradient separator line
- Link to Cloudflare SDK
- French-style guillemets « »
- Georgia serif italic for tagline

### Props: None
### Events: None
### Dependencies: None

---

## 4. SpeedTestControls.vue

**Type**: Interactive Component
**Lines of Code**: 55
**Complexity**: Low

### Purpose
User controls for starting/stopping tests and displaying status.

### Template Structure
```html
<div class="controls">
  <button @click="handleStartClick" :disabled="isRunning">
    {{ isRunning ? 'Testing...' : 'Start Test' }}
  </button>
  <button @click="handleStopClick" :disabled="!isRunning">
    Stop Test
  </button>
  <div class="status" :class="statusClass">
    {{ statusText }}
  </div>
</div>
```

### Props
- `isRunning`: Boolean - Test execution state
- `statusText`: String - Status message
- `statusClass`: String - CSS class for status

### Events Emitted
- `start-test`: User clicked start button
- `stop-test`: User clicked stop button

### Methods
- `handleStartClick()`: Emit start event
- `handleStopClick()`: Emit stop event

### Styling
- 3D button effects (pressed state)
- Orange gradient primary button
- Gray gradient secondary button
- Animated status indicator (pulse on running)

---

## 5. RetroSpeedTest.vue

**Type**: Complex Display Component
**Lines of Code**: 401
**Complexity**: Medium-High

### Purpose
Main dashboard displaying speed metrics in retro Citroën CX style.

### Template Structure
```html
<div class="retro-speedtest">
  <VintagePattern />
  <div class="retro-header">
    <div class="model-badge">CX SPEEDTEST</div>
    <div class="year-badge">1975-1989</div>
  </div>
  <div class="dashboard">
    <!-- Drum speedometers -->
    <DrumSpeedometer :value="downloadSpeed" label="Download" />
    <DrumSpeedometer :value="uploadSpeed" label="Upload" />

    <!-- Secondary metrics -->
    <div class="secondary-metrics">
      <!-- Latency, Jitter, Packet Loss displays -->
    </div>

    <!-- Warning lights -->
    <div class="warning-lights">
      <!-- Testing, Complete, Error indicators -->
    </div>
  </div>
  <div class="retro-footer">
    <div class="citroen-logo">CITROËN</div>
    <div class="tagline">L'innovation automobile</div>
  </div>
</div>
```

### Props
- `results`: Object - Real-time metrics
- `isRunning`: Boolean - Test state
- `summary`: Object - Final results (nullable)

### Data
- `hasError`: Boolean - Error state

### Computed Properties
- `downloadSpeed`: Convert bps to Mbps
- `uploadSpeed`: Convert bps to Mbps

### Methods
- `formatLatency(ms)`: Format to fixed decimal with padding
- `formatPacketLoss(percent)`: Convert to percentage

### Styling Features
- Dark gradient background
- Border with inset shadow
- LED-style red displays for secondary metrics
- Warning lights with glow animations
- Responsive flexbox layout

### Child Components
- DrumSpeedometer × 2
- VintagePattern

---

## 6. DrumSpeedometer.vue

**Type**: Animated Display Component
**Lines of Code**: 236
**Complexity**: Medium

### Purpose
Rotating drum speedometer mimicking Citroën CX instrumentation.

### Template Structure
```html
<div class="drum-speedometer">
  <div class="speedometer-label">{{ label }}</div>
  <div class="drum-container">
    <div class="drum-window">
      <div class="drum-roll" :style="{ transform: `translateY(${drumPosition}px)` }">
        <div v-for="digit in drumDigits" class="drum-digit">
          {{ digit.value }}
        </div>
      </div>
      <div class="drum-indicator"></div>
    </div>
    <div class="unit-label">{{ unit }}</div>
  </div>
  <div class="drum-glow" :class="{ active: isActive }"></div>
</div>
```

### Props
- `value`: Number - Speed value (default: 0)
- `label`: String - "Download" or "Upload"
- `unit`: String - "Mbps" (default)
- `isActive`: Boolean - Test running state

### Computed Properties
- `displayValue`: Rounded speed value
- `drumDigits`: Array of 1020 digits (−10 to 1009)
  - Pre-renders full scrollable range
  - Zero-padded 3-digit strings
- `drumPosition`: Calculated vertical offset
  - Formula: `baseOffset (600px) - (value × 60px)`
  - Centers current value in window

### Animation Logic
- Each digit height: 60px
- Transition: 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)
- Hardware-accelerated (will-change: transform)

### Styling Features
- Green LED digits (#00ff00)
- Orange center indicator with arrows
- Scanline overlay (CRT effect)
- Dark inset window
- Pulse glow when active
- Metallic housing appearance

### Performance Optimizations
- CSS transforms (GPU-accelerated)
- Single transition property
- Scoped reactivity (computed values)

---

## 7. VintagePattern.vue

**Type**: Decorative Component
**Lines of Code**: 93
**Complexity**: Low

### Purpose
Vintage aesthetic corner screws for retro panel appearance.

### Template Structure
```html
<div class="vintage-pattern">
  <div class="corner-screws">
    <div class="screw top-left"></div>
    <div class="screw top-right"></div>
    <div class="screw bottom-left"></div>
    <div class="screw bottom-right"></div>
  </div>
</div>
```

### Styling Features
- Radial gradient (metallic appearance)
- Cross pattern (Phillips screw)
- Box shadows (depth)
- Positioned absolutely in corners
- Pointer-events: none (non-interactive)

### Props: None
### Events: None
### Dependencies: None

---

## 8. QualityScores.vue

**Type**: Display Component
**Lines of Code**: 57
**Complexity**: Low

### Purpose
Display quality scores with color-coded badges.

### Template Structure
```html
<div class="scores-section">
  <h2>Quality Scores</h2>
  <div class="scores-grid">
    <div class="score-card" v-for="category in ['streaming', 'gaming', 'rtc']">
      <div class="score-icon">{{ emoji }}</div>
      <h4>{{ category }}</h4>
      <div class="score-value">{{ scores[category].points }}</div>
      <div class="score-badge" :class="getScoreClass(...)">
        {{ scores[category].classification }}
      </div>
    </div>
  </div>
</div>
```

### Props
- `scores`: Object - Quality scores
  ```javascript
  {
    streaming: { points: Number, classification: String },
    gaming: { points: Number, classification: String },
    rtc: { points: Number, classification: String }
  }
  ```

### Methods
- `getScoreClass(classification)`: Maps classification to CSS class
  - bad → badge-bad (red)
  - poor → badge-poor (orange)
  - average → badge-average (yellow)
  - good → badge-good (light green)
  - great → badge-great (dark green)

### Styling
- Grid layout (responsive)
- Gradient card backgrounds
- Emoji icons (🎬, 🎮, 💬)
- Color-coded badges

---

## 9. SummaryDetails.vue

**Type**: Display Component
**Lines of Code**: 33
**Complexity**: Low

### Purpose
Display additional detailed metrics.

### Template Structure
```html
<div class="summary-section">
  <h2>Detailed Results</h2>
  <div class="summary-grid">
    <div class="summary-item">
      <span class="summary-label">Upload Latency:</span>
      <span class="summary-value">{{ formatLatency(...) }} ms</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Upload Jitter:</span>
      <span class="summary-value">{{ formatLatency(...) }} ms</span>
    </div>
  </div>
</div>
```

### Props
- `summary`: Object - Final test summary

### Methods
- `formatLatency(ms)`: Format to 2 decimal places or em dash

### Styling
- Grid layout
- Light background
- Label-value pairs

---

## 10. UltimateQuestionOverlay.vue

**Type**: Interactive Overlay (Easter Egg)
**Lines of Code**: 643
**Complexity**: High

### Purpose
Hitchhiker's Guide to the Galaxy reference - blocks test results until user answers "42".

### Template Structure
```html
<Transition name="overlay-fade">
  <div v-if="isVisible" class="ultimate-overlay">
    <div class="question-panel" :class="{ shake, correct }">
      <div class="panel-header">
        <div class="title-line">DEEP THOUGHT</div>
        <div class="version">v7.5M YEARS</div>
      </div>

      <div class="question-content">
        <p>WHAT IS THE ANSWER TO THE ULTIMATE QUESTION...</p>

        <div v-if="!isCorrect">
          <input v-model="userAnswer" type="text" />
          <button @click="checkAnswer">COMPUTE</button>
          <div v-if="showError">{{ errorMessage }}</div>
        </div>

        <div v-else class="success-message">
          CORRECT! THE ANSWER IS 42
        </div>
      </div>

      <div class="panel-footer">
        <div v-if="attempts > 2">HINT: ...</div>
        <div>Attempts: {{ attempts }}</div>
      </div>
    </div>
  </div>
</Transition>
```

### Props
- `isVisible`: Boolean - Show overlay

### Data
- `userAnswer`: String - User input
- `correctAnswer`: 42 (constant)
- `isCorrect`: Boolean - Answer validated
- `showError`: Boolean - Show error message
- `errorMessage`: String - Dynamic error text
- `attempts`: Number - Attempt counter
- `isShaking`: Boolean - Shake animation trigger

### Computed: None

### Methods
- `formatInput()`: Strip non-numeric characters
- `checkAnswer()`: Validate answer
  - Custom error messages based on proximity
  - Increments attempt counter
  - Triggers shake animation on wrong answer
  - Emits `correct-answer` on success (after 2s delay)
- `triggerShake()`: Activate shake animation
- `shakeOverlay()`: Shake on outside click

### Watchers
- `isVisible`: Reset state when shown, auto-focus input
- `isCorrect`: Emit event after 2s delay

### Events Emitted
- `correct-answer`: User answered correctly

### Animation Features
- Fade in/out transition
- Panel appear animation
- Shake animation on error
- Pulsing corner lights
- Success icon pulse
- Blinking error icon

### Styling
- Full-screen overlay with backdrop blur
- Orange/green theme switching (wrong/correct)
- LED-style input display
- Retro button styling
- Responsive layout

---

## Component Dependency Graph

```
App.vue
├── AppHeader.vue
├── SpeedTestControls.vue
├── RetroSpeedTest.vue
│   ├── VintagePattern.vue
│   └── DrumSpeedometer.vue (×2)
├── QualityScores.vue
├── SummaryDetails.vue
├── AppFooter.vue
└── UltimateQuestionOverlay.vue
```

## Component Statistics

| Component | LOC | Props | Events | Data | Computed | Methods | Complexity |
|-----------|-----|-------|--------|------|----------|---------|------------|
| App.vue | 228 | 0 | 0 | 5 | 2 | 3 | High |
| AppHeader.vue | 43 | 0 | 0 | 0 | 0 | 0 | Low |
| AppFooter.vue | 50 | 0 | 0 | 0 | 0 | 0 | Low |
| SpeedTestControls.vue | 55 | 3 | 2 | 0 | 0 | 2 | Low |
| RetroSpeedTest.vue | 401 | 3 | 0 | 1 | 2 | 2 | Medium |
| DrumSpeedometer.vue | 236 | 4 | 0 | 0 | 3 | 0 | Medium |
| VintagePattern.vue | 93 | 0 | 0 | 0 | 0 | 0 | Low |
| QualityScores.vue | 57 | 1 | 0 | 0 | 0 | 1 | Low |
| SummaryDetails.vue | 33 | 1 | 0 | 0 | 0 | 1 | Low |
| UltimateQuestionOverlay.vue | 643 | 1 | 1 | 6 | 0 | 4 | High |

**Total LOC**: 1,839 lines

---

**Maintained By**: Developer Council
**Last Audit**: 2026-03-23
