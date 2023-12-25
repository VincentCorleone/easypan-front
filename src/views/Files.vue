<style scoped>
.icon-download {
  cursor: pointer;
}
</style>

<template>
  <el-upload :http-request="upload">
    <el-button type="primary">
      <span class="iconfont icon-upload"></span>
      Primary
    </el-button>
  </el-upload>

  <el-table :data="files" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" width="180">
      <template #default="scope">
        <span>{{ scope.row.fileName }}</span>
        <span class="op">
          <span
            v-if="!scope.row.isDirectory"
            class="iconfont icon-download"
            @click="downloadFile(scope.row.fileName)"
            >下载</span
          >
        </span>
        <!-- <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>name: {{ scope.row.fileName }}</div>
            <div>address: {{ scope.row.address }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.name }}</el-tag>
          </template>
        </el-popover> -->
      </template>
    </el-table-column>
    <el-table-column prop="lastModified" label="最近修改时间" width="180" />
    <el-table-column prop="size" label="大小" />
  </el-table>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();

const currentPath = ref("/");
const files = ref([]);

import { onMounted } from "vue";
import { ElMessage } from "element-plus";

import config from "../utils/config.js"

const loadFiles = () => {
  proxy.Request.get("/file/loadFiles", {
    params: {
      currentPath: currentPath.value,
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
        type: "error",
      });
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

const downloadFile = (fileName) => {
  proxy.Request.get("/file/createDownloadCode", {
    params: {
      currentPath: currentPath.value,
      fileName: fileName,
    },
  })
    .then((response) => {
      console.log(response.data);
      //   ElMessage({
      //       message: response.data.message,
      //       type: 'success',
      //   })
      const code = response.data.data.code;
      
      window.open(config.baseUrl + "/file/downloadFile?code=" + code);
    })
    .catch(function (error) {
      //   ElMessage({
      //       message: error.response.data.message,
      //       type: 'error',
      //   })
    });
};
</script>
