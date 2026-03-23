# Serverless HTML5 Migration Plan

**Objective**: Convert Vue.js/Vite application to pure HTML5/CSS/JavaScript without Node.js build dependency

**Target**: Static HTML5 application deployable to any CDN or web server

**Last Updated**: 2026-03-23

---

## Executive Summary

This application is already **nearly serverless** - it requires Node.js only for the build process. The goal is to eliminate the build step entirely, creating a pure HTML5 application that runs directly in browsers without compilation.

### Current State
- Development: Requires Node.js + Vite dev server
- Production: Requires `npm run build` to create deployable files
- Deployment: Static files (already serverless at runtime)

### Target State
- Development: Open index.html in browser (no server needed)
- Production: Same files work directly (no build step)
- Deployment: Upload HTML/CSS/JS directly to hosting

---

## Migration Strategy Options

### Option A: Vue 3 via CDN (Recommended)
**Effort**: Medium | **Compatibility**: High | **Performance**: Good

Convert to browser-native Vue 3 using CDN imports while preserving component structure.

**Pros**:
- Maintains Vue architecture
- Keeps component separation
- No build tools needed
- Minimal code changes

**Cons**:
- Multiple HTTP requests for components
- No tree-shaking
- Larger initial payload
- Template compilation at runtime

---

### Option B: Vanilla JavaScript Rewrite
**Effort**: High | **Compatibility**: Maximum | **Performance**: Best

Complete rewrite using native Web Components or vanilla JS.

**Pros**:
- Zero dependencies
- Maximum performance
- Smallest payload
- Most portable

**Cons**:
- Complete rewrite required
- Lose component abstraction benefits
- More manual DOM management
- Higher maintenance complexity

---

### Option C: Preact/Petite-Vue via CDN
**Effort**: Medium-High | **Compatibility**: High | **Performance**: Excellent

Use lightweight alternatives (Preact 3KB, Petite-Vue 6KB) via CDN.

**Pros**:
- Tiny bundle sizes
- Vue-like syntax (Petite-Vue)
- React-like ecosystem (Preact)
- Better performance than full Vue

**Cons**:
- Some API differences
- Less feature-complete
- May need refactoring
- Smaller community support

---

## Recommended Approach: Option A (Vue 3 CDN)

### Implementation Plan

#### Phase 1: Project Restructuring

**1. Remove Build Dependencies**
```bash
# Remove these from package.json
- vite
- @vitejs/plugin-vue
- All dev dependencies
```

**2. New File Structure**
```
cloudflare-speedtest/
├── index.html                 # Main entry (updated)
├── css/
│   └── styles.css            # Global styles (unchanged)
├── js/
│   ├── app.js                # Main application
│   ├── components/           # Component modules
│   │   ├── AppHeader.js
│   │   ├── AppFooter.js
│   │   ├── SpeedTestControls.js
│   │   ├── RetroSpeedTest.js
│   │   ├── DrumSpeedometer.js
│   │   ├── VintagePattern.js
│   │   ├── QualityScores.js
│   │   ├── SummaryDetails.js
│   │   └── UltimateQuestionOverlay.js
│   └── utils/
│       └── helpers.js        # Utility functions
└── documentation/            # Technical docs
```

#### Phase 2: HTML Entry Point

**index.html** (Updated)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Speedtest Demo</title>

  <!-- Styles -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="app"></div>

  <!-- Vue 3 from CDN -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

  <!-- Cloudflare Speedtest SDK from CDN -->
  <script src="https://unpkg.com/@cloudflare/speedtest@1/dist/speedtest.js"></script>

  <!-- Application Components (ES Modules) -->
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

#### Phase 3: Component Conversion

**Convert .vue files to .js modules**

Example: `DrumSpeedometer.vue` → `DrumSpeedometer.js`

