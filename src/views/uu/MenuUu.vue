<template>
  <el-menu
    :default-active="currentPath"
    class="el-menu-admin"
    router
    mode="vertical"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :unique-opened="true"
    :collapse="isCollapse"
  >
    <div style="height: 80px;"></div>
      <el-submenu index="1" style="text-align: left">
          <template slot="title">
            <i class="iconfont icon-icon-test"></i>
            <span style="font-size: 17px;">组织机构</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/unit"><i class="iconfont icon-danweiguanli"></i>单位管理</el-menu-item>
            <el-menu-item index="/dept"><i class="iconfont icon-bumenguanli"></i>部门管理</el-menu-item>
            <el-menu-item index="/member"><i class="iconfont icon-yuangongguanli
"></i>员工管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2" style="text-align: left">
          <template slot="title">
            <i class="iconfont icon-ic_opt_feature"></i>
            <span style="font-size: 17px;"><i class="iconfont icon-quanxianguanli-
"></i>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/func"><i class="iconfont icon-gongnengguanli
"></i>功能管理</el-menu-item>
            <el-menu-item index="/user"><i class="iconfont icon-yonghuxinxi"></i>用户信息</el-menu-item>
            <el-menu-item index="/role"><i class="iconfont icon-icon_xinyong_xianxing_jijin-
"></i>角色信息</el-menu-item>
            <el-menu-item index="/roleuser"><i class="iconfont icon-icon-test"></i>用户角色</el-menu-item>
            <el-menu-item index="/permuser"><i class="iconfont icon-yonghuquanxian
"></i>用户权限</el-menu-item>
            <el-menu-item index="/permrole"><i class="iconfont icon-yonghuquanxian1
"></i>角色权限</el-menu-item>
            <el-menu-item index="/log"><i class="iconfont icon-rizhiguanli1"></i>日志管理</el-menu-item>
            <el-menu-item index="/logbook"><i class="iconfont icon-rizhiguanli"></i>日志明细</el-menu-item>
          </el-menu-item-group>
          
        </el-submenu>
    <!--index 没有用但是必需字段-->
  </el-menu>
</template>

<script>
export default {
  name: "MenuUu",
  data() {
    return {
      isCollapse: false
    };
  },
  
};
</script>

<style scoped>
.el-menu-admin {
  border-radius: 5px;
  height: 100%;
}
.iconfont{
  margin-right: 5px;
  font-size: 18px;
}
</style>
