<script setup>
import { ref,reactive } from 'vue'
const input = ref('')
const form = reactive({
  input: ''
})

const onSubmit = () => {
  console.log(form)
}
</script>

<template>
  <div class="login-bg">
    <div class="login-img">
      <img class="login-img-itself" src="../assets/undraw_file_sync.svg">
    </div>
    <div class="login-panel">
      <el-form :model="form" class="login-form">
        <div class="login-title">Easy云盘</div>
        <el-form-item prop="email">
          <el-input size="large" placeholder="请输入邮箱" v-model="form.input">
            <template #prefix>
              <el-icon :size="18">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input size="large" placeholder="请输入密码" v-model="form.input" show-password>
            <template #prefix>
              <el-icon :size="18">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <div class="checkCodeWrapper">
            <el-input size="large" placeholder="请输入验证码" v-model="form.input">
              <template #prefix>
                <el-icon :size="18">
                  <Picture />
                </el-icon>
              </template>
            </el-input>
            <img class="checkCode" src="http://www.baidu.com/img/flexible/logo/pc/result@2.png">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="rememberMe">
            <el-checkbox>记住我</el-checkbox>
          </div>
          <div class="cantlogin">
            <a href="javascript:void(O)" class="a-link">忘记密码？</a>
            <a href="javascript:void(O)" class="a-link">没有账号？</a>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>


      </el-form>

    </div>
  </div>
</template>

<style scoped>
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

      .checkCodeWrapper{
        display: flex;
        width: 100%;
        .checkCode{
          margin-left: 5px;
          height: 20px;
        }
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