```javascript
// js/components/DrumSpeedometer.js
export default {
  name: 'DrumSpeedometer',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, required: true },
    unit: { type: String, default: 'Mbps' },
    isActive: { type: Boolean, default: false }
  },
  template: `
    <div class="drum-speedometer">
      <div class="speedometer-label">{{ label }}</div>
      <div class="drum-container">
        <div class="drum-window">
          <div class="drum-roll" :style="{ transform: \`translateY(\${drumPosition}px)\` }">
            <div
              v-for="digit in drumDigits"
              :key="digit.index"
              class="drum-digit"
            >
              {{ digit.value }}
            </div>
          </div>
          <div class="drum-indicator"></div>
        </div>
        <div class="unit-label">{{ unit }}</div>
      </div>
      <div class="drum-glow" :class="{ active: isActive }"></div>
    </div>
  `,
  computed: {
    displayValue() {
      return Math.round(this.value)
    },
    drumDigits() {
      const digits = []
      for (let i = -10; i <= 1009; i++) {
        digits.push({
          index: i,
          value: String(Math.max(0, i)).padStart(3, '0')
        })
      }
      return digits
    },
    drumPosition() {
      const digitHeight = 60
      const baseOffset = 10 * digitHeight
      const valueOffset = this.displayValue * digitHeight
      return baseOffset - valueOffset
    }
  }
}
```

**Note**: Template strings in JS use backticks and escape `${}` with backslash.

#### Phase 4: Main Application

**js/app.js**
```javascript
import AppHeader from './components/AppHeader.js'
import AppFooter from './components/AppFooter.js'
import SpeedTestControls from './components/SpeedTestControls.js'
import RetroSpeedTest from './components/RetroSpeedTest.js'
import QualityScores from './components/QualityScores.js'
import SummaryDetails from './components/SummaryDetails.js'
import UltimateQuestionOverlay from './components/UltimateQuestionOverlay.js'

const { createApp, ref, computed, markRaw } = Vue

const App = {
  components: {
    AppHeader,
    AppFooter,
    SpeedTestControls,
    RetroSpeedTest,
    QualityScores,
    SummaryDetails,
    UltimateQuestionOverlay
  },
  template: `
    <div class="container">
      <AppHeader />
      <SpeedTestControls
        :is-running="isRunning"
        :status-text="statusText"
        :status-class="statusClass"
        @start-test="startTest"
        @stop-test="stopTest"
      />
      <RetroSpeedTest
        v-if="isRunning || summary"
        :results="results"
        :is-running="isRunning"
        :summary="summary"
        :style="{ opacity: showOverlay ? 0.3 : 1 }"
      />
      <QualityScores v-if="scores" :scores="scores" />
      <SummaryDetails v-if="summary" :summary="summary" />
      <AppFooter />

      <UltimateQuestionOverlay
        :is-visible="showOverlay"
        @correct-answer="handleCorrectAnswer"
      />
    </div>
  `,
  setup() {
    const speedTest = ref(null)
    const isRunning = ref(false)
    const showOverlay = ref(false)
    const results = ref({
      download: null,
      upload: null,
      latency: null,
      jitter: null,
      downloadLatency: null,
      downloadJitter: null,
      uploadLatency: null,
      uploadJitter: null,
      packetLoss: null
    })
    const scores = ref(null)
    const summary = ref(null)

    const statusText = computed(() => {
      if (isRunning.value) return '🔄 Test in progress...'
      if (summary.value) return '✅ Test completed'
      return '⚪ Ready to test'
    })

    const statusClass = computed(() => {
      if (isRunning.value) return 'status-running'
      if (summary.value) return 'status-complete'
      return 'status-idle'
    })

    const startTest = () => {
      // Reset previous results
      results.value = {
        download: null,
        upload: null,
        latency: null,
        jitter: null,
        downloadLatency: null,
        downloadJitter: null,
        uploadLatency: null,
        uploadJitter: null,
        packetLoss: null
      }
      scores.value = null
      summary.value = null

      try {
        // Access global SpeedTest from CDN
        speedTest.value = markRaw(new window.SpeedTest({
          autoStart: false,
          measurements: [
            { type: 'latency', numPackets: 1 },
            { type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true },
            { type: 'latency', numPackets: 20 },
            { type: 'download', bytes: 1e5, count: 6 },
            { type: 'download', bytes: 1e6, count: 6 },
            { type: 'download', bytes: 1e7, count: 4 },
            { type: 'upload', bytes: 1e5, count: 8 },
            { type: 'packetLoss', numPackets: 1e3, batchSize: 10 },
            { type: 'upload', bytes: 1e6, count: 6 },
            { type: 'upload', bytes: 1e7, count: 4 },
            { type: 'download', bytes: 2.5e7, count: 4 }
          ]
        }))

        // Set up event handlers
        speedTest.value.onRunningChange = (running) => {
          isRunning.value = running
          if (running) {
            setTimeout(() => {
              showOverlay.value = true
            }, 500)
          }
        }

        speedTest.value.onResultsChange = ({ type }) => {
          if (!speedTest.value.results) return

          const res = speedTest.value.results

          const download = res.getDownloadBandwidth()
          const upload = res.getUploadBandwidth()
          const latency = res.getUnloadedLatency()
          const jitter = res.getUnloadedJitter()
          const downloadLatency = res.getDownLoadedLatency()
          const downloadJitter = res.getDownLoadedJitter()
          const uploadLatency = res.getUpLoadedLatency()
          const uploadJitter = res.getUpLoadedJitter()
          const packetLoss = res.getPacketLoss()

          if (download !== null && download !== undefined) results.value.download = download
          if (upload !== null && upload !== undefined) results.value.upload = upload
          if (latency !== null && latency !== undefined) results.value.latency = latency
          if (jitter !== null && jitter !== undefined) results.value.jitter = jitter
          if (downloadLatency !== null && downloadLatency !== undefined) results.value.downloadLatency = downloadLatency
          if (downloadJitter !== null && downloadJitter !== undefined) results.value.downloadJitter = downloadJitter
          if (uploadLatency !== null && uploadLatency !== undefined) results.value.uploadLatency = uploadLatency
          if (uploadJitter !== null && uploadJitter !== undefined) results.value.uploadJitter = uploadJitter
          if (packetLoss !== null && packetLoss !== undefined) results.value.packetLoss = packetLoss
        }

        speedTest.value.onFinish = (testResults) => {
          summary.value = testResults.getSummary()
          scores.value = testResults.getScores()

          results.value.download = summary.value.download
          results.value.upload = summary.value.upload
          results.value.latency = summary.value.latency
          results.value.jitter = summary.value.jitter
          results.value.downloadLatency = summary.value.downloadLatency
          results.value.downloadJitter = summary.value.downloadJitter
          results.value.uploadLatency = summary.value.uploadLatency
          results.value.uploadJitter = summary.value.uploadJitter
          results.value.packetLoss = summary.value.packetLoss
        }

        speedTest.value.play()
      } catch (error) {
        console.error('Error starting test:', error)
        alert('Error starting test: ' + error.message)
        isRunning.value = false
      }
    }

    const stopTest = () => {
      if (speedTest.value) {
        speedTest.value.pause()
        isRunning.value = false
      }
      showOverlay.value = false
    }

    const handleCorrectAnswer = () => {
      showOverlay.value = false
    }

    return {
      isRunning,
      showOverlay,
      results,
      scores,
      summary,
      statusText,
      statusClass,
      startTest,
      stopTest,
      handleCorrectAnswer
    }
  }
}

createApp(App).mount('#app')
```

