<template>
  <Transition name="overlay-fade">
    <div v-if="isVisible" class="ultimate-overlay" @click.self="shakeOverlay">
      <div class="question-panel" :class="{ shake: isShaking, correct: isCorrect }">
        <div class="panel-header">
          <div class="title-line">DEEP THOUGHT</div>
          <div class="version">v7.5M YEARS</div>
        </div>

        <div class="question-content">
          <div class="question-text">
            <p class="main-question">
              WHAT IS THE ANSWER TO THE ULTIMATE QUESTION
            </p>
            <p class="sub-question">
              OF LIFE, THE UNIVERSE, AND EVERYTHING?
            </p>
          </div>

          <div class="answer-section" v-if="!isCorrect">
            <div class="led-display-container">
              <input
                ref="answerInput"
                v-model="userAnswer"
                type="text"
                class="answer-input"
                placeholder="_ _"
                maxlength="2"
                @keyup.enter="checkAnswer"
                @input="formatInput"
                autofocus
              />
            </div>

            <button
              class="compute-btn"
              @click="checkAnswer"
              :disabled="userAnswer.length === 0"
            >
              COMPUTE
            </button>

            <div v-if="showError" class="error-message">
              <span class="error-icon">⚠</span>
              {{ errorMessage }}
            </div>
          </div>

          <div v-else class="success-message">
            <div class="success-icon">✓</div>
            <div class="success-text">
              CORRECT! THE ANSWER IS {{ correctAnswer }}
            </div>
            <div class="closing-text">Access granted. Revealing results...</div>
          </div>
        </div>

        <div class="panel-footer">
          <div class="hint-text" v-if="attempts > 2 && !isCorrect">
            HINT: It's a two-digit number less than 50
          </div>
          <div class="attempt-counter" v-if="!isCorrect">
            Attempts: <span class="attempt-num">{{ attempts }}</span>
          </div>
        </div>

        <div class="corner-lights">
          <div class="light" v-for="n in 4" :key="n"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'UltimateQuestionOverlay',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userAnswer: '',
      correctAnswer: 42,
      isCorrect: false,
      showError: false,
      errorMessage: '',
      attempts: 0,
      isShaking: false
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        // Reset state when overlay becomes visible
        this.userAnswer = ''
        this.isCorrect = false
        this.showError = false
        this.attempts = 0
        // Focus input after a small delay
        this.$nextTick(() => {
          if (this.$refs.answerInput) {
            this.$refs.answerInput.focus()
          }
        })
      }
    },
    isCorrect(newVal) {
      if (newVal) {
        // Emit close event after a delay
        setTimeout(() => {
          this.$emit('correct-answer')
        }, 2000)
      }
    }
  },
  methods: {
    formatInput() {
      // Only allow numbers
      this.userAnswer = this.userAnswer.replace(/[^0-9]/g, '')
      this.showError = false
    },
    checkAnswer() {
      if (this.userAnswer.trim() === '') return

      this.attempts++
      const answer = parseInt(this.userAnswer)

      if (answer === this.correctAnswer) {
        this.isCorrect = true
        this.showError = false
      } else {
        this.showError = true
        this.triggerShake()

        // Different error messages based on how wrong they are
        if (answer === 41 || answer === 43) {
          this.errorMessage = 'SO CLOSE! But not quite...'
        } else if (answer < 20) {
          this.errorMessage = 'TOO LOW. Think bigger!'
        } else if (answer > 60) {
          this.errorMessage = 'TOO HIGH. Think smaller!'
        } else if (answer === 24) {
          this.errorMessage = 'You reversed the digits! Try again.'
        } else {
          this.errorMessage = 'INCORRECT. Deep Thought disagrees.'
        }

        // Clear input after short delay
        setTimeout(() => {
          this.userAnswer = ''
          if (this.$refs.answerInput) {
            this.$refs.answerInput.focus()
          }
        }, 1500)
      }
    },
    triggerShake() {
      this.isShaking = true
      setTimeout(() => {
        this.isShaking = false
      }, 500)
    },
    shakeOverlay() {
      // Shake when clicking outside the panel
      this.triggerShake()
    }
  }
}
</script>

<style scoped>
.ultimate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.question-panel {
  position: relative;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 4px solid #ff6600;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow:
    0 0 40px rgba(255, 102, 0, 0.5),
    0 20px 60px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: panel-appear 0.5s ease-out;
}

.question-panel.shake {
  animation: shake 0.5s ease-in-out;
}

.question-panel.correct {
  border-color: #00ff00;
  box-shadow:
    0 0 40px rgba(0, 255, 0, 0.6),
    0 20px 60px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ff6600;
}

.title-line {
  font-family: 'Arial Black', sans-serif;
  font-size: 1.5rem;
  color: #ff6600;
  letter-spacing: 4px;
  text-shadow:
    0 0 10px rgba(255, 102, 0, 0.8),
    2px 2px 0 rgba(0, 0, 0, 0.5);
}

