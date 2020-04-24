<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/honor"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>班级荣誉</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='班级名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getHonors'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="honors" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='classOwner.className' label='班级名称' width='120' sortable></el-table-column>
        <el-table-column prop='honorDate' label='获奖日期' width='120' sortable></el-table-column>
        <el-table-column prop='honorFlag' label='荣誉类别' width='120' sortable></el-table-column>
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
        <el-form-item label='班级名称' prop='classOwner'>
          <el-input v-model='editForm.classOwner' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="获奖日期" prop='honorDate'>
          <el-date-picker type="date" v-model="editForm.honorDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="荣誉类别" prop='honorFlag'>
          <el-radio-group v-model="editForm.honorFlag">
            <el-radio class="radio" :label="0">先进班集体</el-radio>
            <el-radio class="radio" :label="1">先进班集体标兵</el-radio>
            <el-radio class="radio" :label="2">五好班级</el-radio>
            <el-radio class="radio" :label="3">十佳示范班级</el-radio>
            <el-radio class="radio" :label="4">市优秀班级</el-radio>
            <el-radio class="radio" :label="5">全国优秀班集体</el-radio>
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
        <el-form-item label='班级名称' prop='classOwner'>
           <el-select v-model="addForm.classOwner" placeholder="请选择">
              <el-option
                  v-for="item in classOwnerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <!-- <el-input v-model='addForm.classOwner' auto-complete='off'></el-input> -->
        </el-form-item>
        <el-form-item label="获奖日期" prop='honorDate'>
          <el-date-picker type="date" v-model="addForm.honorDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="荣誉类别" prop='honorFlag'>
           <el-select v-model="addForm.honorFlag" placeholder="请选择">
              <el-option
                  v-for="item in honorFlaglist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <!-- <el-radio-group v-model="addForm.honorFlag">
            <el-radio class="radio" :label="0">先进班集体</el-radio>
            <el-radio class="radio" :label="1">先进班集体标兵</el-radio>
            <el-radio class="radio" :label="2">五好班级</el-radio>
            <el-radio class="radio" :label="3">十佳示范班级</el-radio>
            <el-radio class="radio" :label="4">市优秀班级</el-radio>
            <el-radio class="radio" :label="5">全国优秀班集体</el-radio>
          </el-radio-group> -->
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
  name: 'Honor',
  data () {
    return {
      // 荣誉类别
      honorFlaglist: [{
          value: '先进班集体',
          label: '先进班集体'
         },
          {
          value: '先进班集体标兵',
          label: '先进班集体标兵'
         },
          {
          value: '五好班级',
          label: '五好班级'
      }],
       // 班级名称
      classOwnerlist: [{
          value: '网络1班',
          label: '网络1班'
         },
          {
          value: '网络2班',
          label: '网络2班'
         },
          {
          value: '网络3班',
          label: '网络3班'
      }],
      filters: {
        name: ''
      },
      honors: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        honorId: '0',
        classOwner: '',
        honorDate: '',
        honorFlag: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
         classOwner: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        honorDate: [{ required: true, message: '请输入获奖日期', trigger: 'blur' }],
        honorFlag: [{ required: true, message: '请输入荣誉类别', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        classOwner: '',
        honorDate: '',
        honorFlag: '',
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
      this.getHonors()
    },
    // 获取用户列表
    getHonors () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/honor/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.honors = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/honor/select').then(res => {
        if (res && res.status === 200) {
          _this.honors = res.data
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
        let para = { id: row.honorId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/honor/delete', {
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
        classOwner: '',
        honorDate: '',
        honorFlag: '',
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
            this.$axios.post('/student/honor/update', {
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
              this.getHonors()
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
            this.$axios.post('/student/honor/insert', {
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
              this.getHonors()
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
      var ids = this.sels.map(item => item.honorId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/honor/delete', {
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
    this.getHonors()
  }
}
</script>

<style scoped>
.el-select{
  width: 100%;
}
</style>
