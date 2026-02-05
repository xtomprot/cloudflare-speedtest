<template>
  <div class="scores-section">
    <h2>Quality Scores</h2>
    <div class="scores-grid">
      <div class="score-card">
        <div class="score-icon">🎬</div>
        <h4>Streaming</h4>
        <div class="score-value">{{ scores.streaming.points }}</div>
        <div class="score-badge" :class="getScoreClass(scores.streaming.classification)">
          {{ scores.streaming.classification }}
        </div>
      </div>

      <div class="score-card">
        <div class="score-icon">🎮</div>
        <h4>Gaming</h4>
        <div class="score-value">{{ scores.gaming.points }}</div>
        <div class="score-badge" :class="getScoreClass(scores.gaming.classification)">
          {{ scores.gaming.classification }}
        </div>
      </div>

      <div class="score-card">
        <div class="score-icon">💬</div>
        <h4>Real-Time Comms</h4>
        <div class="score-value">{{ scores.rtc.points }}</div>
        <div class="score-badge" :class="getScoreClass(scores.rtc.classification)">
          {{ scores.rtc.classification }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QualityScores',
  props: {
    scores: {
      type: Object,
      required: true
    }
  },
  methods: {
    getScoreClass(classification) {
      const classMap = {
        'bad': 'badge-bad',
        'poor': 'badge-poor',
        'average': 'badge-average',
        'good': 'badge-good',
        'great': 'badge-great'
      }
      return classMap[classification.toLowerCase()] || 'badge-average'
    }
  }
}
</script>
