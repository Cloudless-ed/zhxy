<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/logbook"}'>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志明细</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='用户名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getLogbooks'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="logbooks" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop='log.user.userName' label='用户名称' width='120' sortable></el-table-column>
        <el-table-column prop='className' label='类名称' width='120' sortable></el-table-column>
        <el-table-column prop='methodName' label='方法名称' width='120' sortable></el-table-column>
        <el-table-column prop='funcName' label='菜单名称' width='120' sortable></el-table-column>
        <el-table-column prop='actionName' label='操作名称' width='120' sortable></el-table-column>
        <el-table-column prop='objectId' label='操作对象' width='120' sortable></el-table-column>
        <el-table-column prop='operateTime' label='操作时间' width='120' sortable></el-table-column>
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
        <el-form-item label='用户名称' prop='userName'>
          <el-input v-model='editForm.userName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='类名称' prop='className'>
          <el-input v-model='editForm.className' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='方法名称' prop='methodName'>
          <el-input v-model='editForm.methodName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='菜单名称' prop='funcName'>
          <el-input v-model='editForm.funcName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='操作名称' prop='actionName'>
          <el-input v-model='editForm.actionName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='操作对象' prop='objectId'>
          <el-input v-model='editForm.objectId' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='操作时间' prop='operateTime'>
          <el-input v-model='editForm.operateTime' auto-complete='off'></el-input>
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
        <el-form-item label='书名' prop='title'>
          <el-input v-model='addForm.title' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='作者' prop='author'>
          <el-input v-model='addForm.author' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='出版日期' prop='date'>
          <el-input v-model='addForm.date' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='出版社' prop='press'>
          <el-input v-model='addForm.press' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="性别" prop='sex'>
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop='age'>
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" prop='birth'>
          <el-date-picker type="date" v-model="addForm.birth" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label='简介' prop='abs'>
          <el-input type='textarea' v-model='addForm.abs' auto-complete='off'></el-input>
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
  name: 'Logbook',
  data () {
    return {
      filters: {
        name: ''
      },
      logbooks: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        logbookId: '0',
        userName: '',
        className: '',
        methodName: '',
        funcName: '',
        actionName: '',
        objectId: '',
        operateTime: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        userName: '',
        className: '',
        methodName: '',
        funcName: '',
        actionName: '',
        objectId: '',
        operateTime: ''
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
      this.getLogbooks()
    },
    // 获取用户列表
    getLogbooks () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/authority/logbook/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.logbooks = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/authority/logbook/select').then(res => {
        if (res && res.status === 200) {
          _this.logbooks = res.data
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
        let para = { id: row.logbookId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/logbook/delete', {
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
        userName: '',
        className: '',
        methodName: '',
        funcName: '',
        actionName: '',
        objectId: '',
        operateTime: ''
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
            this.$axios.post('/authority/logbook/update', {
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
              this.getLogbooks()
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
            this.$axios.post('/authority/logbook/insert', {
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
              this.getLogbooks()
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
      var ids = this.sels.map(item => item.logbookId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/logbook/delete', {
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
    this.getLogbooks()
  }
}
</script>

<style scoped>
</style>
