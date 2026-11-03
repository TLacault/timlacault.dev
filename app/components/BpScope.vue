<!-- Tells components inside whether they render in the Blueprint's x-ray copy (inject('xray')). -->
<script setup lang="ts">
const props = defineProps<{ xray?: boolean }>()
provide('xray', props.xray)
</script>

<template><slot /></template>
