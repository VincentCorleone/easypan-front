<style lang="scss" scoped>
.window {
  .window-mask {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh);
    z-index: 200;
    opacity: 0.5;
    background: #000;
  }
  .close {
    z-index: 202;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #606266;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #fff;
      z-index: 10000;
    }
  }
  .window-content {
    position: absolute;
    top: 0px;
    z-index: 201;
    background: #fff;
    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }
    .content-body {
      height: calc(100vh - 41px);
      display: flex;
      overflow: auto;
    }
  }
}
</style>
<template>
  <div class="window" v-if="visible">
    <div class="window-mask" @click="close"></div>
    <div class="close" @click="close">
      <span class="iconfont icon-close2"></span>
    </div>
    <div class="window-content"><div id="player" ref="player"></div></div>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import DPlayer from "dplayer";

const type = {
  video: ["mp4", "avi", "rmvb", "mkv", "mov"],
};
const visible = ref(false);

const player = ref();

function initPlayer(url) {
  const dp = new DPlayer({
    container: player.value,
    video: {
      url,
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
}

function show(currentPath, fileName) {
  visible.value = true;
  nextTick(() =>
    initPlayer(
      // http://127.0.0.1:5173/api/file/previewVideo/kdkc.mkv/index.m3u8
      "/api/file/previewVideo" + currentPath + fileName + "/index.m3u8"
    )
  );
}

function close() {
  visible.value = false;
}

defineExpose({
  show,
});
</script>
