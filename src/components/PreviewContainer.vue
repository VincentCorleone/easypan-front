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
    <div class="window-content">
      <div class="title">{{ title }}</div>
      <div class="content-body">
        <VideoPreviewer
          :fileName="g_fileName"
          :currentPath="g_currentPath"
          v-if="type == 'video'"
        ></VideoPreviewer>
        <MusicPreviewer
          :fileName="g_fileName"
          :currentPath="g_currentPath"
          v-if="type == 'music'"
        ></MusicPreviewer>
        <DocxPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-if="type == 'docx'"
        ></DocxPreviewer>
        <ExcelPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-if="type == 'xlsx'"
        ></ExcelPreviewer>
        <PdfPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-if="type == 'pdf'"
        ></PdfPreviewer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import MusicPreviewer from "./previewers/MusicPreviewer.vue";
import VideoPreviewer from "./previewers/VideoPreviewer.vue";
import DocxPreviewer from "./previewers/DocxPreviewer.vue";
import ExcelPreviewer from "./previewers/ExcelPreviewer.vue";
import PdfPreviewer from "./previewers/PdfPreviewer.vue";

const types = {
  video: ["mp4", "avi", "rmvb", "mkv", "mov"],
  music: [
    "mp3",
    "wav",
    "wma",
    "mp2",
    "flac",
    "midi",
    "ra",
    "ape",
    "aac",
    "cda",
  ],
  docx: ["docx"],
  xlsx: ["xlsx"],
  pdf: ["pdf"],
};

const type = ref(null);

const visible = ref(false);
const title = ref("");

const player = ref();

const g_fileName = ref(null);
const g_currentPath = ref(null);

function show(currentPath, fileName) {
  visible.value = true;
  title.value = fileName;

  g_currentPath.value = currentPath;
  g_fileName.value = fileName;

  type.value = Object.keys(types).find((key) =>
    types[key].includes(fileName.substr(fileName.lastIndexOf(".") + 1))
  );
}

function close() {
  visible.value = false;
}

defineExpose({
  show,
});
</script>
