<template>
  <div></div>
</template>

<script>
export default {
  name: "ChatBot",
  mounted() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js";
    script.async = true;
    script.onload = () => {
      if (window.Typebot) {
        window.Typebot.initBubble({
          typebot: "my-typebot-jbp4s5q",
          theme: {
            button: { backgroundColor: "#356bd0" },
            chatWindow: {
              backgroundColor:
                "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MjU2MDR8MHwxfHNlYXJjaHwyNHx8bmlnaHQlMjBjaXR5fGVufDB8MHx8fDE3NDk0ODc4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
          },
        });
      }
    };
    document.body.appendChild(script);
  },
};
</script>
