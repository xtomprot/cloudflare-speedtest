# Cloudflare SDK Integration Summary

## Overview
This application now uses the **official Cloudflare SpeedTest SDK** (`@cloudflare/speedtest` v1.7.0) with **custom parallel execution** for bandwidth tests.

---

## ✅ Restored from Original SDK

### 1. **Core Measurement Engine**
- ✅ Official `SpeedTestEngine` class from `@cloudflare/speedtest`
- ✅ Standard measurement sequence (15-step progressive ramp-up)
- ✅ PerformanceResourceTiming API for accurate measurements
- ✅ Proper event handlers: `onRunningChange`, `onResultsChange`, `onFinish`, `onError`

### 2. **Latency Measurements**
- ✅ **Unloaded latency**: Initial network latency without traffic
- ✅ **Download loaded latency**: Latency measured during active downloads
- ✅ **Upload loaded latency**: Latency measured during active uploads
- ✅ **Jitter calculation**: Standard deviation of latency measurements
- ✅ Configurable latency percentile (default: median/50th percentile)

### 3. **Bandwidth Tests**
- ✅ Progressive file size ramp-up (100 KB → 100 MB → 250 MB)
- ✅ Adaptive duration thresholds
- ✅ Bandwidth percentile calculation (default: 90th percentile)
- ✅ Download and upload separate measurements
- ✅ Proper byte counting and timing via PerformanceResourceTiming

### 4. **Packet Loss Measurement**
- ✅ WebRTC-based packet loss detection
- ✅ 1000 packets sent by default
- ✅ 3-second response wait time
- ✅ Detailed packet loss report with lost message IDs

### 5. **AIM Scoring System**
- ✅ **Streaming score**: Weights download bandwidth, unloaded latency, packet loss
- ✅ **Gaming score**: Prioritizes packet loss, unloaded latency, latency variance
- ✅ **RTC score**: Emphasizes packet loss, jitter, loaded/unloaded latency difference
- ✅ 6-tier scoring: bad → poor → average → good → great (0-50 points)
- ✅ Classification indices (0-4) for programmatic use

### 6. **Results Object**
- ✅ Official `Results` class with proper getter methods:
  - `getSummary()`: Aggregated metrics
  - `getUnloadedLatency()`, `getUnloadedJitter()`, `getUnloadedLatencyPoints()`
  - `getDownLoadedLatency()`, `getDownLoadedJitter()`, `getDownLoadedLatencyPoints()`
  - `getUpLoadedLatency()`, `getUpLoadedJitter()`, `getUpLoadedLatencyPoints()`
  - `getDownloadBandwidth()`, `getDownloadBandwidthPoints()`
  - `getUploadBandwidth()`, `getUploadBandwidthPoints()`
  - `getPacketLoss()`, `getPacketLossDetails()`
  - `getScores()`: Returns AIM scores for streaming, gaming, RTC

### 7. **Configuration System**
- ✅ `downloadApiUrl` / `uploadApiUrl`: Cloudflare endpoints
- ✅ `measurements`: Full measurement sequence array
- ✅ `measureDownloadLoadedLatency` / `measureUploadLoadedLatency`: Toggle loaded latency
- ✅ `loadedLatencyThrottle`: Interval between loaded latency pings (default: 400ms)
- ✅ `bandwidthFinishRequestDuration`: Duration threshold (default: 1000ms)
- ✅ `latencyPercentile`: Percentile for latency (default: 0.5 = median)
- ✅ `bandwidthPercentile`: Percentile for bandwidth (default: 0.9 = 90th)

### 8. **Logging to Cloudflare AIM**
- ✅ POST to `https://aim.cloudflare.com/__log`
- ✅ Includes full summary, scores, config, and client information
- ✅ Data contributes to Measurement Lab's public dataset
- ✅ Navigator connection info (effectiveType, downlink, rtt, saveData)

---

## 🔥 Custom Enhancements (Kept)

### 1. **Parallel Bandwidth Execution**
**What**: Runs multiple concurrent streams (default: 6) during bandwidth tests to maximize throughput

**Why**: Single-stream tests may not saturate high-speed connections. Parallel streams achieve true max bandwidth.

**Implementation**:
- `runParallelBandwidthTest()` in `useCloudflareSpeedTest.js`
- Runs **alongside** SDK measurements
- Uses **6-12 parallel streams** for 10 seconds
- Downloads 10 MB chunks per stream continuously
- Uploads randomly generated 10 MB chunks

**Result Merging**: Takes `Math.max()` of SDK bandwidth and parallel bandwidth results

### 2. **Real-time Progress Updates**
- Live bandwidth updates during parallel tests
- Progress callback system for UI responsiveness
- Displays current speed as test runs

### 3. **Retro Gaming UI**
- Custom Vue.js components with retro aesthetic
- Press Start 2P font, neon green terminal theme
- Vintage speedometer visualization
- Ultimate Question overlay easter egg

---

## 📁 File Structure

