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

.fileName {
  display: flex;
  justify-content: space-between;
}

.op {
  display: none;
}

.fileName:hover .op {
  display: block;
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

  <el-table row-key="fileName" :data="files" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" min-width="500">
      <template #default="scope">
        <div
          v-if="scope.row.isDirectory"
          class="fileName"
          @click="enterFolder(scope.row.fileName)"
        >
          <span>
            <FileIcon :fileName="'.dir'"></FileIcon>
            <span>{{ scope.row.fileName }}</span>
          </span>
          <span class="op">
            <span
              class="iconfont icon-share1 clickable"
              @click.stop="shareFile(scope.row.fileName)"
              >分享</span
            >
            <span
              class="iconfont icon-del clickable"
              @click.stop="deleteFile(scope.row.fileName)"
              >删除</span
            >
            <span
              class="iconfont icon-edit clickable"
              @click.stop="renameFile(scope.row.fileName)"
              >重命名</span
            >
            <span
              class="iconfont icon-move clickable"
              @click.stop="moveFile(scope.row.fileName)"
              >移动</span
            >
          </span>
        </div>
        <div v-else @click="previewFile(scope.row.fileName)" class="fileName">
          <span>
            <FileIcon
              :currentPath="currentPath"
              :fileName="scope.row.fileName"
            ></FileIcon>
            <span>{{ scope.row.fileName }}</span>
          </span>
          <span class="op">
            <span
              class="iconfont icon-download clickable"
              @click.stop="downloadFile(scope.row.fileName)"
              >下载</span
            >
            <span
              class="iconfont icon-share1 clickable"
              @click.stop="shareFile(scope.row.fileName)"
              >分享</span
            >
            <span
              class="iconfont icon-del clickable"
              @click.stop="deleteFile(scope.row.fileName)"
              >删除</span
            >
            <span
              class="iconfont icon-edit clickable"
              @click.stop="renameFile(scope.row.fileName)"
              >重命名</span
            >
            <span
              class="iconfont icon-move clickable"
              @click.stop="moveFile(scope.row.fileName)"
              >移动</span
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
  <PreviewContainer ref="previewContainerRef"></PreviewContainer>
  <ElImageViewer
    v-if="showImageViewer"
    :url-list="[imageUrl]"
    :onClose="closeViewer"
  ></ElImageViewer>
  <el-dialog v-model="shareInfo.visible" title="分享" width="500">
    <el-form
      :model="shareInfo.form"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item label="文件名"> {{ shareInfo.form.fileName }} </el-form-item
      ><el-form-item label="有效期" :required="true">
        <el-radio-group v-model="shareInfo.form.validType">
          <el-radio :label="1">1天</el-radio>
          <el-radio :label="2">3天</el-radio>
          <el-radio :label="3">7天</el-radio>
          <el-radio :label="4">永久</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提取码" :required="true">
        <el-radio-group v-model="shareInfo.form.howCode">
          <el-radio :label="1">自定义</el-radio>
          <el-radio :label="2">系统生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" " v-if="shareInfo.form.howCode == 1">
        <el-input v-model="shareInfo.form.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="shareInfo.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmShare"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="shareResult.visible" title="分享结果" width="500">
    <el-form
      :model="shareInfo.form"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item label="文件名">
        {{ shareResult.form.fileName }} </el-form-item
      ><el-form-item label="分享链接">
        {{ shareResult.form.link }} </el-form-item
      ><el-form-item label="提取码"> {{ shareResult.form.code }} </el-form-item
      ><el-form-item label=" ">
        <el-button
          type="primary"
          @click="copyToClipboard(shareResult.form.link, shareResult.form.code)"
          >复制链接和提取码</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="shareResult.visible = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { h, getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();

const files = ref([]);

import { onMounted } from "vue";
import { ElMessage, ElMessageBox, ElImageViewer } from "element-plus";

import PreviewContainer from "../components/PreviewContainer.vue";

import FileIcon from "../components/FileIcon.vue";

import config from "../utils/config.js";

import { reactive, computed } from "vue";

const paths = reactive([]);

const previewContainerRef = ref();
const showImageViewer = ref(false);

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
};

