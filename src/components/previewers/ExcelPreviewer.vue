<template>
  <div v-html="excelContent" class="table-info"></div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  url: String,
});

const excelContent = ref();

const initExcel = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: "blob",
  });
  if (!result) {
    return;
  }

  const data = await result.data.arrayBuffer();
  let workbook = XLSX.read(data);
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  excelContent.value = XLSX.utils.sheet_to_html(worksheet);
};

onMounted(() => {
  initExcel();
});
</script>

<style lang="scss" scoped>
.table-info {
  width: 100%;
  padding: 10px;
  :deep table {
    widows: 100%;
    border-collapse: collapse;
    td {
      border: 1px solid #ddd;
      border-collapse: collapse;
      padding: 5px;
      height: 30px;
      min-width: 50px;
    }
  }
}
</style>
