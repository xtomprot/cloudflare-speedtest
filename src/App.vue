<template>
  <div class="container">
    <AppHeader />
    <SpeedTestConfig
      :config="config"
      @update:config="updateConfig"
    />
    <SpeedTestControls
      :is-running="isRunning"
      :status-text="statusText"
      :status-class="statusClass"
      @start-test="startTest"
      @stop-test="stopTest"
    />
    <RetroSpeedTest
      v-if="isRunning || summary"
      :results="currentResults"
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
import { ref, computed, watch, onUnmounted, markRaw } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import SpeedTestConfig from './components/SpeedTestConfig.vue'
import SpeedTestControls from './components/SpeedTestControls.vue'
import RetroSpeedTest from './components/RetroSpeedTest.vue'
import QualityScores from './components/QualityScores.vue'
import SummaryDetails from './components/SummaryDetails.vue'
import UltimateQuestionOverlay from './components/UltimateQuestionOverlay.vue'
import { useCloudflareSpeedTest } from './composables/useCloudflareSpeedTest.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    SpeedTestConfig,
    SpeedTestControls,
    RetroSpeedTest,
    QualityScores,
    SummaryDetails,
    UltimateQuestionOverlay
  },
  setup() {
    const { createSpeedTest, runParallelBandwidthTest, logResultsToCloudflare } = useCloudflareSpeedTest()

    const isRunning = ref(false)
    const showOverlay = ref(false)
    const testDuration = ref(0)
    const timerInterval = ref(null)
    const testStartTime = ref(null)
    const speedTestEngine = ref(null)
    const parallelTestActive = ref(false)

    const config = ref({
      parallelStreams: 6,
      testDuration: 10,
      latencyPackets: 20,
      enableLogging: true,
      measureDownloadLoadedLatency: true,
      measureUploadLoadedLatency: true,
      loadedLatencyThrottle: 400
    })

    // Current results from SDK
    const currentResults = ref({
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

    // Parallel test results (enhanced bandwidth)
    const parallelResults = ref({
      download: null,
      upload: null
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
        testStartTime.value = Date.now()
        testDuration.value = 0
        timerInterval.value = setInterval(() => {
          testDuration.value = Math.floor((Date.now() - testStartTime.value) / 1000)
        }, 100)
      } else {
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }
      }
    })

    onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
    })

    const updateConfig = (newConfig) => {
      config.value = { ...newConfig }
      console.log('Config updated:', config.value)
    }

    const updateCurrentResults = (sdkResults) => {
      const summary = sdkResults.getSummary()

      // Merge SDK results with parallel test results (use the higher bandwidth)
      currentResults.value = {
        download: Math.max(summary.download || 0, parallelResults.value.download || 0),
        upload: Math.max(summary.upload || 0, parallelResults.value.upload || 0),
        latency: summary.latency,
        jitter: summary.jitter,
        downloadLatency: summary.downLoadedLatency,
        downloadJitter: summary.downLoadedJitter,
        uploadLatency: summary.upLoadedLatency,
        uploadJitter: summary.upLoadedJitter,
        packetLoss: summary.packetLoss
      }

      console.log('📊 Current results updated:', currentResults.value)
    }

    const startTest = async () => {
      console.log('🚀 Starting Cloudflare SpeedTest with parallel enhancement...')

      // Reset previous results
      currentResults.value = {
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
      parallelResults.value = {
        download: null,
        upload: null
      }
      scores.value = null
      summary.value = null

      // Create new SpeedTest engine with current config
      // Use markRaw to prevent Vue reactivity on class with private fields
      speedTestEngine.value = markRaw(createSpeedTest(config.value))

      // Set up SDK event handlers
      speedTestEngine.value.onRunningChange = (running) => {
        isRunning.value = running
        console.log(`🔄 SDK running state: ${running}`)
      }

      speedTestEngine.value.onResultsChange = ({ type }) => {
        console.log(`📈 SDK measurement complete: ${type}`)
        updateCurrentResults(speedTestEngine.value.results)

        // Run parallel tests when SDK starts bandwidth measurements
        if (type === 'download' && !parallelTestActive.value) {
          parallelTestActive.value = true
          runParallelBandwidthTest(
            'download',
            config.value.parallelStreams,
            config.value.testDuration,
            (progress) => {
              parallelResults.value.download = progress.speed
              currentResults.value.download = Math.max(
                currentResults.value.download || 0,
                progress.speed
              )
            }
          ).then(result => {
            parallelResults.value.download = result.speed
            console.log('✅ Parallel download complete:', result)
          })
        }

        if (type === 'upload' && parallelTestActive.value) {
          runParallelBandwidthTest(
            'upload',
            config.value.parallelStreams,
            config.value.testDuration,
            (progress) => {
              parallelResults.value.upload = progress.speed
              currentResults.value.upload = Math.max(
                currentResults.value.upload || 0,
                progress.speed
              )
            }
          ).then(result => {
            parallelResults.value.upload = result.speed
            console.log('✅ Parallel upload complete:', result)
            parallelTestActive.value = false
          })
        }
      }

      speedTestEngine.value.onFinish = async (results) => {
        console.log('✅ SDK Test complete!')

        // Get final results
        const finalSummary = results.getSummary()
        const sdkScores = results.getScores()

        // Merge with parallel test results
        summary.value = {
          download: Math.max(finalSummary.download || 0, parallelResults.value.download || 0),
          upload: Math.max(finalSummary.upload || 0, parallelResults.value.upload || 0),
          latency: finalSummary.latency,
          jitter: finalSummary.jitter,
          downloadLatency: finalSummary.downLoadedLatency,
          downloadJitter: finalSummary.downLoadedJitter,
          uploadLatency: finalSummary.upLoadedLatency,
          uploadJitter: finalSummary.upLoadedJitter,
          packetLoss: finalSummary.packetLoss
        }

        // Use SDK scores (AIM scoring system)
        scores.value = sdkScores

        console.log('📊 Final summary:', summary.value)
        console.log('🏆 AIM Scores:', scores.value)

        // Log to Cloudflare AIM endpoint
        if (config.value.enableLogging) {
          await logResultsToCloudflare(results, speedTestEngine.value._customConfig)
        }

        isRunning.value = false
        showOverlay.value = false
      }

      speedTestEngine.value.onError = (error) => {
        console.error('❌ SDK Error:', error)
        alert('SpeedTest error: ' + error)
        isRunning.value = false
        showOverlay.value = false
      }

      // Show overlay during test
      setTimeout(() => {
        if (isRunning.value) {
          showOverlay.value = true
        }
      }, 500)

      // Start the SDK test
      speedTestEngine.value.play()
    }

    const stopTest = () => {
      console.log('⏸️ Stopping test...')
      if (speedTestEngine.value) {
        speedTestEngine.value.pause()
      }
      isRunning.value = false
      showOverlay.value = false
      parallelTestActive.value = false
    }

    const handleCorrectAnswer = () => {
      console.log('Correct answer! Hiding overlay...')
      showOverlay.value = false
    }

    return {
      isRunning,
      showOverlay,
      testDuration,
      config,
      currentResults,
      scores,
      summary,
      statusText,
      statusClass,
      updateConfig,
      startTest,
      stopTest,
      handleCorrectAnswer
    }
  }
}
</script>