const imageUrl = ref("");

function closeViewer() {
  showImageViewer.value = false;
}

function previewFile(fileName) {
  const image = [
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
  ];

  if (image.includes(fileName.substr(fileName.lastIndexOf(".") + 1))) {
    imageUrl.value =
      "/api/file/previewFile?currentPath=" +
      currentPath.value +
      "&fileName=" +
      fileName;
    showImageViewer.value = true;
  } else {
    previewContainerRef.value.show(currentPath.value, fileName);
  }
}

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

function generateUUID() {
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const emit = defineEmits(["updateUploadProgress"]);

import SparkMD5 from "spark-md5";

function getFileMD5(file, originFile) {
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10M

  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  // 获取文件分片对象（注意它的兼容性，在不同浏览器的写法不同）
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  // 当前分片下标
  let currentChunk = 0;
  // 分片总数(向下取整)
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  // 加载下一个分片
  const loadNext = () => {
    const start = currentChunk * CHUNK_SIZE;
    const end =
      start + CHUNK_SIZE >= file.size ? file.size : start + CHUNK_SIZE;
    // 文件分片操作，读取下一分片(fileReader.readAsArrayBuffer操作会触发onload事件)
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  };
  loadNext();

  return new Promise((resolve, reject) => {
    fileReader.onload = function (e) {
      spark.append(e.target.result);

      const toEmitFile = JSON.parse(JSON.stringify(originFile));
      toEmitFile.md5Progress = Math.floor((currentChunk / chunks) * 100);
      toEmitFile.event = "updateMd5";
      // console.log(toEmitFile);
      emit("updateUploadProgress", toEmitFile);

      if (currentChunk < chunks) {
        currentChunk++;
        loadNext();
      } else {
        // 该文件的md5值
        const md5 = spark.end();
        resolve(md5);
      }
    };
    fileReader.onerror = function () {
      reject(new Error("文件读取出错，请检查该文件！"));
    };
  });
}

const upload = async (request) => {
  const fileId = generateUUID();
  const originFile = {
    fileId: fileId,
    fileName: request.file.name,
    md5Progress: 0,
    uploadProgress: 0,
  };

  emit("updateUploadProgress", JSON.parse(JSON.stringify(originFile)));
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
    )
      .then((response) => {
        const toEmitFile = JSON.parse(JSON.stringify(originFile));
        toEmitFile.uploadProgress = 100;
        toEmitFile.event = "updateUpload";
        emit("updateUploadProgress", toEmitFile);
        loadFiles();
      })
      .catch(function (error) {
        ElMessage({
          message: error.response.data.message,
          type: "error",
        });
      });
  } else {
    //计算MD5判断是否秒传
    const md5 = await getFileMD5(request.file, originFile);
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
          md5: md5,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).catch(function (error) {
        ElMessage({
          message: error.response.data.message,
          type: "error",
        });
      });
      const toEmitFile = JSON.parse(JSON.stringify(originFile));
      toEmitFile.uploadProgress = Math.floor(((chunkIndex + 1) / chunks) * 100);
      toEmitFile.event = "updateUpload";
      emit("updateUploadProgress", toEmitFile);
      if (chunkIndex == 0 && response.data.code == 205) {
        const toEmitFile = JSON.parse(JSON.stringify(originFile));
        toEmitFile.uploadProgress = 100;
        toEmitFile.event = "updateUpload";
        emit("updateUploadProgress", toEmitFile);
        ElMessage({
          message: "文件秒传成功",
          type: "success",
        });
        loadFiles();
        break;
      }
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

