<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/disciproom"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>寝室纪律</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='寝室名称'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getDisciprooms'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="disciprooms" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
        <el-table-column prop='room.roomName' label='寝室名称' width='120' sortable></el-table-column>
        <el-table-column prop='disciplineTime' label='巡检时间' width='120' sortable></el-table-column>
        <el-table-column prop='healthFlag' label='卫生达标' width='120' sortable></el-table-column>
        <el-table-column prop='bedtimeFlag' label='按时就寝' width='120' sortable></el-table-column>
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
        <el-form-item label='寝室名称' prop='room'>
          <el-input v-model='editForm.room' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="巡检时间" prop='disciplineTime'>
          <el-date-picker type="date" v-model="editForm.disciplineTime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="卫生达标" prop='healthFlag'>
          <el-radio-group v-model="editForm.healthFlag">
            <el-radio class="radio" :label="1">好</el-radio>
            <el-radio class="radio" :label="0">坏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="按时就寝" prop='bedtimeFlag'>
          <el-radio-group v-model="editForm.bedtimeFlag">
            <el-radio class="radio" :label="1">好</el-radio>
            <el-radio class="radio" :label="0">坏</el-radio>
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
        <el-form-item label='寝室名称' prop='room'>
          <el-input v-model='addForm.room' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="巡检时间" prop='disciplineTime'>
          <el-date-picker type="date" v-model="addForm.disciplineTime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="卫生达标" prop='healthFlag'>
          <el-radio-group v-model="addForm.healthFlag">
            <el-radio class="radio" :label="1">好</el-radio>
            <el-radio class="radio" :label="0">坏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="按时就寝" prop='bedtimeFlag'>
          <el-radio-group v-model="addForm.bedtimeFlag">
            <el-radio class="radio" :label="1">好</el-radio>
            <el-radio class="radio" :label="0">坏</el-radio>
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
  name: 'Disciproom',
  data () {
    return {
      filters: {
        name: ''
      },
      disciprooms: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入寝室名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        disciproomId: '0',
        room: '',
        disciplineTime: '',
        healthFlag: '',
        bedtimeFlag: '',
        memo: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        room: [{ required: true, message: '请输入寝室名称', trigger: 'blur' }],
        disciplineTime: [{ required: true, message: '请输入巡检时间', trigger: 'blur' }],
        healthFlag: [{ required: true, message: '请输入卫生达标', trigger: 'blur' }],
        bedtimeFlag: [{ required: true, message: '请输入按时就寝', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        room: '',
        disciplineTime: '',
        healthFlag: '',
        bedtimeFlag: '',
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
      this.getDisciprooms()
    },
    // 获取用户列表
    getDisciprooms () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/disciproom/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.disciprooms = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/disciproom/select').then(res => {
        if (res && res.status === 200) {
          _this.disciprooms = res.data
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
        let para = { id: row.disciproomId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/disciproom/delete', {
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
        room: '',
        disciplineTime: '',
        healthFlag: '',
        bedtimeFlag: '',
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
            this.$axios.post('/student/disciproom/update', {
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
              this.getDisciprooms()
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
            this.$axios.post('/student/disciproom/insert', {
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
              this.getDisciprooms()
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
      var ids = this.sels.map(item => item.disciproomId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/disciproom/delete', {
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
    this.getDisciprooms()
  }
}
</script>

<style scoped>
</style>
