<template>
  <span class="file-icon"><img :src="url" /></span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  currentPath: String,
  fileName: String,
});

const types = {
  image: [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "dds",
    "psd",
    "pdt",
    "webp",
    "xmp",
    "svg",
    "tiff",
  ],
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

import { getCurrentInstance, ref, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const url = ref();

onMounted(async () => {
  // debugger;
  const ext = props.fileName.substr(props.fileName.lastIndexOf(".") + 1);
  if (ext == "dir") {
    url.value = new URL(
      `../assets/icon-image/folder.png`,
      import.meta.url
    ).href;
  } else if (types.image.includes(ext)) {
    const result = await proxy.Request({
      url:
        "/file/getCover?currentPath=" +
        props.currentPath +
        "&fileName=" +
        props.fileName,
    });
    if (!result.data) {
      url.value = new URL(
        `../assets/icon-image/image.png`,
        import.meta.url
      ).href;
      return;
    }
    url.value =
      "/api/file/getCover?currentPath=" +
      props.currentPath +
      "&fileName=" +
      props.fileName;
  } else if (types.music.includes(ext)) {
    url.value = new URL(`../assets/icon-image/music.png`, import.meta.url).href;
  } else if (types.video.includes(ext)) {
    const result = await proxy.Request({
      url:
        "/file/getCover?currentPath=" +
        props.currentPath +
        "&fileName=" +
        props.fileName,
    });
    if (!result.data) {
      url.value = new URL(
        `../assets/icon-image/video.png`,
        import.meta.url
      ).href;
      return;
    }
    url.value =
      "/api/file/getCover?currentPath=" +
      props.currentPath +
      "&fileName=" +
      props.fileName;
  } else if (types.docx.includes(ext)) {
    url.value = new URL(`../assets/icon-image/word.png`, import.meta.url).href;
  } else if (types.xlsx.includes(ext)) {
    url.value = new URL(`../assets/icon-image/excel.png`, import.meta.url).href;
  } else if (types.txt.includes(ext)) {
    url.value = new URL(`../assets/icon-image/txt.png`, import.meta.url).href;
  } else if (types.pdf.includes(ext)) {
    url.value = new URL(`../assets/icon-image/pdf.png`, import.meta.url).href;
  } else {
    url.value = new URL(
      `../assets/icon-image/others.png`,
      import.meta.url
    ).href;
  }
});
</script>

<style scoped lang="scss">
.file-icon {
  display: inline-block;
  height: 40px;
  width: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