function copyToClipboard(link, code) {
  const text = "链接: " + link + " 提取码: " + code;
  navigator.clipboard
    .writeText(text)
    .then(function () {
      console.log("Text copied to clipboard");
      ElMessage({
        message: "复制成功",
        type: "success",
      });
    })
    .catch(function (err) {
      console.error("Failed to copy text: ", err);
    });
}

const shareInfo = reactive({
  visible: false,
  form: {
    fileName: "",
    validType: 0,
    // 1:1天，2:3天，3:7天，4：永久
    howCode: 0,
    // 1：自定义，2：系统生成
    code: "",
  },
});

const shareResult = reactive({
  visible: false,
  form: {
    fileName: "",
    link: "",
    code: "",
  },
});

function shareFile(fileName) {
  shareInfo.visible = true;
  shareInfo.form.fileName = fileName;
}

function confirmShare() {
  if (shareInfo.form.validType == 0) {
    ElMessage({
      message: "有效期未填写",
      type: "error",
    });
    return;
  }
  if (shareInfo.form.howCode == 0) {
    ElMessage({
      message: "提取码生成方式未填写",
      type: "error",
    });
    return;
  } else if (shareInfo.form.howCode == 1 && shareInfo.form.code == "") {
    ElMessage({
      message: "提取码未填写",
      type: "error",
    });
    return;
  }
  shareInfo.visible = false;
  proxy.Request.get("/share/create", {
    params: {
      currentPath: currentPath.value,
      fileName: shareInfo.form.fileName,
      validType: shareInfo.form.validType,
      howCode: shareInfo.form.howCode,
      code: shareInfo.form.code,
    },
  })
    .then((response) => {
      ElMessage({
        message: response.data.message,
        type: "success",
      });
      shareResult.form.fileName = shareInfo.form.fileName;
      shareResult.form.link = response.data.data.link;
      shareResult.form.code = response.data.data.code;
      shareResult.visible = true;
    })
    .catch(function (error) {
      ElMessage({
        message: error.response.data.message,
        type: "error",
      });
    });
}

import PathChooser from "../components/PathChooser.vue";

const moveFile = (fileName) => {
  const newPath = ref([]);
  console.log(newPath.value);
  ElMessageBox({
    showCancelButton: true,
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "移动到",
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(PathChooser, {
        modelValue: newPath.value,
      }),
  })
    .then(() => {
      let targetPath;
      if (newPath.value.length == 0) {
        targetPath = "/";
      } else {
        targetPath = "/" + newPath.value.join("/") + "/";
      }
      proxy.Request.get("/file/moveTo", {
        params: {
          currentPath: currentPath.value,
          fileName: fileName,
          targetPath: targetPath,
        },
      }).then((response) => {
        loadFiles();
      });
    })
    .catch(() => {
      console.log("用户取消输入");
    });
};

const renameFile = (fileName) => {
  ElMessageBox.prompt("请输入新的名称", "重命名", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: fileName,
    inputValidator: (value) => {
      if (value == null || value.length == 0) {
        return "名称不能为空";
      } else if (value.includes("/")) {
        return "名称不能包含’/‘'";
      }
      return true;
    },
  })
    .then(({ value }) => {
      proxy.Request.get("/file/rename", {
        params: {
          currentPath: currentPath.value,
          fileName: fileName,
          newName: value,
        },
      })
        .then((response) => {
          ElMessage({
            message: response.data.message,
            type: "success",
          });
          loadFiles();
        })
        .catch(function (error) {
          ElMessage({
            message: error.response.data.message,
            type: "error",
          });
        });
    })
    .catch(() => {
      console.log("用户取消输入");
    });
};

const deleteFile = (fileName) => {
  proxy.Request.get("/file/delete", {
    params: {
      currentPath: currentPath.value,
      fileName: fileName,
    },
  })
    .then((response) => {
      ElMessage({
        message: response.data.message,
        type: "success",
      });
      loadFiles();
    })
    .catch(function (error) {
      ElMessage({
        message: error.response.data.message,
        type: "error",
      });
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
