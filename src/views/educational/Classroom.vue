<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/classroom"}'>教务管理</el-breadcrumb-item>
        <el-breadcrumb-item>教室管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="教室名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getClassrooms">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="classrooms"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <span>{{ props.row.memo }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="classroomName" label="教室名称" width="120" sortable></el-table-column>
        <el-table-column prop="dept.party.partyName" label="学科名称" width="120" sortable></el-table-column>
        <el-table-column prop="seatNum" label="座位总数" width="120" sortable></el-table-column>
        <el-table-column prop="classroomFlag" label="教室状态" width="120" sortable></el-table-column>
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
        <el-form-item label="教室名称" prop="classroomName">
          <el-input v-model="editForm.classroomName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="dept">
          <el-input v-model="editForm.dept" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="座位总数" prop="seatNum">
          <el-input-number v-model="editForm.seatNum" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="教室状态" prop="classroomFlag">
          <el-radio-group v-model="editForm.classroomFlag">
            <el-radio class="radio" :label="1">使用</el-radio>
            <el-radio class="radio" :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" v-model="editForm.memo" auto-complete="off"></el-input>
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
        <el-form-item label="教室名称" prop="classroomName">
          <el-input v-model='addForm.classroomName' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="学科名称" prop="dept">
          <el-input v-model='addForm.dept' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="座位总数" prop="seatNum">
          <el-input-number v-model="addForm.seatNum" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="教室状态" prop="classroomFlag">
          <el-radio-group v-model="addForm.classroomFlag">
            <el-radio class="radio" :label="1">使用</el-radio>
            <el-radio class="radio" :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" v-model="addForm.memo" auto-complete="off" maxlength="100" show-word-limit></el-input>
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

  name: "Classroom",
  data() {
    return {
      filters: {
        name: ""
      },
      classrooms: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入教室名称", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        classroomId: "0",
        dept: "",
        classroomName: "",
        seatNum: "",
        classroomFlag: "",
        memo: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入教室名称", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        dept: "",
        classroomName: "",
        seatNum: "",
        classroomFlag: "",
        memo: ""
      },
      // addFormRules:{
      //   classroomName:[
      //     { required: true, message: "请输入教室名称", trigger: "blur" }
      //   ],
      //   dept:[
      //     { required: true, message: "请输入学科名称", trigger: "blur" }
      //   ],
      //   seatNum:[
      //     { required: true, message: "请输入座位总数", trigger: "blur" }
      //   ],
      //   classroomFlag:[
      //      { required: true, message: "请选择教室状态", trigger: "blur" }
      //   ]
      // }
    };
  },
  methods: {
    //重置表单
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
      this.getClassrooms();
    },
    // 获取用户列表
    getClassrooms() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/educational/classroom/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.classrooms = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/educational/classroom/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      })
         
        .then(res => {
        
        if (res && res.status === 200) {
          _this.classrooms = res.data;
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
          let para = { id: row.classroomId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/educational/classroom/delete", {
              classroomId: para.classroomId
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
        deptId:'1',
        dept: "",
        classroomName: "",
        seatNum: "",
        classroomFlag: "",
        memo: "",
        classroomCode:""
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
              .post("/api/educational/classroom/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                classroomId:para.classroomId,
                deptId:para.deptId,
                classroomCode:para.classroomCode,
                classroomName:para.classroomName,
                seatNum:para.seatNum,
                classroomFlag:para.classroomFlag,
                memo:para.memo
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
                this.getClassrooms();
              });
          });
        }
      });
    },
    // 新增
     resetForm(formName) {
        this.$refs[formName].resetFields();
      },
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
              .post("/api/educational/classroom/insert", {
                deptId: para.deptId,
                classroomCode: para.classroomCode,
                classroomName: para.classroomName,
                seatNum: para.seatNum,
                classroomFlag: para.classroomFlag,
                memo: para.memo,
                // abs: para.abs,
                // category: para.category
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
                this.getClassrooms();
              }).catch(function(error){
                console.log(error);
                vm.errorMsg = error;
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
      var ids = this.sels.map(item => item.classroomId).toString();
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
            .post("/api/educational/classroom/delete", {
              // id: para.ids
              classroomId:para.classroomId
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
    this.getClassrooms();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
