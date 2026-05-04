import SpeedTestEngine from '@cloudflare/speedtest'

/**
 * Custom composable that wraps the Cloudflare SpeedTest SDK
 * with enhanced parallel execution for bandwidth tests
 */
export function useCloudflareSpeedTest() {

  /**
   * Creates a SpeedTest instance with custom parallel bandwidth measurements
   * while preserving all other SDK functionality
   */
  const createSpeedTest = (config = {}) => {
    const {
      parallelStreams = 6,
      testDuration = 10,
      latencyPackets = 20,
      enableLogging = true,
      measureDownloadLoadedLatency = true,
      measureUploadLoadedLatency = true,
      loadedLatencyThrottle = 400
    } = config

    // Create measurements array with custom parallel bandwidth tests
    const measurements = [
      // 1. Initial latency estimation
      { type: 'latency', numPackets: 1 },

      // 2. Quick download estimation
      { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },

      // 3. Comprehensive unloaded latency
      { type: 'latency', numPackets: latencyPackets },

      // 4. Progressive download warm-up
      { type: 'download', bytes: 1e5, count: 9 },
      { type: 'download', bytes: 1e6, count: 8 },

      // 5. CUSTOM: Parallel download test (main bandwidth measurement)
      // This will be handled specially with parallel streams
      { type: 'download', bytes: 1e7, count: 6 },
      { type: 'download', bytes: 2.5e7, count: 4 },
      { type: 'download', bytes: 1e8, count: 3 },

      // 6. Upload warm-up
      { type: 'upload', bytes: 1e5, count: 8 },

      // 7. Packet loss measurement
      { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },

      // 8. CUSTOM: Parallel upload test (main bandwidth measurement)
      { type: 'upload', bytes: 1e6, count: 6 },
      { type: 'upload', bytes: 1e7, count: 4 },
      { type: 'upload', bytes: 2.5e7, count: 4 },
      { type: 'upload', bytes: 5e7, count: 3 },

      // 9. Final download burst
      { type: 'download', bytes: 2.5e8, count: 2 }
    ]

    // Create SDK instance with configuration
    const speedTest = new SpeedTestEngine({
      autoStart: false,
      downloadApiUrl: 'https://speed.cloudflare.com/__down',
      uploadApiUrl: 'https://speed.cloudflare.com/__up',
      measurements,
      measureDownloadLoadedLatency,
      measureUploadLoadedLatency,
      loadedLatencyThrottle,
      bandwidthFinishRequestDuration: 1000,
      latencyPercentile: 0.5,
      bandwidthPercentile: 0.9,
      bandwidthMinRequestDuration: 500,
      loadedRequestMinDuration: 1000,
      loadedLatencyMaxPoints: 20
    })

    // Store config for logging
    speedTest._customConfig = {
      parallelStreams,
      testDuration,
      latencyPackets,
      enableLogging
    }

    return speedTest
  }

  /**
   * Parallel bandwidth test enhancement
   * This runs alongside SDK measurements to max out bandwidth with parallel streams
   */
  const runParallelBandwidthTest = async (type, parallelStreams, duration, onProgress) => {
    console.log(`🔥 Running parallel ${type} test (${parallelStreams} streams, ${duration}s)...`)

    const baseUrl = type === 'download'
      ? 'https://speed.cloudflare.com/__down'
      : 'https://speed.cloudflare.com/__up'

    const chunkSize = 1e7 // 10 MB chunks
    let totalBytes = 0
    let isRunning = true
    const startTime = Date.now()

    // Create random data buffer for uploads
    const createDataBuffer = (size) => {
      const buffer = new Uint8Array(size)
      crypto.getRandomValues(buffer)
      return buffer
    }

    // Single stream function
    const runStream = async (streamId) => {
      let streamBytes = 0
      while (isRunning) {
        try {
          const chunkStart = Date.now()

          if (type === 'download') {
            const response = await fetch(`${baseUrl}?bytes=${chunkSize}`, {
              cache: 'no-store',
              priority: 'high'
            })
            const buffer = await response.arrayBuffer()
            streamBytes += buffer.byteLength
            totalBytes += buffer.byteLength
          } else {
            const data = createDataBuffer(chunkSize)
            await fetch(baseUrl, {
              method: 'POST',
              body: data,
              cache: 'no-store',
              priority: 'high'
            })
            streamBytes += data.byteLength
            totalBytes += data.byteLength
          }

          const elapsed = (Date.now() - startTime) / 1000
          const currentSpeed = (totalBytes * 8) / (elapsed * 1e6) // Mbps

          if (onProgress) {
            onProgress({
              type,
              speed: currentSpeed * 1e6, // bps
              bytes: totalBytes,
              elapsed
            })
          }

          if (elapsed >= duration) {
            isRunning = false
            break
          }
        } catch (err) {
          console.error(`Stream ${streamId} error:`, err)
          break
        }
      }
      return streamBytes
    }

    // Stop after duration
    setTimeout(() => { isRunning = false }, duration * 1000)

    // Launch all parallel streams
    await Promise.all(
      Array(parallelStreams).fill(null).map((_, i) => runStream(i + 1))
    )

    const totalDuration = (Date.now() - startTime) / 1000
    const avgSpeed = (totalBytes * 8) / (totalDuration * 1e6)

    console.log(`✅ Parallel ${type} complete: ${(totalBytes / 1e6).toFixed(1)} MB in ${totalDuration.toFixed(2)}s = ${avgSpeed.toFixed(1)} Mbps`)

    return {
      speed: avgSpeed * 1e6, // bps
      bytes: totalBytes,
      duration: totalDuration
    }
  }

  /**
   * Log results to Cloudflare AIM endpoint
   */
  const logResultsToCloudflare = async (results, customConfig) => {
    try {
      const summary = results.getSummary()
      const scores = results.getScores()

      const logData = {
        type: 'cloudflare-speedtest',
        version: '1.7.0',
        timestamp: new Date().toISOString(),
        summary,
        scores,
        config: customConfig,
        client: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
          } : undefined
        }
      }

      console.log('📤 Logging results to Cloudflare AIM...', logData)

      const response = await fetch('https://aim.cloudflare.com/__log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData),
        cache: 'no-store'
      })

      if (response.ok) {
        console.log('✅ Results logged to Cloudflare AIM successfully')
      } else {
        console.warn('⚠️ AIM logging response:', response.status, response.statusText)
      }
    } catch (error) {
      console.warn('⚠️ Failed to log results to AIM:', error.message)
    }
  }

  return {
    createSpeedTest,
    runParallelBandwidthTest,
    logResultsToCloudflare
  }
}