#### Phase 5: CSS Migration

**Move CSS from .vue files to global stylesheet**

1. Extract all scoped styles from `.vue` files
2. Add component-specific class prefixes to prevent collisions
3. Combine into `css/styles.css`

Example:
```css
/* DrumSpeedometer styles */
.drum-speedometer {
  position: relative;
  display: flex;
  flex-direction: column;
  /* ... rest of styles ... */
}
```

**Note**: Scoped styles become globally scoped, so ensure unique class names.

---

## Performance Comparison

### Current (Vite Build)
```
dist/
├── index.html (1 KB)
├── assets/
│   ├── index-abc123.js (200 KB minified)
│   └── index-abc123.css (15 KB minified)
Total: ~216 KB (gzipped: ~70 KB)
Requests: 3
```

### Serverless (CDN)
```
/
├── index.html (2 KB)
├── css/styles.css (15 KB)
├── js/
│   ├── app.js (20 KB)
│   └── components/ (9 files × ~5 KB = 45 KB)
CDN:
├── vue.global.prod.js (100 KB, cached)
├── speedtest.js (150 KB, cached)
Total: ~332 KB (not gzipped, but CDN provides compression)
Requests: 13 (but parallelized)
```

**Trade-offs**:
- **Size**: +50% larger (but CDN libraries cached across sites)
- **Requests**: More requests (but HTTP/2 parallel loading)
- **Speed**: First load slower, subsequent loads faster (cache)
- **Development**: Instant reload (no build), edit-refresh workflow

