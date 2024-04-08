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
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
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
          style="width: 600px"
          :fileName="g_fileName"
          :currentPath="g_currentPath"
          v-else-if="type == 'music'"
        ></MusicPreviewer>
        <DocxPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-else-if="type == 'docx'"
        ></DocxPreviewer>
        <ExcelPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-else-if="type == 'xlsx'"
        ></ExcelPreviewer>
        <PdfPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-else-if="type == 'pdf'"
        ></PdfPreviewer>
        <TxtPreviewer
          :url="
            '/file/previewFile?currentPath=' +
            g_currentPath +
            '&fileName=' +
            g_fileName
          "
          v-else-if="type == 'txt'"
        ></TxtPreviewer>
        <div v-else style="width: 600px">
          <p style="margin-left: 20px">该类型不支持预览，请直接下载</p>
        </div>
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
import TxtPreviewer from "./previewers/TxtPreviewer.vue";

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
  txt: ["txt"],
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
