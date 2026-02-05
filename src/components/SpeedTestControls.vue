<template>
  <div class="controls">
    <button
      @click="handleStartClick"
      :disabled="isRunning"
      class="btn btn-primary"
    >
      {{ isRunning ? 'Testing...' : 'Start Test' }}
    </button>
    <button
      @click="handleStopClick"
      :disabled="!isRunning"
      class="btn btn-secondary"
    >
      Stop Test
    </button>
    <div class="status" :class="statusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpeedTestControls',
  props: {
    isRunning: {
      type: Boolean,
      required: true
    },
    statusText: {
      type: String,
      required: true
    },
    statusClass: {
      type: String,
      required: true
    }
  },
  emits: ['start-test', 'stop-test'],
  methods: {
    handleStartClick() {
      console.log('Start button clicked in component!')
      this.$emit('start-test')
      console.log('start-test event emitted')
    },
    handleStopClick() {
      console.log('Stop button clicked in component!')
      this.$emit('stop-test')
      console.log('stop-test event emitted')
    }
  }
}
</script>
