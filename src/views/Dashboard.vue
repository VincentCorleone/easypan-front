<script setup>

import {ref,getCurrentInstance} from 'vue'
import { useRouter,useRoute } from 'vue-router';

const {proxy} = getCurrentInstance()
const router = useRouter()

const currentMenuIndex=ref(0)

const menus = [
    {
        path: "/dashboard/files"
    },
    {
        path: "/dashboard/share"
    },
    {
        path: "/dashboard/del"
    }
]

const selectMenu = (index) => {
    console.log("selected")
    currentMenuIndex.value = index
    router.push(menus[index-1].path)
}

import { ElMessage } from 'element-plus'

const logout = () => {
    proxy.Request.get("/user/logout").then((response)=>{
          ElMessage({
              message: response.data.message,
              type: 'success',
          })
          router.push("/")
      }).catch(function (error) {
          ElMessage({
              message: error.response.data.message,
              type: 'error',
          })
      })
}
</script>

<style scoped>
.logo{
    display: flex;
}
#logo{
    margin-left: 20px;
    font-size: 40px;
}
#logo-text{
    font-size: 25px;
    font-weight: 700;
    margin-left: 10px;
}
.transfer-progress{
    font-size: 20px;
}
.header{
    color: #05a1f5;
    display: flex;
    justify-content: space-between;
    height: 56px;
    line-height: 56px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.62);
}
.right-panel{
    display: flex;
}

.body{
    display: flex;
    height: 100vh;
}
.left-sider{
    
    height: 100vh;
    width: 72px;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.62);
}

.content{
    height: 100vh;
}

.menu-item.active{
    color: #05a1f5;
}

.menu-item{
    padding: 20px 0;
    text-align: center;
    cursor: pointer;
}
.menu-item .iconfont{
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
            <el-popover>
                <template #reference>
                    <div><span class="transfer-progress iconfont icon-transfer"></span></div>
                </template>
                内容
            </el-popover>
            <el-dropdown>
                <div class="user-info">
                    <div class="avatar">头像</div>
                    <span>张三</span>
                </div>
                
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>修改头像</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item @click="logout()">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <div class="body">
        <div class="left-sider">
            <div class="menu-list">
                <div :class="['menu-item', currentMenuIndex==1?'active':'']" @click="selectMenu(1)">
                    <div class="iconfont icon-cloude"></div>
                    <div>首页</div>
                </div>
                <div :class="['menu-item', currentMenuIndex==2?'active':'']" @click="selectMenu(2)">
                    <div class="iconfont icon-share"></div>
                    <div>分享</div>
                </div>
                <div :class="['menu-item', currentMenuIndex==3?'active':'']" @click="selectMenu(3)">
                    <div class="iconfont icon-del"></div>
                    <div>回收站</div>
                </div>
            </div>
        </div>
        <div class="content">
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>
    </div>
</template>