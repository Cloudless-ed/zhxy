<template>
  <section>
    <el-row style="margin: 10px 10px 10px 10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to='{path: "/career"}'>教师管理</el-breadcrumb-item>
        <el-breadcrumb-item>任职管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style="margin: 20px 1%;width: 100%">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
        <el-form :inline="true" :model="addForm" :rules="addFormRules" ref="addForm">
          <el-form-item prop="partyname">
            <el-input v-model="addForm.name" placeholder="教师姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getCareers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table
        :data="careers"
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
                <span>{{ props.row.careerDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="member.party.partyName" label="教师姓名" width="120" sortable></el-table-column>
        <el-table-column prop="dept.party.partyName" label="学科名称" width="120" sortable></el-table-column>
        <el-table-column prop="begDate" label="调入日期" width="120" sortable></el-table-column>
        <el-table-column prop="endDate" label="调离日期" width="120" sortable></el-table-column>
        <el-table-column prop="careerFlag" label="任职状态" width="120" sortable></el-table-column>
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
        <el-form-item label="教师姓名" prop="member">
          <el-input v-model="editForm.member" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="dept">
          <el-input v-model="editForm.dept" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="调入日期" prop="begDate">
          <el-input v-model="editForm.begDate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="调离日期" prop="endDate">
          <el-input v-model="editForm.endDate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="careerFlag">
          <el-radio-group v-model="editForm.careerFlag">
            <el-radio class="radio" :label="1">在任</el-radio>
            <el-radio class="radio" :label="0">离任</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任职说明" prop="careerDesc">
          <el-input type="textarea" v-model="editForm.careerDesc" auto-complete="off"></el-input>
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
        <el-form-item label="教师姓名" prop="partyName">
          <el-input v-model="addForm.partyName" auto-complete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="dept">
          <el-input v-model='addForm.dept' auto-complete='off' class="demonstration" maxlength="20"></el-input>
          <!-- <el-cascader v-model="value" :options="options"></el-cascader> -->
        </el-form-item>
        <el-form-item label="调入日期" prop="begDate">
          <!-- <el-input v-model='addForm.begDate' auto-complete='off' maxlength="15"></el-input> -->
          <el-date-picker type="dates" v-model="transferIn" placeholder="选择一个或多个日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="调离日期" prop="endDate">
          <!-- <el-input v-model='addForm.endDate' auto-complete='off' maxlength="15"></el-input> -->
          <el-date-picker type="dates" v-model="transferFrom" placeholder="选择一个或多个日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否在任" prop="careerFlag">
          <el-radio-group v-model="addForm.careerFlag">
            <el-radio class="radio" :label="1">在任</el-radio>
            <el-radio class="radio" :label="0">离任</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任职说明" prop="careerDesc">
          <el-input
            type="textarea"
            v-model="addForm.careerDesc"
            auto-complete="off"
            maxlength="100"
            show-word-limit
          ></el-input>
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
  name: "Career",
  data() {
    //姓名验证
    var chinese = (rule, value, callback) => {
      var patt1 = /^[\u4e00-\u9fa5]+$/; //只能输入汉字
      if (!value.match(patt1)) {
        callback(new Error("请输入汉字"));
      } else {
        callback();
      }
    };
    return {
      value: [],
      transferIn: "",
      transferFrom: "",
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],

      filters: {
        name: ""
      },
      careers: [],
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
        careerId: "0",
        member: "",
        dept: "",
        begDate: "",
        endDate: "",
        careerFlag: "",
        careerDesc: ""
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      // addFormRules: {
      //   name: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }]
      // },
      // 新增界面数据
      addForm: {
        member: "",
        dept: "",
        begDate: "",
        endDate: "",
        careerFlag: "",
        careerDesc: ""
      },
      addFormRules: {
        partyName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入2~10个汉字", trigger: "blur" },
          { validator: chinese, trigger: "blur" }
        ],
        careerDesc: [
          { min: 1, max: 100, message: "输入字数在100字以内", trigger: "blur" }
        ],
        dept:[
          { required: true, message: "请输入学科名称", trigger: "blur" },
        ],
        careerFlag:[
          { required: true, message: "请选择是否在任", trigger: "blur" },
        ]

      },
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
      this.getCareers();
    },
    // 获取用户列表
    getCareers() {
      this.listLoading = true;
      var _this = this;
      /*
      this.$axios.post('/member/career/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.careers = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post("/api/member/career/select",{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.careers = res.data;
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
          let para = { id: row.careerId };
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios
            .post("/api/member/career/delete", {
              // id: para.id
              careerId:para.careerId
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
        member: "",
        dept: "",
        begDate: "",
        endDate: "",
        careerFlag: "",
        careerDesc: ""
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
              .post("/api/member/career/update", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                careerId:para.careerId,
                deptId:para.deptId,
                memberId:para.memberId,
                begDate:para.begDate,
                endDate:para.endDate,
                careerFlag:para.careerFlag,
                careerDesc:para.careerDesc
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
                this.getCareers();
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
              .post("/api/member/career/insert", {
                // id: para.id,
                // cover: para.cover,
                // title: para.title,
                // author: para.author,
                // date: para.date,
                // press: para.press,
                // abs: para.abs,
                // category: para.category
                deptId:para.deptId,
                memberId:para.memberId,
                begDate:para.begDate,
                endDate:para.endDate,
                careerFlag:para.careerFlag,
                careerDesc:para.careerDesc
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
                this.getCareers();
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
      var ids = this.sels.map(item => item.careerId).toString();
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
            .post("/member/career/delete", {
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
    this.getCareers();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
