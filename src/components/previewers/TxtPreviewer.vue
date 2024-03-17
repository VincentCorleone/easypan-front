<template>
  <div class="code">
    <highlightjs autodetect :code="textContent"></highlightjs>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  url: String,
});

const textContent = ref("");
const blobResult = ref();

const readTxt = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "blob",
  });
  if (!result) {
    return;
  }
  blobResult.value = result.data;

  const reader = new FileReader();
  reader.onload = () => {
    textContent.value = reader.result;
  };
  reader.readAsText(blobResult.value, "utf8");
};

onMounted(() => {
  readTxt();
});
</script>

<style lang="scss">
.doc-content {
  margin: 0 auto;
}
</style>
