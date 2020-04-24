<template>
  <el-card class="el-card-header">
    <a href="/index">
      <img src="../../assets/img/icon/icon2.png" alt="" width="30px" style="float: left;margin-top: 4px;">
    </a>
    <span style="font-size: 24px;font-weight: bold;position: absolute;left: 4px;">教育资源公共服务平台</span>
    <i class="el-icon-switch-button" v-on:click="logout" style="font-size: 40px;float: right"></i>
  </el-card>
</template>

<script>
  import {createRouter} from '../../router'

  export default {
    name: 'HeaderEr',
    methods: {
      logout () {
        var _this = this
        this.$axios.get('/logout').then(res => {
          if (res.data.code === 200) {
            _this.$store.commit('logout')
            _this.$router.replace('/index')
            // 清空路由，防止路由重复加载
            const newRouter = createRouter()
            _this.$router.matcher = newRouter.matcher
          }
        }).catch(failResponse => {})
      }
    }
  }
</script>

<style scoped>
  .el-card-header {
    height: 80px;
    opacity: 0.85;
    line-height: 40px;
    min-width: 900px;
  }
  .el-icon-switch-button {
    cursor: pointer;
    outline:0;
  }
</style>
