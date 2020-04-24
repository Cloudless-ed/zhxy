<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/classtime"}'>教务管理</el-breadcrumb-item>
        <el-breadcrumb-item>作息时间</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="星期周数" type="number" min="0" max="99"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getClasstimes">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table
        :data="classtimes"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="weekNo" label="星期周数" width="120" sortable></el-table-column>
        <el-table-column prop="begTime" label="上课时间" width="120" sortable></el-table-column>
        <el-table-column prop="endTime" label="下课时间" width="120" sortable></el-table-column>
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
        <el-form-item label="星期周数" prop="weekNo">
          <el-radio-group v-model="editForm.weekNo">
            <el-radio class="radio" :label="1">星期一</el-radio>
            <el-radio class="radio" :label="2">星期二</el-radio>
            <el-radio class="radio" :label="3">星期三</el-radio>
            <el-radio class="radio" :label="4">星期四</el-radio>
            <el-radio class="radio" :label="5">星期五</el-radio>
            <el-radio class="radio" :label="6">星期六</el-radio>
            <el-radio class="radio" :label="0">星期日</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上课时间" prop="begTime">
          <el-date-picker type="date" v-model="editForm.begTime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="下课时间" prop="endTime">
          <el-date-picker type="date" v-model="editForm.endTime" placeholder="选择日期"></el-date-picker>
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
        <el-form-item label="星期周数" prop="weekNo">
          <!-- <el-radio-group v-model="addForm.weekNo">
            <el-radio class="radio" :label="1">星期一</el-radio>
            <el-radio class="radio" :label="2">星期二</el-radio>
            <el-radio class="radio" :label="3">星期三</el-radio>
            <el-radio class="radio" :label="4">星期四</el-radio>
            <el-radio class="radio" :label="5">星期五</el-radio>
            <el-radio class="radio" :label="6">星期六</el-radio>
            <el-radio class="radio" :label="0">星期日</el-radio> -->
          <!-- </el-radio-group> -->
          <!-- <el-select v-model="value" placeholder="请选择" prop="addForm.weekNo">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-input-number v-model="addForm.weekNo" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="上课时间" prop="begTime">
          <el-date-picker type="date" v-model="addForm.begTime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="下课时间" prop="endTime">
          <el-date-picker type="date" v-model="addForm.endTime" placeholder="选择日期"></el-date-picker>
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
  name: "Classtime",
  data() {
    return {
      options: [{
          value: '选项1',
          label: '星期一'
        }, {
          value: '选项2',
          label: '星期二'
        }, {
          value: '选项3',
          label: '星期三'
        }, {
          value: '选项4',
          label: '星期四'
        }, {
          value: '选项5',
          label: '星期五'
        },{
          value: '选项5',
          label: '星期六'
        },{
          value: '选项5',
          label: '星期日'
        }],
        value: '',
      filters: {
        name: ""
      },
      classtimes: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入星期周数", trigger: "blur" }]
      },
      // 编辑界面数据
      editForm: {
        classtimeId: "0",
        weekNo: "",
        begTime: "",
        endTime: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入星期周数", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        weekNo: "",
        begTime: "",
        endTime: ""
      },
      addFormRules:{
        weekNo:[
          { required: true, message: "请输入星期周数", trigger: "blur" }
        ],
        begTime:[
          { required: true, message: "请输入上课时间", trigger: "blur" }
        ],
        endTime:[
          { required: true, message: "请输入下课时间", trigger: "blur" }
        ]
      }
    
    };
  },
  methods: {
    // 性别显示转换
    formatSex: function(row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getClasstimes();
    },
    // 获取用户列表
    getClasstimes() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/educational/classtime/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.classtimes = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/educational/classtime/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      })
      .then(res => {
        if (res && res.status === 200) {
          _this.classtimes = res.data;
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
          let para = { id: row.classtimeId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/educational/classtime/delete", {
              // id: para.id
              classtimeId:para.classtimeId
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
        weekNo: "",
        begTime: "",
        endTime: ""
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
              .post("/api/educational/classtime/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                classtimeId:para.classtimeId,
                weekNo:para.weekNo,
                begTime:para.begTime,
                endTime:para.endTime
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
                this.getClasstimes();
              });
          });
        }
      });
    },
    // 新增
    //表单重置
    resetForm(addForm) {
      this.$refs[addForm].resetFields();
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
              .post("/api/educational/classtime/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                weekNo:para.weekNo,
                begTime:para.begTime,
                endTime:para.endTime,
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
                this.getClasstimes();
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
      var ids = this.sels.map(item => item.classtimeId).toString();
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
            .post("/educational/classtime/delete", {
              id: para.ids
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
    this.getClasstimes();
  }
};
</script>

<style scoped>
</style>
