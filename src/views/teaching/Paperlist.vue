<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/paperlist"}'>教学管理</el-breadcrumb-item>
        <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>习题管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="试卷名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getPaperlists">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="paperlists"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="paper.paperName" label="试卷名称" width="120" sortable></el-table-column>
        <el-table-column prop="exerciseNo" label="习题序号" width="120" sortable></el-table-column>
        <el-table-column prop="exercise.exerciseName" label="习题名称" width="120" sortable></el-table-column>
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
        <el-form-item label="试卷名称" prop="paper">
          <el-input v-model="editForm.paper" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="习题序号" prop="exerciseNo">
          <el-input-number v-model="editForm.exerciseNo" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="习题名称" prop="exercise">
          <el-input v-model="editForm.exercise" auto-complete="off"></el-input>
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
        <el-form-item label="试卷名称" prop="paper">
          <el-input v-model="addForm.paper" auto-complete="off" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="习题序号" prop="exerciseNo">
          <el-input-number v-model="addForm.exerciseNo" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="习题名称" prop="exercise">
          <el-input v-model="addForm.exercise" auto-complete="off" maxlength="20"></el-input>
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
  name: "Paperlist",
  data() {
    var chinese = (rule, value, callback) => {
      // console.log('rule',rule);
      // console.log('value',value);
      var patt1 = /^[a-z0-9A-Z\u4e00-\u9fa5]+$/gi; //只能输入汉字,字母和数字
      if (!value.match(patt1)) {
        callback(new Error("请输入正确的试卷名称"));
      } else {
        callback();
      }
    };
    var exercise = (rule, value, callback) => {
      // console.log('rule',rule);
      // console.log('value',value);
      var patt2 = /^[a-z0-9A-Z\u4e00-\u9fa5]+$/gi; //只能输入汉字,字母和数字
      if (!value.match(patt2)) {
        callback(new Error("请输入正确的试卷名称"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        name: ""
      },
      paperlists: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入试卷名称", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        paperlistId: "0",
        paper: "",
        exerciseNo: "",
        exercise: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入试卷名称", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        paper: "",
        exerciseNo: "",
        exercise: ""
      },
      addFormRules: {
        paper: [
          { required: true, message: "请输入试卷名称", trigger: "blur" },
          { min: 2, max: 20, message: "请输入2~00个字符", trigger: "blur" },
          { validator: chinese, trigger: "blur" }
        ],
        exercise: [
          { required: true, message: "请输入习题名称", trigger: "blur" },
          { min: 2, max: 20, message: "请输入2~00个字符", trigger: "blur" },
          { validator: exercise, trigger: "blur" }
        ],
        exerciseNo:[
          { required: true, message: "请输入习题序号", trigger: "blur" },
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
      this.getPaperlists();
    },
    // 获取用户列表
    getPaperlists() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/teaching/paperlist/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.paperlists = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get("/api/teaching/paperlist/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.paperlists = res.data;
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
          let para = { id: row.paperlistId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/teaching/paperlist/delete", {
              // id: para.id
              paperlistId:para.paperlistId
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
        paper: "",
        exerciseNo: "",
        exercise: ""
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
              .post("/api/teaching/paperlist/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                paperlistId:para.paperlistId,
                paperId:para.paperId,
                exerciseNo:para.exerciseNo,
                exerciseId:para.exerciseId
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
                this.getPaperlists();
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
              .post("/api/teaching/paperlist/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                paperlistId:para.paperlistId,
                paperId:para.paperId,
                exerciseNo:para.exerciseNo,
                exerciseId:para.exerciseId
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
                this.getPaperlists();
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
      var ids = this.sels.map(item => item.paperlistId).toString();
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
            .post("/api/teaching/paperlist/delete", {
              // id: para.ids
              paperlistId:para.paperlistId
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
    this.getPaperlists();
  }
};
</script>

<style scoped>
</style>
