<template>
  <div id="aplayerHolder" ref="aplayerHolder"></div>
</template>

<script setup>
import APlayer from "APlayer";
import "APlayer/dist/APlayer.min.css";

import { ref, onMounted, onUnmounted } from "vue";

const aplayerHolder = ref();

const props = defineProps({
  fileName: String,
  currentPath: String,
});

let ap;

onMounted(() => {
  ap = new APlayer({
    element: aplayerHolder.value,
    audio: [
      {
        name: props.fileName,
        url:
          "/api/file/previewFile?currentPath=" +
          props.currentPath +
          "&fileName=" +
          props.fileName,
      },
    ],
  });
});

onUnmounted(() => {
  ap.destroy();
});
</script>
