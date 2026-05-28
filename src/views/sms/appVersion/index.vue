<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="客户端">
            <el-select v-model="listQuery.terminal" placeholder="请选择客户端">
              <el-option :key="1" :value="1" label="Android"></el-option>
              <el-option :key="2" :value="2" label="IOS"></el-option>
              <!-- <el-option :key="3" :value="3" label="WechatApp"></el-option>
              <el-option :key="4" :value="4" label="AliApp"></el-option>
              <el-option :key="5" :value="5" label="WapH5"></el-option>
              <el-option :key="6" :value="6" label="PC"></el-option> -->
            </el-select>
          </el-form-item>
          <!-- 1=Android 2=IOS 3=WechatApp 4=AliApp 5=WapH5 6=PC  -->
          <el-form-item label="关键词">
            <el-input
              v-model="listQuery.keyword"
              clearable
              placeholder="请输入关键词"
            ></el-input>
          </el-form-item>
          <el-form-item class="fr">
            <el-button
              type="primary"
              @click="handleSearchList()"
              size="small"
              icon="el-icon-search"
            >
              查询
            </el-button>
            <el-button
              @click="handleResetSearch()"
              size="small"
              icon="el-icon-refresh"
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>版本管理列表</span>
      </div>
      <el-button
        size="small"
        class="btn-add"
        style="margin-left: 20px"
        type="primary"
        icon="el-icon-plus"
        v-permission="['Post_Content_SetAppVersionEdit']"
        @click="addVersion('add')"
        >新增版本</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="roleTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
        :header-cell-style="{
          background: '#F2F6FA',
          color: '#555555',
          'text-align': 'center'
        }"
      >
        <el-table-column label="客户端" align="center" prop="terminalMsg">
        </el-table-column>

        <el-table-column label="版本号" align="center">
          <template slot-scope="scope">{{ scope.row.versionNumber }}</template>
        </el-table-column>
        <el-table-column label="版本编号" align="center">
          <template slot-scope="scope">{{ scope.row.grade }}</template>
        </el-table-column>
        <el-table-column label="升级类型" prop="compulsoryMsg" align="center">
          <template slot-scope="scope">{{
            scope.row.compulsoryMsg == '弱提示升级'
              ? '普通升级'
              : scope.row.compulsoryMsg
          }}</template>
        </el-table-column>

        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.verify ? 'enabled' : ''">{{
              scope.row.verify ? '启用' : '禁用'
            }}</span></template
          >
        </el-table-column>

        <el-table-column
          label="是否显示"
          width="140"
          align="center"
          v-permission="['Post_Content_SetAppVersionVerify']"
        >
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange($event, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.verify"
            >
            </el-switch>
          </template>
        </el-table-column>

        <!-- <el-table-column label="升级提示语" align="center">
          <template slot-scope="scope">{{ scope.row.upgradeTips }}</template>
        </el-table-column> -->

        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">{{
            scope.row.releaseTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-row class="handle-table-box">
              <el-button
                size="mini"
                type="primary"
                @click="addVersion('edit', scope.row)"
                v-permission="['Post_Content_SetAppVersionEdit']"
              >
                编辑
              </el-button>
              <!-- <el-button
                size="mini"
                type="primary"
                @click="download(scope.row)"
              >
                下载
              </el-button> -->
              <!-- <el-button
                size="mini"
                type="primary"
            
              >
                查看二维码
              </el-button> -->
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="clearfix">
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageIndex"
          :page-size="listQuery.pageSize"
          :page-sizes="[10, 20, 30]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUsers } from '@/api/userList'
import { getAppVersionList, setAppVersionVerify } from '@/api/appVersion'
import { formatDate } from '@/utils/date'
const defaultListQuery = {
  pageIndex: 1,
  pageSize: 10,
  appTypeId: null,
  terminal: null,
  keyword: ''
}
const freightForm = {
  id: null,
  grade: null,
  freightAmount: null,
  tempName: null,
  tempRemark: null,
  pricingType: null
}

export default {
  name: 'resLogs',
  data() {
    const _freightAmount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入属性值'))
      } else if (value <= 0) {
        return callback(new Error('输入的运费金额不能小于0'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        freightAmount: [
          { required: true, validator: _freightAmount, trigger: 'blur' }
        ],
        tempName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        tempRemark: [
          { required: true, message: '请输入模板说明', trigger: 'blur' }
        ],
        pricingType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      listQuery: Object.assign({}, defaultListQuery),
      freightForm: Object.assign({}, freightForm),
      list: null,
      total: null,
      id: null,
      freightType: null,
      listLoading: false,
      dialogVisible: false,
      form: {},
      freightDialogVisible: false,
      dateList: [],
      nameList: [],
      clientList: [],
      reminderList: [],
      isCreated: false
    }
  },
  activated() {
    if (!this.isCreated) {
      this.getList()
    }
    this.isCreated = false
  },
  created() {
    this.isCreated = true
    this.getList()
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    download(row) {
      console.log(row)
      if (row.attachment) {
        window.location.href = row.attachment
      } else {
        this.$message({
          type: 'warning',
          message: '下载地址为空'
        })
      }
    },
    handleStatusChange(status, row) {
      row.verify = status === 1 ? 0 : 1
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.SetProductCateGoryVerifyFn(status, row.id, row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          })
        })
    },
    SetProductCateGoryVerifyFn(status, ids, row) {
      let isSingle = true
      if (Array.isArray(ids)) {
        isSingle = false
        ids = ids.join()
      } else {
        ids = ids + ''
      }
      setAppVersionVerify({
        verify: status,
        commonIds: ids
      }).then(response => {
        if (response.retCode === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          if (isSingle) {
            row.verify = status
          }
        } else {
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        }
      })
    },
    // 文字转换
    switchText(value, obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].value == value) {
          return obj[i].text
        }
      }
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleSearchList() {
      this.listQuery.pageIndex = 1
      if (this.dateList) {
        this.listQuery.startDate = this.dateList[0]
        this.listQuery.endDate = this.dateList[1]
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageIndex = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getList()
    },
    addVersion(type, data) {
      var query = data ? { applicationId: data.id, type: type } : { type: type }
      var path = data ? '/sms/versionDetail' : '/sms/versionDetailAdd'
      this.$router.push({
        path: path,
        query: query
      })
    },
    close() {
      this.attrValueForm = {}
      this.$refs.refFreightForm.resetFields()
    },
    getList() {
      this.listLoading = true
      getAppVersionList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.retData.pageData
        this.total = response.retData.recordCount
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.enabled {
  color: #67c23a;
}
</style>
