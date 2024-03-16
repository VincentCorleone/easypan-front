<template>
  <div ref="docxHolder" class="doc-content"></div>
</template>

<script setup>
import * as docx from "docx-preview";
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  url: String,
});

const docxHolder = ref();

const initDoc = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "blob",
  });
  if (!result) {
    return;
  }

  docx.renderAsync(result.data, docxHolder.value);
};

onMounted(() => {
  initDoc();
});
</script>

<style lang="scss">
.doc-content {
  margin: 0 auto;
}
</style>
