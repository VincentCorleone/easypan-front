<template>
  <!-- {{ $route.params.suffix }} -->

  <div class="share">
    <div class="body-content">
      <div class="logo">
        <span id="icon" class="iconfont icon-pan"></span>
        <span class="name">Easy云盘</span>
      </div>
      <div class="code-panel">
        <div class="file-info">
          <div class="avatar">
            <span style="height: 50px; width: 50px">
              <img src="../assets/icon-image/others.png" />
            </span>
          </div>
          <div class="share-info">
            <div class="user-info">
              <span>
                {{ shareInfo.nickName }}
              </span>
              <span> 分享于 </span>
              <span>
                {{ shareInfo.shareTime }}
              </span>
            </div>
            <div>
              <span>分享文件： {{ shareInfo.fileName }}</span>
            </div>
          </div>
        </div>
        <div class="code-body">
          <div id="extract-code">
            <el-button type="success" @click="download">提取文件</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#input-hint {
  margin-bottom: 10px;
}

#icon {
  font-size: 50px;
  font-weight: bold;
  color: #409eff;
}
.name {
  color: #409eff;
  margin-left: 10px;
}
#extract-code {
  display: flex;
  .el-button {
    width: 100%;
  }
}

.avatar {
  display: flex;
}

.share {
  background: url(../assets/share_bg.png);
  height: 100vh;
  background-repeat: repeat-x;
  background-position: 0 bottom;
  background-color: #eef2f6;
  display: flex;
  justify-content: center;
  .body-content {
    width: 500px;
    margin-top: 20vh;
    .logo {
      font-weight: bold;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .code-panel {
      overflow: hidden;
      border-radius: 5px;
      margin-top: 20px;
      box-shadow: 0 0 7px 1px #5757574f;
      .file-info {
        padding: 10px 20px;
        background: #409eff;
        display: flex;
        color: #fff;
        font-size: 14px;
        .avatar {
          border-radius: 50%;
          img {
            width: 100%;
            object-fit: cover;
          }
        }
      }
      .code-body {
        padding: 30px 20px;
        .el-input {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

<script setup>
import { reactive, onMounted, getCurrentInstance } from "vue";

import { useRoute } from "vue-router";

const route = useRoute();
const { proxy } = getCurrentInstance();

const shareInfo = reactive({
  nickName: "Vincent",
  shareTime: "2020-06-07",
  fileName: "测试文件",
});

onMounted(() => {
  console.log(route.params.suffix);
  proxy.Request.get("/share/info", {
    params: {
      linkSuffix: route.params.suffix,
    },
  })
    .then((response) => {
      shareInfo.nickName = response.data.data.nickName;
      shareInfo.shareTime = response.data.data.datetime;
      shareInfo.fileName = response.data.data.fileName;
    })
    .catch((error) => {
      ElMessage({
        message: error.response.data.message,
        type: "error",
      });
    });
});

import config from "../utils/config.js";

function download() {
  window.open(config.baseUrl + "/share/download?suffix=" + route.params.suffix);
}
</script>
