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

import config from "../utils/config.js";

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

const upload = async (request) => {
  if (request.file.size < 1024 * 10) {
    proxy.Request.post(
      "/file/upload",
      {
        file: request.file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then((response) => {
      loadFiles();
    });
  } else {
    const fileName = request.file.name;
    const chunkSize = 1024 * 1024 * 10;
    var chunks = Math.ceil(request.file.size / chunkSize);
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      var chunk = request.file.slice(
        chunkSize * chunkIndex,
        Math.min(chunkSize * (chunkIndex + 1), request.file.size)
      );
      var response = await proxy.Request.post(
        "/file/upload",
        {
          file: chunk,
          chunkIndex: chunkIndex,
          chunks: chunks,
          fileName: fileName,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (chunkIndex < chunks - 1 && response.data.code !== 203) {
        ElMessage({
          message: "文件分片上传出错，请重试",
          type: "error",
        });
        break;
      }

      if (chunkIndex == chunks - 1) {
        ElMessage({
          message: response.data.message,
          type: "success",
        });
        loadFiles();
      }
    }
  }
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
