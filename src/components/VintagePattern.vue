<template>
  <div class="vintage-pattern">
    <div class="corner-screws">
      <div class="screw top-left"></div>
      <div class="screw top-right"></div>
      <div class="screw bottom-left"></div>
      <div class="screw bottom-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VintagePattern'
}
</script>

<style scoped>
.vintage-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.corner-screws {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.screw {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #555, #222);
  border: 1px solid #333;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.5);
}

.screw::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 1px;
  background: #111;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}

.screw::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 8px;
  background: #111;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}

.screw.top-left {
  top: 15px;
  left: 15px;
}

.screw.top-right {
  top: 15px;
  right: 15px;
}

.screw.bottom-left {
  bottom: 15px;
  left: 15px;
}

.screw.bottom-right {
  bottom: 15px;
  right: 15px;
}
</style>
