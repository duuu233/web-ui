<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <i class="el-icon-edit-outline"></i>
      <span v-if="$route.query.type == 'add'">添加版本信息</span>
      <span v-else-if="$route.query.type == 'edit'">编辑版本信息</span>
    </el-card>
    <el-card class="box-card">
      <el-form
        :model="appForm"
        ref="refappForm"
        :rules="rules"
        label-width="180px"
        size="small"
      >
        <!-- <el-form-item label="上次更新版本号" prop="lastComVersion">
          <el-input
            placeholder="请输入上次更新版本号"
            class="input-width"
            v-model="appForm.lastComVersion"
          ></el-input>
          <i style="padding-left: 6px; font-size: 12px; color: #909399"
            >(版本号填写格式如:V2.0.0)</i
          >
        </el-form-item> -->

        <el-form-item label="版本号" prop="versionNumber">
          <el-input
            placeholder="请输入版本号"
            class="input-width"
            v-model="appForm.versionNumber"
          ></el-input>
          <i style="padding-left: 6px; font-size: 12px; color: #909399"
            >(版本号填写格式如:V2.0.0)</i
          >
        </el-form-item>

        <el-form-item label="发布终端" prop="terminal">
          <el-radio-group style="height: 32px;" v-model="appForm.terminal">
            <el-radio
              key="1"
              :aria-hidden="true"
              style="height: 32px;line-height: 32px;"
              :label="1"
              >Android</el-radio
            >
            <el-radio
              :aria-hidden="true"
              key="2"
              style="height: 32px;line-height: 32px;"
              :label="2"
              >IOS</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用商店地址" prop="attachment">
          <el-input
            placeholder="请输入应用商店地址"
            style="width:350px"
            v-model="appForm.attachment"
            type="textarea"
            :rows="6"
            maxlength="100"
            show-word-limit
          ></el-input>
          <!-- <file-upload
            v-model="appForm.attachment"
            :defaultAttachmentName="appForm.attachmentName"
            @getAttachmentName="getAttachmentName"
          ></file-upload> -->
        </el-form-item>

        <!-- <el-form-item label="图片" prop="fileList">
          <multi-upload v-model="appForm.fileList" :maxCount="5"></multi-upload>
        </el-form-item> -->

        <div
          class="clearfix"
          style="
            background-color: #efefef;
            padding-left: 20px;
            margin-bottom: 30px;
          "
        >
          <span>升级任务信息</span>
        </div>
        <el-form-item label="版本编号" prop="grade">
          <el-input
            v-model="appForm.grade"
            placeholder="请输入版本编号"
            class="input-width"
          ></el-input>
          <i style="margin-left: 20px;font-size: 12px;"
            >新增版本需填写版本编号确保新版本编号大于老版本编号即可，只支持1以上数字。</i
          >
        </el-form-item>
        <!-- <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker
            style="width: 217px"
            v-model="appForm.releaseTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd"
            placeholder="请发布时间"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item
          label="升级类型"
          prop="compulsory"
          class="form-item-radio"
        >
          <!-- 1=强制升级 2=强提示升级 3=提示升级 4=不提示升级  -->
          <el-radio-group style="height: 32px;" v-model="appForm.compulsory">
            <el-radio style="height: 32px;line-height: 32px;" :label="1"
              >强制升级</el-radio
            >
            <!-- <el-radio style="height: 32px;line-height: 32px;" :label="2"
              >强提示升级</el-radio
            > -->
            <el-radio style="height: 32px;line-height: 32px;" :label="3"
              >普通升级</el-radio
            >
            <!-- <el-radio style="height: 32px;line-height: 32px;" :label="4"
              >不提示升级</el-radio
            > -->
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="升级提示语" prop="upgradeTips">
          <el-input
            placeholder="请输入升级提示语"
            v-model="appForm.upgradeTips"
            type="textarea"
            class="input-width"
            :rows="4"
          ></el-input>
        </el-form-item> -->

        <el-form-item>
          <!-- <el-button>取消</el-button> -->
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { valiNumber } from '@/utils/validate'
import { getAppMarketList } from '@/api/applicationStore'
import { setAppVersionEdit, getAppVersionDetail } from '@/api/appVersion'
import fileUpload from '@/components/Upload/fileUpload'
import multiUpload from '@/components/Upload/multiUpload'
const appForm = {
  appTypeId: null,
  attachment: null,
  fileList: [],
  compulsory: null,
  id: null,
  releaseTime: null,
  terminal: null,
  upgradeTips: null,
  versionNumber: null,
  lastComVersion: null,
  grade: null,
  appMarketIdList: '' //应用市场id组合
}
export default {
  name: 'config',
  components: { multiUpload },
  data() {
    const _grade = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          return callback(new Error('版本编号不能为空'))
        } else if (!valiNumber(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value * 1 > 2147483647) {
            callback(new Error('最大值为2147483647'))
          } else {
            callback()
          }
        }
      }, 400)
    }
    return {
      rules: {
        attachment: [
          { required: true, message: '请输入apk应用商店地址', trigger: 'blur' }
        ],
        compulsory: [
          { required: true, message: '请选择升级类型', trigger: 'change' }
        ],
        releaseTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ],
        terminal: [
          { required: true, message: '请选择客户端', trigger: 'change' }
        ],
        upgradeTips: [
          { required: true, message: '请输入升级提示语', trigger: 'blur' }
        ],

        fileList: [
          {
            type: 'array',
            required: false,
            message: '请上传图片',
            trigger: 'blur'
          }
        ],

        versionNumber: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        codeUrl: [
          { required: true, message: '请上传二维码图片', trigger: 'change' }
        ],

        lastComVersion: [
          { required: true, message: '请输入上次更新版本号', trigger: 'blur' }
        ],
        grade: [{ required: true, validator: _grade, trigger: 'blur' }]
      },
      appForm: Object.assign({}, appForm),
      loading: true,
      urlData: [],
      selectData: [],
      clientData: [],
      reminderData: [],
      editType: null,
      applicationId: null,
      aplicationType: null,
      isCreated: false
    }
  },
  activated() {
    if (!this.isCreated) {
      this.aplicationType = this.$route.query.type
      if (this.$route.query.applicationId) {
        this.applicationId = this.$route.query.applicationId
        this.getApplication()
      }
    }
    this.isCreated = false
  },
  created() {
    this.isCreated = true
    this.aplicationType = this.$route.query.type
    if (this.$route.query.applicationId) {
      this.applicationId = this.$route.query.applicationId
      this.getApplication()
    }
  },
  filters: {},
  methods: {
    getAttachmentName(v) {
      if (v) {
        this.appForm.attachmentName = v
      }
    },
    getApplicationList() {
      // 内容做展示判断处理
      this.appForm.terminal == 1
        ? (this.editType = true)
        : (this.editType = false)
      var form = {
        pageIndex: 1,
        pageSize: 10,
        appTypeId: this.appForm.appTypeId,
        terminal: this.appForm.terminal
      }
      // getAppMarketList(form).then(response => {
      //   if (response.retCode == 200) {
      //     this.urlData = response.retData.pageData
      //     var arr = []
      //     if (this.urlData) {
      //       for (let item of this.urlData) {
      //         arr.push(item.id)
      //       }
      //     }
      //     let form = Object.assign({}, this.appForm)
      //     form.appMarketIdList = arr.join(',')
      //     this.appForm = form
      //   }
      // })
    },
    getApplication() {
      getAppVersionDetail({ id: this.applicationId }).then(res => {
        if (res.retCode == 200) {
          this.getApplicationList()
          let fileList = []

          if (res.retData.fileList && res.retData.fileList.length) {
            res.retData.fileList.map(v => {
              fileList.push({
                url: v,
                name: '图片'
              })
            })
          }

          this.appForm = Object.assign({}, res.retData)
          this.appForm.fileList = fileList
        }
      })
    },
    submitForm() {
      this.$refs.refappForm.validate(valid => {
        if (valid) {
          let form = Object.assign({}, this.appForm)
          form.attachmentName = this.appForm.attachment
          form.fileList = []
          if (this.appForm.fileList && this.appForm.fileList.length) {
            this.appForm.fileList.map(v => {
              form.fileList.push(v.url)
            })
          }
          form.upgradeTips = '默认升级提示语'

          form.lastComVersion = '1.0.0'
          setAppVersionEdit(form).then(response => {
            if (response.retCode === 200) {
              this.form = {}
              this.$refs.refappForm.resetFields()
              this.urlData = []
              let message =
                this.aplicationType == 'edit' ? '编辑成功' : '新增成功'
              this.$message({
                message: message,
                type: 'success',
                duration: 1000
              })
              this.$router.push({
                path: '/sms/appVersion'
              })
            }
          })
        } else {
          console.log('error submit!!')
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
