<template>
  <div class="summary-section">
    <h2>Detailed Results</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">Upload Latency:</span>
        <span class="summary-value">{{ formatLatency(summary.uploadLatency) }} ms</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Upload Jitter:</span>
        <span class="summary-value">{{ formatLatency(summary.uploadJitter) }} ms</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryDetails',
  props: {
    summary: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatLatency(ms) {
      if (ms === null || ms === undefined) return '—'
      return ms.toFixed(2)
    }
  }
}
</script>
