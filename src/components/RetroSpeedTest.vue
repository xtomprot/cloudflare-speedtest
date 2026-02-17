<template>
  <div class="retro-speedtest">
    <VintagePattern />
    <div class="retro-header">
      <div class="model-badge">CX SPEEDTEST</div>
      <div class="year-badge">1975-1989</div>
    </div>

    <div class="dashboard">
      <!-- Main Speed Drums -->
      <div class="main-drums">
        <DrumSpeedometer
          :value="downloadSpeed"
          label="Download"
          unit="Mbps"
          :isActive="isRunning"
        />
        <DrumSpeedometer
          :value="uploadSpeed"
          label="Upload"
          unit="Mbps"
          :isActive="isRunning"
        />
      </div>

      <!-- Secondary Metrics -->
      <div class="secondary-metrics">
        <div class="metric-display">
          <div class="metric-label">Latency</div>
          <div class="metric-value">
            <span class="led-display">{{ formatLatency(results.latency) }}</span>
            <span class="metric-unit">ms</span>
          </div>
        </div>

        <div class="metric-display">
          <div class="metric-label">Jitter</div>
          <div class="metric-value">
            <span class="led-display">{{ formatLatency(results.jitter) }}</span>
            <span class="metric-unit">ms</span>
          </div>
        </div>

        <div class="metric-display">
          <div class="metric-label">Packet Loss</div>
          <div class="metric-value">
            <span class="led-display">{{ formatPacketLoss(results.packetLoss) }}</span>
            <span class="metric-unit">%</span>
          </div>
        </div>
      </div>

      <!-- Warning Lights -->
      <div class="warning-lights">
        <div class="warning-light" :class="{ active: isRunning }">
          <div class="light-bulb testing"></div>
          <div class="light-label">Testing</div>
        </div>
        <div class="warning-light" :class="{ active: summary }">
          <div class="light-bulb complete"></div>
          <div class="light-label">Complete</div>
        </div>
        <div class="warning-light" :class="{ active: hasError }">
          <div class="light-bulb error"></div>
          <div class="light-label">Error</div>
        </div>
      </div>
    </div>

    <!-- Retro Brand Footer -->
    <div class="retro-footer">
      <div class="citroen-logo">CITROËN</div>
      <div class="tagline">L'innovation automobile</div>
    </div>
  </div>
</template>

<script>
import DrumSpeedometer from './DrumSpeedometer.vue'
import VintagePattern from './VintagePattern.vue'

export default {
  name: 'RetroSpeedTest',
  components: {
    DrumSpeedometer,
    VintagePattern
  },
  props: {
    results: {
      type: Object,
      required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    },
    summary: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      hasError: false
    }
  },
  computed: {
    downloadSpeed() {
      if (this.results.download === null || this.results.download === undefined) return 0
      return this.results.download / 1e6
    },
    uploadSpeed() {
      if (this.results.upload === null || this.results.upload === undefined) return 0
      return this.results.upload / 1e6
    }
  },
  methods: {
    formatLatency(ms) {
      if (ms === null || ms === undefined) return '---'
      return ms.toFixed(1).padStart(5, '0')
    },
    formatPacketLoss(percent) {
      if (percent === null || percent === undefined) return '--.-'
      return (percent * 100).toFixed(1)
    }
  }
}
</script>

<style scoped>
.retro-speedtest {
  background: linear-gradient(to bottom, #1a1a1a 0%, #0d0d0d 100%);
  border: 4px solid #444;
  border-radius: 12px;
  padding: 40px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

.retro-speedtest::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid #333;
  border-radius: 8px;
  pointer-events: none;
}

.retro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ff6600;
}

.model-badge {
  font-family: 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #ff6600;
  letter-spacing: 3px;
  text-shadow:
    0 0 10px rgba(255, 102, 0, 0.8),
    2px 2px 0 rgba(0, 0, 0, 0.5);
}

.year-badge {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #999;
  letter-spacing: 2px;
  background: #222;
  padding: 5px 15px;
  border: 1px solid #444;
  border-radius: 4px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.main-drums {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.secondary-metrics {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.metric-display {
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 2px solid #333;
  border-radius: 6px;
  padding: 15px 25px;
  min-width: 150px;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.metric-label {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.led-display {
  font-family: 'Courier New', 'DS-Digital', monospace;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff3300;
  text-shadow:
    0 0 5px #ff3300,
    0 0 10px #ff3300;
  background: #000;
  padding: 5px 10px;
  border-radius: 3px;
  min-width: 80px;
  text-align: right;
}

.metric-unit {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #999;
  font-weight: bold;
}

.warning-lights {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid #222;
}

.warning-light {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.warning-light.active {
  opacity: 1;
}

.light-bulb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #333;
  background: #1a1a1a;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
}

.warning-light.active .light-bulb {
  box-shadow:
    0 0 10px currentColor,
    0 0 20px currentColor,
    inset 0 0 10px currentColor;
}

.light-bulb.testing {
  background: #003300;
  border-color: #00ff00;
}

.warning-light.active .light-bulb.testing {
  background: #00ff00;
  animation: blink-green 1s ease-in-out infinite;
}

.light-bulb.complete {
  background: #000033;
  border-color: #0066ff;
}

.warning-light.active .light-bulb.complete {
  background: #0066ff;
}

.light-bulb.error {
  background: #330000;
  border-color: #ff0000;
}

.warning-light.active .light-bulb.error {
  background: #ff0000;
  animation: blink-red 0.5s ease-in-out infinite;
}

.light-label {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.warning-light.active .light-label {
  color: #ccc;
}

.retro-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ff6600;
  text-align: center;
}

.citroen-logo {
  font-family: 'Arial Black', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  color: #ff6600;
  letter-spacing: 4px;
  margin-bottom: 5px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.tagline {
  font-family: 'Georgia', serif;
  font-size: 0.8rem;
  font-style: italic;
  color: #666;
  letter-spacing: 1px;
}

@keyframes blink-green {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes blink-red {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .retro-speedtest {
    padding: 20px;
  }

  .main-drums {
    flex-direction: column;
    gap: 20px;
  }

  .secondary-metrics {
    flex-direction: column;
  }

  .warning-lights {
    gap: 20px;
  }

  .model-badge {
    font-size: 1.2rem;
  }
}
</style>