---

## Migration Checklist

### Pre-Migration
- [ ] Audit all components for Vue 3 CDN compatibility
- [ ] Test Cloudflare SDK standalone (without bundler)
- [ ] Backup current codebase
- [ ] Create migration branch

### Migration Steps
- [ ] Create new folder structure
- [ ] Update index.html with CDN imports
- [ ] Convert App.vue → app.js
- [ ] Convert all child components to .js modules
- [ ] Extract and consolidate CSS
- [ ] Update asset references (if any)
- [ ] Test each component individually
- [ ] Integration testing
- [ ] Cross-browser testing

### Post-Migration
- [ ] Remove node_modules, package.json
- [ ] Update README deployment instructions
- [ ] Deploy to static hosting (Cloudflare Pages, Netlify, etc.)
- [ ] Performance audit
- [ ] User acceptance testing

---

## Deployment Options (Post-Migration)

### Option 1: Cloudflare Pages
**Cost**: Free
**Setup**: Git-based deployment
```bash
# No build command needed!
Build command: (none)
Output directory: /
```

### Option 2: GitHub Pages
**Cost**: Free
**Setup**: Enable in repository settings
```bash
# Serve from main branch, root directory
```

### Option 3: Any Static Host
- Netlify (free)
- Vercel (free)
- AWS S3 + CloudFront
- Google Cloud Storage
- Traditional web hosting (Apache/Nginx)

### Option 4: File System
**Cost**: Free
**Setup**: None
```bash
# Open directly in browser
file:///C:/Projects/cloudflare-speedtest/index.html
```
**Note**: May need CORS workaround for local testing

---

## Alternative: Hybrid Approach

Keep Vite for development, but add serverless option:

### package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:serverless": "node scripts/build-serverless.js"
  }
}
```

### scripts/build-serverless.js
- Converts .vue files to .js modules
- Injects CDN scripts
- Outputs serverless version to `dist-serverless/`

**Benefit**: Best of both worlds (dev DX + production simplicity)

---

## Risks & Mitigations

### Risk 1: Vue 3 CDN API Differences
**Mitigation**: Test all components in CDN mode before full migration

### Risk 2: Template Compilation Performance
**Mitigation**: Use production Vue build (pre-compiled templates)

### Risk 3: CSS Scope Collisions
**Mitigation**: Use BEM naming convention or unique prefixes

### Risk 4: SDK CDN Availability
**Mitigation**: Self-host SDK as fallback, use SRI hashes

### Risk 5: Browser Module Support
**Mitigation**: Provide ES5 fallback for older browsers

---

## Success Criteria

✅ **Zero Build Dependencies**: No npm/Node.js required
✅ **Direct Deployment**: Upload files → works immediately
✅ **Feature Parity**: All functionality preserved
✅ **Performance**: Acceptable load times (<3s on 3G)
✅ **Browser Compatibility**: Same as current (Chrome 90+, etc.)
✅ **Maintainability**: Code remains readable and modular

---

## Estimated Effort

- **Planning & Setup**: 2 hours
- **Component Conversion**: 8 hours (9 components × ~1 hour each)
- **CSS Migration**: 2 hours
- **Testing**: 4 hours
- **Documentation**: 2 hours

**Total**: ~18 hours for complete migration

---

## Recommendation

**Proceed with Vue 3 CDN migration (Option A)** because:

1. **Minimal Code Changes**: Component logic remains identical
2. **Preserved Architecture**: Maintains separation of concerns
3. **Acceptable Performance**: CDN caching benefits
4. **Lower Risk**: Incremental migration possible
5. **Best ROI**: Achieves goal with reasonable effort

**Next Steps**:
1. Create proof-of-concept with 2-3 components
2. Validate performance and DX
3. Proceed with full migration if POC successful
4. Document serverless deployment process

---

**Document Owner**: Developer Council
**Status**: Proposal - Awaiting Approval
**Version**: 1.0
