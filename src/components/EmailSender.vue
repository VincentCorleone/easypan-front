<template>
    <el-dialog :model-value="dialogVisible" title="获取邮箱验证码" @close="close">
        <div>
            <span>邮箱</span> <span>{{ email }}</span>
        </div>
        <div class="checkCodeWrapper">
            <el-form :model="form" :rules="formRules" ref="formRef">
                <el-form-item prop="captcha">
                    <el-input size="large" placeholder="请输入验证码" v-model="form.captcha">
                        <template #prefix>
                            <el-icon :size="18">
                                <Picture />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <img class="checkCode" :src="captchaUrlEmail" @click="updateCaptcha('email')">
        </div>
        <template #footer>
            <el-button type="primary" @click="getEmailCode(formRef)">发送验证码</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref,reactive, getCurrentInstance} from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();


import config from '../utils/config.js'

const baseUrl = config.baseUrl
const api = {
  captcha: "/captcha"
}

const validatorCaptcha = (rule, value, callback) => {
    if (!/^[A-Za-z0-9]{5}$/.test(value)) return callback(new Error("验证码格式不正确"));
    callback();
};

const formRules = {
    captcha: [
        { required: true, message: "验证码不能为空" },
        { validator: validatorCaptcha }
    ]
}



const props = defineProps(['dialogVisible','email','api'])
const emit = defineEmits(['close'])

const form = reactive({})

const captchaUrlEmail = ref(baseUrl + api.captcha + "?type=email&time=" + new Date().getTime())

const formRef = ref(null)

const close = () => {
    emit('close')
}


const getEmailCode = (formEl)=>{
    formEl.validate((valid)=>{

        console.log(valid)
        if(valid){
            console.log(props)
            proxy.Request.get(props.api,{
                params: {
                    email: props.email,
                    captcha: form.captcha
                }
            }).then((response)=>{
                ElMessage({
                    message: response.data.message,
                    type: 'success',
                })
                close();
            }).catch(function (error) {
                console.log(error)
                ElMessage({
                    message: error.response.data.message,
                    type: 'error',
                })
                updateCaptcha('email')
            })

        }
        
    })
    
}

const updateCaptcha = (type)=>{
    console.log("更新验证码")
    if(type == "email"){
        captchaUrlEmail.value = baseUrl + api.captcha + "?type=email&time=" + new Date().getTime()
    }else{
        captchaUrl.value = baseUrl + api.captcha + "?time=" + new Date().getTime()
    }
}

import { onUpdated } from 'vue'

onUpdated(() => {
    updateCaptcha('email')
})

</script>

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
</style>