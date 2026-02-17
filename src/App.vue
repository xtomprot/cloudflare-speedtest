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
    />
    <QualityScores v-if="scores" :scores="scores" />
    <SummaryDetails v-if="summary" :summary="summary" />
    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, markRaw } from 'vue'
import SpeedTest from '@cloudflare/speedtest'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import SpeedTestControls from './components/SpeedTestControls.vue'
import RetroSpeedTest from './components/RetroSpeedTest.vue'
import QualityScores from './components/QualityScores.vue'
import SummaryDetails from './components/SummaryDetails.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    SpeedTestControls,
    RetroSpeedTest,
    QualityScores,
    SummaryDetails
  },
  setup() {
    const speedTest = ref(null)
    const isRunning = ref(false)
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
      console.log('Starting test...')
      console.log('SpeedTest constructor:', SpeedTest)
      console.log('typeof SpeedTest:', typeof SpeedTest)

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
        // Create new SpeedTest instance
        // Use markRaw to prevent Vue reactivity from breaking private class fields
        console.log('Creating SpeedTest instance...')
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

      console.log('SpeedTest instance created:', speedTest.value)

      // Set up event handlers
      speedTest.value.onRunningChange = (running) => {
        console.log('Running state changed:', running)
        isRunning.value = running
      }

      speedTest.value.onResultsChange = ({ type }) => {
        if (!speedTest.value.results) return

        // Update results in real-time using the Results object methods
        const res = speedTest.value.results

        // Get bandwidth values (returns bps or null)
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
        console.log('Test finished!', testResults)

        // Get final summary
        summary.value = testResults.getSummary()
        console.log('Summary:', summary.value)

        // Get quality scores
        scores.value = testResults.getScores()
        console.log('Scores:', scores.value)

        // Update final results
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
    }

    return {
      isRunning,
      results,
      scores,
      summary,
      statusText,
      statusClass,
      startTest,
      stopTest
    }
  }
}
</script>
