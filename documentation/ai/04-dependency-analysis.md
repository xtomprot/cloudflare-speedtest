# Dependency Analysis

**Project**: Cloudflare Speedtest Demo
**Last Updated**: 2026-03-23

---

## Dependency Overview

### Production Dependencies (2)
```json
{
  "vue": "^3.5.27",
  "@cloudflare/speedtest": "^1.7.0"
}
```

### Development Dependencies (2)
```json
{
  "@vitejs/plugin-vue": "^5.2.1",
  "vite": "^6.0.7"
}
```

**Total Package Count**: 4 direct, ~200 transitive
**Total Size**: ~150 MB (node_modules)

---

## Production Dependencies

### 1. Vue.js (^3.5.27)

**Purpose**: UI framework
**Size**: ~500 KB (unpacked), ~45 KB (gzipped prod build)
**License**: MIT
**Maintainer**: Evan You / Vue.js Team

**What it provides**:
- Reactive data binding
- Component system
- Virtual DOM
- Template compilation
- Composition API
- Lifecycle hooks

**Usage in project**:
```javascript
import { createApp } from 'vue'              // App initialization
import { ref, computed, markRaw } from 'vue' // Reactivity
```

**Component imports**:
- All `.vue` Single File Components
- Composition API in App.vue setup()

**Transitive dependencies**:
- @vue/shared
- @vue/reactivity
- @vue/runtime-dom
- @vue/runtime-core
- @vue/compiler-sfc (dev only)

**Removal impact**:
- Would require complete rewrite
- Alternative: Preact, Petite-Vue, Vanilla JS
- Serverless: Use Vue from CDN instead of bundling

---

### 2. @cloudflare/speedtest (^1.7.0)

**Purpose**: Network performance testing SDK
**Size**: ~500 KB (unpacked), ~100-150 KB (minified)
**License**: BSD-3-Clause
**Maintainer**: Cloudflare, Inc.

**What it provides**:
- SpeedTest class
- Network measurement orchestration
- Bandwidth calculation (up/down)
- Latency measurement
- Jitter calculation
- Packet loss detection
- Quality scoring algorithms

**Usage in project**:
```javascript
import SpeedTest from '@cloudflare/speedtest'

const speedTest = new SpeedTest({
  autoStart: false,
  measurements: [...]
})

speedTest.onRunningChange = (running) => { }
speedTest.onResultsChange = (results) => { }
speedTest.onFinish = (results) => { }
speedTest.play()
speedTest.pause()
```

**API surface**:
- `new SpeedTest(config)`: Constructor
- `.play()`: Start test
- `.pause()`: Stop test
- `.results`: Results object
  - `.getDownloadBandwidth()`
  - `.getUploadBandwidth()`
  - `.getUnloadedLatency()`
  - `.getUnloadedJitter()`
  - `.getDownLoadedLatency()`
  - `.getDownLoadedJitter()`
  - `.getUpLoadedLatency()`
  - `.getUpLoadedJitter()`
  - `.getPacketLoss()`
  - `.getSummary()`
  - `.getScores()` → { streaming, gaming, rtc }

**Transitive dependencies**:
- isomorphic-fetch (polyfill)
- Various low-level networking utilities

**Removal impact**:
- Core functionality lost
- Would need alternative speedtest implementation
- No direct replacement available
- Serverless: Load from unpkg.com CDN

**CDN availability**: ✅ Available
```html
<script src="https://unpkg.com/@cloudflare/speedtest@1/dist/speedtest.js"></script>
```

---

## Development Dependencies

### 3. Vite (^6.0.7)

**Purpose**: Build tool and dev server
**Size**: ~15 MB (with dependencies)
**License**: MIT
**Maintainer**: Evan You / Vite Team

**What it provides**:
- Dev server with HMR
- ES module handling
- Asset processing
- Production bundling (via Rollup)
- Plugin system

**Usage in project**:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

**Commands**:
- `vite`: Start dev server
- `vite build`: Production build
- `vite preview`: Preview production build

**Transitive dependencies** (major):
- esbuild: Fast JavaScript/TypeScript bundler
- rollup: Production bundler
- picocolors: Terminal colors
- postcss: CSS processing

**Removal impact**:
- No dev server (use browser directly)
- No HMR (manual refresh)
- No automatic bundling
- Benefits: Zero build time, instant updates
- Serverless: Not needed (development convenience only)

---

### 4. @vitejs/plugin-vue (^5.2.1)

**Purpose**: Vue.js integration for Vite
**Size**: ~200 KB
**License**: MIT
**Maintainer**: Vite Team

**What it provides**:
- `.vue` Single File Component compilation
- Template → render function conversion
- Scoped CSS processing
- Hot Module Replacement for Vue components

