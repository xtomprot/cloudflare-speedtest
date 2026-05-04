<template>
  <div class="config-panel" :class="{ 'config-expanded': isExpanded }">
    <button class="config-toggle" @click="toggleConfig">
      <span>⚙️ {{ isExpanded ? 'Hide' : 'Show' }} Configuration</span>
    </button>

    <div v-if="isExpanded" class="config-content">
      <div class="config-section">
        <h3>Test Parameters</h3>

        <div class="config-item">
          <label for="parallel-streams">Parallel Streams</label>
          <input
            id="parallel-streams"
            type="number"
            min="1"
            max="12"
            v-model.number="localConfig.parallelStreams"
            @change="emitConfig"
          />
          <span class="config-hint">Number of concurrent connections (1-12)</span>
        </div>

        <div class="config-item">
          <label for="test-duration">Test Duration (seconds)</label>
          <input
            id="test-duration"
            type="number"
            min="5"
            max="30"
            v-model.number="localConfig.testDuration"
            @change="emitConfig"
          />
          <span class="config-hint">How long to run each test (5-30s)</span>
        </div>

        <div class="config-item">
          <label for="latency-packets">Latency Packets</label>
          <input
            id="latency-packets"
            type="number"
            min="5"
            max="50"
            v-model.number="localConfig.latencyPackets"
            @change="emitConfig"
          />
          <span class="config-hint">Number of latency measurements (5-50)</span>
        </div>
      </div>

      <div class="config-section">
        <h3>SDK Options</h3>

        <div class="config-item checkbox">
          <label>
            <input
              type="checkbox"
              v-model="localConfig.measureDownloadLoadedLatency"
              @change="emitConfig"
            />
            Measure download loaded latency
          </label>
        </div>

        <div class="config-item checkbox">
          <label>
            <input
              type="checkbox"
              v-model="localConfig.measureUploadLoadedLatency"
              @change="emitConfig"
            />
            Measure upload loaded latency
          </label>
        </div>

        <div class="config-item">
          <label for="loaded-latency-throttle">Loaded Latency Throttle (ms)</label>
          <input
            id="loaded-latency-throttle"
            type="number"
            min="100"
            max="1000"
            step="100"
            v-model.number="localConfig.loadedLatencyThrottle"
            @change="emitConfig"
          />
          <span class="config-hint">Interval between loaded latency pings (100-1000ms)</span>
        </div>

        <div class="config-item checkbox">
          <label>
            <input
              type="checkbox"
              v-model="localConfig.enableLogging"
              @change="emitConfig"
            />
            Enable result logging to Cloudflare AIM
          </label>
        </div>
      </div>

      <button class="reset-button" @click="resetToDefaults">
        Reset to Defaults
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SpeedTestConfig',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  emits: ['update:config'],
  setup(props, { emit }) {
    const isExpanded = ref(false)
    const localConfig = ref({ ...props.config })

    watch(() => props.config, (newConfig) => {
      localConfig.value = { ...newConfig }
    }, { deep: true })

    const toggleConfig = () => {
      isExpanded.value = !isExpanded.value
      console.log('Config panel toggled:', isExpanded.value ? 'OPEN' : 'CLOSED')
    }

    const emitConfig = () => {
      emit('update:config', { ...localConfig.value })
    }

    const resetToDefaults = () => {
      localConfig.value = {
        parallelStreams: 6,
        testDuration: 10,
        latencyPackets: 20,
        enableLogging: true,
        measureDownloadLoadedLatency: true,
        measureUploadLoadedLatency: true,
        loadedLatencyThrottle: 400
      }
      emitConfig()
    }

    return {
      isExpanded,
      localConfig,
      toggleConfig,
      emitConfig,
      resetToDefaults
    }
  }
}
</script>

<style scoped>
.config-panel {
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.config-toggle {
  width: 100%;
  padding: 12px 20px;
  background: rgba(0, 255, 157, 0.1);
  border: none;
  color: #00ff9d;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.config-toggle:hover {
  background: rgba(0, 255, 157, 0.2);
}

.config-content {
  padding: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.config-section {
  margin-bottom: 20px;
}

.config-section h3 {
  color: #00ff9d;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.config-item {
  margin-bottom: 15px;
}

.config-item label {
  display: block;
  color: #00ff9d;
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  margin-bottom: 8px;
}

.config-item input[type="number"] {
  width: 100%;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 4px;
  color: #00ff9d;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
}

.config-item input[type="number"]:focus {
  outline: none;
  border-color: #00ff9d;
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
}

.config-item.checkbox label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.config-item.checkbox input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.config-hint {
  display: block;
  color: rgba(0, 255, 157, 0.6);
  font-family: monospace;
  font-size: 10px;
  margin-top: 5px;
  font-style: italic;
}

.reset-button {
  padding: 10px 20px;
  background: rgba(255, 100, 100, 0.2);
  border: 1px solid rgba(255, 100, 100, 0.5);
  border-radius: 4px;
  color: #ff6464;
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: rgba(255, 100, 100, 0.3);
  box-shadow: 0 0 10px rgba(255, 100, 100, 0.3);
}
</style>