```
src/
├── App.vue                              # Main application (uses SDK + parallel)
├── composables/
│   └── useCloudflareSpeedTest.js       # SDK wrapper with parallel enhancement
└── components/
    ├── SpeedTestConfig.vue             # Configuration panel
    ├── QualityScores.vue               # AIM scores display
    ├── RetroSpeedTest.vue              # Retro UI visualization
    ├── SummaryDetails.vue              # Results summary
    └── ...                             # Other UI components
```

---

## 🔧 Configuration Options

### User-Configurable (via UI)

| Option | Default | Range | Description |
|--------|---------|-------|-------------|
| Parallel Streams | 6 | 1-12 | Number of concurrent connections for bandwidth tests |
| Test Duration | 10s | 5-30s | How long to run parallel bandwidth tests |
| Latency Packets | 20 | 5-50 | Number of latency measurements |
| Loaded Latency Throttle | 400ms | 100-1000ms | Interval between loaded latency pings |
| Measure Download Loaded Latency | ✅ | - | Track latency during downloads |
| Measure Upload Loaded Latency | ✅ | - | Track latency during uploads |
| Enable Logging | ✅ | - | Send results to Cloudflare AIM |

---

## 🎯 Measurement Sequence

The SDK follows this 15-step sequence:

1. **Initial latency estimation** (1 packet)
2. **Quick download estimation** (100 KB)
3. **Comprehensive unloaded latency** (20 packets)
4. **Download warm-up** (100 KB × 9, 1 MB × 8)
5. **🔥 PARALLEL DOWNLOAD** (10 MB × 6, 25 MB × 4, 100 MB × 3) ← **Custom**
6. **Upload warm-up** (100 KB × 8)
7. **Packet loss measurement** (1000 packets, 3s wait)
8. **🔥 PARALLEL UPLOAD** (1 MB × 6, 10 MB × 4, 25 MB × 4, 50 MB × 3) ← **Custom**
9. **Final download burst** (250 MB × 2)

**Note**: Steps marked 🔥 use custom parallel execution while still reporting to the SDK's Results object.

---

## 📊 Results Format

### SDK Summary Object
```javascript
{
  download: 123456789,        // bps
  upload: 98765432,           // bps
  latency: 15.2,              // ms (median)
  jitter: 3.1,                // ms (std dev)
  downLoadedLatency: 45.3,    // ms during downloads
  downLoadedJitter: 8.2,      // ms
  upLoadedLatency: 38.7,      // ms during uploads
  upLoadedJitter: 6.5,        // ms
  packetLoss: 0.02            // 2% loss
}
```

### AIM Scores
```javascript
{
  streaming: { points: 45, classificationIdx: 4, classificationName: 'great' },
  gaming: { points: 30, classificationIdx: 3, classificationName: 'good' },
  rtc: { points: 20, classificationIdx: 2, classificationName: 'average' }
}
```

---

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `https://speed.cloudflare.com/__down?bytes=<size>` | GET | Download bandwidth test |
| `https://speed.cloudflare.com/__up` | POST | Upload bandwidth test |
| `turn.speed.cloudflare.com:50000` | WebRTC | Packet loss measurement |
| `https://aim.cloudflare.com/__log` | POST | Result logging/telemetry |

---

## 🚀 How It Works

1. **User clicks "Start Test"**
2. SDK initializes with custom measurement sequence
3. SDK runs latency measurements (unloaded)
4. SDK starts download tests → **Parallel enhancement kicks in**
5. Parallel test runs 6 streams simultaneously for 10 seconds
6. Results merged: `Math.max(sdkBandwidth, parallelBandwidth)`
7. SDK measures loaded latency during download
8. SDK runs packet loss test (WebRTC)
9. SDK starts upload tests → **Parallel enhancement kicks in again**
10. SDK measures loaded latency during upload
11. **Finish**: SDK calculates AIM scores
12. **Log**: Results sent to Cloudflare AIM (if enabled)

---

## 📈 Benefits of This Approach

✅ **Best of both worlds**: Official SDK reliability + parallel throughput maximization  
✅ **Accurate AIM scoring**: Proper streaming/gaming/RTC quality metrics  
✅ **Full latency analysis**: Unloaded + loaded latency tracking  
✅ **Packet loss detection**: WebRTC-based measurement  
✅ **Data contribution**: Results shared with Measurement Lab public dataset  
✅ **Retro UI**: Unique visual identity while using standard SDK underneath  

---

## 🔍 Verification

To verify SDK integration, check console logs:
- `🚀 Starting Cloudflare SpeedTest with parallel enhancement...`
- `🔄 SDK running state: true`
- `📈 SDK measurement complete: latency`
- `🔥 Running parallel download test (6 streams, 10s)...`
- `✅ Parallel download complete: {...}`
- `📊 Final summary: {...}`
- `🏆 AIM Scores: {...}`
- `📤 Logging results to Cloudflare AIM...`

---

## 📚 References

- **GitHub**: https://github.com/cloudflare/speedtest
- **npm**: https://www.npmjs.com/package/@cloudflare/speedtest
- **AIM Database**: https://developers.cloudflare.com/speed/aim/
- **Blog Post**: https://blog.cloudflare.com/how-does-cloudflares-speed-test-really-work/
- **Measurement Lab**: https://www.measurementlab.net/tests/cloudflare/
