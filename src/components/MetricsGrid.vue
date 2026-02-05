<template>
  <div class="metrics-grid">
    <!-- Download Speed -->
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">⬇️</span>
        <h3>Download</h3>
      </div>
      <div class="metric-value">
        {{ formatSpeed(results.download) }}
        <span class="unit">Mbps</span>
      </div>
      <div class="progress-bar" v-if="isRunning">
        <div
          class="progress-fill download"
          :style="{ width: getProgressWidth(results.download, 1000) }"
        ></div>
      </div>
    </div>

    <!-- Upload Speed -->
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">⬆️</span>
        <h3>Upload</h3>
      </div>
      <div class="metric-value">
        {{ formatSpeed(results.upload) }}
        <span class="unit">Mbps</span>
      </div>
      <div class="progress-bar" v-if="isRunning">
        <div
          class="progress-fill upload"
          :style="{ width: getProgressWidth(results.upload, 500) }"
        ></div>
      </div>
    </div>

    <!-- Latency -->
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">⏱️</span>
        <h3>Latency</h3>
      </div>
      <div class="metric-value">
        {{ formatLatency(results.latency) }}
        <span class="unit">ms</span>
      </div>
      <div class="metric-detail" v-if="results.downloadLatency">
        Loaded: {{ formatLatency(results.downloadLatency) }} ms
      </div>
    </div>

    <!-- Jitter -->
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">📊</span>
        <h3>Jitter</h3>
      </div>
      <div class="metric-value">
        {{ formatLatency(results.jitter) }}
        <span class="unit">ms</span>
      </div>
      <div class="metric-detail" v-if="results.downloadJitter">
        Loaded: {{ formatLatency(results.downloadJitter) }} ms
      </div>
    </div>

    <!-- Packet Loss -->
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">📦</span>
        <h3>Packet Loss</h3>
      </div>
      <div class="metric-value">
        {{ formatPacketLoss(results.packetLoss) }}
        <span class="unit">%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricsGrid',
  props: {
    results: {
      type: Object,
      required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    formatSpeed(bps) {
      if (bps === null || bps === undefined) return '—'
      const mbps = bps / 1e6
      return mbps.toFixed(2)
    },
    formatLatency(ms) {
      if (ms === null || ms === undefined) return '—'
      return ms.toFixed(2)
    },
    formatPacketLoss(percent) {
      if (percent === null || percent === undefined) return '—'
      return (percent * 100).toFixed(2)
    },
    getProgressWidth(value, max) {
      if (!value) return '0%'
      const mbps = value / 1e6
      const percentage = Math.min((mbps / max) * 100, 100)
      return percentage + '%'
    }
  }
}
</script>
