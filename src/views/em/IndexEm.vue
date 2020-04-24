<template>
  <el-container id="admin-body">
    <el-header style="z-index: 1;height: 80px;margin-left: -20px">
      <header-em style="position: absolute;width: 98%;"></header-em>
    </el-header>
    <!--<el-row style="height: 100%;">-->
    <el-container>
      <el-aside style="height: 112%;margin-top: -80px;width: 250px">
        <menu-em></menu-em>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import MenuEm from './MenuEm'
  import HeaderEm from './HeaderEm'

  export default {
    name: 'IndexEm',
    components: {MenuEm, HeaderEm},
    data () {
      return {
        dialogVisible: false
      }
    },
    mounted () {
      // this.$router.replace('/admin/dashboard')
    }
  }
</script>

<style scoped>
  #admin-body {
  height: 95vh;
}
</style>
