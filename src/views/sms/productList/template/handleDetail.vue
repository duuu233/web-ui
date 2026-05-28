<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <i class="el-icon-edit-outline"></i>
      <span v-if="pageType == 1">添加产品</span>
      <span v-else-if="pageType == 2">编辑产品</span>
      <span v-else-if="pageType == 3">查看产品</span>
    </el-card>
    <el-card class="box-card">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        label-width="180px"
        size="small"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input
            placeholder="请输入产品名称"
            clearable
            class="input-width"
            :disabled="pageType === 3"
            v-model="formData.productName"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品图片" prop="productImg">
          <multi-upload
            v-model="formData.productImg"
            :maxCount="1"
            :disabled="pageType === 3"
          ></multi-upload>
        </el-form-item>
        <el-form-item label="产品说明书下载文件" prop="productFile">
          <file-upload
            v-model="formData.productFile"
            :maxCount="1"
            :disabled="pageType === 3"
          ></file-upload>
        </el-form-item>

        <!-- <el-form-item label="产品内容" prop="productContent">
          <tinymce
            :height="300"
            v-model="formData.productContent"
            :isDisabled="pageType === 3"
            id="product"
          ></tinymce>
        </el-form-item> -->

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
import { addProduct, editProduct, getProductDetail } from '@/api/productList'
import FileUpload from '@/components/Upload/fileUpload'
import multiUpload from '@/components/Upload/multiUpload'
import Tinymce from '@/components/Tinymce'
import { cloneDeep } from 'lodash-es'
export default {
  props: {
    pageType: {
      type: Number,
      default: 3
    }
  },
  components: { multiUpload, Tinymce, FileUpload },
  data() {
    return {
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productImg: [
          {
            required: true,
            type: 'array',
            message: '请上传产品图片',
            trigger: 'blur'
          }
        ],
        productFile: [
          {
            required: true,
            type: 'array',
            message: '请上传产品说明书下载文件',
            trigger: 'blur'
          }
        ],
        productContent: [
          { required: true, message: '请输入产品内容', trigger: 'blur' }
        ]
      },
      formData: {
        productFile: [],
        productImg: []
      },

      isCreated: false
    }
  },
  activated() {
    if (this.$route.query.update == 0) return
    if (!this.isCreated) {
      if (this.pageType !== 1) {
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
      const res = await getProductDetail({ id: this.$route.query.id })

      this.formData = res.retData || {}
      if (this.formData.productImg) {
        this.formData.productImg = [
          { url: this.formData.productImg, name: '图片' }
        ]
      }
      if (this.formData.productFile) {
        this.formData.productFile = [
          {
            url: this.formData.productFile,
            name: this.formData.productFileName
          }
        ]
      }
    },
    submitForm() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          let submitData = cloneDeep(this.formData)

          submitData.productImg = this.formData.productImg[0].url
          submitData.productFile = this.formData.productFile[0].url
          submitData.productFileName = this.formData.productFile[0].name
          if (this.pageType === 1) {
            const res = await addProduct(submitData)
          }
          if (this.pageType === 2) {
            const res = await editProduct(submitData)
          }
          let message = this.pageType === 1 ? '新增成功' : '编辑成功'
          this.$message({
            message: message,
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.push({
              name: 'productList'
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
