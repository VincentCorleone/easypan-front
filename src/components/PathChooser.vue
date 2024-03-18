<script setup>
import { computed, onMounted, ref, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const folders = ref([]);

const paths = computed({
  get() {
    return props.modelValue;
  },
  // set(value) {
  //   console.log("set 被处罚");
  //   emit("update:modelValue", value);
  // },
});

const targetPath = computed(() => {
  if (paths.value.length == 0) {
    return "/";
  } else {
    return "/" + paths.value.join("/") + "/";
  }
});

onMounted(() => {
  loadDirs();
});

const jumpFolder = (index) => {
  const length = paths.value.length;
  while (index < length - 1) {
    paths.value.pop();
    index++;
  }
  loadDirs();
};

const enterFolder = (folderName) => {
  paths.value.push(folderName);
  loadDirs();
};

const returnFolder = () => {
  paths.value.pop();
  loadDirs();
};

const loadDirs = () => {
  proxy.Request.get("/file/loadDirs", {
    params: {
      targetPath: targetPath.value,
    },
  }).then((response) => {
    folders.value = response.data.data;
  });

  //
};
</script>

<template>
  <div v-if="paths.length > 0">
    <span @click="returnFolder()" class="clickable">返回上一级</span>
    <span> | </span>
    <span @click="jumpFolder(-1)" class="clickable">根目录</span>
    <span v-for="(item, index) in paths">
      <span> > </span>

      <span
        class="clickable"
        @click="jumpFolder(index)"
        v-if="index < paths.length - 1"
        >{{ item }}</span
      >
      <span v-else>{{ item }}</span>
    </span>
  </div>
  <div>
    <div
      v-for="folder in folders"
      class="folderItem"
      @click="enterFolder(folder)"
    >
      <span>
        <img src="../assets/icon-image/folder.png" width="32" />
      </span>
      <span>{{ folder }}</span>
    </div>
  </div>
</template>

<style>
.clickable {
  color: cadetblue;
  cursor: pointer;
}
.folderItem {
  cursor: pointer;
}

.folderItem:hover {
  background: #f8f8f8;
}
</style>
