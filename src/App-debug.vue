<template>
  <div class="container">
    <header>
      <h1>⚡ Cloudflare Speedtest Demo (DEBUG)</h1>
      <p class="subtitle">Test your network performance using Cloudflare's edge network</p>
    </header>

    <div class="controls">
      <button
        @click="handleStartTest"
        :disabled="isRunning"
        class="btn btn-primary"
      >
        {{ isRunning ? 'Testing...' : 'Start Test' }}
      </button>
      <button
        @click="handleStopTest"
        :disabled="!isRunning"
        class="btn btn-secondary"
      >
        Stop Test
      </button>
      <div class="status" :class="statusClass">
        {{ statusText }}
      </div>
    </div>

    <div v-if="debugInfo" style="margin: 20px; padding: 20px; background: #f0f0f0; border-radius: 10px;">
      <h3>Debug Info:</h3>
      <pre>{{ debugInfo }}</pre>
    </div>

    <footer>
      <p>Powered by <a href="https://www.npmjs.com/package/@cloudflare/speedtest" target="_blank">@cloudflare/speedtest</a></p>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'App',
  setup() {
    const isRunning = ref(false)
    const debugInfo = ref('')

    const statusText = computed(() => {
      if (isRunning.value) return '🔄 Test in progress...'
      return '⚪ Ready to test'
    })

    const statusClass = computed(() => {
      if (isRunning.value) return 'status-running'
      return 'status-idle'
    })

    const handleStartTest = () => {
      console.log('START TEST CLICKED!')
      debugInfo.value = 'Start Test button was clicked at ' + new Date().toLocaleTimeString()
      alert('Start Test button works!')
      isRunning.value = true

      // Simulate test running
      setTimeout(() => {
        isRunning.value = false
        debugInfo.value += '\nTest finished at ' + new Date().toLocaleTimeString()
      }, 5000)
    }

    const handleStopTest = () => {
      console.log('STOP TEST CLICKED!')
      debugInfo.value += '\nStop Test button clicked at ' + new Date().toLocaleTimeString()
      alert('Stop Test button works!')
      isRunning.value = false
    }

    return {
      isRunning,
      debugInfo,
      statusText,
      statusClass,
      handleStartTest,
      handleStopTest
    }
  }
}
</script>
