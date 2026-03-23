<template>
  <div class="data-transfer-display" v-if="totalData > 0">
    <div class="data-icon">📊</div>
    <div class="data-details">
      <div class="data-label">Total Data Transferred</div>
      <div class="data-value">
        <span class="data-number">{{ formattedTotal }}</span>
        <span class="data-unit">{{ unit }}</span>
      </div>
      <div class="data-breakdown" v-if="showBreakdown">
        <span class="breakdown-item">
          ↓ {{ formattedDownload }} {{ unit }}
        </span>
        <span class="breakdown-separator">•</span>
        <span class="breakdown-item">
          ↑ {{ formattedUpload }} {{ unit }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTransferDisplay',
  props: {
    downloadBytes: {
      type: Number,
      default: 0
    },
    uploadBytes: {
      type: Number,
      default: 0
    },
    showBreakdown: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    totalData() {
      return this.downloadBytes + this.uploadBytes
    },
    formattedTotal() {
      return this.formatBytes(this.totalData)
    },
    formattedDownload() {
      return this.formatBytes(this.downloadBytes)
    },
    formattedUpload() {
      return this.formatBytes(this.uploadBytes)
    },
    unit() {
      if (this.totalData >= 1e9) return 'GB'
      if (this.totalData >= 1e6) return 'MB'
      return 'KB'
    }
  },
  methods: {
    formatBytes(bytes) {
      if (bytes === 0) return '0'
      if (bytes >= 1e9) return (bytes / 1e9).toFixed(2)
      if (bytes >= 1e6) return (bytes / 1e6).toFixed(1)
      return (bytes / 1e3).toFixed(0)
    }
  }
}
</script>

<style scoped>
.data-transfer-display {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 2px solid #444;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.data-icon {
  font-size: 2.5rem;
  filter: grayscale(0.5);
  opacity: 0.8;
}

.data-details {
  flex: 1;
}

.data-label {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.data-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.data-number {
  font-family: 'Arial Black', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: #ff6600;
  text-shadow:
    0 0 10px rgba(255, 102, 0, 0.5),
    2px 2px 0 rgba(0, 0, 0, 0.5);
  line-height: 1;
}

.data-unit {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #999;
}

.data-breakdown {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 10px;
}

.breakdown-item {
  color: #999;
}

.breakdown-separator {
  color: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .data-transfer-display {
    padding: 15px;
  }

  .data-icon {
    font-size: 2rem;
  }

  .data-number {
    font-size: 1.5rem;
  }

  .data-unit {
    font-size: 0.85rem;
  }

  .data-breakdown {
    font-size: 0.7rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .breakdown-separator {
    display: none;
  }
}
</style>
