<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/award"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人荣誉</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='学生姓名'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getAwards'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="awards" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='awardDate' label='获奖日期' width='120' sortable></el-table-column>
        <el-table-column prop='awardFlag' label='荣誉类别' width='120' sortable></el-table-column>
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
        <el-form-item label="获奖日期" prop='awardDate'>
          <el-date-picker type="date" v-model="editForm.awardDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="荣誉类别" prop='awardFlag'>
          <el-radio-group v-model="editForm.awardFlag">
            <el-radio class="radio" :label="0">三好学生</el-radio>
            <el-radio class="radio" :label="1">优秀团员（队员）</el-radio>
            <el-radio class="radio" :label="2">优秀班干部</el-radio>
            <el-radio class="radio" :label="3">省级优秀学生</el-radio>
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
        <el-form-item label="获奖日期" prop='awardDate'>
          <el-date-picker type="date" v-model="addForm.awardDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="荣誉类别" prop='awardFlag'>
           <el-select v-model="addForm.awardFlag" placeholder="请选择">
              <el-option
                  v-for="item in awardFlaglist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <!-- <el-radio-group v-model="addForm.awardFlag">
            <el-radio class="radio" :label="0">三好学生</el-radio>
            <el-radio class="radio" :label="1">优秀团员（队员）</el-radio>
            <el-radio class="radio" :label="2">优秀班干部</el-radio>
            <el-radio class="radio" :label="3">省级优秀学生</el-radio>
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
  name: 'Award',
  data () {
    return {
      // 荣誉类别
       awardFlaglist: [{
          value: '三好学生',
          label: '三好学生'
         },
          {
          value: '优秀团员（队员）',
          label: '优秀团员（队员）'
         },
          {
          value: '优秀班干部',
          label: '优秀班干部'
      }],
      filters: {
        name: ''
      },
      awards: [],
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
        awardId: '0',
        student: '',
        awardDate: '',
        awardFlag: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        student: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        awardDate: [{ required: true, message: '请输入获奖日期', trigger: 'blur' }],
        awardFlag: [{ required: true, message: '请输入荣誉类别', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        student: '',
        awardDate: '',
        awardFlag: '',
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
      this.getAwards()
    },
    // 获取用户列表
    getAwards () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/award/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.awards = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/award/select').then(res => {
        if (res && res.status === 200) {
          _this.awards = res.data
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
        let para = { id: row.awardId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/award/delete', {
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
        awardDate: '',
        awardFlag: '',
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
            this.$axios.post('/student/award/update', {
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
              this.getAwards()
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
            this.$axios.post('/student/award/insert', {
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
              this.getAwards()
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
      var ids = this.sels.map(item => item.awardId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/award/delete', {
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
    this.getAwards()
  }
}
</script>

<style scoped>
.el-select{
  width: 100%;
}
</style>
