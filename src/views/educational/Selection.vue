<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/selection"}'>教务管理</el-breadcrumb-item>
        <el-breadcrumb-item>选课管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="课程名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getSelections">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="selections"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="lecturer.course.courseName" label="课程名称" width="120" sortable></el-table-column>
        <el-table-column prop="lecturer.member.party.partyName" label="教师姓名" width="120" sortable></el-table-column>
        <el-table-column prop="classOwner.className" label="班级名称" width="120" sortable></el-table-column>
        <el-table-column prop="student.party.partyName" label="学生姓名" width="120" sortable></el-table-column>
        <el-table-column prop="selectionFlag" label="选课类别" width="120" sortable></el-table-column>
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
        <el-form-item label="任课名称" prop="lecturer">
          <el-input v-model="editForm.lecturer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="classOwner">
          <el-input v-model="editForm.classOwner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="student">
          <el-input v-model="editForm.student" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选课类别" prop="selectionFlag">
          <el-radio-group v-model="editForm.selectionFlag">
            <el-radio class="radio" :label="0">未排课</el-radio>
            <el-radio class="radio" :label="1">已排课</el-radio>
            <el-radio class="radio" :label="2">已退课</el-radio>
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
        <el-form-item label="任课名称" prop="lecturer">
          <el-input v-model='addForm.lecturer' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="班级名称" prop="classOwner">
          <el-input v-model='addForm.classOwner' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="学生姓名" prop="student">
          <el-input v-model="addForm.student" auto-complete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="选课类别" prop="selectionFlag">
          <el-radio-group v-model="addForm.selectionFlag">
            <el-radio class="radio" :label="0">未排课</el-radio>
            <el-radio class="radio" :label="1">已排课</el-radio>
            <el-radio class="radio" :label="2">已退课</el-radio>
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
  name: "Selection",
  data() {
    //姓名验证
    var chinese = (rule, value, callback) => {
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
    return {
      filters: {
        name: ""
      },
      selections: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        selectionId: "0",
        lecturer: "",
        classOwner: "",
        student: "",
        selectionFlag: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        lecturer: "",
        classOwner: "",
        student: "",
        selectionFlag: ""
      },
      addFormRules: {
        student: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入2~10个汉字", trigger: "blur" },
          { validator: chinese, trigger: "blur" }
        ],
        lecturer:[
          { required: true, message: "请输入任课名称", trigger: "blur" }
        ],
        classOwner:[
          { required: true, message: "请输入班级名称", trigger: "blur" }
        ],
        selectionFlag:[
          { required: true, message: "请输入选课类别", trigger: "blur" }
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
      this.getSelections();
    },
    // 获取用户列表
    getSelections() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/educational/selection/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.selections = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/educational/selection/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.selections = res.data;
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
          let para = { id: row.selectionId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/educational/selection/delete", {
              // id: para.id
              selectionId:para.selectionId
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
        lecturer: "",
        classOwner: "",
        student: "",
        selectionFlag: ""
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
              .post("/api/educational/selection/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                selectionId:para.selectionId,
                lecturerId:para.lecturerId,
                classId:para.classId,
                studentId:para.studentId,
                selectionFlag:para.selectionFlag
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
                this.getSelections();
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
              .post("/api/educational/selection/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                lecturerId:para.lecturerId,
                classId:para.classId,
                studentId:para.studentId,
                selectionFlag:para.selectionFlag
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
                this.getSelections();
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
      var ids = this.sels.map(item => item.selectionId).toString();
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
            .post("/api/educational/selection/delete", {
              // id: para.ids
              selectionId:para.selectionId
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
    this.getSelections();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
