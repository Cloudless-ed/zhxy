<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to='{path: "/video"}'>资源管理</el-breadcrumb-item>
            <el-breadcrumb-item :to='{path: "/video"}'>视频资源</el-breadcrumb-item>
            <el-breakcrumb-item>视频文件</el-breakcrumb-item>
        </el-breadcrumb>
    </el-row>
    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='视频文件'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getvideos'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="videos" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type='expand'>
          <template slot-scope='props'>
            <el-form label-position='left' inline>
              <el-form-item>
                <span>{{ props.row.videoDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop='classify.classifyName' label='视频名称' width='120' sortable></el-table-column>
        <el-table-column prop='grade.gradeName' label='视频说明' width='120' sortable></el-table-column>
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
    <!--新增界面-->
    <el-dialog title='新增' :visible.sync='addFormVisible' :close-on-click-modal='false' @close="resetForm('addForm')">
      <el-form :model='addForm' label-width='80px' :rules='addFormRules' ref='addForm'>
        <el-form-item label="视频文件" prop="uploadFile">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="primary">上传视频</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item label='视频说明' prop='memo'>
          <el-input type='textarea' v-model='addForm.memo' auto-complete='off' maxlength="100" show-word-limit></el-input>
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
    name: 'cartoonFile',
    data () {
      return {
        filters: {
          name: ''
        },
        videos: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          name: [{ required: true, message: '请输入微课名称', trigger: 'blur' }]
        },
        // 编辑界面数据
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [{ required: true, message: '请输入微课名称', trigger: 'blur' }]
        },
        // 新增界面数据
        addForm: {
          classify: '',
          grade: '',
          videoName: '',
          videoWord: '',
          videoDesc: '',
          memo: '',
          uploadFile:[]
        },
        // addFormRules:{
        //   uploadFile:[
        //     { required: true, message: '请上传视频文件', trigger: 'blur' }
        //   ],
        // }
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
        this.getvideos()
      },
      // 获取用户列表
      getvideos () {
        this.listLoading = true
        var _this = this
        /*
        this.$axios.post('/library/video/select', {
            page: this.page,
            name: this.filters.name
          }).then(res => {
            if (res.data.code === 200) {
              _this.videos = res.data
            }
          }).catch(failResponse => {})
          */
        this.$axios.get('/api/library/video/select').then(res => {
          if (res && res.status === 200) {
            _this.videos = res.data
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
          let para = { id: row.videoId }
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios.post('/api/library/video/delete', {
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
          classify: '',
          grade: '',
          videoName: '',
          videoWord: '',
          videoDesc: '',
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
              this.$axios.post('/api/library/video/update', {
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
                this.getvideos()
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
              this.$axios.post('/api/library/video/insert', {
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
                this.getvideos()
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
        var ids = this.sels.map(item => item.videoId).toString()
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start()
          let para = { ids: ids }
          // eslint-disable-next-line no-undef
          // 提交数据到后台
          this.$axios.post('/api/library/video/delete', {
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
      this.getvideos()
    }
  }
</script>
<style>
</style>