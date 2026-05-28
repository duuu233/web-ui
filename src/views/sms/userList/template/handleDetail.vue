<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <i class="el-icon-edit-outline"></i>
      <span v-if="pageType == 1">添加用户</span>
      <span v-else-if="pageType == 2">编辑用户</span>
      <span v-else-if="pageType == 3">查看用户</span>
    </el-card>
    <el-card class="box-card">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        label-width="180px"
        size="small"
      >
        <el-form-item label="用户昵称" prop="nickName">
          <el-input
            placeholder="用户昵称"
            clearable
            class="input-width"
            :disabled="pageType === 3"
            v-model="formData.nickName"
          ></el-input>
        </el-form-item>

        <el-form-item label="修改密码" prop="passwordEdit">
          <el-input
            placeholder="请输入修改后的账号密码"
            class="input-width"
            clearable
            show-password
            v-model="formData.passwordEdit"
          >
          </el-input>
          <i style="padding-left: 10px;">修改提交成功后将覆盖原有密码！</i>
        </el-form-item>

        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            placeholder="请输入邮箱"
            class="input-width"
            clearable
            :disabled="pageType === 3"
            v-model="formData.userEmail"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="pageType != 3"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { valiNumber } from '@/utils/validate'
import { getUserDetails, setUserInfo } from '@/api/userList'
import { setAppVersionEdit, getAppVersionDetail } from '@/api/appVersion'
import md5 from 'js-md5'
export default {
  props: {
    pageType: {
      type: Number,
      default: 3
    }
  },
  components: {},
  data() {
    return {
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        passwordEdit: [
          { required: false, message: '请输入账号密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '请输入6位长度以上的密码',
            trigger: 'blur'
          }
        ]
      },
      formData: {},

      isCreated: false
    }
  },
  activated() {
    // if (this.$route.query.update == 0) return
    if (!this.isCreated) {
      if(this.pageType!==1){
        this.getData()
      }
    }
    this.isCreated = false
  },
  deactivated() {
    this.isCreated = false
  },
  created() {
    if (this.pageType !== 1) {
      this.getData()
    }

    this.isCreated = true
    // this.aplicationType = this.$route.query.type
  },
  filters: {},
  methods: {
    async getData() {
      const res = await getUserDetails({ id: this.$route.query.id })
      this.formData = res.retData || {}
    },
    submitForm() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          if (this.formData.passwordEdit) {
            this.formData.password = md5(this.formData.passwordEdit)
            delete this.formData.passwordEdit
          }
          const res = await setUserInfo(this.formData)

          let message = this.pageType === 1 ? '新增成功' : '编辑成功'
          this.$message({
            message: message,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.push({
              path: '/sms/userList'
            })
          }, 1600)
        } else {
          console.log('提交失败')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-box {
  text-align: center;
}
.box-card {
  margin-top: 10px;
}
</style>
