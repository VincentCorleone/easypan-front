<template>
    <el-upload
    :http-request="upload">
        <el-button type="primary">
            <span class="iconfont icon-upload"></span>
            Primary
        </el-button>
    </el-upload>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const upload = (file)=>{
    console.log(file.file)
    proxy.Request.post("/file/upload",{
        file: file.file
    },{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
</script>
