<template>
  <el-container id="admin-body">
    <el-header style="z-index: 1;height: 80px;margin-left: -20px">
      <header-er style="position: absolute;width: 98%;"></header-er>
    </el-header>
    <!--<el-row style="height: 100%;">-->
    <el-container>
      <el-aside style="height: 112%;margin-top: -80px;width: 250px">
        <menu-er></menu-er>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import MenuEr from './MenuEr'
  import HeaderEr from './HeaderEr'

  export default {
    name: 'IndexEr',
    components: {MenuEr, HeaderEr},
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
