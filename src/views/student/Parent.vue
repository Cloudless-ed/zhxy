<template>
  <section>
    <el-row style='margin: 10px 10px 10px 10px;'>
      <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item :to='{path: "/parent"}'>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>家长管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card style='margin: 20px 1%;width: 100%'>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
        <el-form :inline='true' :model='filters'>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='学生姓名'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' v-on:click='getParents'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="parents" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column type='expand'>
          <template slot-scope='props'>
            <el-form label-position='left' inline>
              <el-form-item>
                <span>{{ props.row.parentDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop='student.party.partyName' label='学生姓名' width='120' sortable></el-table-column>
        <el-table-column prop='parentName' label='家长姓名' width='120' sortable></el-table-column>
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
        <el-form-item label='学生姓名' prop='student'>
          <el-input v-model='editForm.student' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='家长姓名' prop='parentName'>
          <el-input v-model='editForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="家长性别" prop='sexFlag'>
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
        <el-form-item label='家长简介' prop='parentDesc'>
          <el-input type='textarea' v-model='editForm.parentDesc' auto-complete='off'></el-input>
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
        <el-form-item label='家长姓名' prop='parentName'>
          <el-input v-model='addForm.parentName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="家长性别" prop='sexFlag'>
          <el-radio-group v-model="addForm.sexFlag">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop='birthDate'>
          <el-date-picker type="date" v-model="addForm.birthDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label='身份证号' prop='idcardNo'>
          <el-input v-model='addForm.idcardNo' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='民族' prop='nation'>
          <el-input v-model='addForm.nation' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='政治面貌' prop='political'>
          <el-input v-model='addForm.political' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='学历' prop='education'>
           <el-select v-model="addForm.education" placeholder="请选择">
              <el-option
                  v-for="item in educationlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <!-- <el-input v-model='addForm.education' auto-complete='off'></el-input> -->
        </el-form-item>
        <el-form-item label='学位' prop='degree'>
           <el-select v-model="addForm.degree" placeholder="请选择">
              <el-option
                  v-for="item in degreelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <!-- <el-input v-model='addForm.degree' auto-complete='off'></el-input> -->
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
          <el-cascader size="large" :options="options"  v-model="addForm.address" @change="handleChange"></el-cascader>
          <!-- <el-input v-model='addForm.address' auto-complete='off'></el-input> -->
        </el-form-item>
        <el-form-item label="邮政编码" prop='postalCode'>
          <el-input v-model='addForm.postalCode' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='家长简介' prop='parentDesc'>
          <el-input type='textarea' v-model='addForm.parentDesc' auto-complete='off'></el-input>
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
import { regionData } from 'element-china-area-data'
export default {
  name: 'Parent',
  data () {
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
     var validataName = (rule, value, callback) => {
      var patt1 = /^[\u4e00-\u9fa5]+$/
      if (!value.match(patt1)) {
         callback(new Error('请输入汉字'))
        } else {
         callback()
       }
     }
    return {
       options: regionData,
      // 学位
      degreelist: [
        {
          value: '学士',
          label: '学士'
        },
        {
          value: '硕士',
          label: '硕士'
        },
        {
          value: '博士',
          label: '博士'
        }
       ],
      // 学历
      educationlist: [
        {
          value: '小学',
          label: '小学'
        },
        {
          value: '初中',
          label: '初中'
        },
        {
          value: '高中',
          label: '高中'
        },
        {
          value: '大学',
          label: '大学'
        }
        ],
      filters: {
        name: ''
      },
      parents: [],
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
        parentId: '0',
        student: '',
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
        parentDesc: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
         student: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
         parentName: [{ required: true, message: '请输入名称', trigger: 'blur' }, // required: true,必输项，前面显示红星
                       { validator: validataName, trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        idcardNo: [{required: true, message: '请输入身份证ID'},
            {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确'}
        ],
        sexFlag: [
                     { required: true, message: 'aaaa' }
        ],
          birthDate: [{required: true}],
        nation: [
                     { required: true, message: '请输入民族' },
                     { validator: validataName, trigger: 'blur' }
        ],
         postalCode: [
          {required: true, message: '请输入邮政编码'},
         {pattern: /^[0-9]\d{5}(?!\d)$/, message: '邮政编码输入格式不正确'}
          ],
          political: [
            { required: true, message: '请输入政治面貌', trigger: 'blur' }, // required: true,必输项，前面显示红星
            { validator: validataName, trigger: 'blur' }],
           email: [ { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                       { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                      ],
           telephone: [{required: true, message: '请输入联系方式'},
                       { validator: phvalidateMobilePhoneone, trigger: 'blur' }],
           mobile: [{required: true, message: '请输入联系方式'},
                       { validator: validatePhone, trigger: 'blur' }]
     },
      // 新增界面数据
      addForm: {
        student: '',
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
        parentDesc: ''
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
      this.getParents()
    },
    // 获取用户列表
    getParents () {
      this.listLoading = true
      var _this = this
      /*
      this.$axios.post('/student/parent/select', {
          page: this.page,
          name: this.filters.name
        }).then(res => {
          if (res.data.code === 200) {
            _this.parents = res.data
          }
        }).catch(failResponse => {})
        */
      this.$axios.get('/student/parent/select').then(res => {
        if (res && res.status === 200) {
          _this.parents = res.data
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
        let para = { id: row.parentId }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/parent/delete', {
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
        parentDesc: ''
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
            this.$axios.post('/student/parent/update', {
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
              this.getParents()
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
            this.$axios.post('/student/parent/insert', {
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
              this.getParents()
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
      var ids = this.sels.map(item => item.parentId).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { ids: ids }
        // eslint-disable-next-line no-undef
        // 提交数据到后台
        this.$axios.post('/student/parent/delete', {
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
    this.getParents()
  }
}
</script>

<style scoped>
.el-select{
  width: 100%;
}
.el-cascader{
  width: 100%;
}
</style>
