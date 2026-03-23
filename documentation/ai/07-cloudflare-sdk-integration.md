# Cloudflare SDK Integration Guide

**Package**: @cloudflare/speedtest v1.7.0
**Project**: Cloudflare Speedtest Demo Application
**Last Updated**: 2026-03-23

---

## Executive Summary

This document explains how the **@cloudflare/speedtest SDK** has been integrated into the Vue.js application to provide network performance testing capabilities. The SDK handles all network measurements while the application manages UI presentation and user interaction.

---

## Table of Contents

1. [SDK Overview](#sdk-overview)
2. [Installation & Setup](#installation--setup)
3. [Integration Architecture](#integration-architecture)
4. [SDK Configuration](#sdk-configuration)
5. [Measurement Sequence](#measurement-sequence)
6. [Event Handling](#event-handling)
7. [Results Processing](#results-processing)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## SDK Overview

### What is @cloudflare/speedtest?

The Cloudflare Speedtest SDK is an official JavaScript library that measures network performance by running tests against Cloudflare's global edge network (275+ locations).

**Key Capabilities**:
- **Bandwidth measurement**: Download and upload speeds
- **Latency testing**: Round-trip time to nearest edge
- **Jitter calculation**: Latency variation
- **Packet loss detection**: Network reliability
- **Quality scoring**: Streaming, gaming, RTC quality ratings

**How it works**:
1. Connects to nearest Cloudflare edge server
2. Transfers data in controlled measurements
3. Uses browser Performance API for accurate timing
4. Calculates metrics in real-time
5. Provides event-driven updates

**Network Endpoints**: Managed automatically by SDK (no configuration needed)

---

## Installation & Setup

### Package Installation

**Current implementation**:
```bash
npm install @cloudflare/speedtest
```

**Package.json**:
```json
{
  "dependencies": {
    "@cloudflare/speedtest": "^1.7.0"
  }
}
```

**Import in application**:
```javascript
// src/App.vue
import SpeedTest from '@cloudflare/speedtest'
```

### CDN Alternative (Serverless)

**For serverless deployment**:
```html
<script src="https://unpkg.com/@cloudflare/speedtest@1.7.0/dist/speedtest.js"></script>
```

**Global access**:
```javascript
const SpeedTest = window.SpeedTest
```

---

## Integration Architecture

### Component Integration Point

**Location**: `src/App.vue` (Root component)

**Architecture Pattern**: SDK Facade
- App.vue acts as facade/adapter between SDK and UI components
- SDK instance isolated from Vue reactivity system
- Event-driven communication pattern
- Unidirectional data flow (SDK → App → Children)

### Sequence Diagram

**Complete API interaction flow documented in**:
`cloudflare-sdk-sequence-diagram.puml`

The PlantUML sequence diagram visualizes:
- Full test lifecycle (initialization → 11 measurements → completion)
- Event handler registration and callbacks
- Real-time data flow between SDK, App, and UI components
- Measurement sequence timing and network requests
- User interaction patterns

**To view**: Open `cloudflare-sdk-sequence-diagram.puml` in PlantUML viewer or IDE with PlantUML support.

### Data Flow Diagram (Simplified)

```
User Click "Start Test"
        ↓
SpeedTestControls (emit start-test)
        ↓
App.vue (startTest method)
        ↓
new SpeedTest({ config }) → SDK Instance Created
        ↓
speedTest.play() → Test Starts
        ↓
SDK Events → onRunningChange, onResultsChange, onFinish
        ↓
Update Vue Reactive State (results, scores, summary)
        ↓
Component Re-render (RetroSpeedTest, QualityScores, etc.)
        ↓
User Sees Real-time Updates
```

**For detailed sequence**: See `cloudflare-sdk-sequence-diagram.puml`

---

## SDK Configuration

### Instance Creation

**Location**: `src/App.vue` lines 105-120

```javascript
const speedTest = ref(null)

const startTest = () => {
  // Create new SpeedTest instance
  speedTest.value = markRaw(new SpeedTest({
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
}
```

### Configuration Options Explained

**`autoStart: false`**
- Manual control over when test begins
- Prevents immediate execution on instantiation
- Allows event handlers to be attached first
- Started explicitly with `speedTest.play()`

**`measurements: Array<Measurement>`**
- Defines the sequence of network tests to run
- Executed in order from top to bottom
- Each measurement has specific parameters

**`bandwidthFinishRequestDuration: number`** ⚠️ **CRITICAL FOR CUSTOM MEASUREMENTS**
- **Default**: `1000` (milliseconds)
- **Purpose**: SDK stops further measurements once this duration of transfer time is reached
- **Problem**: Custom measurements ignored if early-stopping threshold is met
- **Symptom**: All test modes transfer same data (~69 MB download, ~47 MB upload) regardless of configuration
- **Solution**: Set to very high value to ensure all measurements complete

```javascript
// ❌ WRONG - SDK will stop after 1 second of transfer
speedTest.value = markRaw(new SpeedTest({
  autoStart: false,
  measurements: customMeasurements  // Will be partially ignored!
}))

// ✅ CORRECT - All measurements execute
speedTest.value = markRaw(new SpeedTest({
  autoStart: false,
  measurements: customMeasurements,
  bandwidthFinishRequestDuration: 999999  // Don't stop early!
}))
```

**Impact of this setting**:
- `1000` (default): Test modes all execute ~same measurements (Quick/Standard/Full identical)
- `999999` (recommended): Test modes execute different measurements (200MB / 600MB / 1.3GB)

**When to use high value**:
- User-configurable test modes (Quick/Standard/Full)
- Custom measurement sequences longer than default
- Accurate sustained bandwidth testing (not quick estimates)

**When default is OK**:
- Using SDK default measurements
- Quick estimate tests only
- Mobile/metered connections (want to stop early)

**Related**: See `10-test-modes-feature.md` for detailed explanation of this issue

### Critical Implementation Detail: `markRaw()`

```javascript
speedTest.value = markRaw(new SpeedTest({ ... }))
```

**Why `markRaw()` is essential**:

The SDK uses **private class fields** internally (e.g., `#privateField`). Vue 3's reactivity system attempts to wrap objects with Proxies to track changes. However, JavaScript Proxies cannot access private fields, causing errors.

**Without `markRaw()`**:
```javascript
speedTest.value = new SpeedTest({ ... })
// Error: TypeError: Cannot read private member from an object whose class did not declare it
```

**With `markRaw()`**:
```javascript
speedTest.value = markRaw(new SpeedTest({ ... }))
// Success: Vue skips reactivity, SDK works normally
```

**Trade-off**: The speedTest instance itself won't be reactive, but that's fine—we store results in separate reactive refs.

---

## Measurement Sequence

### Test Flow Timeline

**Total Duration**: 30-60 seconds (varies by connection speed)

```
1. Initial Latency Check (1 packet)           [0-1s]
   ↓
2. Quick Download Warmup (800 KB)             [1-3s]
   ↓
3. Extended Latency Baseline (20 packets)     [3-5s]
   ↓
4. Progressive Downloads (100KB → 10MB)       [5-20s]
   ↓
5. Upload Warmup (800 KB)                     [20-25s]
   ↓
6. Packet Loss Test (1000 packets)            [25-35s]
   ↓
7. Large Uploads (1MB → 10MB)                 [35-50s]
   ↓
8. Final Large Download (100 MB)              [50-60s]
   ↓
9. Finish Event → Summary & Scores
```

### Measurement Types

#### 1. Latency Measurements

**Purpose**: Measure round-trip time (ping)

**Configuration**:
```javascript
{ type: 'latency', numPackets: 1 }    // Quick check
{ type: 'latency', numPackets: 20 }   // Statistical baseline
```

**Parameters**:
- `numPackets`: Number of ping packets to send
- More packets = more accurate average

**What it measures**:
- Unloaded latency (idle connection)
- Loaded latency (during data transfer)
- Jitter (latency variation)

**Results available**:
- `results.getUnloadedLatency()` → milliseconds
- `results.getUnloadedJitter()` → milliseconds

---

#### 2. Download Measurements

**Purpose**: Measure download bandwidth

**Progressive sizing strategy**:
```javascript
{ type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true }  // 100 KB × 8
{ type: 'download', bytes: 1e5, count: 6 }   // 100 KB × 6
{ type: 'download', bytes: 1e6, count: 6 }   // 1 MB × 6
{ type: 'download', bytes: 1e7, count: 4 }   // 10 MB × 4
{ type: 'download', bytes: 2.5e7, count: 4 } // 25 MB × 4 (final)
```

**Why progressive sizing?**
- **Small files first** (100 KB): Quick warmup, TCP slow-start
- **Medium files** (1 MB): Establish baseline
- **Large files** (10-25 MB): Measure sustained throughput
- **Multiple iterations** (`count`): Statistical accuracy

**Parameters**:
- `bytes`: Size of each download chunk
- `count`: Number of parallel/sequential transfers
- `bypassMinDuration`: Skip minimum duration requirement (for quick tests)

**What it measures**:
- Download bandwidth (bits per second)
- Loaded latency (latency during download)
- Loaded jitter (jitter during download)

**Results available**:
- `results.getDownloadBandwidth()` → bps (bits per second)
- `results.getDownLoadedLatency()` → milliseconds
- `results.getDownLoadedJitter()` → milliseconds

**Note**: SDK method has typo: `getDownLoadedLatency()` (capital L)

---

#### 3. Upload Measurements

**Purpose**: Measure upload bandwidth

**Configuration**:
```javascript
{ type: 'upload', bytes: 1e5, count: 8 }  // 100 KB × 8
{ type: 'upload', bytes: 1e6, count: 6 }  // 1 MB × 6
{ type: 'upload', bytes: 1e7, count: 4 }  // 10 MB × 4
```

**Similar to downloads**: Progressive sizing strategy

**What it measures**:
- Upload bandwidth (bits per second)
- Loaded latency during upload
- Loaded jitter during upload

**Results available**:
- `results.getUploadBandwidth()` → bps
- `results.getUpLoadedLatency()` → milliseconds
- `results.getUpLoadedJitter()` → milliseconds

**Note**: SDK method has typo: `getUpLoadedLatency()` (capital L)

---

#### 4. Packet Loss Measurement

**Purpose**: Detect network reliability issues

**Configuration**:
```javascript
{ type: 'packetLoss', numPackets: 1e3, batchSize: 10 }
```

**Parameters**:
- `numPackets`: 1000 total packets to send
- `batchSize`: 10 packets per batch (parallelization)

**What it measures**:
- Percentage of packets that fail to return
- 0% = perfect connection
- >5% = significant issues

**Results available**:
- `results.getPacketLoss()` → decimal (0.01 = 1%)

**Network impact**: Sends 1000 small packets, ~10-20 KB total

---

## Event Handling

### Event-Driven Architecture

The SDK uses **callback functions** for real-time updates. The application registers three event handlers:

### 1. onRunningChange

**Purpose**: Test start/stop state changes

**Location**: `src/App.vue` lines 125-135

```javascript
speedTest.value.onRunningChange = (running) => {
  console.log('Running state changed:', running)
  isRunning.value = running

  // Show easter egg overlay when test starts
  if (running) {
    setTimeout(() => {
      showOverlay.value = true
    }, 500) // Small delay to let test UI appear first
  }
}
```

**When fired**:
- `running = true`: Test started (after `.play()`)
- `running = false`: Test stopped (after `.pause()` or completion)

**Application behavior**:
- Updates `isRunning` reactive state
- Enables/disables UI controls
- Shows easter egg overlay (Hitchhiker's Guide reference)
- Updates status indicator

---

### 2. onResultsChange

**Purpose**: Real-time metric updates during test

**Location**: `src/App.vue` lines 137-163

```javascript
speedTest.value.onResultsChange = ({ type }) => {
  if (!speedTest.value.results) return

  // Get current results from SDK
  const res = speedTest.value.results

  // Extract all available metrics
  const download = res.getDownloadBandwidth()
  const upload = res.getUploadBandwidth()
  const latency = res.getUnloadedLatency()
  const jitter = res.getUnloadedJitter()
  const downloadLatency = res.getDownLoadedLatency()
  const downloadJitter = res.getDownLoadedJitter()
  const uploadLatency = res.getUpLoadedLatency()
  const uploadJitter = res.getUpLoadedJitter()
  const packetLoss = res.getPacketLoss()

  // Update reactive state only if values exist
  if (download !== null && download !== undefined)
    results.value.download = download
  if (upload !== null && upload !== undefined)
    results.value.upload = upload
  // ... (all metrics)
}
```

**When fired**:
- After each measurement completes
- Multiple times during test (~10-15 times)
- Parameter `type`: String indicating which measurement just completed

**Why check for null/undefined?**
- Not all metrics are available at all times
- Example: `getUploadBandwidth()` returns `null` before upload tests start
- Prevents UI flickering with `null` values

**Application behavior**:
- Updates drum speedometers in real-time
- Updates secondary LED displays (latency, jitter, packet loss)
- Triggers Vue reactivity → component re-renders

**Performance note**: Called frequently, but Vue's reactivity is efficient enough

---

### 3. onFinish

**Purpose**: Final results and quality scores

**Location**: `src/App.vue` lines 165-186

```javascript
speedTest.value.onFinish = (testResults) => {
  console.log('Test finished!', testResults)

  // Get final summary object
  summary.value = testResults.getSummary()
  console.log('Summary:', summary.value)

  // Get quality scores
  scores.value = testResults.getScores()
  console.log('Scores:', scores.value)

  // Update final results (in case onResultsChange missed anything)
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
```

**When fired**:
- Once, after all measurements complete
- ~30-60 seconds after test starts

**Parameter**: `testResults` object with methods:
- `getSummary()`: Final aggregated metrics
- `getScores()`: Quality scores for streaming/gaming/RTC

**Application behavior**:
- Shows final results
- Displays quality score badges
- Shows detailed summary section
- Enables "Start Test" button again

---

## Results Processing

### Results Object Structure

**Accessed via**: `speedTest.value.results`

**Available during test** (onResultsChange):

```javascript
const results = speedTest.value.results

// Bandwidth (bits per second)
const downloadBps = results.getDownloadBandwidth()  // e.g., 50000000 (50 Mbps)
const uploadBps = results.getUploadBandwidth()      // e.g., 10000000 (10 Mbps)

// Latency (milliseconds)
const latency = results.getUnloadedLatency()        // e.g., 15.3 ms
const jitter = results.getUnloadedJitter()          // e.g., 2.1 ms

// Loaded metrics (during data transfer)
const downloadLatency = results.getDownLoadedLatency()  // e.g., 18.7 ms
const downloadJitter = results.getDownLoadedJitter()    // e.g., 4.2 ms
const uploadLatency = results.getUpLoadedLatency()      // e.g., 22.1 ms
const uploadJitter = results.getUpLoadedJitter()        // e.g., 3.8 ms

// Reliability
const packetLoss = results.getPacketLoss()          // e.g., 0.01 (1% loss)
```

**Return values**:
- Number if metric available
- `null` if not yet measured
- `undefined` in some edge cases

---

### Summary Object

**Accessed via**: `testResults.getSummary()` (in onFinish callback)

**Structure**:
```javascript
{
  download: 50000000,        // Download bandwidth (bps)
  upload: 10000000,          // Upload bandwidth (bps)
  latency: 15.3,             // Unloaded latency (ms)
  jitter: 2.1,               // Unloaded jitter (ms)
  downloadLatency: 18.7,     // Loaded download latency (ms)
  downloadJitter: 4.2,       // Loaded download jitter (ms)
  uploadLatency: 22.1,       // Loaded upload latency (ms)
  uploadJitter: 3.8,         // Loaded upload jitter (ms)
  packetLoss: 0.01           // Packet loss (decimal, 0.01 = 1%)
}
```

**Usage in application**:
```javascript
// src/App.vue line 177
results.value.download = summary.value.download
results.value.upload = summary.value.upload
// ... etc
```

**Display conversion** (in components):
```javascript
// Convert bps to Mbps for display
const downloadMbps = summary.value.download / 1e6  // 50000000 → 50 Mbps

// Format latency
const latencyMs = summary.value.latency.toFixed(1)  // 15.3 → "15.3"

// Format packet loss as percentage
const lossPercent = (summary.value.packetLoss * 100).toFixed(1)  // 0.01 → "1.0"
```

---

### Scores Object

**Accessed via**: `testResults.getScores()` (in onFinish callback)

**Structure**:
```javascript
{
  streaming: {
    points: 85,
    classification: 'good'
  },
  gaming: {
    points: 72,
    classification: 'average'
  },
  rtc: {
    points: 91,
    classification: 'great'
  }
}
```

**Score classifications**:
- `'bad'`: 0-25 points (red badge)
- `'poor'`: 26-50 points (orange badge)
- `'average'`: 51-75 points (yellow badge)
- `'good'`: 76-90 points (light green badge)
- `'great'`: 91-100 points (dark green badge)

**How scores are calculated** (by SDK):
- **Streaming**: Download speed + latency + packet loss
  - High download needed
  - Tolerates moderate latency
  - Sensitive to packet loss

- **Gaming**: Latency + jitter + packet loss
  - Very sensitive to latency (<50ms ideal)
  - Jitter must be low
  - Zero packet loss critical

- **RTC (Real-Time Comms)**: Upload + download + latency + jitter
  - Balanced up/down speeds needed
  - Low latency required
  - Jitter must be minimal

**Usage in application**:
```javascript
// src/components/QualityScores.vue
<div class="score-value">{{ scores.streaming.points }}</div>
<div class="score-badge" :class="getScoreClass(scores.streaming.classification)">
  {{ scores.streaming.classification }}
</div>
```

---

## API Reference

### SpeedTest Class

#### Constructor

```javascript
new SpeedTest(config: SpeedTestConfig): SpeedTest
```

**SpeedTestConfig**:
```typescript
{
  autoStart?: boolean          // Default: false
  measurements?: Measurement[] // Array of test definitions
}
```

**Measurement types**:
```typescript
// Latency test
{
  type: 'latency'
  numPackets: number  // Number of ping packets
}

// Download test
{
  type: 'download'
  bytes: number       // Size per chunk
  count: number       // Number of chunks
  bypassMinDuration?: boolean  // Skip min duration check
}

// Upload test
{
  type: 'upload'
  bytes: number
  count: number
}

// Packet loss test
{
  type: 'packetLoss'
  numPackets: number  // Total packets
  batchSize: number   // Packets per batch
}
```

#### Methods

**`.play(): void`**
- Starts or resumes the test
- No parameters
- Triggers onRunningChange(true)

**`.pause(): void`**
- Pauses or stops the test
- No parameters
- Triggers onRunningChange(false)
- Can resume with .play()

#### Properties

**`.results: Results | null`**
- Results object (available during test)
- `null` before test starts
- See Results Object section

#### Event Handlers

**`.onRunningChange: (running: boolean) => void`**
- Callback when test starts/stops
- `running`: true when running, false when stopped

**`.onResultsChange: ({ type: string }) => void`**
- Callback when metrics update
- `type`: Name of measurement that just completed

**`.onFinish: (testResults: TestResults) => void`**
- Callback when test completes
- `testResults`: Object with getSummary() and getScores()

---

### Results Object

**Methods**:

```javascript
getDownloadBandwidth(): number | null      // Download speed (bps)
getUploadBandwidth(): number | null        // Upload speed (bps)
getUnloadedLatency(): number | null        // Idle latency (ms)
getUnloadedJitter(): number | null         // Idle jitter (ms)
getDownLoadedLatency(): number | null      // Download latency (ms) [note typo]
getDownLoadedJitter(): number | null       // Download jitter (ms) [note typo]
getUpLoadedLatency(): number | null        // Upload latency (ms) [note typo]
getUpLoadedJitter(): number | null         // Upload jitter (ms) [note typo]
getPacketLoss(): number | null             // Packet loss (decimal)
```

---

### TestResults Object

**Methods**:

**`getSummary(): Summary`**
```typescript
{
  download: number         // bps
  upload: number          // bps
  latency: number         // ms
  jitter: number          // ms
  downloadLatency: number // ms
  downloadJitter: number  // ms
  uploadLatency: number   // ms
  uploadJitter: number    // ms
  packetLoss: number      // decimal
}
```

**`getScores(): Scores`**
```typescript
{
  streaming: {
    points: number           // 0-100
    classification: string   // 'bad'|'poor'|'average'|'good'|'great'
  },
  gaming: { ... },
  rtc: { ... }
}
```

---

## Best Practices

### 1. Always Use markRaw()

```javascript
// ✅ CORRECT
speedTest.value = markRaw(new SpeedTest({ ... }))

// ❌ WRONG - Will cause errors
speedTest.value = new SpeedTest({ ... })
```

**Why**: SDK uses private fields incompatible with Vue reactivity

---

### 2. Check for Null Before Using Results

```javascript
// ✅ CORRECT
const download = res.getDownloadBandwidth()
if (download !== null && download !== undefined) {
  results.value.download = download
}

// ❌ WRONG - May set null values, causes UI issues
results.value.download = res.getDownloadBandwidth()
```

**Why**: Results are `null` before measurements complete

---

### 3. Create New Instance Per Test

```javascript
// ✅ CORRECT
const startTest = () => {
  speedTest.value = markRaw(new SpeedTest({ ... }))
  speedTest.value.play()
}

// ❌ WRONG - Reusing instances can cause issues
const startTest = () => {
  if (!speedTest.value) {
    speedTest.value = markRaw(new SpeedTest({ ... }))
  }
  speedTest.value.play()  // May have stale state
}
```

**Why**: Ensures clean state for each test

---

### 4. Handle Errors Gracefully

```javascript
try {
  speedTest.value = markRaw(new SpeedTest({ ... }))
  speedTest.value.play()
} catch (error) {
  console.error('Error starting test:', error)
  alert('Error starting test: ' + error.message)
  isRunning.value = false
}
```

**Common errors**:
- Network disconnected
- Browser blocked requests
- SDK initialization failed

---

### 5. Clean Up on Stop

```javascript
const stopTest = () => {
  if (speedTest.value) {
    speedTest.value.pause()
    isRunning.value = false
  }
  showOverlay.value = false
}
```

**Why**: Proper cleanup prevents memory leaks

---

### 6. Reset State Between Tests

```javascript
const startTest = () => {
  // Reset previous results
  results.value = {
    download: null,
    upload: null,
    latency: null,
    // ... all metrics
  }
  scores.value = null
  summary.value = null

  // Create fresh instance
  speedTest.value = markRaw(new SpeedTest({ ... }))
}
```

**Why**: Prevents showing stale data from previous test

---

## Troubleshooting

### Common Issues

#### 1. "TypeError: Cannot read private member"

**Symptom**: Error when creating SpeedTest instance

**Cause**: Missing `markRaw()` wrapper

**Solution**:
```javascript
// Change this:
speedTest.value = new SpeedTest({ ... })

// To this:
speedTest.value = markRaw(new SpeedTest({ ... }))
```

---

#### 2. "SpeedTest is not a constructor"

**Symptom**: Error when using CDN version

**Cause**: Incorrect global access

**Solution**:
```javascript
// CDN exposes as window.SpeedTest (capital S and T)
const SpeedTest = window.SpeedTest

// NOT window.speedTest or window.Speedtest
```

---

#### 3. Results Always Null

**Symptom**: `results.getDownloadBandwidth()` returns null

**Cause**: Accessing results before test completes

**Solution**: Always check for null:
```javascript
const download = res.getDownloadBandwidth()
if (download !== null && download !== undefined) {
  // Use value
}
```

---

#### 4. Test Never Finishes

**Symptom**: onFinish never fires

**Possible causes**:
- Network disconnected
- Browser blocked requests
- Firewall blocking Cloudflare endpoints
- Ad blocker interfering

**Debug**:
```javascript
speedTest.value.onResultsChange = ({ type }) => {
  console.log('Measurement completed:', type)
}
// Check which measurement hangs
```

---

#### 5. Packet Loss Test Deprecated Warning

**Symptom**: Console warning about TURN server

**Message**: "The public TURN server may be deprecated soon"

**Impact**: Packet loss measurement may not work in future versions

**Current status**: Still functional as of v1.7.0

**Future**: May need alternative packet loss testing method

---

## Network Impact

### Bandwidth Consumption Per Test

**Download tests**: ~115 MB
- 100 KB × 14 = 1.4 MB
- 1 MB × 6 = 6 MB
- 10 MB × 4 = 40 MB
- 25 MB × 4 = 100 MB
- **Total**: ~147 MB

**Upload tests**: ~58 MB
- 100 KB × 8 = 0.8 MB
- 1 MB × 6 = 6 MB
- 10 MB × 4 = 40 MB
- **Total**: ~47 MB

**Latency/Packet Loss**: ~0.1 MB

**Total per test**: ~200 MB bandwidth consumed

**Cost implications**:
- On metered connections (mobile data): ~$2-5 per test in some countries
- On unlimited home connections: No cost
- Corporate networks: Possible bandwidth policy violations

---

## SDK Limitations

### Current Limitations (v1.7.0)

1. **Browser-only**: No Node.js server-side testing
2. **Single test at a time**: Cannot run multiple tests concurrently
3. **No test cancellation**: `.pause()` stops but doesn't clean up
4. **No custom endpoints**: Always uses Cloudflare's edge network
5. **No historical data**: Results not persisted between tests
6. **Packet loss may deprecate**: Warning about TURN server

### Browser Requirements

**Minimum versions**:
- Chrome 61+ (ES6 modules, Performance API)
- Firefox 60+
- Safari 11+
- Edge 79+ (Chromium-based)

**Required APIs**:
- Fetch API
- Performance Resource Timing API
- ES6 Promises
- ES6 Classes

---

## Future Considerations

### Potential Enhancements

**Application-level**:
- Store test history in localStorage
- Export results to CSV/JSON
- Compare multiple test results
- Graph results over time
- Custom measurement configurations (UI controls)

**SDK-level** (if official SDK adds features):
- Custom server endpoints
- Historical data persistence
- Test scheduling
- Result comparison APIs
- WebSocket for real-time updates

---

## Resources

### Official Documentation

- **NPM Package**: https://www.npmjs.com/package/@cloudflare/speedtest
- **GitHub Repository**: https://github.com/cloudflare/speedtest
- **Official Speedtest**: https://speed.cloudflare.com/
- **How It Works**: https://blog.cloudflare.com/how-does-cloudflares-speed-test-really-work/

### Related Technologies

- **Cloudflare Network**: https://www.cloudflare.com/network/
- **Performance API**: https://developer.mozilla.org/en-US/docs/Web/API/Performance
- **Resource Timing**: https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API

---

## Summary

The Cloudflare SDK integration in this project demonstrates:

✅ **Proper isolation**: markRaw() prevents reactivity issues
✅ **Event-driven updates**: Real-time UI without polling
✅ **Progressive testing**: Optimized measurement sequence
✅ **Comprehensive metrics**: 9 different measurements
✅ **User experience**: Visual feedback during 30-60s test
✅ **Quality scoring**: Practical use-case ratings

**Key takeaway**: The SDK handles all network complexity; the application focuses on presentation and user interaction.

---

**Document Version**: 1.0
**Last Updated**: 2026-03-23
**Maintained By**: Developer Council
**Next Review**: When SDK updates to v2.0
