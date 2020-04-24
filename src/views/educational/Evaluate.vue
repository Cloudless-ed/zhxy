<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/evaluate"}'>教务管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程评价</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="课程名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getEvaluates">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="evaluates"
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
        <el-table-column
          prop="selection.lecturer.course.courseName"
          label="课程名称"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="selection.lecturer.member.party.partyName"
          label="教师姓名"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column prop="evaluateDate" label="评价日期" width="120" sortable></el-table-column>
        <el-table-column prop="environFlag" label="办学环境" width="120" sortable></el-table-column>
        <el-table-column prop="serviceFlag" label="组织管理" width="120" sortable></el-table-column>
        <el-table-column prop="courseFlag" label="课程内容" width="120" sortable></el-table-column>
        <el-table-column prop="teachFlag" label="课堂教学" width="120" sortable></el-table-column>
        <el-table-column prop="wholeFlag" label="综合评价" width="120" sortable></el-table-column>
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
        <el-form-item label="选课名称" prop="selection">
          <el-input v-model="editForm.selection" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="评价日期" prop="evaluateDate">
          <el-date-picker type="date" v-model="editForm.evaluateDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="办学环境" prop="environFlag">
          <el-radio-group v-model="editForm.environFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组织管理" prop="serviceFlag">
          <el-radio-group v-model="editForm.serviceFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容" prop="courseFlag">
          <el-radio-group v-model="editForm.courseFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课堂教学" prop="teachFlag">
          <el-radio-group v-model="editForm.teachFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="综合评价" prop="wholeFlag">
          <el-radio-group v-model="editForm.wholeFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
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
        <el-form-item label="选课名称" prop="selection">
          <el-input v-model='addForm.selection' auto-complete='off' maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
        </el-form-item>
        <el-form-item label="评价日期" prop="evaluateDate">
          <el-date-picker type="date" v-model="addForm.evaluateDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="办学环境" prop="environFlag">
          <el-radio-group v-model="addForm.environFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组织管理" prop="serviceFlag">
          <el-radio-group v-model="addForm.serviceFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容" prop="courseFlag">
          <el-radio-group v-model="addForm.courseFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课堂教学" prop="teachFlag">
          <el-radio-group v-model="addForm.teachFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="综合评价" prop="wholeFlag">
          <el-radio-group v-model="addForm.wholeFlag">
            <el-radio class="radio" :label="5">非常满意</el-radio>
            <el-radio class="radio" :label="4">满意</el-radio>
            <el-radio class="radio" :label="3">一般</el-radio>
            <el-radio class="radio" :label="2">不满意</el-radio>
            <el-radio class="radio" :label="1">极不满意</el-radio>
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
  name: "Evaluate",
  data() {
    return {
      filters: {
        name: ""
      },
      evaluates: [],
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
        evaluateId: "0",
        selection: "",
        evaluateDate: "",
        environFlag: "",
        serviceFlag: "",
        courseFlag: "",
        teachFlag: "",
        wholeFlag: "",
        memo: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        selection: "",
        evaluateDate: "",
        environFlag: "",
        serviceFlag: "",
        courseFlag: "",
        teachFlag: "",
        wholeFlag: "",
        memo: ""
      },
      addFormRules:{
        selection:[
          { required: true, message: "请输入选课名称", trigger: "blur" }
        ],
        evaluateDate:[
          { required: true, message: "请输入评价日期", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
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
      this.getEvaluates();
    },
    // 获取用户列表
    getEvaluates() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/educational/evaluate/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.evaluates = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/educational/evaluate/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.evaluates = res.data;
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
          let para = { id: row.evaluateId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/educational/evaluate/delete", {
              // id: para.id
              evaluateId:para.evaluateId
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
        selection: "",
        evaluateDate: "",
        environFlag: "",
        serviceFlag: "",
        courseFlag: "",
        teachFlag: "",
        wholeFlag: "",
        memo: ""
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
              .post("/api/educational/evaluate/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                evaluateId:para.evaluateId,
                selectionId:para.selectionId,
                evaluateDate:para.evaluateDate,
                environFlag:para.environFlag,
                serviceFlag:para.serviceFlag,
                courseFlag:para.courseFlag,
                teachFlag:para.teachFlag,
                wholeFlag:para.wholeFlag,
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
                this.getEvaluates();
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
              .post("/api/educational/evaluate/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                selectionId:para.selectionId,
                evaluateDate:para.evaluateDate,
                environFlag:para.environFlag,
                serviceFlag:para.serviceFlag,
                courseFlag:para.courseFlag,
                teachFlag:para.teachFlag,
                wholeFlag:para.wholeFlag,
                memo:para.memo
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
                this.getEvaluates();
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
      var ids = this.sels.map(item => item.evaluateId).toString();
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
            .post("/api/educational/evaluate/delete", {
              // id: para.ids
              evaluateId:para.evaluateId
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
    this.getEvaluates();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
