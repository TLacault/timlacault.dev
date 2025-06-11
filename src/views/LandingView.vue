<script>
// import NavigationBar from "@/components/NavigationBar.vue";

export default {
  name: "LandingView",
  components: {
    // HelloWorld,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const letters = document.querySelectorAll("h1 span");

  letters.forEach((letter) => {
    let isAnimating = false;

    letter.addEventListener("mouseenter", () => {
      if (isAnimating) return;

      isAnimating = true;
      letter.classList.add("bounce");

      // Remove class after animation completes (duration: 600ms)
      setTimeout(() => {
        letter.classList.remove("bounce");
        isAnimating = false;
      }, 600); // match animation duration
    });
  });
});
</script>

<template>
  <span class="blur blur-color1"></span>
  <span class="blur blur-color2"></span>
  <span class="blur blur-color2"></span>

  <div class="hero container">
    <div class="title slide-in">
      <h2>Hello ! I'm</h2>
      <h1>
        <span>T</span>
        <span>i</span>
        <span>m</span>
        <span>L</span>
        <span>a</span>
        <span>c</span>
        <span>a</span>
        <span>u</span>
        <span>l</span>
        <span>t</span>
      </h1>
      <h3>Undergraduate <span>Software Engineer</span> based in Bordeaux 🍇</h3>
      <div class="socials">
        <a
          href="https://github.com/TLacault"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="ri-github-line"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/tim-lacault"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="ri-linkedin-line"></i>
        </a>
        <a
          href="https://cal.com/tim-lacault"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="ri-calendar-event-line"></i>
        </a>
        <a
          href="mailto:lacault.tim@gmail.com?subject=Contact%20from%20Portfolio"
          target="_blank"
          rel="noopener noreferrer"
          ><i class="ri-mail-line"></i>
        </a>
      </div>
    </div>

    <!-- scroll down -->
    <div class="down slide-in">
      <p>view more</p>
      <i class="ri-arrow-down-double-line"></i>
    </div>
  </div>
</template>

<style scoped>
.hero {
  flex-direction: column;
  text-align: center;
  color: var(--text);
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 0;

  & * {
    font-family: "Cal Sans", sans-serif;
    font-weight: 500;
  }

  & h2 {
    font-size: 2.5rem;
  }

  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8.5rem;

    & span:nth-of-type(4) {
      margin-left: 40px;
    }

    span {
      display: inline-block;
      background: linear-gradient(0deg, var(--primary) 30%, var(--accent));
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      cursor: default;
      will-change: transform, text-shadow;

      animation: float 6s ease-in-out infinite;
      &:nth-of-type(2) {
        animation-delay: 0.1s;
      }
      &:nth-of-type(3) {
        animation-delay: 0.2s;
      }
      &:nth-of-type(4) {
        animation-delay: 0.3s;
      }
      &:nth-of-type(5) {
        animation-delay: 0.4s;
      }
      &:nth-of-type(6) {
        animation-delay: 0.5s;
      }
      &:nth-of-type(7) {
        animation-delay: 0.6s;
      }
      &:nth-of-type(8) {
        animation-delay: 0.7s;
      }
      &:nth-of-type(9) {
        animation-delay: 0.8s;
      }
      &:nth-of-type(10) {
        animation-delay: 0.9s;
      }
    }
  }

  & h3 {
    margin-top: 20px;
    font-family: "Poppins", sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--text);

    span {
      margin-left: 5px;
      margin-right: 5px;
      &:hover {
        color: var(--accent);
        text-shadow: 0px 0px 20px var(--primary);
      }
    }

    i {
      margin-left: 0px;
    }
  }

  & p {
    margin-top: 20px;
    font-size: 1.2rem;
    color: var(--text);
  }
}

@keyframes float {
  0%,
  40% {
    transform: translateY(0px);
    /* text-shadow: 0px 0px 0px var(--primary); */
    /* color: transparent; */
  }
  50% {
    transform: translateY(-10px);
    text-shadow: 0px 0px 10px var(--accent);
    /* color: var(--accent); */
  }
  60%,
  100% {
    transform: translateY(0px);
    /* text-shadow: 0px 0px 0px var(--primary); */
    /* color: transparent; */
  }
}

.socials {
  display: flex;
  gap: 20px;
  margin-top: 30px;

  & a {
    font-size: 1.5rem;
    padding: 10px;
    border-radius: 50%;
    color: var(--text);
    outline: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.1);

    transition: all 0.3s ease-in-out;
    &:hover {
      color: var(--accent);
      transform: scale(1.1);
    }
  }
}

.down {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  gap: 10px;

  & p {
    font-size: 1rem;
    color: var(--text);
    margin-bottom: 10px;
    /* animation: fade 1s infinite alternate; */
    animation-delay: 0.8s;
  }

  & i {
    font-size: 2rem;
    color: var(--text);
    animation: bounce 1s infinite alternate, fade 1s infinite alternate;
  }

  opacity: 0;
  animation-delay: 1s;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}

/* Decorations */
.blur:nth-of-type(1) {
  top: -150px;
  left: -100px;
  scale: 1.5;
  opacity: 0.3;
}

.blur:nth-of-type(2) {
  top: -150px;
  right: -100px;
  scale: 3;
  opacity: 0.3;
}

.blur:nth-of-type(3) {
  bottom: -150px;
  left: auto;
  scale: 1;
  opacity: 0.15;
}
</style>
