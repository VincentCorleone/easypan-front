<style scoped>
.icon-download {
  cursor: pointer;
}

.buttons {
  display: flex;
}

.clickable {
  color: cadetblue;
  cursor: pointer;
}
</style>

<template>
  <div class="buttons">
    <el-upload :http-request="upload">
      <el-button type="primary">
        <span class="iconfont icon-upload"></span>
        上传
      </el-button>
    </el-upload>
    <el-button @click="newFolder" type="success">
      <span class="iconfont icon-folder-add"></span>
      新建文件夹
    </el-button>
  </div>

  <div>
    <template v-if="paths.length > 0">
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
    </template>
    <template v-else>
      <span>根目录</span>
    </template>
  </div>

  <el-table :data="files" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" width="180">
      <template #default="scope">
        <div
          v-if="scope.row.isDirectory"
          @click="enterFolder(scope.row.fileName)"
        >
          <span>{{ scope.row.fileName }}</span>
        </div>
        <div v-else>
          <span>{{ scope.row.fileName }}</span>
          <span class="op">
            <span
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
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="lastModified" label="最近修改时间" width="180" />
    <el-table-column prop="size" label="大小" />
  </el-table>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();

const files = ref([]);

import { onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import config from "../utils/config.js";

import { reactive, computed } from "vue";

const paths = reactive([]);

// a computed ref
const currentPath = computed(() => {
  if (paths.length == 0) {
    return "/";
  } else {
    return "/" + paths.join("/") + "/";
  }
});

const jumpFolder = (index) => {
  const length = paths.length;
  while (index < length - 1) {
    paths.pop();
    index++;
  }
  loadFiles();
};

const returnFolder = () => {
  paths.pop();
  loadFiles();
};

const enterFolder = (folderName) => {
  paths.push(folderName);
  loadFiles();
  ElMessage({
    message: folderName,
    type: "success",
  });
};
const newFolder = () => {
  ElMessageBox.prompt("请输入新的文件夹的名称", "新建文件夹", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValidator: (value) => {
      console.log("sfdffd");
      if (value == null || value.length == 0) {
        return "文件夹名称不能为空";
      } else if (value.includes("/")) {
        return "文件夹名称不能包含’/‘'";
      }
      return true;
    },
  })
    .then(({ value }) => {
      proxy.Request.post(
        "/file/newFolder",
        {
          currentPath: currentPath.value,
          folderName: value,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((response) => {
        loadFiles();
      });
    })
    .catch(() => {
      console.log("用户取消输入");
    });
};

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
  if (request.file.size < 1024 * 1024 * 10) {
    proxy.Request.post(
      "/file/upload",
      {
        file: request.file,
        currentPath: currentPath.value,
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
          currentPath: currentPath.value,
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
