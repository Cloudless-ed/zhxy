<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/party"}'>组织机构</el-breadcrumb-item>
        <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='组织名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getPartys'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="partys" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop='partyCode' label='组织编码' width='120' sortable></el-table-column>
        <el-table-column prop='partyName' label='组织名称' width='120' sortable></el-table-column>
        <el-table-column prop='partyParent.partyName' label='上级机构' width='120' sortable></el-table-column>
        <el-table-column prop='partyFlag' label='组织类别' width='120' sortable></el-table-column>
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
        <el-form-item label='组织编码' prop='partyCode'>
          <el-input v-model='editForm.partyCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='组织名称' prop='partyName'>
          <el-input v-model='editForm.partyName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='上级机构' style="display:none;" prop='parentId'>
          <el-input v-model='editForm.parentId' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='上级部门' prop='parentName'>
          <el-input v-model='editForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='组织类别' prop='partyFlag'>
          <el-input v-model='editForm.partyFlag' auto-complete='off'></el-input>
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
        <el-form-item label='组织编码' prop='partyCode'>
          <el-input v-model='addForm.partyCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='组织名称' prop='partyName'>
          <el-input v-model='addForm.partyName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='上级机构' style="display:none;" prop='parentId'>
          <el-input v-model='addForm.parentId' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='上级部门' prop='parentName'>
          <el-input v-model='addForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='组织类别' prop='partyFlag'>
          <el-input v-model='addForm.partyFlag' auto-complete='off'></el-input>
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
  name: 'Party',
  data () {
    return {
      filters: {
        name: ''
      },
      partys: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        partyId: '0',
        partyCode: '',
        partyName: '',
        parentId: '',
        parentName: '',
        partyFlag: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        partyCode: '',
        partyName: '',
        parentId: '',
        parentName: '',
        partyFlag: ''
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
      this.getPartys()
    },
    // 获取用户列表
    getPartys () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/authority/party/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.partys = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/authority/party/select').then(res => {
        if (res && res.status === 200) {
          _this.partys = res.data
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
        let para = { id: row.partyId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/party/delete', {
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
        partyCode: '',
        partyName: '',
        parentId: '',
        parentName: '',
        partyFlag: ''
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
            this.$axios.post('/authority/party/update', {
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
              this.getPartys()
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
            this.$axios.post('/authority/party/insert', {
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
              this.getPartys()
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
      var ids = this.sels.map(item => item.partyId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/party/delete', {
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
    this.getPartys()
  }
}
</script>

<style scoped>
</style>