.question-panel.correct .title-line {
  color: #00ff00;
  text-shadow:
    0 0 10px rgba(0, 255, 0, 0.8),
    2px 2px 0 rgba(0, 0, 0, 0.5);
}

.version {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #666;
  background: #0d0d0d;
  padding: 4px 10px;
  border: 1px solid #333;
  border-radius: 3px;
}

.question-content {
  margin-bottom: 30px;
}

.question-text {
  text-align: center;
  margin-bottom: 30px;
}

.main-question {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.sub-question {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.5;
}

.answer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.led-display-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.answer-input {
  width: 150px;
  height: 80px;
  background: #000;
  border: 3px solid #333;
  border-radius: 8px;
  font-family: 'Courier New', 'DS-Digital', monospace;
  font-size: 3.5rem;
  font-weight: bold;
  color: #00ff00;
  text-align: center;
  text-shadow:
    0 0 10px #00ff00,
    0 0 20px #00ff00;
  box-shadow:
    inset 0 5px 15px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(0, 255, 0, 0.3);
  outline: none;
  letter-spacing: 10px;
  transition: all 0.3s ease;
}

.answer-input:focus {
  border-color: #ff6600;
  box-shadow:
    inset 0 5px 15px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(255, 102, 0, 0.5);
}

.answer-input::placeholder {
  color: #003300;
  opacity: 1;
}

.compute-btn {
  padding: 15px 50px;
  font-family: 'Arial Black', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  background: linear-gradient(to bottom, #ff8800 0%, #ff6600 100%);
  border: 3px solid #cc5500;
  border-radius: 6px;
  color: #000;
  cursor: pointer;
  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.3),
    0 6px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
  position: relative;
  top: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.compute-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, #ffaa00 0%, #ff8800 100%);
  box-shadow:
    0 0 25px rgba(255, 102, 0, 0.8),
    0 4px 0 rgba(0, 0, 0, 0.3),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.compute-btn:active:not(:disabled) {
  top: 4px;
  box-shadow:
    0 0 0 rgba(0, 0, 0, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.4);
}

.compute-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(50%);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid #ff0000;
  padding: 12px 20px;
  border-radius: 6px;
  color: #ff3333;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: error-pulse 0.5s ease-out;
}

.error-icon {
  font-size: 1.5rem;
  animation: blink-red 0.5s ease-in-out 3;
}

.success-message {
  text-align: center;
  animation: success-appear 0.5s ease-out;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #00ff00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #000;
  font-weight: bold;
  box-shadow:
    0 0 30px rgba(0, 255, 0, 0.8),
    inset 0 0 20px rgba(0, 255, 0, 0.5);
  animation: success-pulse 1s ease-in-out infinite;
}

.success-text {
  font-family: 'Arial Black', sans-serif;
  font-size: 1.5rem;
  color: #00ff00;
  letter-spacing: 2px;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}

.closing-text {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #999;
  font-style: italic;
}

.panel-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.hint-text {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #ff8800;
  font-style: italic;
}

.attempt-counter {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #666;
}

.attempt-num {
  color: #ff6600;
  font-weight: bold;
}

.corner-lights {
  position: absolute;
}

.light {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ff6600;
  border-radius: 50%;
  box-shadow:
    0 0 10px rgba(255, 102, 0, 0.8),
    inset 0 0 5px rgba(255, 102, 0, 0.5);
  animation: light-pulse 2s ease-in-out infinite;
}

.question-panel.correct .light {
  background: #00ff00;
  box-shadow:
    0 0 10px rgba(0, 255, 0, 0.8),
    inset 0 0 5px rgba(0, 255, 0, 0.5);
}

.light:nth-child(1) {
  top: 15px;
  left: 15px;
}

.light:nth-child(2) {
  top: 15px;
  right: 15px;
  animation-delay: 0.5s;
}

.light:nth-child(3) {
  bottom: 15px;
  left: 15px;
  animation-delay: 1s;
}

.light:nth-child(4) {
  bottom: 15px;
  right: 15px;
  animation-delay: 1.5s;
}

/* Animations */
@keyframes overlay-fade-enter-active {
  animation: fade-in 0.3s ease-out;
}

@keyframes overlay-fade-leave-active {
  animation: fade-out 0.3s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes panel-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

@keyframes error-pulse {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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

@keyframes success-appear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes success-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes light-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .question-panel {
    padding: 25px;
  }

  .title-line {
    font-size: 1.2rem;
  }

  .main-question,
  .sub-question {
    font-size: 1rem;
  }

  .answer-input {
    width: 120px;
    height: 70px;
    font-size: 3rem;
  }

  .compute-btn {
    padding: 12px 40px;
    font-size: 1rem;
  }

  .panel-footer {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
