<script setup>
import { ref,reactive, getCurrentInstance, nextTick } from 'vue'

import { ElMessage } from 'element-plus'

const panelType = ref(1)
const dialogVisible = ref(false)
const CAPTCHA = ref('')
const form = reactive({

})

import config from '../utils/config.js'

const baseUrl = config.baseUrl
const api = {
  captcha: "/captcha"
}

const captchaUrlEmail = ref(baseUrl + api.captcha + "?type=email&time=" + new Date().getTime())
const captchaUrl = ref(baseUrl + api.captcha + "?time=" + new Date().getTime())


const {proxy} = getCurrentInstance()

const validatorEmail = (rule, value, callback) => {
    var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!pattern.test(value)) return callback(new Error("邮箱格式不正确"));
    callback();
};

const validatorEmailCode = (rule, value, callback) => {
    var pattern = /^[0-9]{6}$/;
    if (!pattern.test(value)) return callback(new Error("邮箱验证码格式不正确，正确格式为6位数字"));
    callback();
};

const password = (rule, value, callback) => {
    var pattern = /^[0-9a-z]{8,12}$/;
    if (!pattern.test(value)) return callback(new Error("密码格式不正确，正确格式为8-12位密码或数字"));
    callback();
};

const rePassword = (rule, value, callback) => {
  console.log(form.password)
  if (form.password!==value) return callback(new Error("两次输入的密码不一致"));
  callback();
};

const captcha = (rule, value, callback) => {
    var pattern = /^[0-9a-z]{5}$/;
    if (!pattern.test(value)) return callback(new Error("图片验证码格式不正确，正确格式为5位密码或数字"));
    callback();
};


const formRules = {
  email: [
    { required: true, message:"请输入邮箱"},
    { validator: validatorEmail , trigger: 'blur'}
  ],
  emailCode: [
    { required: true, message:"请输入邮箱验证码"},
    { validator: validatorEmailCode , trigger: 'blur'}
  ],
  nickname: [
    { required: true, message: "请输入昵称"}
  ],
  password: [
    { required: true, message:"请输入密码"},
    { validator: password, trigger: 'blur'}
  ],
  rePassword: [
    { required: true, message:"请再次输入密码"},
    { validator: rePassword, trigger: 'blur'}
  ],
  captcha: [
    { required: true, message:"请输入图片验证码"},
    { validator: captcha, trigger: 'blur'}
  ]

}

const loginFormRef = ref(null)


const resetPassword = () => {
  loginFormRef.value.validate((valid)=>{
    if(valid){
      proxy.Request.post("/user/resetPassword",{
        email: form.email,
        emailCode: form.emailCode,
        password: form.password,
        captcha: form.captcha
      },{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response)=>{
          ElMessage({
              message: response.data.message,
              type: 'success',
          })
      }).catch(function (error) {
          ElMessage({
              message: error.response.data.message,
              type: 'error',
          })
          updateCaptcha()
      })
    }
  })
}

const login = () => {
  loginFormRef.value.validate((valid)=>{
    if(valid){
      proxy.Request.post("/user/login",{
        email: form.email,
        password: form.password,
        captcha: form.captcha
      },{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response)=>{
          ElMessage({
              message: response.data.message,
              type: 'success',
          })
      }).catch(function (error) {
          ElMessage({
              message: error.response.data.message,
              type: 'error',
          })
          updateCaptcha()
      })
    }
  })
}

const register = () => {
  loginFormRef.value.validate((valid)=>{
    if(valid){
      proxy.Request.post("/user/register",{
              email: form.email,
              emailCode: form.emailCode,
              nickname: form.nickname,
              password: form.password,
              captcha: form.captcha,
      },{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response)=>{
          ElMessage({
              message: response.data.message,
              type: 'success',
          })
          panelType.value=1
      }).catch(function (error) {
          ElMessage({
              message: error.response.data.message,
              type: 'error',
          })
          updateCaptcha()
      })
      console.log(form)
    }
  })
}

const emailSenderApi = ref('')

const openEmailSender = (api)=>{
  console.log("clickerd")
  loginFormRef.value.validateField("email", (valid)=>{
    if(valid){
      console.log("valid")
      emailSenderApi.value = api
      dialogVisible.value = true
    }
  })
}

const closeEmailSender = () => {
  dialogVisible.value = false
}

const updateCaptcha = (type) => {
  console.log("更新验证码")
  if(type == "email"){
    captchaUrlEmail.value = baseUrl + api.captcha + "?type=email&time=" + new Date().getTime()
  }else{
    captchaUrl.value = baseUrl + api.captcha + "?time=" + new Date().getTime()
  }
}

const clear = () => {
  updateCaptcha()
  Object.assign(form, {})
  loginFormRef.value.resetFields()
}

const switchPanel = (type) => {
  clear()
  panelType.value = type
}


</script>

