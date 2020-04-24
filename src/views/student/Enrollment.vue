<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/enrollment"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>学籍管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='学生学号'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getClasses'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="enrollmentes" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='enrollmentCode' label='学生学号' width='120' sortable></el-table-column>
        <el-table-column prop='enrollmentName' label='学生姓名' width='120' sortable></el-table-column>
        <el-table-column prop='begDate' label='入学日期' width='120' sortable></el-table-column>
        <el-table-column prop='endDate' label='毕业日期' width='120' sortable></el-table-column>
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
        <el-form-item label='学生学号' prop='enrollmentCode'>
          <el-input v-model='editForm.enrollmentCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生姓名' prop='enrollmentName'>
          <el-input v-model='editForm.enrollmentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="入学日期" prop='begDate'>
          <el-date-picker type="date" v-model="editForm.begDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业日期" prop='endDate'>
          <el-date-picker type="date" v-model="editForm.endDate" placeholder="选择日期"></el-date-picker>
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
        <el-form-item label='学生学号' prop='enrollmentCode'>
          <el-input type="number" v-model.trim='addForm.enrollmentCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生姓名' prop='enrollmentName'>
          <el-input v-model.trim='addForm.enrollmentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="入学日期" prop='begDate'>
          <el-date-picker type="date" v-model="addForm.begDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业日期" prop='endDate'>
          <el-date-picker type="date" v-model="addForm.endDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label='备注' prop='memo'>
          <el-input type='textarea' v-model.trim='addForm.memo' auto-complete='off'></el-input>
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
  name: 'Class',
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
      enrollmentes: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
      //   enrollmentCode: [
      //                { required: true, message: '请输入学生学号' },
      //                { type: 'number', message: '学生学号为数字值' }
      //               //  { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      //   ],
      //  enrollmentName: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
      //                  { validator: validataName, trigger: 'blur' },
      //                  { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        enrollmentId: '0',
        enrollmentCode: '',
        enrollmentName: '',
        begDate: '',
        endDate: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        enrollmentCode: [
                     { required: true, message: '请输入学生学号' },
                     { min: 1, max: 20, message: '请输入正确的学生学号 长度为1-20', trigger: 'blur' }
        ],
        enrollmentName: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
         begDate: [{ required: true, message: '请输入入学日期', trigger: 'blur' }],
         endDate: [{ required: true, message: '请输入毕业日期', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        enrollmentCode: '',
        enrollmentName: '',
        begDate: '',
        endDate: '',
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
      this.getClasses()
    },
    // 获取用户列表
    getClasses () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/enrollment/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.enrollmentes = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/enrollment/select').then(res => {
        if (res && res.status === 200) {
          _this.enrollmentes = res.data
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
        let para = { id: row.enrollmentId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/enrollment/delete', {
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
        enrollmentCode: '',
        enrollmentName: '',
        begDate: '',
        endDate: '',
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
            this.$axios.post('/student/enrollment/update', {
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
              this.getClasses()
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
            this.$axios.post('/student/enrollment/insert', {
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
              this.getClasses()
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
      var ids = this.sels.map(item => item.enrollmentId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/enrollment/delete', {
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
    this.getClasses()
  }
}
</script>

<style scoped>
</style>
