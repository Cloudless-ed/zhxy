<template>
  <el-menu 
    :default-active="currentPath" 
    class="el-menu-admin" 
    router
    mode="vertical"
    background-color="#545c64" 
    text-color="#fff" 
    active-text-color="#ffd04b" 
    :collapse="isCollapse"
    :unique-opened="true">
    <div style="height: 80px;"></div>
      <!--index 没有用但是必需字段-->
      <!-- <el-submenu  v-for="(item,i) in menuEr" :key="i" :index="(i).toString()" style="text-align: left">
        <span slot="title" style="font-size: 17px;">
          <i :class="item.iconCls"></i>
          {{item.nameZh}}
        </span>
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
          <i :class="child.icon"></i>
          {{ child.nameZh }}
        </el-menu-item>
      </el-submenu> -->
      <el-submenu style="text-align: left">
        <span slot="title" style="font-size: 17px;" index="1">
          <!-- <i :class="item.iconCls"></i> -->
          <span class="iconfont icon-ziyuanguanli"></span>
          资源管理
        </span>
        <el-menu-item index="/exercise">
          <!-- <i :class="child.icon"></i> -->
          <span class="iconfont icon-xiti"></span>
          习题资源表
        </el-menu-item>
        <el-menu-item index="/question">
        <span class="iconfont icon-wenti"></span>
          习题问题表
        </el-menu-item>
        <el-menu-item index="/answer">
        <span class="iconfont icon-biaozhundaan"></span>
          习题答案表
        </el-menu-item>
        <el-menu-item index="/material">
        <span class="iconfont icon-sucai"></span>
          素材资源表
        </el-menu-item>
        <el-menu-item index="/video">
        <span class="iconfont icon-shipin"></span>
          视频资源表
        </el-menu-item>
        <el-menu-item index="/cartoon">
        <span class="iconfont icon-donghua"></span>
          动画资源表
        </el-menu-item>
        <el-menu-item index="/microlesson">
        <span class="iconfont icon-weike"></span>
          微课资源表
        </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
    export default {
      name: 'MenuEr',
      data () {
        return {
          isCollapse: false
        }
      },
      computed: {
        menuEr () {
          return this.$store.state.menuEr
        },
        currentPath () {
          return this.$route.path
        }
      }
    }
</script>

<style scoped>
  .el-menu-admin {
    border-radius: 5px;
    height: 100%;
  }
</style>
