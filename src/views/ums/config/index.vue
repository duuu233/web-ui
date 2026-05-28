<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>系统设置</span>
      </div>
      <el-form
        :model="form"
        ref="refForm"
        :rules="rules"
        label-width="160px"
        size="small"
      >
        <template v-for="(item, index) in form.configList">
          <el-form-item
            v-if="[1, 2].indexOf(item.configType) !== -1"
            :key="index"
            :label="item.configKey"
            :prop="'configList.' + index + '.configValue'"
            class="basic-classify-item"
            :rules="rules.configList"
          >
            <el-input
              v-show="[2].indexOf(item.configType) != -1"
              placeholder="请输入平台邮箱"
              v-model="item.configValue"
              style="width: 311px"
              maxlength="40"
              show-word-limit
            ></el-input>

            <el-input
              v-show="[1].indexOf(item.configType) != -1"
              placeholder="请输入平台设备id"
              v-model="item.configValue"
              type="textarea"
              :row="2"
              style="width: 311px"
              maxlength="500"
              show-word-limit
            ></el-input>

            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[1].indexOf(item.configType) !== -1"
              >(多个之间请使用英文逗号分隔)</i
            >
            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[6].indexOf(item.configType) !== -1"
              >单</i
            >
            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[7].indexOf(item.configType) !== -1"
              >分钟，提醒调度员人工调度</i
            >
            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[8].indexOf(item.configType) !== -1"
              >米(半径)</i
            >
            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[9].indexOf(item.configType) !== -1"
              >米范围内可点击“确认取货”</i
            >
            <i
              style="padding-left: 6px; font-size: 12px"
              v-show="[10].indexOf(item.configType) !== -1"
              >米范围内可点击“确认送达”</i
            >
            <el-cascader
              v-show="[3].indexOf(item.configType) !== -1"
              v-model="item.configValue"
              :options="AreaList"
              :placeholder="'请输入' + item.configKey"
              class="input-width"
              :props="{
                children: 'childs',
                label: 'areaName',
                value: 'areaId',
                checkStrictly: false,
                emitPath: false
              }"
              disabled
              clearable
              filterable
            ></el-cascader>
            <el-time-picker
              v-show="[5].indexOf(item.configType) !== -1"
              is-range
              v-model="timeList"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-box">
        <el-button
          type="primary"
          @click="handleDialogConfirm()"
          size="small"
          v-permission="['Post_Common_SetConfigDataEdit']"
          >保 存</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import { getConfigDataList, setConfigDataEdit } from '@/api/config'
import { valiNumber } from '@/utils/validate'

export default {
  name: 'config',
  data() {
    const RegExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    const _configList = (rule, value, callback) => {
      setTimeout(() => {
        let index = rule.field.split('.')[1] //index 就是页面的从上到下的顺序

        if (['0'].indexOf(index) !== -1) {
          if (!value) {
            return callback(new Error('平台邮箱不能为空'))
          } else if (!RegExp.test(value)) {
            callback(new Error('请输入正确的邮箱'))
          } else {
            callback()
          }
        }
        if (['1'].indexOf(index) !== -1) {
          if (!value) {
            return callback(new Error('平台设备id不能为空'))
          } else {
            callback()
          }
        }
      }, 200)
    }
    return {
      form: {
        configList: []
      },
      loading: true,
      rules: {
        configList: [
          { required: true, validator: _configList, trigger: 'blur' }
        ]
      },
      timeList: [],
      AreaList: [],
      workList: [],
      isCreated: false
    }
  },
  activated() {
    if (!this.isCreated) {
      this.getData()
    }
    this.isCreated = false
  },
  created() {
    this.isCreated = true

    this.getData()
  },
  filters: {},
  methods: {
    handleDialogConfirm() {
      this.$refs.refForm.validate((valid, error) => {
        if (valid) {
          let configList = [...this.form.configList]

          let form = {
            listConfigTypeValue: configList
          }
          setConfigDataEdit(form).then(res => {
            if (res.retCode === 200) {
              this.$message({
                message: '保存成功！',
                type: 'success',
                duration: 1000
              })
            }
            this.getData()
          })
        }
      })
    },

    getData() {
      getConfigDataList().then(response => {
        if (response.retCode === 200) {
          this.form.configList = response.retData

          this.loading = false
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
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
.el-card {
  //   min-height: 80vh;
}
</style>
