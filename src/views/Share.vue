<template>
  <el-table row-key="linkSuffix" :data="shares" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" min-width="500">
      <template #default="scope">
        <div class="fileName">
          <span>{{ scope.row.fileName }}</span>
          <span class="op">
            <span
              class="iconfont icon-link clickable"
              @click.stop="copyLink(scope.row.linkSuffix)"
              >复制链接</span
            >
            <span
              class="iconfont icon-cancel clickable"
              @click.stop="cancelShare(scope.row.linkSuffix)"
              >取消分享</span
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
    <el-table-column prop="shareTime" label="分享时间" width="380" />
    <el-table-column prop="expireTime" label="失效时间" width="380" />
  </el-table>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";

import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();

const shares = ref([
  {
    fileName: "测试文件1",
    linkSuffix: "HciTXEkToyxmiKbWWnfX",
    shareTime: "2024-04-05 13:47:53",
    expireTime: "2024-05-05 13:47:53",
  },
]);

function copyLink(linkSuffix) {
  var currentUrl = window.location.href;
  var cursor = currentUrl.indexOf("//") + 2;
  while (currentUrl[cursor] != "/") {
    cursor++;
  }
  const link = currentUrl.substring(0, cursor) + "/share/" + linkSuffix;

  navigator.clipboard
    .writeText(link)
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

function cancelShare(linkSuffix) {
  proxy.Request.delete("/share/cancel", {
    params: {
      linkSuffix: linkSuffix,
    },
  }).then((response) => {
    ElMessage({
      message: response.data.message,
      type: "success",
    });
    proxy.Request.get("/share/list").then((response) => {
      shares.value = response.data.data;
    });
  });
}

function loadShares() {
  proxy.Request.get("/share/list").then((response) => {
    shares.value = response.data.data;
  });
}

onMounted(() => {
  loadShares();
});
</script>

<style>
.op {
  display: none;
}

.fileName:hover .op {
  display: block;
}

.fileName {
  display: flex;
  justify-content: space-between;
}

.clickable {
  color: cadetblue;
  cursor: pointer;
}
</style>
