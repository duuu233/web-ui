<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          ref="searchForm"
          :rules="rules"
          size="small"
        >
          <el-form-item label="常见问题关键词">
            <el-input
              v-model="listQuery.keyword"
              placeholder="请输入常见问题关键词"
              clearable
              maxlength="40"
              class="input-width"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- 语言(0=英语,1=英语,2=德语,3=西班牙语,4=法语,5=意大利语,6=葡萄牙语) -->
          <el-form-item label="语种">
            <el-select
              v-model="listQuery.language"
              clearable
              placeholder="请选择语种"
            >
              <el-option :key="0" label="英语" :value="1"> </el-option>

              <el-option :key="2" label="德语" :value="2"> </el-option>
              <el-option :key="3" label="西班牙语" :value="3"> </el-option>

              <el-option :key="4" label="法语" :value="4"> </el-option>
              <el-option :key="5" label="意大利语" :value="5"> </el-option>
              <el-option :key="6" label="葡萄牙语" :value="6"> </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="发布次数">
            <el-form-item label="" prop="startNum" style="margin-right: 0">
              <el-input
                v-model="listQuery.startNum"
                style="width: 100px"
                placeholder="起始值"
                maxlength="5"
                clearable
              ></el-input>
            </el-form-item>
            一
            <el-form-item label="" prop="endNum">
              <el-input
                v-model="listQuery.endNum"
                style="width: 100px"
                placeholder="终止值"
                maxlength="5"
                clearable
              ></el-input>
            </el-form-item>
          </el-form-item> -->
          <el-form-item label="创建时间">
            <el-date-picker
              style="width: 300px"
              v-model="dateList"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
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
        <span>常见问题列表</span>
      </div>
      <div>
        <el-button
          size="small"
          style="margin-left: 10px"
          icon="el-icon-document"
          type="primary"
          v-permission="['Post_Product_AddProductFaq']"
          @click="handleAdd"
          >新增常见问题</el-button
        >
      </div>
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
        <el-table-column label="编号" align="center" type="index">
        </el-table-column>
        <el-table-column label="业务ID" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.faqId }}</template>
        </el-table-column>
        <el-table-column label="所属产品" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="语种" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.languageMsg }}</template>
        </el-table-column>
        <el-table-column label="标题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.faqTitle }}</template>
        </el-table-column>
        <el-table-column
          label="排序值(数值越大排名越前)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.grade }}</template>
        </el-table-column>
        <el-table-column
          label="是否自动翻译多语种"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.isAutoTranslate == 0 ? '否' : '是'
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-permission="['post_Product_setProductFaqVerify']"
              @change="handleStatusChange($event, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.verify"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-row class="handle-table-box">
              <el-button
                size="mini"
                type="primary"
                v-permission="['Post_Product_EditProductFaq']"
                @click="handleEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-permission="['Get_Product_ProductDetailFaq']"
                @click="handleDetail(scope.$index, scope.row)"
              >
                详情
              </el-button>

              <el-button
                size="mini"
                type="danger"
                v-permission="['post_Product_setProductFaqVerify']"
                @click="handleStatusChange(scope.row)"
              >
                删除
              </el-button>
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
import { getProductFaqList, setProductFaqVerify } from '@/api/productList'
import { formatDate } from '@/utils/date'
import { valiNumber } from '@/utils/validate'

const defaultListQuery = {
  pageIndex: 1,
  pageSize: 10,
  keyword: null
}

export default {
  name: 'productFaqList',
  data() {
    const _validatorNumMin = (rule, value, callback) => {
      setTimeout(() => {
        if (value && !valiNumber(value)) {
          callback(new Error('请输入有效数字值'))
        } else {
          callback()
        }
      }, 100)
    }
    const _validatorNumMax = (rule, value, callback) => {
      setTimeout(() => {
        if (value && !valiNumber(value)) {
          callback(new Error('请输入有效数字值'))
        } else if (value < this.listQuery.startNum) {
          this.listQuery.endNum = this.listQuery.startNum
          callback()
        } else {
          callback()
        }
      }, 100)
    }
    return {
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
      list: null,
      total: null,
      id: null,
      listLoading: false,
      dialogVisible: false,
      form: {},
      isEdit: false,
      terminalList: [],
      dateList: [],
      isCreated: false,
      rules: {
        startNum: [
          { required: false, validator: _validatorNumMin, trigger: 'blur' }
        ],
        endNum: [
          { required: false, validator: _validatorNumMax, trigger: 'blur' }
        ]
      }
    }
  },
  activated() {
    document.addEventListener('keyup', this.eventFn)
    if (!this.isCreated) {
      this.getList()
    }
    this.isCreated = false
  },
  deactivated() {
    this.isCreated = false
    document.removeEventListener('keyup', this.eventFn)
  },
  created() {
    this.isCreated = true
    this.getList()
    // let allKeyValues = JSON.parse(sessionStorage.getItem('allKeyValues'))
    // this.terminalList = allKeyValues[0].childs
  },
  mounted() {
    document.addEventListener('keyup', this.eventFn)
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
    eventFn(e) {
      if (e.code === 'Enter') {
        e.preventDefault()
        this.handleSearchList()
      }
    },
    handleStatusChange(row) {
      let status = row.verify === 1 ? 0 : 1
      this.$confirm(
        '该操作将删除此常见问题的所有相关语种数据，确认删除吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          setProductFaqVerify({
            verify: status,
            id: row.faqId
          }).then(response => {
            if (response.retCode === 200) {
              // Message.success('修改成功!')
              this.$message({
                type: 'success',
                message: '修改成功!'
              })

              this.getList()
            } else {
              this.$message({
                type: 'info',
                message: '修改失败'
              })
            }
          })
        })
        .catch(err => {
          console.log('err', err)
          this.$message({
            type: 'info',
            message: '取消修改'
          })
          // this.getList();
        })
    },
    handleExport() {
      const listQuery = Object.assign({}, this.listQuery)
      listQuery.pageIndex = 1
      getUserListExcel(listQuery).then(res => {
        if (res.retCode === 200) {
          if (res.retData) {
            window.location.href = res.retData
          } else {
            this.$message({
              type: 'warning',
              message: '数据为空，无法导出!'
            })
          }
        } else {
          this.$message({
            type: 'success',
            message: '导出失败!'
          })
        }
      })
    },
    handleAdd(index, row) {
      this.$router.push({
        name: 'productFaqListAdd'
      })
    },
    handleDetail(index, row) {
      this.$router.push({
        name: 'productFaqListDetail',
        query: { id: row.pflId }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'productFaqListEdit',
        query: { id: row.pflId }
      })
    },

    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.dateList = []
      delete this.listQuery.startDate
      delete this.listQuery.endDate
      this.getList()
    },
    handleSearchList() {
      this.$refs.searchForm.validate(v => {
        if (v) {
          this.listQuery.pageIndex = 1
          if (!this.listQuery.terminal) {
            delete this.listQuery.terminal
          }
          if (this.dateList && this.dateList.length) {
            this.listQuery.startDate = this.dateList[0]
            this.listQuery.endDate = this.dateList[1]
          } else {
            delete this.listQuery.startDate
            delete this.listQuery.endDate
          }
          for (let key in this.listQuery) {
            if (!this.listQuery[key] && this.listQuery[key] != 0) {
              delete this.listQuery[key]
            }
          }
          this.getList()
        }
      })
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

    getList() {
      this.listLoading = true
      getProductFaqList(this.listQuery).then(response => {
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
