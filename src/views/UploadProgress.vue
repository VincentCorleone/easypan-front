<!-- 页面右上角上传进度弹出页 -->
<template>
  <div v-for="file in files" :key="file.fileId">
    <span>{{ file.fileName }}</span>

    <div>
      <el-progress
        v-if="file.md5Progress == 100"
        type="circle"
        :percentage="file.md5Progress"
        status="success"
      />
      <el-progress v-else type="circle" :percentage="file.md5Progress" />
    </div>

    <div>
      <el-progress
        v-if="file.uploadProgress == 100"
        :percentage="file.uploadProgress"
        :stroke-width="15"
        status="success"
        striped
      />
      <el-progress
        v-else
        :percentage="file.uploadProgress"
        :stroke-width="15"
        striped
        striped-flow
      />
    </div>
  </div>
  <!-- <span @click="test">{{ filesB }}</span> -->
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
const files = reactive({});

// let percentage = 0;

// onMounted(() => {
//   const interval = setInterval(() => {
//     console.log(files);
//     if (percentage < 100) {
//       // filesB.value["ddddd"] = {
//       //   uploadProgress: percentage,
//       // };
//       percentage += 3;
//     } else {
//       clearInterval(interval);
//     }
//   }, 500);
// });

// const filesB = reactive({});

// const testvar = { uploadProgress: 3 };

// function test() {
//   if (filesB["ssddd"] == undefined) {
//     filesB["ssddd"] = testvar;
//   } else {
//     // debugger;
//     //todo 发一篇博文

//     //a 视图不可递增
//     // testvar.uploadProgress += 4;
//     // filesB["ssddd"].uploadProgress = testvar.uploadProgress;

//     //b 视图可递增
//     // var dd = testvar.uploadProgress + 4;
//     // filesB["ssddd"].uploadProgress = dd;

//     //c 视图可递增
//     // filesB["ssddd"].uploadProgress += 4;
//   }

// }

function updateUploadProgress(file) {
  // filesB[file.fileId] = file;
  // console.log(file);
  // if (file.uploadProgress > 10) {
  //   // debugger;
  // }
  // debugger;
  // console.log("before:", files.value);
  console.log(file);
  if (files[file.fileId] == undefined) {
    files[file.fileId] = file;
  } else {
    if (file.event == "updateUpload") {
      files[file.fileId].uploadProgress = file.uploadProgress;
    } else if (file.event == "updateMd5") {
      files[file.fileId].md5Progress = file.md5Progress;
    }
  }
  // console.log("after:", files.value);
}

defineExpose({ updateUploadProgress });
</script>
