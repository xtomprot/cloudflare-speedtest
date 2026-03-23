<template>
  <div class="container">
    <AppHeader />
    <TestModeSelector
      :is-running="isRunning"
      :initial-mode="testMode"
      @mode-changed="handleModeChange"
    />
    <SpeedTestControls
      :is-running="isRunning"
      :status-text="statusText"
      :status-class="statusClass"
      @start-test="startTest"
      @stop-test="stopTest"
    />
    <DataTransferDisplay
      v-if="dataTransferred.total > 0"
      :download-bytes="dataTransferred.download"
      :upload-bytes="dataTransferred.upload"
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
</template>

<script>
import { ref, computed, markRaw } from 'vue'
import SpeedTest from '@cloudflare/speedtest'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import TestModeSelector from './components/TestModeSelector.vue'
import SpeedTestControls from './components/SpeedTestControls.vue'
import DataTransferDisplay from './components/DataTransferDisplay.vue'
import RetroSpeedTest from './components/RetroSpeedTest.vue'
import QualityScores from './components/QualityScores.vue'
import SummaryDetails from './components/SummaryDetails.vue'
import UltimateQuestionOverlay from './components/UltimateQuestionOverlay.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    TestModeSelector,
    SpeedTestControls,
    DataTransferDisplay,
    RetroSpeedTest,
    QualityScores,
    SummaryDetails,
    UltimateQuestionOverlay
  },
  setup() {
    const speedTest = ref(null)
    const isRunning = ref(false)
    const showOverlay = ref(false)
    const testMode = ref('standard')
    const dataTransferred = ref({
      download: 0,
      upload: 0,
      total: 0
    })
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

    // Measurement configurations for different test modes
    const measurementConfigs = {
      quick: [
        // Quick Test: Current config (~200 MB, 30-45s)
        { type: 'latency', numPackets: 1 },
        { type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true },
        { type: 'latency', numPackets: 20 },
        { type: 'download', bytes: 1e5, count: 6 },
        { type: 'download', bytes: 1e6, count: 6 },
        { type: 'download', bytes: 1e7, count: 4 },
        { type: 'upload', bytes: 1e5, count: 8 },
        { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
        { type: 'upload', bytes: 1e6, count: 6 },
        { type: 'upload', bytes: 1e7, count: 4 },
        { type: 'download', bytes: 2.5e7, count: 4 }
      ],
      standard: [
        // Standard Test: Balanced config (~600 MB, 45-75s)
        { type: 'latency', numPackets: 1 },
        { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },
        { type: 'latency', numPackets: 20 },
        { type: 'download', bytes: 1e5, count: 9 },
        { type: 'download', bytes: 1e6, count: 8 },
        { type: 'upload', bytes: 1e5, count: 8 },
        { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
        { type: 'upload', bytes: 1e6, count: 6 },
        { type: 'download', bytes: 1e7, count: 6 },
        { type: 'upload', bytes: 1e7, count: 4 },
        { type: 'download', bytes: 2.5e7, count: 4 },
        { type: 'upload', bytes: 2.5e7, count: 4 },
        { type: 'download', bytes: 1e8, count: 3 },
        { type: 'upload', bytes: 5e7, count: 3 }
      ],
      full: [
        // Full Test: Official SDK config (~1.3 GB, 90-120s)
        { type: 'latency', numPackets: 1 },
        { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },
        { type: 'latency', numPackets: 20 },
        { type: 'download', bytes: 1e5, count: 9 },
        { type: 'download', bytes: 1e6, count: 8 },
        { type: 'upload', bytes: 1e5, count: 8 },
        { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
        { type: 'upload', bytes: 1e6, count: 6 },
        { type: 'download', bytes: 1e7, count: 6 },
        { type: 'upload', bytes: 1e7, count: 4 },
        { type: 'download', bytes: 2.5e7, count: 4 },
        { type: 'upload', bytes: 2.5e7, count: 4 },
        { type: 'download', bytes: 1e8, count: 3 },
        { type: 'upload', bytes: 5e7, count: 3 },
        { type: 'download', bytes: 2.5e8, count: 2 }
      ]
    }

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

    const handleModeChange = (mode) => {
      if (!isRunning.value) {
        testMode.value = mode
        console.log('Test mode changed to:', mode)
      }
    }

    const startTest = () => {
      console.log('Starting test...')
      console.log('Test mode:', testMode.value)

      // Destroy old instance completely
      if (speedTest.value) {
        console.log('Destroying old SpeedTest instance')
        speedTest.value = null
      }

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
      dataTransferred.value = {
        download: 0,
        upload: 0,
        total: 0
      }

      try {
        // Get measurements for selected mode - deep clone to avoid reactivity issues
        const measurements = JSON.parse(JSON.stringify(measurementConfigs[testMode.value]))
        console.log(`Using ${testMode.value} mode with ${measurements.length} measurements`)
        console.log('Measurements config:', JSON.stringify(measurements, null, 2))

        // Show key differences between modes
        const downloadMeasurements = measurements.filter(m => m.type === 'download')
        const uploadMeasurements = measurements.filter(m => m.type === 'upload')
        const totalDownloadBytes = downloadMeasurements.reduce((sum, m) => sum + (m.bytes * m.count), 0)
        const totalUploadBytes = uploadMeasurements.reduce((sum, m) => sum + (m.bytes * m.count), 0)
        console.log(`Expected data transfer: DOWN ${(totalDownloadBytes/1e6).toFixed(0)}MB, UP ${(totalUploadBytes/1e6).toFixed(0)}MB, TOTAL ${((totalDownloadBytes+totalUploadBytes)/1e6).toFixed(0)}MB`)

        // Create new SpeedTest instance
        // IMPORTANT: Create config as plain object, NOT reactive
        const config = {
          autoStart: false,
          measurements: measurements,  // Already deep cloned above
          bandwidthFinishRequestDuration: 999999  // Don't stop early! Complete all measurements
        }
        console.log('Creating SpeedTest with config:', JSON.stringify(config, null, 2))
        console.log('Config.measurements is array:', Array.isArray(config.measurements))
        console.log('Config.measurements.length:', config.measurements.length)
        console.log('Config.measurements[0]:', JSON.stringify(config.measurements[0]))
        console.log('Config.autoStart:', config.autoStart)

        const instance = new SpeedTest(config)
        console.log('Instance created, wrapping with markRaw')
        console.log('Instance type:', instance.constructor.name)
        console.log('Instance properties:', Object.keys(instance))

        // Try to access internal config (might be private)
        console.log('Trying to peek at instance internals...')
        for (let key in instance) {
          if (key.includes('config') || key.includes('measurement')) {
            console.log(`Found: ${key}`, instance[key])
          }
        }

        speedTest.value = markRaw(instance)

      console.log('SpeedTest instance created:', speedTest.value)
      console.log('SpeedTest all properties:', Object.keys(speedTest.value))
      console.log('SpeedTest all own properties:', Object.getOwnPropertyNames(speedTest.value))

      // Set up event handlers
      speedTest.value.onRunningChange = (running) => {
        console.log('Running state changed:', running)
        isRunning.value = running

        // Show overlay when test starts running
        if (running) {
          setTimeout(() => {
            showOverlay.value = true
          }, 2000) // Delay to let downloads start and drum speedometer begin rolling
        }
      }

      let measurementCount = { download: 0, upload: 0, latency: 0, packetLoss: 0 }

      speedTest.value.onResultsChange = ({ type }) => {
        if (!speedTest.value.results) return

        // Count measurement executions
        if (type in measurementCount) {
          measurementCount[type]++
          console.log(`Measurement executed: ${type} (count: ${measurementCount[type]})`)
        }

        // Update results in real-time using the Results object methods
        const res = speedTest.value.results

        // Track data transferred - should accumulate BYTES, not bps
        if (type === 'download') {
          const downloadPoints = res.getDownloadBandwidthPoints()
          if (downloadPoints && downloadPoints.length > 0) {
            const totalDownload = downloadPoints.reduce((sum, point) => sum + (point.bytes || 0), 0)
            dataTransferred.value.download = totalDownload
            dataTransferred.value.total = dataTransferred.value.download + dataTransferred.value.upload
            console.log('Accumulated download BYTES:', totalDownload, '(', (totalDownload / 1e6).toFixed(1), 'MB )')
          }
        } else if (type === 'upload') {
          const uploadPoints = res.getUploadBandwidthPoints()
          if (uploadPoints && uploadPoints.length > 0) {
            const totalUpload = uploadPoints.reduce((sum, point) => sum + (point.bytes || 0), 0)
            dataTransferred.value.upload = totalUpload
            dataTransferred.value.total = dataTransferred.value.download + dataTransferred.value.upload
            console.log('Accumulated upload BYTES:', totalUpload, '(', (totalUpload / 1e6).toFixed(1), 'MB )')
          }
        }

        // Get bandwidth values (returns bps or null) - these are SPEEDS
        const download = res.getDownloadBandwidth()
        const upload = res.getUploadBandwidth()
        const latency = res.getUnloadedLatency()
        const jitter = res.getUnloadedJitter()
        const downloadLatency = res.getDownLoadedLatency()
        const downloadJitter = res.getDownLoadedJitter()
        const uploadLatency = res.getUpLoadedLatency()
        const uploadJitter = res.getUpLoadedJitter()
        const packetLoss = res.getPacketLoss()

        console.log('Bandwidth (bps) - download:', download, 'upload:', upload)

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
        console.log('Test finished!', testResults)
        console.log('Measurements executed:', measurementCount)
        const expectedDownloads = measurements.filter(m => m.type === 'download').length
        const expectedUploads = measurements.filter(m => m.type === 'upload').length
        console.log(`Expected: ${expectedDownloads} downloads, ${expectedUploads} uploads`)
        console.log(`Actual: ${measurementCount.download} downloads, ${measurementCount.upload} uploads`)

        // Get final summary
        summary.value = testResults.getSummary()
        console.log('Summary:', summary.value)
        console.log('Summary download (bps):', summary.value.download)
        console.log('Summary upload (bps):', summary.value.upload)

        // Get quality scores
        scores.value = testResults.getScores()
        console.log('Scores:', scores.value)

        // Update final results - summary contains SPEEDS in bps
        console.log('Updating results with summary speeds (bps):', summary.value.download, summary.value.upload)
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

        // Start the test
        console.log('Calling play()...')
        speedTest.value.play()
      } catch (error) {
        console.error('Error creating or starting SpeedTest:', error)
        console.error('Error stack:', error.stack)
        alert('Error starting test: ' + error.message + '\n\nCheck console for details.')
        isRunning.value = false
      }
    }

    const stopTest = () => {
      console.log('Stopping test...')
      if (speedTest.value) {
        speedTest.value.pause()
        isRunning.value = false
      }
      // Hide overlay if stopping
      showOverlay.value = false
    }

    const handleCorrectAnswer = () => {
      console.log('Correct answer! Hiding overlay...')
      showOverlay.value = false
    }

    return {
      isRunning,
      showOverlay,
      testMode,
      dataTransferred,
      results,
      scores,
      summary,
      statusText,
      statusClass,
      handleModeChange,
      startTest,
      stopTest,
      handleCorrectAnswer
    }
  }
}
</script>
