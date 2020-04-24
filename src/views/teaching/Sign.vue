<template>
  <section id="boxFixed">
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/sign"}'>教学管理</el-breadcrumb-item>
        <el-breadcrumb-item>课堂点名</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="学生姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getSigns">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="signs"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="student.party.partyName" label="学生姓名" width="120" sortable></el-table-column>
        <el-table-column
          prop="schedule.selection.lecturer.course.courseName"
          label="课程名称"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="schedule.selection.lecturer.member.party.partyName"
          label="教师姓名"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column prop="schedule.classtime.begTime" label="上课时间" width="120" sortable></el-table-column>
        <el-table-column prop="schedule.classroom.classroomName" label="教室名称" width="120" sortable></el-table-column>
        <el-table-column prop="scheduleDate" label="上课日期" width="120" sortable></el-table-column>
        <el-table-column prop="callTime" label="点名时间" width="120" sortable></el-table-column>
        <el-table-column prop="signTime" label="签到时间" width="120" sortable></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="20"
          :total="total"
          style="float:right"
        ></el-pagination>
      </el-col>
    </el-card>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="学生姓名" prop="student">
          <el-input v-model="editForm.student" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排课名称" prop="schedule">
          <el-input v-model="editForm.schedule" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上课日期" prop="scheduleDate">
          <el-date-picker type="date" v-model="editForm.scheduleDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="点名时间" prop="callTime">
          <el-date-picker type="time" v-model="editForm.callTime" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="签到时间" prop="signTime">
          <el-date-picker type="time" v-model="editForm.signTime" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="点名类别" prop="signFlag">
          <el-radio-group v-model="editForm.signFlag">
            <el-radio class="radio" :label="1">出勤</el-radio>
            <el-radio class="radio" :label="2">请假</el-radio>
            <el-radio class="radio" :label="0">缺勤</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="学生姓名" prop="student">
          <el-input v-model="addForm.student" auto-complete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="排课名称" prop="schedule">
          <el-input v-model="addForm.schedule" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上课日期" prop="scheduleDate">
          <el-date-picker type="date" v-model="addForm.scheduleDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="点名时间" prop="callTime">
          <el-date-picker type="time" v-model="addForm.callTime" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="签到时间" prop="signTime">
          <el-date-picker type="time" v-model="addForm.signTime" placeholder="选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="点名类别" prop="signFlag">
          <el-radio-group v-model="addForm.signFlag">
            <el-radio class="radio" :label="1">出勤</el-radio>
            <el-radio class="radio" :label="2">请假</el-radio>
            <el-radio class="radio" :label="0">缺勤</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false,resetForm('addForm')">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: "Sign",
  data() {
    var studentName = (rule, value, callback) => {
      // console.log('rule',rule);
      // console.log('value',value);
      var patt1 = /^[\u4e00-\u9fa5]+$/; //只能输入汉字
      if (!value.match(patt1)) {
        callback(new Error("请输入汉字"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        name: ""
      },
      signs: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        signId: "0",
        student: "",
        schedule: "",
        scheduleDate: "",
        callTime: "",
        signTime: "",
        signFlag: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        student: "",
        schedule: "",
        scheduleDate: "",
        callTime: "",
        signTime: "",
        signFlag: ""
      },
      addFormRules: {
        student: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入2~10个汉字", trigger: "blur" },
          { validator: studentName, trigger: "blur" }
        ],
        schedule: [
          { required: true, message: "请输入排课名称", trigger: "blur" },
          { min: 2, max: 20, message: "请输入2~20个字符", trigger: "blur" }
        ],
        scheduleDate:[
          { required: true, message: "请输入上课日期", trigger: "blur" }
        ],
        callTime:[
          { required: true, message: "请输入点名时间", trigger: "blur" }
        ],
        signTime:[
          { required: true, message: "请输入签到时间", trigger: "blur" }
        ],
        signFlag:[
          { required: true, message: "请输入点名类别", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleScroll(){
    　　let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
    　　let offsetTop = document.querySelector('#boxFixed').offsetTop; // 要滚动到顶部吸附的元素的偏移量
    　　this.isFixed = scrollTop > offsetTop ? true : false; // 如果滚动到顶部了，this.isFixed就为true
    },
    //表单重置
    resetForm(addForm) {
      this.$refs[addForm].resetFields();
    },
    // 性别显示转换
    formatSex: function(row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSigns();
    },
    // 获取用户列表
    getSigns() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/teaching/sign/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.signs = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/teaching/sign/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.signs = res.data;
        }
      });
      this.listLoading = false;
    },
    // 删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          // NProgress.start()
          let para = { id: row.signId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/teaching/sign/delete", {
              // id: para.id
              signId:para.signId
            })
            .then(res => {
              this.listLoading = false;
              // NProgress.done()
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getDepts();
            });
        })
        .catch(() => {});
    },
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        student: "",
        schedule: "",
        scheduleDate: "",
        callTime: "",
        signTime: "",
        signFlag: ""
      };
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            // NProgress.start()
            let para = Object.assign({}, this.editForm);
            // eslint-disable-next-line eqeqeq
            // eslint-disable-next-line no-undef
            para.birth =
              // eslint-disable-next-line eqeqeq
              !para.birth || para.birth == ""
                ? ""
                : (new Date(para.birth), "yyyy-MM-dd");
            // eslint-disable-next-line no-undef
            // 提交数据到后台
            this.$axios
              .post("/api/teaching/sign/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                studentId:para.studentId,
                scheduleId:para.scheduleId,
                scheduleDate:para.scheduleDate,
                callTime:para.callTime,
                callLong:para.callLong,
                callLat:para.callLat,
                callAddr:para.callAddr,
                signTime:para.signTime,
                signLong:para.signLong,
                signLat:para.signLat,
                signAddr:para.signAddr,
                signFlag:para.signFlag
              })
              .then(res => {
                this.editLoading = false;
                // NProgress.done()
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getSigns();
              });
          });
        }
      });
    },
    // 新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            // NProgress.start()
            let para = Object.assign({}, this.addForm);
            para.birth =
              // eslint-disable-next-line eqeqeq
              !para.birth || para.birth == ""
                ? ""
                : (new Date(para.birth), "yyyy-MM-dd");
            // eslint-disable-next-line no-undef
            // 提交数据到后台
            this.$axios
              .post("/api/teaching/sign/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                signId:para.signId,
                studentId:para.studentId,
                scheduleId:para.scheduleId,
                scheduleDate:para.scheduleDate,
                callTime:para.callTime,
                callLong:para.callLong,
                callLat:para.callLat,
                callAddr:para.callAddr,
                signTime:para.signTime,
                signLong:para.signLong,
                signLat:para.signLat,
                signAddr:para.signAddr,
                signFlag:para.signFlag
              })
              .then(res => {
                this.addLoading = false;
                // NProgress.done()
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getSigns();
              });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    // 批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.signId).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          // NProgress.start()
          let para = { ids: ids };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/teaching/sign/delete", {
              // id: para.ids
              signId:para.signId
            })
            .then(res => {
              this.listLoading = false;
              // NProgress.done()
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getDepts();
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getSigns();
    window.addEventListener('scroll',this.handleScroll);
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
