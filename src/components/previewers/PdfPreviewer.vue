<template>
  <div class="pdf">
    <VuePdfEmbed
      ref="pdfRef"
      :source="state.url"
      width="850"
      :page="state.pageNum"
    ></VuePdfEmbed>
  </div>
</template>

<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  url: String,
});

const state = ref({
  url: "",
  pageNum: 0,
  numPages: 0,
});

const initPdf = async () => {
  state.value.url = "/api" + props.url;
};

onMounted(() => {
  initPdf();
});
</script>

<style lang="scss">
.doc-content {
  margin: 0 auto;
}
</style>
