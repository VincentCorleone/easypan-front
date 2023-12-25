<template>
  <el-upload :http-request="upload">
    <el-button type="primary">
      <span class="iconfont icon-upload"></span>
      Primary
    </el-button>
  </el-upload>

  <el-table :data="files" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" width="180" />
    <el-table-column prop="lastModified" label="最近修改时间" width="180" />
    <el-table-column prop="size" label="大小" />
  </el-table>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();

const files = ref([]);

import { onMounted } from "vue";
import { ElMessage } from "element-plus";

const loadFiles = () => {
  proxy.Request.get("/file/loadFiles", {
    params: {
      currentPath: "/",
    },
  })
    .then((response) => {
      console.log(response.data);
      //   ElMessage({
      //       message: response.data.message,
      //       type: 'success',
      //   })
      files.value = response.data.data;
    })
    .catch(function (error) {
        ElMessage({
            message: error.response.data.message,
            type: 'error',
        })
    });
};

onMounted(loadFiles);

const upload = (file) => {
  proxy.Request.post(
    "/file/upload",
    {
      file: file.file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ).then((response) => {
    loadFiles();
  });
};
</script>
