<template>
  <el-upload
    class="upload-demo"
    :action="fileUploadUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
    multiple
    name="fileParam"
    :disabled="disabled"
    :limit="1"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <!-- <div slot="tip" class="el-upload__tip">
      只能上传jpg/png文件，且不超过500kb
    </div> -->
  </el-upload>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'newValue'
  },
  data() {
    return {
      fileUploadUrl: `${
        process.env.BASE_API
      }Common/setFileUpload?userToken=${getToken()}`
    }
  },
  computed: {
    fileList() {
      let file = []

      if (this.value && this.value.length) {
        for (let i = 0; i < this.value.length; i++) {
          file.push({ url: this.value[i].url, name: this.value[i].name })
        }
      }

      return file
    }
  },

  methods: {
    handleRemove(file, fileList) {
      if (this.value.length && file.status === 'success') {
        this.value.forEach((v, i) => {
          if (v.url === file.url) {
            this.value.splice(i, 1)
          }
        })
      } else {
      }
    },
    handlePreview(file) {
      console.log(file)
      if (!file || !file.url) {
        this.$message.warning(`图片地址为空`)
        return
      }
      window.open(file.url)
    },
    handleUploadSuccess(res, file) {
      if (res.retCode === 200 && res.retData.length) {
        this.value.push(...res.retData)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前只能上传1个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
