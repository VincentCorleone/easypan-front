<template>
  <div id="dplayerHolder" ref="dplayerHolder"></div>
</template>

<script setup>
import DPlayer from "dplayer";

import { ref, onMounted, onUnmounted } from "vue";

const dplayerHolder = ref();

const props = defineProps({
  fileName: String,
  currentPath: String,
});

let dp;

onMounted(() => {
  dp = new DPlayer({
    container: dplayerHolder.value,
    video: {
      url:
        "/api/file/previewVideo" +
        props.currentPath +
        props.fileName +
        "/index.m3u8",
      tyle: "customHls",
      customType: {
        customHls: function (video, player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
  });
});

onUnmounted(() => {
  dp.destroy();
});
</script>
