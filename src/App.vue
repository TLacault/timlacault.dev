<script>
import NavigationBar from "@/components/NavigationBar.vue";
import FooterComp from "@/components/FooterComp.vue";
// import ChatBot from "@/components/ChatBot.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
    FooterComp,
    // ChatBot,
  },
};

document.title = "Tim Lacault - Portfolio";

// theme switch
const theme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", theme);
</script>

<template>
  <NavigationBar />
  <router-view />
  <!-- <ChatBot /> -->
  <FooterComp />
</template>

<style>
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

#app {
  font-family: "Inter", sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* resets */

#app,
html,
body {
  width: 100%;
  scroll-behavior: smooth;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}

html {
  overflow: -moz-scrollbars-none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
  scrollbar-width: none; /* Firefox */
}

body {
  background: var(--background-radial);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  font-family: "Inter", sans-serif;
  font-weight: 500;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  color: inherit;
  font: inherit;
}

/* global */
.container {
  display: flex;
  width: 100%;
  max-width: 1200px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>

<style>
/* main colors */
:root[data-theme="light"] {
  --text: rgb(5, 7, 10);
  --background: rgb(240, 244, 250);
  --primary: rgb(53, 107, 208);
  --secondary: #80a5ea;
  --accent: #55b4dd;
}

:root[data-theme="dark"] {
  --text: #f4f6fa;
  --background: rgb(5, 9, 15);
  --primary: rgb(47, 102, 202);
  --secondary: #153a7f;
  --accent: rgb(94, 201, 255);
}

/* shades */

:root[data-theme="light"] {
  --text-50: #eef1f6;
  --text-100: #dde4ee;
  --text-200: #bbc9dd;
  --text-300: #99adcc;
  --text-400: #7792bb;
  --text-500: #5577aa;
  --text-600: #445f88;
  --text-700: #334766;
  --text-800: #223044;
  --text-900: #111822;
  --text-950: #090c11;

  --background-50: #ecf1f9;
  --background-100: #d9e3f2;
  --background-200: #b3c7e6;
  --background-300: #8cabd9;
  --background-400: #668fcc;
  --background-500: #4073bf;
  --background-600: #335c99;
  --background-700: #264573;
  --background-800: #192e4d;
  --background-900: #0d1726;
  --background-950: #060b13;

  --primary-50: #eaf0fa;
  --primary-100: #d6e1f5;
  --primary-200: #acc3ec;
  --primary-300: #83a4e2;
  --primary-400: #5a86d8;
  --primary-500: #3068cf;
  --primary-600: #2753a5;
  --primary-700: #1d3e7c;
  --primary-800: #132a53;
  --primary-900: #0a1529;
  --primary-950: #050a15;

  --secondary-50: #e9effb;
  --secondary-100: #d3e0f8;
  --secondary-200: #a7c1f1;
  --secondary-300: #7ba2ea;
  --secondary-400: #5083e2;
  --secondary-500: #2464db;
  --secondary-600: #1d50af;
  --secondary-700: #153c84;
  --secondary-800: #0e2858;
  --secondary-900: #07142c;
  --secondary-950: #040a16;

  --accent-50: #e8effd;
  --accent-100: #d0dffb;
  --accent-200: #a2bff6;
  --accent-300: #739ff2;
  --accent-400: #4480ee;
  --accent-500: #1660e9;
  --accent-600: #114dbb;
  --accent-700: #0d398c;
  --accent-800: #09265d;
  --accent-900: #04132f;
  --accent-950: #020a17;
}

:root[data-theme="dark"] {
  --text-50: #080b11;
  --text-100: #101623;
  --text-200: #202d46;
  --text-300: #304369;
  --text-400: #40598c;
  --text-500: #5070af;
  --text-600: #738cbf;
  --text-700: #96a9cf;
  --text-800: #b9c6df;
  --text-900: #dce2ef;
  --text-950: #eef1f7;

  --background-50: #060b13;
  --background-100: #0d1726;
  --background-200: #192e4d;
  --background-300: #264573;
  --background-400: #335c99;
  --background-500: #4073bf;
  --background-600: #668fcc;
  --background-700: #8cabd9;
  --background-800: #b3c7e6;
  --background-900: #d9e3f2;
  --background-950: #ecf1f9;

  --primary-50: #050a15;
  --primary-100: #0a1529;
  --primary-200: #132a53;
  --primary-300: #1d3e7c;
  --primary-400: #2753a5;
  --primary-500: #3068cf;
  --primary-600: #5a86d8;
  --primary-700: #83a4e2;
  --primary-800: #acc3ec;
  --primary-900: #d6e1f5;
  --primary-950: #eaf0fa;

  --secondary-50: #040a16;
  --secondary-100: #07142c;
  --secondary-200: #0e2858;
  --secondary-300: #153c84;
  --secondary-400: #1d50af;
  --secondary-500: #2464db;
  --secondary-600: #5083e2;
  --secondary-700: #7ba2ea;
  --secondary-800: #a7c1f1;
  --secondary-900: #d3e0f8;
  --secondary-950: #e9effb;

  --accent-50: #020a17;
  --accent-100: #04132f;
  --accent-200: #09265d;
  --accent-300: #0d398c;
  --accent-400: #114dbb;
  --accent-500: #1660e9;
  --accent-600: #4480ee;
  --accent-700: #739ff2;
  --accent-800: #a2bff6;
  --accent-900: #d0dffb;
  --accent-950: #e8effd;
}

/* gradients */
:root {
  --linear-primary-secondary: linear-gradient(var(--primary), var(--secondary));
  --linear-primary-accent: linear-gradient(var(--primary), var(--accent));
  --linear-secondary-accent: linear-gradient(var(--secondary), var(--accent));
  --radial-primary-secondary: radial-gradient(var(--primary), var(--secondary));
  --radial-primary-accent: radial-gradient(var(--primary), var(--accent));
  --radial-secondary-accent: radial-gradient(var(--secondary), var(--accent));
}

/* backgrounds */
:root[data-theme="light"] {
  --background-radial: radial-gradient(
    circle at top right,
    rgb(197, 220, 255),
    rgb(153, 180, 232)
  );
}

:root[data-theme="dark"] {
  --background-radial: radial-gradient(
    circle at top right,
    rgb(17, 23, 36),
    rgb(13, 16, 21)
  );
}

/* ui colors */
:root[data-theme="light"] {
  --block-background: rgba(0, 0, 0, 0.05);
  --block-border: rgba(0, 0, 0, 0.2);
  --block-shadow: 0px 5px 50px rgba(var(--text), 1);

  --button-hover-bg: rgba(0, 0, 0, 0.1);
}

:root[data-theme="dark"] {
  --block-background: #ffffff0d;
  --block-border: rgba(255, 255, 255, 0.2);
  --block-shadow: 0px 5px 5px rgba(var(--text), 0.1);

  --button-hover-bg: rgba(255, 255, 255, 0.2);
}

/* Animations */

.slide-in {
  animation: slideIn 1s ease-in-out forwards;
}

@keyframes slideIn {
  from {
    /* transform: translateY(100px); */
    opacity: 0;
    scale: 0.9;
    filter: blur(10px);
  }
  to {
    /* transform: translateY(0); */
    opacity: 1;
    scale: 1;
    filter: blur(0);
  }
}

/* Decorations */

.blur {
  position: absolute;
  padding: 200px;
  border-radius: 100%;

  z-index: -1;
  filter: blur(100px);
  pointer-events: none;
}

.blur-color1 {
  background: radial-gradient(circle, rgba(114, 119, 255), rgba(5, 9, 15, 0));
}

.blur-color2 {
  background: radial-gradient(circle, rgb(0, 89, 255), rgba(5, 9, 15, 0));
}

.blur-color3 {
  background: radial-gradient(circle, rgb(70, 227, 255), rgba(5, 9, 15, 0));
}

/* ui elements */
.block {
  gap: 5px;
  padding: 5px;
  border-radius: 6px;
  box-shadow: var(--block-shadow);
  background-color: var(--block-background);
  outline: 0.5px solid var(--block-border);
  backdrop-filter: blur(10px);
}

.block-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: transparent;

  &:hover {
    background-color: var(--button-hover-bg);
  }

  &:active {
    transition: transform 0.1s ease-in-out;
    transform: scale(0.95);
  }
}
</style>
