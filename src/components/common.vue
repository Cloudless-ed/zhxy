<template>
  <div id="common">
    <div class="top">
      <div class="top-l" @click="gohome()">管理系统</div>
      <div class="top-r">
        <div>
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </div>
        <div>
          <el-row class="block-col-2">
            <el-col :span="12">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link" id="homename">{{username}}</span>
                <span class="el-icon-arrow-down el-icon--right"></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>我的信息</el-dropdown-item>
                  <el-dropdown-item>修改信息</el-dropdown-item>
                  <el-dropdown-item>添加账户</el-dropdown-item>
                  <el-dropdown-item  >
                    <div @click="backlogin()">退出登录</div>
                    </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="back">退出</div> -->
      </div>
    </div>
    <div class="content">
      <div class="content-l">
        <!-- <ul>
          <li>
            <p>主页</p>
          </li>
          <li>公司财务报告</li>
          <li>人员分布</li>
          <li>人员管理</li>
          <li>账号管理</li>
        </ul>-->
        <el-col :span="12">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
          router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="iconfont icon-yonghu"></i>
                <span>组织机构</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="Dept"  @click="getTab($event)">部门管理
                
                </el-menu-item>
                <el-menu-item index="Member" @click="getTab($event)">员工管理
                 
                </el-menu-item>
                <el-menu-item index="Party" @click="getTab($event)">组织管理
                 
                </el-menu-item>
                <el-menu-item index="Unit" @click="getTab($event)">单位管理
                 
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="iconfont icon-ic_opt_feature"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="Func"  @click="getTab($event)">菜单管理
              
                </el-menu-item>
                <el-menu-item index="Log" @click="getTab($event)">日志管理
                
                </el-menu-item>
                <el-menu-item index="Permrole" @click="getTab($event)">角色权限
                
                </el-menu-item>
                <el-menu-item index="Permuser" @click="getTab($event)">用户权限
                
                </el-menu-item>
                <el-menu-item index="User" @click="getTab($event)">用户管理
                
                </el-menu-item>
                <el-submenu index="Role">
                <template slot="title" index="Role" @click="getTab($event)">角色管理</template>
                <el-menu-item index="Roleuser" @click="getTab($event)">用户角色
                </el-menu-item>
              </el-submenu>
              </el-menu-item-group>
              <el-submenu index="Log">
                <template slot="title" index="Log" @click="getTab($event)">日志管理</template>
                <el-menu-item index="Logbook" @click="getTab($event)">日志明细
                </el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-col>
      </div>
      <div class="content-r">
        <div class="tab">
          <el-tag
            :key="indexs"
            v-for="(tag,indexs) in dynamicTags"
            closable
            :disable-transitions="false"
            @close="taghandleClose(tag)"
            style="background-color='';"
          >
          <i class="tagtext" @click="goPage(tag)">{{tag.text}}</i>
          </el-tag>
        </div>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      isCollapse: true,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      username: []
    };
  },
  created() {
    this.getCookie("username");
    if(this.username.length==0){
      this.username="未登录"
    }
  },
  methods: {
 
    getCookie(c_name) {
      console.log(this)
      var _this=this
      //判断document.cookie对象里面是否存有cookie
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        //如果document.cookie对象里面有cookie则查找是否有指定的cookie，如果有则返回指定的cookie值，如果没有则返回空字符串
      
        if (c_start != -1) {
          console.log(document.cookie);
          console.log(document.cookie.split("=")[1]);
          var nameCookie = document.cookie.split("=")[1];
          _this.username=document.cookie.split("=")[1]
          return;
        }
      
      }
      return "";
    },
    backlogin() {
      alert("已成功退出登录！");
      this.$router.push({
        path: "/"
      });
    },
    getTab(e) {
      console.log(e._vnode)
      console.log(e._vnode.children[0].text);
      console.log(window.location.pathname)
      this.dynamicTags.push({
        text:e._vnode.children[0].text,
        pathname:window.location.pathname,
      });
    },
    goPage(tag){
      this.$router.push({
        path:tag.pathname
      })
      // tag.style.backgroundColor="red"
      console.log(tag)
      let my_div = document.getElementsByClassName("el-tag")[0];
      console.log(my_div)
let style = window.getComputedStyle(my_div, null).backgroundColor;
      console.log(style)
      // console.log(document.getElementsByClassName(.el-tag))
    },
    gohome() {
      this.$router.push({
        path: "/home"
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      // console.log(this.$data)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    taghandleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  }
};
</script>
<style lang="scss" scoped>
#common {
  min-width: 800px;
  height: 100%;
  width: 100%;

  .top {
    width: 100%;
    height: 75px;
    background: #555;
    color: #fff;
    .top-l {
      min-width: 180px;
      float: left;
      width: 15%;
      line-height: 75px;
      font-size: 24px;
      background: #000;
      text-align: center;
    }
    .top-r {
      height: 100%;
      min-width: 130px;
      float: right;
      line-height: 75px;
      width: 8%;
      display: flex;
      justify-content: space-between;
      margin-right: 20px;
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-col-12 {
        width: 100%;
      }
      .el-icon--right {
        color: #fff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
      .el-dropdown {
        width: 100%;
      }
      .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
      }
      span {
        margin-top: 20px;
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .content {
    width: 100%;
    height: 90%;
    background: #eee;
    display: flex;

    .content-l {
      min-width: 180px;
      width: 15%;
      height: 100%;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .el-col-12 {
        width: 100%;
        height: 100%;
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 100%;
        height: 100%;
      }
      .el-menu-item {
        min-width: auto;
      }
    }
    .content-r {
      width: 83%;
      height: 100%;
      .tab {
        width: 100%;
        height: 5%;
        overflow: hidden;
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
      .content {
        height: 95%;
        width: 100%;
      }
    }
  }
}
</style>