**Usage in project**:
```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

**Removal impact**:
- Cannot compile .vue files
- Must use plain .js components with template strings
- Serverless: Not needed (runtime Vue handles templates)

---

## Transitive Dependency Highlights

### Notable Indirect Dependencies

**Rollup** (via Vite)
- Production bundler
- Tree-shaking
- Code splitting
- Asset optimization

**esbuild** (via Vite)
- TypeScript/JSX compilation
- Minification
- Extremely fast build times

**PostCSS** (via Vite)
- CSS transformation
- Autoprefixer
- CSS minification

**d3-* libraries** (via @cloudflare/speedtest)
- d3-scale, d3-array, d3-format, d3-interpolate
- Data visualization utilities
- Used for graph rendering (if enabled)

**isomorphic-fetch** (via @cloudflare/speedtest)
- Fetch API polyfill
- Cross-environment compatibility

---

## Dependency Security

### Vulnerability Scan
```bash
npm audit
```

**Current Status**: No known vulnerabilities (as of 2026-03-23)

### Update Policy
- Vue: Follow stable releases
- Cloudflare SDK: Monitor for updates
- Vite: Update with caution (test builds)

### Security Considerations
- All dependencies are from reputable sources
- MIT/BSD licenses (permissive)
- Regular security patches from maintainers
- No deprecated packages

---

## CDN Availability Analysis

### Can be loaded from CDN

✅ **Vue.js**
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<!-- Global: window.Vue -->
```

✅ **@cloudflare/speedtest**
```html
<script src="https://unpkg.com/@cloudflare/speedtest@1/dist/speedtest.js"></script>
<!-- Global: window.SpeedTest -->
```

### Cannot be loaded from CDN (dev-only)

❌ **Vite** - Build tool, not runtime library
❌ **@vitejs/plugin-vue** - Build tool plugin

---

## Serverless Migration Impact

### What to keep
- Vue.js (load from CDN instead of bundling)
- @cloudflare/speedtest (load from CDN)

### What to remove
- Vite (not needed without build step)
- @vitejs/plugin-vue (not needed without build step)
- All transitive dev dependencies

### Size comparison

**Current (bundled)**:
```
node_modules/: ~150 MB
dist/ (built): ~300 KB
```

**Serverless (CDN)**:
```
Project files: ~100 KB (HTML + CSS + JS components)
CDN dependencies: ~250 KB (cached across sites)
Total first load: ~350 KB
Total repeat load: ~100 KB (CDN cached)
```

---

## Alternative Dependency Options

### Vue.js Alternatives

**Preact** (3 KB)
- React-compatible API
- Smaller bundle size
- Slightly different ecosystem
- Would require component rewrites

**Petite-Vue** (6 KB)
- Vue-compatible syntax
- Subset of Vue 3 features
- Alpine.js-like approach
- May lack some advanced features

**Vanilla JS**
- Zero dependencies
- Maximum control
- More manual DOM management
- Higher development effort

**Web Components**
- Native browser API
- Reusable custom elements
- Less framework overhead
- Limited IE support

### Speedtest SDK Alternatives

**speed-cloudflare-cli** (community)
- CLI tool, not browser library
- Would need adaptation

**Custom implementation**
- Use Fetch API + Resource Timing
- Significant development effort
- May lack accuracy
- Not recommended

**No viable alternatives** - Cloudflare SDK is best option

---

## Package.json Simplified (Serverless)

### Before (Current)
```json
{
  "name": "cloudflare-speedtest",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@cloudflare/speedtest": "^1.7.0",
    "vue": "^3.5.27"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "vite": "^6.0.7"
  }
}
```

### After (Serverless)
```json
{
  "name": "cloudflare-speedtest",
  "version": "2.0.0",
  "description": "Serverless HTML5 Cloudflare Speedtest (no build required)",
  "scripts": {
    "serve": "python -m http.server 8000"
  }
}
```

**OR**: Delete package.json entirely (no Node.js needed!)

---

## License Compliance

### All Dependencies - MIT or BSD License

**MIT License** (permissive):
- Vue.js
- Vite
- @vitejs/plugin-vue

**BSD-3-Clause** (permissive):
- @cloudflare/speedtest

**Implications**:
- Commercial use allowed
- Modification allowed
- Distribution allowed
- No copyleft requirements
- Attribution required (preserved in code comments)

---

## Dependency Graph

```
cloudflare-speedtest
├── vue@3.5.27 (prod)
│   ├── @vue/shared
│   ├── @vue/reactivity
│   ├── @vue/runtime-dom
│   └── @vue/runtime-core
├── @cloudflare/speedtest@1.7.0 (prod)
│   ├── isomorphic-fetch
│   ├── d3-scale
│   ├── d3-array
│   ├── d3-format
│   └── ... (networking utils)
├── vite@6.0.7 (dev)
│   ├── esbuild
│   ├── rollup
│   ├── postcss
│   ├── picocolors
│   └── ... (~100 transitive deps)
└── @vitejs/plugin-vue@5.2.1 (dev)
    ├── @vue/compiler-sfc
    └── ... (Vue compilation tools)
```

---

## Recommendations

### For Serverless Migration

1. **Remove all dev dependencies** - Not needed
2. **Load Vue from CDN** - unpkg.com or jsdelivr.com
3. **Load Cloudflare SDK from CDN** - unpkg.com
4. **Use SRI hashes** - Ensure CDN integrity
5. **Local fallback** - Copy CDN scripts locally as backup

### SRI (Subresource Integrity) Example

```html
<script
  src="https://unpkg.com/vue@3.5.27/dist/vue.global.prod.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

### Version Pinning

❌ **Don't use latest**:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
```

✅ **Pin specific version**:
```html
<script src="https://unpkg.com/vue@3.5.27/dist/vue.global.prod.js"></script>
```

---

**Maintained By**: Developer Council
**Last Audit**: 2026-03-23
**Next Review**: 2026-06-23
