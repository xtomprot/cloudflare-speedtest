<template>
  <div class="test-mode-selector">
    <h3>Test Mode</h3>
    <div class="mode-options">
      <label
        v-for="mode in modes"
        :key="mode.id"
        class="mode-option"
        :class="{ selected: selectedMode === mode.id }"
      >
        <input
          type="radio"
          :value="mode.id"
          v-model="selectedMode"
          @change="handleModeChange"
          :disabled="isRunning"
        />
        <div class="mode-details">
          <div class="mode-name">{{ mode.name }}</div>
          <div class="mode-info">
            <span class="mode-duration">~{{ mode.duration }}s</span>
            <span class="mode-separator">•</span>
            <span class="mode-data">~{{ mode.data }} MB</span>
          </div>
          <div class="mode-description">{{ mode.description }}</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestModeSelector',
  props: {
    isRunning: {
      type: Boolean,
      required: true
    },
    initialMode: {
      type: String,
      default: 'standard'
    }
  },
  emits: ['mode-changed'],
  data() {
    return {
      selectedMode: this.initialMode,
      modes: [
        {
          id: 'quick',
          name: 'Quick Test',
          duration: '30-45',
          data: '200',
          description: 'Fast estimate (current config)'
        },
        {
          id: 'standard',
          name: 'Standard Test',
          duration: '45-75',
          data: '600',
          description: 'Balanced accuracy and speed'
        },
        {
          id: 'full',
          name: 'Full Test',
          duration: '90-120',
          data: '1300',
          description: 'Maximum accuracy (matches official Cloudflare)'
        }
      ]
    }
  },
  methods: {
    handleModeChange() {
      this.$emit('mode-changed', this.selectedMode)
    }
  }
}
</script>

<style scoped>
.test-mode-selector {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 2px solid #444;
  border-radius: 8px;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.test-mode-selector h3 {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  text-align: center;
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: linear-gradient(145deg, #0d0d0d, #1a1a1a);
  border: 2px solid #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-option:hover:not(.selected) {
  border-color: #555;
  background: linear-gradient(145deg, #1a1a1a, #222);
}

.mode-option.selected {
  border-color: #ff6600;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  box-shadow:
    0 0 15px rgba(255, 102, 0, 0.3),
    inset 0 1px 3px rgba(255, 102, 0, 0.2);
}

.mode-option input[type="radio"] {
  margin-top: 2px;
  cursor: pointer;
  accent-color: #ff6600;
}

.mode-option input[type="radio"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.mode-details {
  flex: 1;
}

.mode-name {
  font-family: 'Arial Black', sans-serif;
  font-size: 1rem;
  font-weight: 900;
  color: #ccc;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.mode-option.selected .mode-name {
  color: #ff6600;
}

.mode-info {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-separator {
  color: #555;
}

.mode-description {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
}

.mode-option.selected .mode-info {
  color: #ff8800;
}

.mode-option.selected .mode-description {
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .test-mode-selector {
    padding: 15px;
  }

  .mode-option {
    padding: 12px;
  }

  .mode-name {
    font-size: 0.9rem;
  }

  .mode-info {
    font-size: 0.7rem;
  }

  .mode-description {
    font-size: 0.65rem;
  }
}
</style>
