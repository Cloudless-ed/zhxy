<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/exercise"}'>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>习题管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='习题标题'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getExercises'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="exercises" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='classify.classifyName' label='体系名称' width='120' sortable></el-table-column>
        <el-table-column prop='grade.gradeName' label='年级名称' width='120' sortable></el-table-column>
        <el-table-column prop='exerciseFlag' label='习题类别' width='120' sortable></el-table-column>
        <el-table-column prop='exerciseDesc' label='习题标题' width='120' sortable></el-table-column>
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
        <el-form-item label='体系名称' prop='classify'>
          <el-input v-model='editForm.classify' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='年级名称' prop='grade'>
          <el-input v-model='editForm.grade' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="习题类别" prop='exerciseFlag'>
          <el-radio-group v-model="editForm.exerciseFlag">
            <el-radio class="radio" :label="0">说明题</el-radio>
            <el-radio class="radio" :label="1">单选题</el-radio>
            <el-radio class="radio" :label="2">多选题</el-radio>
            <el-radio class="radio" :label="3">填空题</el-radio>
            <el-radio class="radio" :label="4">主观题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='关 键 词' prop='exerciseWord'>
          <el-input v-model='editForm.exerciseWord' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='习题标题' prop='exerciseDesc'>
          <el-input v-model='editForm.exerciseDesc' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='习题答案' prop='exerciseKey'>
          <el-input v-model='editForm.exerciseKey' auto-complete='off'></el-input>
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
        <el-form-item label='体系名称' prop='classify'>
          <el-input v-model='addForm.classify' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='年级名称' prop='grade'>
          <el-input v-model='addForm.grade' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="习题类别" prop='exerciseFlag'>
          <el-radio-group v-model="addForm.exerciseFlag">
            <el-radio class="radio" :label="0">说明题</el-radio>
            <el-radio class="radio" :label="1">单选题</el-radio>
            <el-radio class="radio" :label="2">多选题</el-radio>
            <el-radio class="radio" :label="3">填空题</el-radio>
            <el-radio class="radio" :label="4">主观题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='关 键 词' prop='exerciseWord'>
          <el-input v-model='addForm.exerciseWord' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='习题标题' prop='exerciseDesc'>
          <el-input v-model='addForm.exerciseDesc' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='习题答案' prop='exerciseKey'>
          <el-input type="textarea" v-model='addForm.exerciseKey' auto-complete='off' maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='备注' prop='memo'>
          <el-input type='textarea' v-model='addForm.memo' auto-complete='off' maxlength="500" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <!-- <el-button type="primary" @click="toExerciseFile()">操作</el-button> -->
        <el-button @click.native='addFormVisible = false,resetForm("addForm")'>取消</el-button>
        <el-button type='primary' @click.native='addSubmit' :loading='addLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'Exercise',
  data () {
    return {
      exercises: [
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
      filters: {
        name: ''
      },
      // exercises: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入习题标题', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        exerciseId: '0',
        classify: '',
        grade: '',
        exerciseFlag: '',
        exerciseWord: '',
        exerciseDesc: '',
        exerciseKey: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入习题标题', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        classify: '',
        grade: '',
        exerciseFlag: '',
        exerciseWord: '',
        exerciseDesc: '',
        exerciseKey: '',
        memo: '',
      },
      addFormRules:{
        classify:[
          { required: true, message: '请输入体系名称', trigger: 'blur' }
        ],
        grade:[
          { required: true, message: '请输入年级名称', trigger: 'blur' }
        ],
        exerciseFlag:[
          { required: true, message: '请选择习题类别', trigger: 'blur' }
        ],
        exerciseWord:[
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        exerciseDesc:[
          { required: true, message: '请输入习题标题', trigger: 'blur' }
        ],
        exerciseKey:[
          { required: true, message: '请输入习题答案', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // toExerciseFile(){
    //     this.$router.replace('/exerciseFile')
    // },
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
      this.getExercises()
    },
    // 获取用户列表
    getExercises () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/library/exercise/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.exercises = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.post('/api/library/exercise/select',{
        pageId:'1',
        limit:'1',
        searchKey:'1'
      }).then(res => {
        if (res && res.status === 200) {
          _this.exercises = res.data
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
        let para = { id: row.exerciseId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/api/library/exercise/delete', {
          // id: para.id
          exerciseId:para.exerciseId
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
        path:'/exerciseFile?id=' + row.id
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        classify: '',
        grade: '',
        exerciseFlag: '',
        exerciseWord: '',
        exerciseDesc: '',
        exerciseKey: '',
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
            this.$axios.post('/api/library/exercise/update', {
              // id: para.id,
              // cover: para.cover,
              // title: para.title,
              // author: para.author,
              // date: para.date,
              // press: para.press,
              // abs: para.abs,
              // category: para.category
              exerciseId:para.exerciseId,
              classifyId:para.classifyId,
              gradeId:para.gradeId,
              exerciseFlag:para.exerciseFlag,
              exerciseWord:para.exerciseWord,
              exerciseDesc:para.exerciseDesc,
              exerciseKey:para.exerciseKey,
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
              this.getExercises()
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
            this.$axios.post('/api/library/exercise/insert', {
              // id: para.id,
              // cover: para.cover,
              // title: para.title,
              // author: para.author,
              // date: para.date,
              // press: para.press,
              // abs: para.abs,
              // category: para.category
              classifyId:para.classifyId,
              gradeId:para.gradeId,
              exerciseFlag:para.exerciseFlag,
              exerciseWord:para.exerciseWord,
              exerciseDesc:para.exerciseDesc,
              exerciseKey:para.exerciseKey,
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
              this.getExercises()
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
      var ids = this.sels.map(item => item.exerciseId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/api/library/exercise/delete', {
          // id: para.ids
          exerciseId:para.exerciseId
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
    this.getExercises()
  }
}
</script>

<style scoped>
</style>
