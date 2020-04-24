<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/courseware"}'>教学管理</el-breadcrumb-item>
        <el-breadcrumb-item>课件管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="教师姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getCoursewares">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="coursewares"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="preparation.preparationName" label="备课主题" width="120" sortable></el-table-column>
        <el-table-column prop="member。party.partyName" label="备课教师" width="120" sortable></el-table-column>
        <el-table-column prop="coursewareNo" label="课件序号" width="120" sortable></el-table-column>
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
        <el-form-item label="备课主题" prop="preparation">
          <el-input v-model="editForm.preparation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备课教师" prop="member">
          <el-input v-model="editForm.member" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课件序号" prop="coursewareNo">
          <el-input v-model="editForm.coursewareNo" auto-complete="off"></el-input>
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
        <el-form-item label="备课主题" prop="preparation">
          <el-input v-model='addForm.preparation' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="备课教师" prop="member">
          <el-input v-model="addForm.member" auto-complete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="课件序号" prop="coursewareNo">
          <el-input v-model="addForm.coursewareNo" auto-complete="off" maxlength="20"></el-input>
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
  name: "Courseware",
  data() {
    var lesson = (rule, value, callback) => {
      // console.log('rule',rule);
      // console.log('value',value);
      var patt1 = /^[\u4e00-\u9fa5]+$/; //只能输入汉字
      //     console.log('============',value.match(patt1));
      if (!value.match(patt1)) {
        callback(new Error("请输入汉字"));
      } else {
        callback();
      }
    };
    var serial = (rule, value, callback) => {
      // console.log('rule',rule);
      // console.log('value',value);
      var patt2 = /^[A-Za-z0-9\u4e00-\u9fa5]+$/; //不能输入非法字符，其他都能输入
      //     console.log('============',value.match(patt1));
      if (!value.match(patt2)) {
        callback(new Error("请输入正确的试卷序号"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        name: ""
      },
      coursewares: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入教师姓名", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        coursewareId: "0",
        preparation: "",
        member: "",
        coursewareNo: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入教师姓名", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        preparation: "",
        member: "",
        coursewareNo: ""
      },
      addFormRules: {
        member: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入2~10个汉字", trigger: "blur" },
          { validator: lesson, trigger: "blur" }
        ],
        coursewareNo: [
          { required: true, message: "请输入试卷序号", trigger: "blur" },
          { min: 2, max: 20, message: "请不要输入非法字符", trigger: "blur" },
          { validator: serial, trigger: "blur" }
        ],
        preparation:[
          { required: true, message: "请输入备课主题", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
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
      this.getCoursewares();
    },
    // 获取用户列表
    getCoursewares() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/teaching/courseware/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.coursewares = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/teaching/courseware/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.coursewares = res.data;
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
          let para = { id: row.coursewareId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/teaching/courseware/delete", {
              // id: para.id
              coursewareId:para.coursewareId
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
        preparation: "",
        member: "",
        coursewareNo: ""
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
              .post("/api/teaching/courseware/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                coursewareId:para.coursewareId,
                preparationId:para.preparationId,
                memberId:para.memberId,
                coursewareNo:para.coursewareNo
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
                this.getCoursewares();
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
              .post("api//teaching/courseware/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                preparationId:para.preparationId,
                memberId:para.memberId,
                coursewareNo:para.coursewareNo
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
                this.getCoursewares();
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
      var ids = this.sels.map(item => item.coursewareId).toString();
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
            .post("/teaching/courseware/delete", {
              // id: para.ids
              coursewareId:para.coursewareId
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
    this.getCoursewares();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
