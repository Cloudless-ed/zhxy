<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/question"}'>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item :to='{path: "/question"}'>问题管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='习题问题'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getQuestions'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="questions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='exercise.exerciseName' label='习题标题' width='120' sortable></el-table-column>
        <el-table-column prop='questionNo' label='习题序号' width='120' sortable></el-table-column>
        <el-table-column prop='questionDesc' label='习题内容' width='120' sortable></el-table-column>
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
        <el-form-item label='习题标题' prop='exercise'>
          <el-input v-model='editForm.exercise' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="问题序号" prop='questionNo'>
          <el-input-number v-model="editForm.questionNo" :min="0" :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label='问题内容' prop='questionDesc'>
          <el-input type='textarea' v-model='editForm.questionDesc' auto-complete='off'></el-input>
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
    <el-dialog title='新增' :visible.sync='addFormVisible' :close-on-click-modal='false' @close="resetForm('addForm')">
      <el-form :model='addForm' label-width='80px' :rules='addFormRules' ref='addForm'>
        <el-form-item label='习题标题' prop='exercise'>
          <el-input v-model='addForm.exercise' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="问题序号" prop='questionNo'>
          <el-input-number v-model="addForm.questionNo" :min="0" :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label='问题内容' prop='questionDesc'>
          <el-input type='textarea' v-model='addForm.questionDesc' auto-complete='off' maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='备注' prop='memo'>
          <el-input type='textarea' v-model='addForm.memo' auto-complete='off' maxlength="500" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='addFormVisible = false,resetForm("addForm")'>取消</el-button>
        <el-button type='primary' @click.native='addSubmit' :loading='addLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'Question',
  data () {
    return {
      filters: {
        name: ''
      },
       questions: [
        {
          id:1,
          classify:{
            classifyName:'体系名称'
          },
          grade:{
            gradeName:'年级名'
          },
          exerciseFlag:'习题类别',
          exerciseDesc:'习题标题'
        },
        {
          id:2,
          classify:{
            classifyName:'体系名称'
          },
          grade:{
            gradeName:'年级名'
          },
          exerciseFlag:'习题类别',
          exerciseDesc:'习题标题'
        },
        {
          id:3,
          classify:{
            classifyName:'体系名称'
          },
          grade:{
            gradeName:'年级名'
          },
          exerciseFlag:'习题类别',
          exerciseDesc:'习题标题'
        },
        {
          id:4,
          classify:{
            classifyName:'体系名称'
          },
          grade:{
            gradeName:'年级名'
          },
          exerciseFlag:'习题类别',
          exerciseDesc:'习题标题'
        }
      ],
      // questions: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入习题问题', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        questionId: '0',
        exercise: '',
        questionNo: '',
        questionDesc: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入习题问题', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        exercise: '',
        questionNo: '',
        questionDesc: '',
        memo: ''
      },
      addFormRules:{
        exercise:[
        { required: true, message: '请输入习题问题', trigger: 'blur' }
        ],
        questionDesc:[
          { required: true, message: '请输入问题内容', trigger: 'blur' }
        ],
      }
      
    }
  },
  methods: {
    //重置表单
    resetForm(addForm) {
      this.$refs[addForm].resetFields();
    },
    // 性别显示转换
    formatSex: function (row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    handleCurrentChange (val) {
      this.page = val
      this.getQuestions()
    },
    // 获取用户列表
    getQuestions () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/library/question/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.questions = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post('/api/library/question/select',{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.questions = res.data
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
        let para = { id: row.questionId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/api/library/question/delete', {
          // id: para.id
          questionId:para.questionId
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
      this.$router.push({
        path:'/questionFile?id=1' +'----'+ row.id
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        exercise: '',
        questionNo: '',
        questionDesc: '',
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
            this.$axios.post('/api/library/question/update', {
              // id: para.id,
              // cover: para.cover,
              // title: para.title,
              // author: para.author,
              // date: para.date,
              // press: para.press,
              // abs: para.abs,
              // category: para.category
              questionId:para.questionId,
              exerciseId:para.exerciseId,
              questionNo:para.questionNo,
              questionDesc:para.questionDesc,
              memo:para.memo
            }).then(res => {
              this.editLoading = false
              // NProgress.done()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getQuestions()
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
            this.$axios.post('/api/library/question/insert', {
              // id: para.id,
              // cover: para.cover,
              // title: para.title,
              // author: para.author,
              // date: para.date,
              // press: para.press,
              // abs: para.abs,
              // category: para.category
              exerciseId:para.exerciseId,
              questionNo:para.questionNo,
              questionDesc:para.questionDesc,
              memo:para.memo
            }).then(res => {
              this.addLoading = false
              // NProgress.done()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getQuestions()
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
      var ids = this.sels.map(item => item.questionId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/api/library/question/delete', {
          // id: para.ids
          questionId:para.questionId
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
    this.getQuestions()
  }
}
</script>

<style scoped>
</style>
