<template>
  <footer>
    <div class="vintage-line"></div>
    <p class="powered-by">
      POWERED BY
      <a href="https://www.npmjs.com/package/@cloudflare/speedtest" target="_blank">
        CLOUDFLARE SPEEDTEST
      </a>
    </p>
    <p class="retro-tagline">
      « Digital Performance Engineering Since 1975 »
    </p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
footer {
  padding-top: 30px;
}

.vintage-line {
  width: 200px;
  height: 3px;
  background: linear-gradient(to right, transparent 0%, #ff6600 50%, transparent 100%);
  margin: 0 auto 20px;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.powered-by {
  margin-bottom: 10px;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.retro-tagline {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 0.8rem;
  color: #555;
  margin-top: 10px;
}
</style>
