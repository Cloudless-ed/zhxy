<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/homework"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='课程名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getHomeworks'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="homeworks" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type='expand'>
          <template slot-scope='props'>
            <el-form label-position='left' inline>
              <el-form-item>
                <span>{{ props.row.memo }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop='student.party.partyName' label='学生姓名' width='120' sortable></el-table-column>
        <el-table-column prop='assignment.lecturer.course.courseName' label='课程名称' width='120' sortable></el-table-column>
        <el-table-column prop='assignment.lecturer.member.party.partyName' label='教师姓名' width='120' sortable></el-table-column>
        <el-table-column prop='assignment.assignmentTime' label='布置时间' width='120' sortable></el-table-column>
        <el-table-column prop='receiveFlag' label='接收标识' width='120' sortable></el-table-column>
        <el-table-column fixed='right' label='操作' width='120'>
          <template slot-scope='scope'>
            <el-button type='text' size='small' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
            <el-button type='text' size='small' @click='handleDel(scope.$index, scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span='24' class='toolbar'>
        <el-button type='danger' @click='batchRemove' :disabled='this.sels.length===0'>批量删除</el-button>
        <el-pagination
          layout='prev, pager, next'
          @current-change='handleCurrentChange'
          :page-size='20'
          :total='total'
          style='float:right'
        ></el-pagination>
      </el-col>
    </el-card>

    <!--编辑界面-->
    <el-dialog title='编辑' :visible.sync='editFormVisible' :close-on-click-modal='false'>
      <el-form :model='editForm' label-width='80px' :rules='editFormRules' ref='editForm'>
        <el-form-item label='学生姓名' prop='student'>
          <el-input v-model='editForm.student' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='作业名称' prop='assignment'>
          <el-input v-model='editForm.assignment' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="接收标识" prop='receiveFlag'>
          <el-radio-group v-model="editForm.receiveFlag">
            <el-radio class="radio" :label="1">已经接收</el-radio>
            <el-radio class="radio" :label="0">没有接收</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='备注' prop='memo'>
          <el-input type='textarea' v-model='editForm.memo' auto-complete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='editFormVisible = false'>取消</el-button>
        <el-button type='primary' @click.native='editSubmit' :loading='editLoading'>提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title='新增' :visible.sync='addFormVisible' :close-on-click-modal='false'>
      <el-form :model='addForm' label-width='80px' :rules='addFormRules' ref='addForm'>
        <el-form-item label='学生姓名' prop='student'>
          <el-input v-model='addForm.student' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='作业名称' prop='assignment'>
          <el-input v-model='addForm.assignment' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="接收标识" prop='receiveFlag'>
          <el-radio-group v-model="addForm.receiveFlag">
            <el-radio class="radio" :label="1">已经接收</el-radio>
            <el-radio class="radio" :label="0">没有接收</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='备注' prop='memo'>
          <el-input type='textarea' v-model='addForm.memo' auto-complete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='addFormVisible = false'>取消</el-button>
        <el-button type='primary' @click.native='addSubmit' :loading='addLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'Homework',
  data () {
     var validataName = (rule, value, callback) => {
      var patt1 = /^[\u4e00-\u9fa5]+$/
      if (!value.match(patt1)) {
         callback(new Error('请输入姓名'))
        } else {
         callback()
       }
     }
    return {
      filters: {
        name: ''
      },
      homeworks: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        homeworkId: '0',
        student: '',
        assignment: '',
        receiveFlag: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        student: [
                     { required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
         assignment: [
                 { required: true, message: '请输入作业名称', trigger: 'blur' }
              ],
               receiveFlag: [
                 { required: true, message: '请选择是否接收', trigger: 'blur' }
              ]
      },
      // 新增界面数据
      addForm: {
        student: '',
        assignment: '',
        receiveFlag: '',
        memo: ''
      }
    }
  },
  methods: {
    // 性别显示转换
    formatSex: function (row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    handleCurrentChange (val) {
      this.page = val
      this.getHomeworks()
    },
    // 获取用户列表
    getHomeworks () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/homework/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.homeworks = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/homework/select').then(res => {
        if (res && res.status === 200) {
          _this.homeworks = res.data
        }
      })
      this.listLoading = false
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { id: row.homeworkId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/homework/delete', {
          id: para.id
        }).then(res => {
          this.listLoading = false
          // NProgress.done()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDepts()
        })
      }).catch(() => {})
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        student: '',
        assignment: '',
        receiveFlag: '',
        memo: ''
      }
    },
    // 编辑
    editSubmit: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            // NProgress.start()
            let para = Object.assign({}, this.editForm)
            // eslint-disable-next-line eqeqeq
            // eslint-disable-next-line no-undef
            para.birth =
              // eslint-disable-next-line eqeqeq
              !para.birth || para.birth == ''
                ? ''
                : (new Date(para.birth), 'yyyy-MM-dd')
            // eslint-disable-next-line no-undef
            // 提交数据到后台
            this.$axios.post('/student/homework/update', {
              id: para.id,
              cover: para.cover,
              title: para.title,
              author: para.author,
              date: para.date,
              press: para.press,
              abs: para.abs,
              category: para.category
            }).then(res => {
              this.editLoading = false
              // NProgress.done()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getHomeworks()
            })
          })
        }
      })
    },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            // NProgress.start()
            let para = Object.assign({}, this.addForm)
            para.birth =
              // eslint-disable-next-line eqeqeq
              !para.birth || para.birth == ''
                ? ''
                : (new Date(para.birth), 'yyyy-MM-dd')
            // eslint-disable-next-line no-undef
            // 提交数据到后台
            this.$axios.post('/student/homework/insert', {
              id: para.id,
              cover: para.cover,
              title: para.title,
              author: para.author,
              date: para.date,
              press: para.press,
              abs: para.abs,
              category: para.category
            }).then(res => {
              this.addLoading = false
              // NProgress.done()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getHomeworks()
            })
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.homeworkId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/homework/delete', {
          id: para.ids
        }).then(res => {
          this.listLoading = false
          // NProgress.done()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDepts()
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.getHomeworks()
  }
}
</script>

<style scoped>
</style>
