<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

const currentMenuIndex = ref(0);

const showUploadProgress = ref(false);

const menus = [
  {
    path: "/dashboard/files",
  },
  {
    path: "/dashboard/share",
  },
  {
    path: "/dashboard/del",
  },
];

const selectMenu = (index) => {
  console.log("selected");
  currentMenuIndex.value = index;
  router.push(menus[index - 1].path);
};

import { ElMessage } from "element-plus";

const logout = () => {
  proxy.Request.get("/user/logout")
    .then((response) => {
      ElMessage({
        message: response.data.message,
        type: "success",
      });
      router.push("/");
    })
    .catch(function (error) {
      ElMessage({
        message: error.response.data.message,
        type: "error",
      });
    });
};

const username = ref("");

function userInfo() {
  proxy.Request.get("/user/info")
    .then((response) => {
      username.value = response.data.data.nickname;
    })
    .catch(function (error) {
      ElMessage({
        message: error.response.data.message,
        type: "error",
      });
    });
}

onMounted(() => {
  userInfo();
});

const uploadProgressRef = ref(null);

const updateUploadProgress = (file) => {
  showUploadProgress.value = true;
  uploadProgressRef.value?.updateUploadProgress(file);
};

const dialogVisible = ref(false);
const form = reactive({
  password: "",
  rePassword: "",
});

const ruleFormRef = ref();

const password = (rule, value, callback) => {
  var pattern = /^[0-9a-z]{8,12}$/;
  if (!pattern.test(value))
    return callback(new Error("密码格式不正确，正确格式为8-12位密码或数字"));
  callback();
};

const rePassword = (rule, value, callback) => {
  if (form.password !== value)
    return callback(new Error("两次输入的密码不一致"));
  callback();
};

const formRules = {
  password: [
    { required: true, message: "请输入密码" },
    { validator: password, trigger: "blur" },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    { validator: rePassword, trigger: "blur" },
  ],
};

function updatePwd() {
  dialogVisible.value = true;
}

function submit() {
  // dialogVisible.value = false;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      proxy.Request.get("/user/updatePwd", {
        params: {
          password: form.password,
        },
      })
        .then((response) => {
          ElMessage({
            message: response.data.message,
            type: "success",
          });
        })
        .catch(function (error) {
          ElMessage({
            message: error.response.data.message,
            type: "error",
          });
        });
      form.password = "";
      dialogVisible.value = false;
    }
  });
  // console.log(form.password);ss
}
</script>

<style scoped>
.logo {
  display: flex;
}
#logo {
  margin-left: 20px;
  font-size: 40px;
}
#logo-text {
  font-size: 25px;
  font-weight: 700;
  margin-left: 10px;
}
.transfer-progress {
  font-size: 20px;
}
.header {
  color: #05a1f5;
  display: flex;
  justify-content: space-between;
  height: 56px;
  line-height: 56px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.62);
}
.right-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
}

.right-panel .el-dropdown span {
  color: #05a1f5;
}
.el-tooltip__trigger {
  padding-right: 16px;
}

.body {
  display: flex;
  height: 100vh;
}
.left-sider {
  height: 100vh;
  width: 72px;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.62);
}

.content {
  height: 100vh;
  width: 100%;
}

.menu-item.active {
  color: #05a1f5;
}

.menu-item {
  padding: 20px 0;
  text-align: center;
  cursor: pointer;
}
.menu-item .iconfont {
  font-size: 28px;
}
</style>

<template>
  <div class="header">
    <div class="logo">
      <span id="logo" class="iconfont icon-pan"></span>
      <div id="logo-text">Easy云盘</div>
    </div>
    <div class="right-panel">
      <el-popover trigger="click" v-model:visible="showUploadProgress">
        <template #reference>
          <div>
            <span class="transfer-progress iconfont icon-transfer"></span>
          </div>
        </template>
        <upload-progress ref="uploadProgressRef"></upload-progress>
      </el-popover>
      <el-dropdown>
        <div class="user-info">
          <span>{{ username }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="updatePwd()">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div class="body">
    <div class="left-sider">
      <div class="menu-list">
        <div
          :class="['menu-item', currentMenuIndex == 1 ? 'active' : '']"
          @click="selectMenu(1)"
        >
          <div class="iconfont icon-cloude"></div>
          <div>首页</div>
        </div>
        <div
          :class="['menu-item', currentMenuIndex == 2 ? 'active' : '']"
          @click="selectMenu(2)"
        >
          <div class="iconfont icon-share"></div>
          <div>分享</div>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          @updateUploadProgress="updateUploadProgress"
        />
      </router-view>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :rules="formRules"
    title="修改密码"
    width="500"
  >
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="formRules"
      label-width="auto"
    >
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="rePassword">
        <el-input v-model="form.rePassword" autocomplete="off" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