<template>
  <email-sender :dialogVisible="dialogVisible" :email="form.email" :api="emailSenderApi" @close="closeEmailSender"></email-sender>

  <div class="login-bg">
    <div class="login-img">
      <img class="login-img-itself" src="../assets/undraw_file_sync.svg">
    </div>
    <div class="login-panel">
      <el-form :model="form" :rules="formRules" ref="loginFormRef" class="login-form" v-if="panelType==0">
        <div class="login-title">Easy云盘</div>
        <el-form-item prop="email">
          <el-input size="large" placeholder="请输入邮箱" v-model="form.email">
            <template #prefix>
              <el-icon :size="18">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="emailCode">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入邮箱验证码" v-model="form.emailCode">
              <template #prefix>
                <el-icon :size="18">
                  <Message />
                </el-icon>
              </template>
            </el-input>
            <div class="getEmailCode">
              <el-button type="primary" size="large" @click="openEmailSender('/sendEmailCodeForResetPassword')">获取验证码</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="large" placeholder="请输入密码" type="password" v-model="form.password">
              <template #prefix>
                <el-icon :size="18">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
            <el-input size="large" placeholder="请再次输入密码" type="password" v-model="form.rePassword">
              <template #prefix>
                <el-icon :size="18">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入验证码" v-model="form.captcha">
              <template #prefix>
                <el-icon :size="18">
                  <Picture />
                </el-icon>
              </template>
            </el-input>
            <img class="checkCode" :src="captchaUrl" @click="updateCaptcha()">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="cantlogin">
            <a class="a-link" @click="switchPanel(1)">去登录？</a>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="resetPassword()">重置密码</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="form" :rules="formRules" ref="loginFormRef" class="login-form" v-if="panelType==1">
        <div class="login-title">Easy云盘</div>
        <el-form-item prop="email">
          <el-input size="large" placeholder="请输入邮箱" v-model="form.email">
            <template #prefix>
              <el-icon :size="18">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" placeholder="请输入密码" v-model="form.password" show-password>
            <template #prefix>
              <el-icon :size="18">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入验证码" v-model="form.captcha">
              <template #prefix>
                <el-icon :size="18">
                  <Picture />
                </el-icon>
              </template>
            </el-input>
            <img class="checkCode" :src="captchaUrl" @click="updateCaptcha">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="rememberMe">
            <el-checkbox>记住我</el-checkbox>
          </div>
          <div class="cantlogin">
            <a class="a-link" @click="switchPanel(0)">忘记密码？</a>
            <a class="a-link" @click="switchPanel(2)">没有账号？</a>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login()">登录</el-button>
        </el-form-item>


      </el-form>
      <el-form :model="form" :rules="formRules" ref="loginFormRef" class="login-form" v-if="panelType==2">
        <div class="login-title">Easy云盘</div>
        <el-form-item prop="email">
          <el-input size="large" placeholder="请输入邮箱" v-model="form.email">
            <template #prefix>
              <el-icon :size="18">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="emailCode">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入邮箱验证码" v-model="form.emailCode">
              <template #prefix>
                <el-icon :size="18">
                  <Message />
                </el-icon>
              </template>
            </el-input>
            <div class="getEmailCode">
              <el-button type="primary" size="large" @click="openEmailSender('/sendEmailCodeForRegister')">获取验证码</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="nickname">
            <el-input size="large" placeholder="请输入昵称" v-model="form.nickname">
              <template #prefix>
                <el-icon :size="18">
                  <User />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="large" placeholder="请输入密码" type="password" v-model="form.password">
              <template #prefix>
                <el-icon :size="18">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
            <el-input size="large" placeholder="请再次输入密码" type="password" v-model="form.rePassword">
              <template #prefix>
                <el-icon :size="18">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入验证码" v-model="form.captcha">
              <template #prefix>
                <el-icon :size="18">
                  <Picture />
                </el-icon>
              </template>
            </el-input>
            <img class="checkCode" :src="captchaUrl" @click="updateCaptcha()">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="cantlogin">
            <a class="a-link" @click="switchPanel(1)">去登录？</a>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.checkCodeWrapper{
  display: flex;
  width: 100%;
  .checkCode{
    height: 40px;
    margin-left: 5px;
  }

  .getEmailCode{
    margin-left: 10px;
  }
}
.login-bg{
  height: calc(100vh);
  background-size: cover;
  background-image: url("../assets/login_bg.png");
  /* display: flex; */
  display: flex;
  .login-img{
    width: calc(66%);
    height: calc(100vh);
    display: flex;
    justify-content: center;
    align-content: center;
    .login-img-itself{
      width:600px
    }
  }

  .login-panel{
    margin-top: calc((100vh - 500px)/2);
    margin-right: 15%;
    width: 400px;

    .login-form{
      padding: 25px;
      border-radius: 5px;
      background-color: white;
      width: 400px;
      .login-title{
        text-align: center;
        font-weight: bold;
        color: #666;
        margin-bottom: 10px;
      }



      .rememberMe{
        width: 100%;
      }

      .cantlogin{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .login-btn{
        width: 100%;
      }
    }
  }

}

</style>
