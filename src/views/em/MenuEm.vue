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
    :unique-opened="true"
  >
    <div style="height: 80px;"></div>
    <!--index 没有用但是必需字段-->
    <el-submenu style="text-align: left" index="1">
      <span slot="title" style="font-size: 17px;">
        <!-- <i class="item.iconCls"></i> -->
        <i class="iconfont icon-jiaoshiguanli"></i>
        教师管理
      </span>
      <el-menu-item index="/career">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-jiaoshirenzhiqingkuang"></i>
        教师任职表
      </el-menu-item>
      <el-menu-item index="/wechat">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-wechat"></i>
        教师微信表
      </el-menu-item>
    </el-submenu>
    <el-submenu style="text-align: left" index="2">
      <span slot="title" style="font-size: 17px;">
        <!-- <i class="item.iconCls"></i> -->
        <!-- <i class="iconfont icon-xueshengguanli"></i> -->
        <i class="iconfont icon-jiaowuguanli"></i>
        教务管理
      </span>
      <el-menu-item index="/course">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-kecheng-copy"></i>
        课程管理表
      </el-menu-item>
      <el-menu-item index="/lecturer">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-renkeguanli"></i>
        任课管理表
      </el-menu-item>
      <el-menu-item index="/selection">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-xuankeguanli"></i>
        选课管理表
      </el-menu-item>
      <el-menu-item index="/classroom">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-jiaoshiguanli1"></i>
        教室管理表
      </el-menu-item>
      <el-menu-item index="/classtime">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-zuoxishijian"></i>
        作息时间表
      </el-menu-item>
      <el-menu-item index="/schedule">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-paikeguanli"></i>
        排课管理表
      </el-menu-item>
      <el-menu-item index="/exam">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-chengjiguanli"></i>
        成绩管理表
      </el-menu-item>
      <el-menu-item index="/evaluate">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-kechengpingjia"></i>
        课程评价表
      </el-menu-item>
    </el-submenu>
    <el-submenu style="text-align: left" index="3">
      <span slot="title" style="font-size: 17px;">
        <i class="iconfont icon-jiaoxueguanli"></i>
        <!-- <i class="item.iconCls"></i> -->
        教学管理
      </span>
      <el-menu-item index="/preparation">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-beikeguanli"></i>
        备课管理表
      </el-menu-item>
      <el-menu-item index="/courseware">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-kejianguanli"></i>
        课件管理表
      </el-menu-item>
      <el-menu-item index="/sign">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-ketangdianming"></i>
        课堂点名表
      </el-menu-item>
      <el-menu-item index="/assignment">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-yewu"></i>
        作业管理表
      </el-menu-item>
      <el-menu-item index="/paper">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-shijuanguanli"></i>
        试卷管理表
      </el-menu-item>
      <el-menu-item index="/paperlist">
        <!-- <i class="child.icon"></i> -->
        <i class="iconfont icon-exercises"></i>
        试卷习题表
      </el-menu-item>
    </el-submenu>
    <el-submenu style="text-align: left">
      <span slot="title" style="font-size: 17px;">
        <!-- <i class="el-icon-setting"></i> -->
        <i class="iconfont icon-xueshengguanli1"></i>
        学生管理
      </span>
      <el-menu-item index="/student">
        <!-- <i class="el-icon-coordinate"></i> -->
        <i class="iconfont icon-xueshengguanli1"></i>
        学生管理
      </el-menu-item>
      <el-menu-item index="/enrollment">
        <!-- <i  class="el-icon-document-copy"></i> -->
        <i class="iconfont icon-xuejiguanli"></i>
        学籍管理
      </el-menu-item>
      <el-menu-item index="/class">
        <!-- <i class="el-icon-s-tools"></i> -->
        <i class="iconfont icon-banjiguanli"></i>
        班级管理
      </el-menu-item>
      <el-menu-item index="/classmate">
        <!-- <i class="el-icon-user-solid"></i> -->
        <i class="iconfont icon-xueshengguanli2"></i>
        同学管理
      </el-menu-item>
      <el-menu-item index="/wechats">
        <!-- <i class="el-icon-chat-dot-round"></i> -->
        <i class="iconfont icon-wechat-outline"></i>
        学生微信
      </el-menu-item>
      <el-menu-item index="/homework">
        <!-- <i class="el-icon-document-checked"></i> -->
        <i class="iconfont icon-zuoye"></i>
        作业接收
      </el-menu-item>
      <el-menu-item index="/parent">
        <!-- <i class="el-icon-coordinate"></i> -->
        <i class="iconfont icon-tianjiajiachang"></i>
        家长管理
      </el-menu-item>
      <el-menu-item index="/room">
        <i style="margin-left:-6px" class="el-icon-c-scale-to-original"></i>
        <!-- <i class="iconfont icon-_qinshiguanli"></i> -->
        寝室管理
      </el-menu-item>
      <el-menu-item index="/roommate">
        <!-- <i class="el-icon-office-building"></i> -->
        <i class="iconfont icon-zhusuguanli-hui"></i>
        住宿管理
      </el-menu-item>
      <el-menu-item index="/disciproom">
        <!-- <i class="el-icon-bank-card"></i> -->
        <i class="iconfont icon-jilv"></i>
        寝室纪律
      </el-menu-item>
      <el-menu-item index="/discipclass">
        <!-- <i class="el-icon-s-data"></i> -->
        <i class="iconfont icon-banji"></i>
        班级纪律
      </el-menu-item>
      <el-menu-item index="/leader">
        <!-- <i class="el-icon-postcard"></i> -->
        <i class="iconfont icon-nianqingganbu"></i>
        干部管理
      </el-menu-item>
      <el-menu-item index="/duty">
        <!-- <i class="el-icon-tickets"></i> -->
        <i class="iconfont icon-29zhiri"></i>
        值日管理
      </el-menu-item>
      <el-menu-item index="/honor">
        <!-- <i class="el-icon-trophy-1"></i> -->
        <i class="iconfont icon-banjirongyu"></i>
        班级荣誉
      </el-menu-item>
      <el-menu-item index="/award">
        <!-- <i class="el-icon-trophy"></i> -->
        <i class="iconfont icon-gerenrongyuchenghaoshenqingchaxun"></i>
        个人荣誉
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "AdminMenu",
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    adminMenus() {
      return this.$store.state.adminMenus;
    },
    currentPath() {
      return this.$route.path;
    }
  }
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
