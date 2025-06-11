<script>
export default {
  name: "FooterComp",
};
</script>

<template>
  <!-- <span class="blur blur-color1"></span> -->
  <footer class="">
    <div class="footer-content">Footer</div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
  margin-top: 10vh;
  margin-bottom: 2vw;
}

.footer-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30vh;
  padding: 20px;
  border-radius: 10px;
  outline: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(50px);
}

.blur:nth-last-of-type(1) {
  position: absolute;
  bottom: -1000px;
  left: 50%;
  transform: translateX(-50%);
  scale: 2;
  opacity: 0.3;
}
</style>
