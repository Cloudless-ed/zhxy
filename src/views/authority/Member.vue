<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/member"}'>组织机构</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='员工姓名'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getMembers'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="members" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type='expand'>
          <template slot-scope='props'>
            <el-form label-position='left' inline>
              <el-form-item>
                <span>{{ props.row.memberDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop='party.partyCode' label='员工工号' width='120' sortable></el-table-column>
        <el-table-column prop='party.partyName' label='员工姓名' width='120' sortable></el-table-column>
        <el-table-column prop='sexFlag' label='性别' width='120' sortable></el-table-column>
        <el-table-column prop='birthDate' label='出生日期' width='120' sortable></el-table-column>
        <el-table-column prop='nation.nationName' label='民族' width='120' sortable></el-table-column>
        <el-table-column prop='political.politicalName' label='政治面貌' width='120' sortable></el-table-column>
        <el-table-column prop='education.educationName' label='学历' width='120' sortable></el-table-column>
        <el-table-column prop='degree.degreeName' label='学位' width='120' sortable></el-table-column>
        <el-table-column prop='techtitle.techtitleName' label='职称' width='120' sortable></el-table-column>
        <el-table-column prop='telephone' label='联系电话' width='120' sortable></el-table-column>
        <el-table-column prop='email' label='电子邮箱' width='120' sortable></el-table-column>
        <el-table-column prop='address' label='办公地址' width='120' sortable></el-table-column>
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
        <el-form-item label='员工工号' prop='partyName'>
          <el-input v-model='editForm.partyCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='员工姓名' prop='partyName'>
          <el-input v-model='editForm.partyName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='部门名称' style="display:none;" prop='parentId'>
          <el-input v-model='editForm.parentId' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='部门名称' prop='parentName'>
          <el-input v-model='editForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="员工性别" prop='sexFlag'>
          <el-radio-group v-model="editForm.sexFlag">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='出生日期' prop='birthDate'>
          <el-input v-model='editForm.birthDate' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='身份证号' prop='idcardNo'>
          <el-input v-model='editForm.memberIdcardNo' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='民族' prop='nation'>
          <el-input v-model='editForm.nation' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='政治面貌' prop='political'>
          <el-input v-model='editForm.political' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学历' prop='education'>
          <el-input v-model='editForm.education' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学位' prop='degree'>
          <el-input v-model='editForm.degree' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='职称' prop='techtitle'>
          <el-input v-model='editForm.techtitle' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='移动电话' prop='mobile'>
          <el-input v-model='editForm.mobile' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='联系电话' prop='telephone'>
          <el-input v-model='editForm.telephone' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop='email'>
          <el-input v-model='editForm.email' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="办公地址" prop='address'>
          <el-input v-model='editForm.address' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop='postalCode'>
          <el-input v-model='editForm.postalCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='员工简介' prop='memberDesc'>
          <el-input type='textarea' v-model='editForm.memberDesc' auto-complete='off'></el-input>
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
        <el-form-item label='员工工号' prop='partyName'>
          <el-input v-model='addForm.partyCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='员工姓名' prop='partyName'>
          <el-input v-model='addForm.partyName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='部门名称' style="display:none;" prop='parentId'>
          <el-input v-model='addForm.parentId' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='部门名称' prop='parentName'>
          <el-input v-model='addForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="员工性别" prop='sexFlag'>
          <el-radio-group v-model="addForm.sexFlag">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='出生日期' prop='birthDate'>
          <el-input v-model='addForm.birthDate' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='身份证号' prop='idcardNo'>
          <el-input v-model='addForm.memberIdcardNo' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='民族' prop='nation'>
          <el-input v-model='addForm.nation' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='政治面貌' prop='political'>
          <el-input v-model='addForm.political' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学历' prop='education'>
          <el-input v-model='addForm.education' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学位' prop='degree'>
          <el-input v-model='addForm.degree' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='职称' prop='techtitle'>
          <el-input v-model='addForm.techtitle' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='移动电话' prop='mobile'>
          <el-input v-model='addForm.mobile' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='联系电话' prop='telephone'>
          <el-input v-model='addForm.telephone' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop='email'>
          <el-input v-model='addForm.email' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="办公地址" prop='address'>
          <el-input v-model='addForm.address' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop='postalCode'>
          <el-input v-model='addForm.postalCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='员工简介' prop='memberDesc'>
          <el-input type='textarea' v-model='addForm.memberDesc' auto-complete='off'></el-input>
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
  name: 'Member',
  data () {
    return {
      filters: {
        name: ''
      },
      members: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        memberId: '0',
        partyCode: '',
        partyName: '',
        parentId: '',
        parentName: '',
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        education: '',
        degree: '',
        techtitle: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        memberDesc: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        partyCode: '',
        partyName: '',
        parentId: '',
        parentName: '',
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        education: '',
        degree: '',
        techtitle: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        memberDesc: ''
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
      this.getMembers()
    },
    // 获取用户列表
    getMembers () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/authority/member/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.members = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/authority/member/select').then(res => {
        if (res && res.status === 200) {
          _this.members = res.data
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
        let para = { id: row.memberId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/member/delete', {
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
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        education: '',
        degree: '',
        techtitle: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        memberDesc: ''
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
            this.$axios.post('/authority/member/update', {
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
              this.getMembers()
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
            this.$axios.post('/authority/member/insert', {
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
              this.getMembers()
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
      var ids = this.sels.map(item => item.memberId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/authority/member/delete', {
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
    this.getMembers()
  }
}
</script>

<style scoped>
</style>
