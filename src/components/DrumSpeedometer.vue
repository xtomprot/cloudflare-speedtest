<template>
  <div class="drum-speedometer">
    <div class="speedometer-label">{{ label }}</div>
    <div class="drum-container">
      <div class="drum-window">
        <div class="drum-roll" :style="{ transform: `translateY(${drumPosition}px)` }">
          <div
            v-for="digit in drumDigits"
            :key="digit.index"
            class="drum-digit"
          >
            {{ digit.value }}
          </div>
        </div>
        <div class="drum-indicator"></div>
      </div>
      <div class="unit-label">{{ unit }}</div>
    </div>
    <div class="drum-glow" :class="{ active: isActive }"></div>
  </div>
</template>

<script>
export default {
  name: 'DrumSpeedometer',
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: 'Mbps'
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayValue() {
      return Math.round(this.value)
    },
    drumDigits() {
      // Create a continuous drum of digits from 0-999
      const digits = []
      for (let i = -10; i <= 1009; i++) {
        digits.push({
          index: i,
          value: String(Math.max(0, i)).padStart(3, '0')
        })
      }
      return digits
    },
    drumPosition() {
      // Each digit is 60px high, position so current value is centered
      const digitHeight = 60
      const baseOffset = 10 * digitHeight // Start offset (10 digits above 0)
      const valueOffset = this.displayValue * digitHeight
      return baseOffset - valueOffset
    }
  }
}
</script>

<style scoped>
.drum-speedometer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 3px solid #444;
  border-radius: 8px;
  box-shadow:
    inset 0 2px 10px rgba(0, 0, 0, 0.8),
    0 5px 20px rgba(0, 0, 0, 0.5);
}

.speedometer-label {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.drum-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.drum-window {
  position: relative;
  width: 140px;
  height: 80px;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  border: 2px solid #333;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    inset 0 5px 15px rgba(0, 0, 0, 0.9),
    inset 0 -5px 15px rgba(0, 0, 0, 0.9);
}

.drum-roll {
  position: absolute;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
}

.drum-digit {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', 'DS-Digital', monospace;
  font-size: 3rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow:
    0 0 5px #00ff00,
    0 0 10px #00ff00,
    0 0 20px rgba(0, 255, 0, 0.5);
  background: linear-gradient(to right,
    rgba(0, 255, 0, 0.05) 0%,
    rgba(0, 255, 0, 0.1) 50%,
    rgba(0, 255, 0, 0.05) 100%);
}

.drum-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff6600;
  transform: translateY(-50%);
  box-shadow:
    0 0 5px #ff6600,
    0 0 10px #ff6600;
  pointer-events: none;
  z-index: 10;
}

.drum-indicator::before,
.drum-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  transform: translateY(-50%);
}

.drum-indicator::before {
  left: -8px;
  border-width: 6px 8px 6px 0;
  border-color: transparent #ff6600 transparent transparent;
}

.drum-indicator::after {
  right: -8px;
  border-width: 6px 0 6px 8px;
  border-color: transparent transparent transparent #ff6600;
}

.unit-label {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.drum-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow:
    0 0 20px rgba(0, 255, 0, 0.3),
    0 0 40px rgba(0, 255, 0, 0.2),
    inset 0 0 20px rgba(0, 255, 0, 0.1);
}

.drum-glow.active {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Retro scanline effect */
.drum-window::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
}
</style>
