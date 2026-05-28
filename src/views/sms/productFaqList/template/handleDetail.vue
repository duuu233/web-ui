<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <i class="el-icon-edit-outline"></i>
      <span v-if="pageType == 1">添加常见问题</span>
      <span v-else-if="pageType == 2">编辑常见问题</span>
      <span v-else-if="pageType == 3">查看常见问题</span>
    </el-card>
    <el-card class="box-card">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        label-width="180px"
        size="small"
      >
        <el-form-item label="所属产品" prop="productId">
          <el-select
            clearable
            :disabled="pageType === 3"
            v-model="formData.productId"
            placeholder="请选择所属产品"
          >
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否自动翻译多语种" prop="isAutoTranslate">
          <el-radio-group
            style="height: 32px;"
            v-model="formData.isAutoTranslate"
            :disabled="pageType === 3"
          >
            <el-radio
              style="height: 32px;line-height: 32px;"
              :label="1"
              :value="1"
              >是</el-radio
            >
            <el-radio
              style="height: 32px;line-height: 32px;"
              :label="0"
              :value="0"
              >否</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序值(数值越大排名越前)" prop="grade">
          <el-input-number
            :disabled="pageType === 3"
            clearable
            style="width: 103px;"
            v-model="formData.grade"
            :min="0"
            :max="999"
            placeholder="请输入排序值"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="常见问题标题" prop="faqTitle">
          <el-input
            clearable
            :disabled="pageType === 3"
            maxlength="299"
            show-word-limit
            style="width: 60vw;"
            :rows="3"
            placeholder="请输入常见问题标题"
            v-model="formData.faqTitle"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="常见问题内容" prop="faqContent">
          <el-input
            clearable
            :disabled="pageType === 3"
            maxlength="100"
            show-word-limit
            type="textarea"
            style="width: 220px;"
            :rows="3"
            placeholder="请输入常见问题内容"
            v-model="formData.faqContent"
          >
          </el-input>
        </el-form-item> -->
        <el-form-item label="常见问题内容" prop="faqContent">
          <tinymce
            :key="tinymceKey"
            :height="300"
            v-model="formData.faqContent"
            :isDisabled="pageType === 3"
            id="product"
          ></tinymce>
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
import Tinymce from '@/components/Tinymce'
import {
  getProductFaqDetail,
  addProductFaq,
  editProductFaq as editProductFaqApi,
  getProductList as getProductListApi
} from '@/api/productList'
import { cloneDeep } from 'lodash-es'
import { formatDate } from '@/utils/date'
import md5 from 'js-md5'
import { Loading } from 'element-ui'
export default {
  props: {
    pageType: {
      type: Number,
      default: 3
    }
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        productId: [
          { required: true, message: '请选择所属产品', trigger: 'change' }
        ],
        isAutoTranslate: [
          {
            required: true,
            message: '请选择是否自动翻译多语种',
            trigger: 'change'
          }
        ],
        grade: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
        faqTitle: [
          { required: true, message: '请输入常见问题标题', trigger: 'blur' }
        ],
        faqContent: [
          { required: true, message: '请输入常见问题内容', trigger: 'blur' }
        ]
      },
      formData: {
        productId: '',
        isAutoTranslate: 0,
        grade: 0,
        faqTitle: '',
        faqContent: '',
        productName: ''
      },
      productList: null,
      isInitialized: false,
      tinymceKey: Date.now() // 用于强制刷新 tinymce 组件
    }
  },
  async activated() {
    if (this.$route.query.update == 0) return

    if (!this.isInitialized) {
      await this.initializeData()
    }
    this.isInitialized = false
  },
  deactivated() {
    // this.isInitialized = false
  },
  async created() {
    this.isInitialized = true
    await this.initializeData()
  },
  filters: {},
  methods: {
    /**
     * 初始化页面数据
     */
    async initializeData() {
      try {
        // 获取产品列表（如果还未获取）
        if (this.productList === null) {
          await this.getEnumData()
        }

        // 非添加页面需要获取详情数据
        if (this.pageType !== 1) {
          await this.getData()
        }
      } catch (error) {
        console.error('初始化数据失败:', error)
        this.$message.error('数据加载失败，请刷新重试')
      }
    },

    /**
     * 获取FAQ详情数据
     */
    async getData() {
      try {
        const res = await getProductFaqDetail({ id: this.$route.query.id })
        const responseData = res.retData || {}

        // 使用 Object.assign 保持响应式，而不是直接赋值
        Object.assign(this.formData, {
          productId: responseData.productId || '',
          isAutoTranslate: responseData.isAutoTranslate || 0,
          grade: responseData.grade || 0,
          faqTitle: responseData.faqTitle || '',
          faqContent: responseData.faqContent || '',
          productName: responseData.productName || '',
          faqId: responseData.faqId || '',
          pflId: responseData.pflId || ''
        })

        // 根据产品名称匹配产品ID
        const productItem = this.productList.find(
          item => item.productName === this.formData.productName
        )

        if (productItem) {
          // 使用 $set 确保响应式
          this.$set(this.formData, 'productId', productItem.productId)
        }

        // 更新 tinymce key 强制刷新组件，解决缓存问题
        this.tinymceKey = Date.now()
      } catch (error) {
        console.error('获取FAQ详情失败:', error)
        this.$message.error('获取详情数据失败')
      }
    },
    /**
     * 提交表单
     */
    submitForm() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) {
          console.log('表单验证失败')
          return false
        }

        let loadingObj = null
        try {
          loadingObj = Loading.service({
            background: 'rgba(0,0,0,.8)',
            text: '提交中...'
          })

          let res = null
          // 根据产品名称匹配产品ID
          const productItem = this.productList.find(
            item => item.productId === this.formData.productId
          )

          if (productItem) {
            // 使用 $set 确保响应式
            this.$set(this.formData, 'productId', productItem.productId)
            this.$set(this.formData, 'productName', productItem.productName)
          }
          if (this.pageType === 1) {
            res = await addProductFaq(this.formData)
          } else if (this.pageType === 2) {
            res = await editProductFaqApi(this.formData)
          }

          const message = this.pageType === 1 ? '新增成功' : '编辑成功'
          this.$message({
            message: message,
            type: 'success',
            duration: 1000
          })

          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            this.$router.push({
              path: 'productFaqList'
            })
          }, 1000)
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('提交失败，请重试')
        } finally {
          if (loadingObj) {
            loadingObj.close()
          }
        }
      })
    },
    /**
     * 获取产品列表数据
     */
    async getEnumData() {
      try {
        const res = await getProductListApi({
          pageIndex: 1,
          pageSize: 500
        })
        this.productList = res.retData.pageData || []
      } catch (error) {
        console.error('获取产品列表失败:', error)
        this.$message.error('获取产品列表失败')
        this.productList = []
      }
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
