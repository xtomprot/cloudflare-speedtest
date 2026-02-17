<template>
  <header>
    <div class="retro-badge">EST. 1975</div>
    <h1>SPEEDTEST CX</h1>
    <p class="subtitle">Network Performance Analysis System</p>
    <div class="vintage-line"></div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
header {
  position: relative;
  padding-bottom: 30px;
}

.retro-badge {
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  font-weight: bold;
  color: #666;
  background: #1a1a1a;
  border: 1px solid #444;
  padding: 4px 12px;
  border-radius: 3px;
  letter-spacing: 2px;
  margin-bottom: 15px;
}

.vintage-line {
  width: 200px;
  height: 3px;
  background: linear-gradient(to right, transparent 0%, #ff6600 50%, transparent 100%);
  margin: 20px auto 0;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}
</style>
