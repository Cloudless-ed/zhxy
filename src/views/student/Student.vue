<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/student"}'>学生管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='学生姓名'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getStudents'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="students" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type='expand'>
          <template slot-scope='props'>
            <el-form label-position='left' inline>
              <el-form-item>
                <span>{{ props.row.studentDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop='studentCode' label='学生学号' width='120' sortable></el-table-column>
        <el-table-column prop='studentName' label='学生姓名' width='120' sortable></el-table-column>
        <el-table-column prop='sexFlag' label='性别' width='120' sortable></el-table-column>
        <el-table-column prop='birthDate' label='出生日期' width='120' sortable></el-table-column>
        <el-table-column prop='nation.nationName' label='民族' width='120' sortable></el-table-column>
        <el-table-column prop='political.politicalName' label='政治面貌' width='120' sortable></el-table-column>
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
        <el-form-item label='学生学号' prop='studentCode'>
          <el-input v-model='editForm.studentCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生姓名' prop='studentName'>
          <el-input v-model='editForm.studentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生昵称' prop='studentNick'>
          <el-input v-model='editForm.studentNick' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="学生性别" prop='sexFlag'>
          <el-radio-group v-model="editForm.sexFlag">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop='birthDate'>
          <el-date-picker type="date" v-model="editForm.birthDate" placeholder="选择日期"></el-date-picker>
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
          <!-- <el-input v-model='editForm.address' auto-complete='off'></el-input> -->
          <el-cascader v-model="address" :options="addressData" @change1="handleChange1" style="width:40%;"></el-cascader>
        </el-form-item>
        <el-form-item label="邮政编码" prop='postalCode'>
          <el-input v-model='editForm.postalCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生简介' prop='studentDesc'>
          <el-input type='textarea' v-model='editForm.studentDesc' auto-complete='off'></el-input>
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
        <el-form-item label='学生学号' prop='studentCode'>
          <el-input v-model.number.trim='addForm.studentCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生姓名' prop='studentName'>
          <el-input v-model.trim='addForm.studentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生昵称' prop='studentNick'>
          <el-input v-model.trim='addForm.studentNick' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="学生性别" prop='sexFlag'>
          <el-radio-group v-model="addForm.sexFlag">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop='birthDate'>
          <el-date-picker type="date" v-model="addForm.birthDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label='身份证号' prop='idcardNo'> -->
        <el-form-item label='身份证号' prop='idcardNo'>
          <el-input v-model.trim='addForm.idcardNo' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='民族' prop='nation'>
          <el-input v-model.trim='addForm.nation' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='政治面貌' prop='political'>
          <el-input v-model.trim='addForm.political' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='移动电话' prop='mobile'>
          <el-input v-model.trim='addForm.mobile' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='联系电话' prop='telephone'>
          <el-input v-model.trim='addForm.telephone' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop='email'>
          <el-input v-model.trim='addForm.email' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="办公地址" prop='address'>
          <el-cascader size="large" :options="options"  v-model="address" @change="handleChange"></el-cascader>
          <!-- <el-input v-model='addForm.address' auto-complete='off'></el-input> -->
        </el-form-item>
        <el-form-item label="邮政编码" prop='postalCode'>
          <el-input v-model.trim='addForm.postalCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学生简介' prop='studentDesc'>
          <el-input type='textarea' v-model='addForm.studentDesc' auto-complete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='addFormVisible = false'>取消</el-button>
        <el-button type='primary' @click.native='addSubmit(addForm)' :loading='addLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { regionData } from 'element-china-area-data'
export default {
  name: 'Student',
  data () {
    var validataName = (rule, value, callback) => {
      var patt1 = /^[\u4e00-\u9fa5]+$/
      if (!value.match(patt1)) {
         callback(new Error('请输入姓名'))
        } else {
         callback()
       }
     }
     var phvalidateMobilePhoneone = (rule, value, callback) => {
    // console.log('rule',rule);
    // console.log('value',value);
    var patt1 = /^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    console.log('============', value.match(patt1))
    if (!value.match(patt1)) {
      callback(new Error('请输入有效的手机号码'))
    } else {
      callback()
    }
   }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('机构电话不可为空'))
        } else {
          if (value !== '') {
            var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
            if (!reg.test(value)) {
              callback(new Error('请输入正确的手机号或者座机号格式为：0000-0000000'))
            }
          }
          callback()
        }
      }
    return {
       options: regionData,
       selectedOptions: [],
      filters: {
         name: ''
      },
      students: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [
                 { required: true, message: '请输入学生姓名', trigger: 'blur' }
              ]
      },
      // 编辑界面数据
      editForm: {
        studentId: '0',
        studentCode: '',
        studentName: '',
        studentNick: '',
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        studentDesc: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        studentCode: [
                     { required: true, message: '请输入学生学号' },
                     { type: 'number', message: '学生学号为数字值' }
                    //  { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
         studentName: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        studentNick: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
               email: [
                       { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                      ],
           sexFlag: [
                     { required: true, message: 'aaaa' }
        ],
         nation: [
                     { required: true, message: '请输入民族' },
                     { validator: validataName, trigger: 'blur' }
        ],
          telephone: [{required: true, message: '请输入联系方式'},
                       { validator: phvalidateMobilePhoneone, trigger: 'blur' }],
        birthDate: [{required: true, message: '请输入日期'}],
        mobile: [{required: true, message: '请输入联系方式'},
                 { validator: validatePhone, trigger: 'blur' }],
       idcardNo: [{required: true, message: '请输入身份证ID'},
         {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确'}
        ],
        postalCode: [
          {required: true, message: '请输入邮政编码'},
         {pattern: /^[0-9]\d{5}(?!\d)$/, message: '邮政编码输入格式不正确'}
          ],
          political: [
            { required: true, message: '请输入政治面貌', trigger: 'blur' }, // required: true,必输项，前面显示红星
            { validator: validataName, trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        studentCode: '',
        studentName: '',
        studentNick: '',
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        studentDesc: ''
      }
    }
  },
  methods: {
    // 性别显示转换
    formatSex: function (row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    // handleCurrentChange触发分页功能
    handleCurrentChange (val) {
      this.page = val
      this.getStudents()
    },
    // 获取用户列表
    getStudents () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/student/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.students = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/student/select').then(res => {
        if (res && res.status === 200) {
          _this.students = res.data
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
        let para = { id: row.studentId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/student/delete', {
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
        studentCode: '',
        studentName: '',
        studentNick: '',
        sexFlag: '',
        birthDate: '',
        idcardNo: '',
        nation: '',
        political: '',
        mobile: '',
        telephone: '',
        email: '',
        address: '',
        postalCode: '',
        studentDesc: ''
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
            this.$axios.post('/student/student/update', {
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
              this.getStudents()
            })
          })
        }
      })
    },
    // 新增
    addSubmit: function (addForm) {
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
            this.$axios.post('/student/student/insert', {
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
              this.getStudents()
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
      var ids = this.sels.map(item => item.studentId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/student/delete', {
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
    this.getStudents()
  }
}
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
