<template>
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
      :test-duration="testDuration"
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
</template>

<script>
import { ref, computed, watch, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import SpeedTestControls from './components/SpeedTestControls.vue'
import RetroSpeedTest from './components/RetroSpeedTest.vue'
import QualityScores from './components/QualityScores.vue'
import SummaryDetails from './components/SummaryDetails.vue'
import UltimateQuestionOverlay from './components/UltimateQuestionOverlay.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    SpeedTestControls,
    RetroSpeedTest,
    QualityScores,
    SummaryDetails,
    UltimateQuestionOverlay
  },
  setup() {
    const isRunning = ref(false)
    const showOverlay = ref(false)
    const testDuration = ref(0)
    const timerInterval = ref(null)
    const testStartTime = ref(null)
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

    // Watch isRunning to start/stop timer
    watch(isRunning, (running) => {
      if (running) {
        // Start timer
        testStartTime.value = Date.now()
        testDuration.value = 0
        timerInterval.value = setInterval(() => {
          testDuration.value = Math.floor((Date.now() - testStartTime.value) / 1000)
        }, 100) // Update every 100ms for smooth updates
      } else {
        // Stop timer
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }
      }
    })

    // Cleanup on unmount
    onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
    })

    const measureLatency = async (numPackets = 20) => {
      console.log(`📡 Measuring latency (${numPackets} packets)...`)
      const latencies = []

      for (let i = 0; i < numPackets; i++) {
        const start = performance.now()
        try {
          await fetch('https://speed.cloudflare.com/__down?bytes=1', { cache: 'no-store' })
          const latency = performance.now() - start
          latencies.push(latency)
        } catch (err) {
          console.error('Latency measurement failed:', err)
        }
      }

      latencies.sort((a, b) => a - b)
      const median = latencies[Math.floor(latencies.length / 2)]
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
      const jitter = Math.sqrt(latencies.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / latencies.length)

      console.log(`  Latency: ${median.toFixed(1)}ms (median), Jitter: ${jitter.toFixed(1)}ms`)
      return { latency: median, jitter, latencies }
    }

    const parallelDownloadTest = async (parallelStreams = 6, duration = 10) => {
      console.log(`🔽 Starting parallel download test (${parallelStreams} streams, ${duration}s)...`)

      const baseUrl = 'https://speed.cloudflare.com/__down'
      const chunkSize = 1e7  // 10 MB chunks
      const measurements = []
      let totalBytes = 0
      let isRunning = true

      const startTime = Date.now()

      // Function to continuously download on a single stream
      const downloadStream = async (streamId) => {
        let streamBytes = 0
        while (isRunning) {
          try {
            const chunkStart = Date.now()
            const response = await fetch(`${baseUrl}?bytes=${chunkSize}`, {
              cache: 'no-store',
              priority: 'high'
            })
            const buffer = await response.arrayBuffer()
            const chunkDuration = (Date.now() - chunkStart) / 1000

            streamBytes += buffer.byteLength
            totalBytes += buffer.byteLength

            const elapsed = (Date.now() - startTime) / 1000
            const currentSpeed = (totalBytes * 8) / (elapsed * 1e6)

            measurements.push({
              time: elapsed,
              bytes: totalBytes,
              speed: currentSpeed
            })

            // Update results in real-time
            results.value.download = currentSpeed * 1e6  // Convert to bps for consistency

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
      const streamResults = await Promise.all(
        Array(parallelStreams).fill(null).map((_, i) => downloadStream(i + 1))
      )

      const totalDuration = (Date.now() - startTime) / 1000
      const avgSpeed = (totalBytes * 8) / (totalDuration * 1e6)

      console.log(`✅ Download complete: ${(totalBytes / 1e6).toFixed(1)} MB in ${totalDuration.toFixed(2)}s = ${avgSpeed.toFixed(1)} Mbps`)

      return {
        speed: avgSpeed * 1e6,  // bps
        bytes: totalBytes,
        duration: totalDuration,
        measurements
      }
    }

    const parallelUploadTest = async (parallelStreams = 6, duration = 10) => {
      console.log(`🔼 Starting parallel upload test (${parallelStreams} streams, ${duration}s)...`)

      const baseUrl = 'https://speed.cloudflare.com/__up'
      const chunkSize = 1e7  // 10 MB chunks
      let totalBytes = 0
      let isRunning = true

      const startTime = Date.now()

      // Create random data buffer
      const createDataBuffer = (size) => {
        const buffer = new Uint8Array(size)
        crypto.getRandomValues(buffer)
        return buffer
      }

      const uploadStream = async (streamId) => {
        let streamBytes = 0
        while (isRunning) {
          try {
            const data = createDataBuffer(chunkSize)
            const chunkStart = Date.now()

            await fetch(baseUrl, {
              method: 'POST',
              body: data,
              cache: 'no-store',
              priority: 'high'
            })

            const chunkDuration = (Date.now() - chunkStart) / 1000
            streamBytes += data.byteLength
            totalBytes += data.byteLength

            const elapsed = (Date.now() - startTime) / 1000
            const currentSpeed = (totalBytes * 8) / (elapsed * 1e6)

            results.value.upload = currentSpeed * 1e6  // Convert to bps

            if (elapsed >= duration) {
              isRunning = false
              break
            }
          } catch (err) {
            console.error(`Upload stream ${streamId} error:`, err)
            break
          }
        }
        return streamBytes
      }

      setTimeout(() => { isRunning = false }, duration * 1000)

      const streamResults = await Promise.all(
        Array(parallelStreams).fill(null).map((_, i) => uploadStream(i + 1))
      )

      const totalDuration = (Date.now() - startTime) / 1000
      const avgSpeed = (totalBytes * 8) / (totalDuration * 1e6)

      console.log(`✅ Upload complete: ${(totalBytes / 1e6).toFixed(1)} MB in ${totalDuration.toFixed(2)}s = ${avgSpeed.toFixed(1)} Mbps`)

      return {
        speed: avgSpeed * 1e6,  // bps
        bytes: totalBytes,
        duration: totalDuration
      }
    }

    const startTest = async () => {
      console.log('🚀 Starting parallel speedtest...')

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

      // Mark as running
      isRunning.value = true

      try {
        // Show overlay
        setTimeout(() => {
          showOverlay.value = true
        }, 500)

        // 1. Initial latency (unloaded)
        const latencyResult = await measureLatency(20)
        results.value.latency = latencyResult.latency
        results.value.jitter = latencyResult.jitter

        // 2. Parallel download test (maintains multiple connections)
        const downloadResult = await parallelDownloadTest(6, 10)
        results.value.download = downloadResult.speed

        // 3. Latency under download load
        const downloadLatencyResult = await measureLatency(10)
        results.value.downloadLatency = downloadLatencyResult.latency
        results.value.downloadJitter = downloadLatencyResult.jitter

        // 4. Parallel upload test
        const uploadResult = await parallelUploadTest(6, 10)
        results.value.upload = uploadResult.speed

        // 5. Latency under upload load
        const uploadLatencyResult = await measureLatency(10)
        results.value.uploadLatency = uploadLatencyResult.latency
        results.value.uploadJitter = uploadLatencyResult.jitter

        // Build summary
        summary.value = {
          download: results.value.download,
          upload: results.value.upload,
          latency: results.value.latency,
          jitter: results.value.jitter,
          downloadLatency: results.value.downloadLatency,
          downloadJitter: results.value.downloadJitter,
          uploadLatency: results.value.uploadLatency,
          uploadJitter: results.value.uploadJitter,
          packetLoss: results.value.packetLoss
        }

        console.log('✅ Test complete!', summary.value)

        // Calculate simple quality scores
        scores.value = calculateScores(summary.value)

      } catch (error) {
        console.error('Error during speedtest:', error)
        alert('Error during test: ' + error.message)
      } finally {
        isRunning.value = false
        showOverlay.value = false
      }
    }

    const calculateScores = (summary) => {
      const scoreMetric = (value, thresholds) => {
        const [bad, poor, avg, good] = thresholds
        if (value >= good) return { points: 100, classificationIdx: 4, classificationName: 'great' }
        if (value >= avg) return { points: 75, classificationIdx: 3, classificationName: 'good' }
        if (value >= poor) return { points: 50, classificationIdx: 2, classificationName: 'average' }
        if (value >= bad) return { points: 25, classificationIdx: 1, classificationName: 'poor' }
        return { points: 10, classificationIdx: 0, classificationName: 'bad' }
      }

      return {
        download: scoreMetric(summary.download / 1e6, [5, 25, 50, 100]),
        upload: scoreMetric(summary.upload / 1e6, [2, 10, 25, 50]),
        latency: scoreMetric(100 - summary.latency, [-100, 0, 50, 80]),  // Lower is better, invert
        jitter: scoreMetric(50 - summary.jitter, [-50, 0, 25, 45])  // Lower is better, invert
      }
    }

    const stopTest = () => {
      console.log('Stopping test...')
      isRunning.value = false
      showOverlay.value = false
    }

    const handleCorrectAnswer = () => {
      console.log('Correct answer! Hiding overlay...')
      showOverlay.value = false
    }

    return {
      isRunning,
      showOverlay,
      testDuration,
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
</script>
