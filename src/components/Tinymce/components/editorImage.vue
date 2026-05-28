<template>
  <div class="upload-container">
    <el-button
      v-if="!isDisabled"
      icon="el-icon-upload"
      size="mini"
      :style="{ background: color, borderColor: color }"
      @click="dialogVisible = true"
      type="primary"
      >上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <multi-upload :maxCount="5" v-model="fileList"></multi-upload>
      <!-- <el-upload
        class="editor-slide-upload"
        action="http://macro-oss.oss-cn-shenzhen.aliyuncs.com"
        :data="dataObj"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload> -->
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { policy } from '@/api/oss'
import MultiUpload from '@/components/Upload/multiUpload'
export default {
  name: 'editorSlideUpload',
  components: { MultiUpload },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    editData: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
      }
    }
  },
  watch: {
    editData(v, old) {
      if (v) {
        this.fileList = []
        let fileList
        let reg = /(\/|http)[^>]+\.(jpg|jpeg|png|gif)/g
        fileList = v.match(reg)
        if (fileList) {
          this.fileList = [...fileList]
        }
      }
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        item => this.listObj[item].hasSuccess
      )
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message(
          '请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！'
        )
        return
      }
      // console.log(this.fileList);
      // this.$emit("successCBK", arr);
      this.$emit('successCBK', this.fileList)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    }
    // handleSuccess(response, file) {
    //   const uid = file.uid;
    //   const objKeyArr = Object.keys(this.listObj);
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       this.listObj[objKeyArr[i]].url =
    //         this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name;
    //       this.listObj[objKeyArr[i]].hasSuccess = true;
    //       return;
    //     }
    //   }
    // },
    // handleRemove(file) {
    //   const uid = file.uid;
    //   const objKeyArr = Object.keys(this.listObj);
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       delete this.listObj[objKeyArr[i]];
    //       return;
    //     }
    //   }
    // },
    // beforeUpload(file) {
    //   const _self = this;
    //   const fileName = file.uid;
    //   this.listObj[fileName] = {};
    //   return new Promise((resolve, reject) => {
    //     policy()
    //       .then((response) => {
    //         _self.dataObj.policy = response.data.policy;
    //         _self.dataObj.signature = response.data.signature;
    //         _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
    //         _self.dataObj.key = response.data.dir + "/${filename}";
    //         _self.dataObj.dir = response.data.dir;
    //         _self.dataObj.host = response.data.host;
    //         _self.listObj[fileName] = {
    //           hasSuccess: false,
    //           uid: file.uid,
    //           width: this.width,
    //           height: this.height,
    //         };
    //         resolve(true);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         reject(false);
    //       });
    //   });
    // },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container .editor-slide-upload {
  margin-bottom: 20px;
}
</style>
