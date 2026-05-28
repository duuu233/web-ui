<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        :editData="value"
        @successCBK="imageSuccessCBK"
        :isDisabled='isDisabled'
      ></editorImage>
    </div>
  </div>
</template>

<script>
import editorImage from "./components/editorImage";
import "../../../static/tinymce4.7.5/langs/zh_CN";

const plugins = [
  `advlist anchor autolink autosave code codesample colorpicker colorpicker
 contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime
  legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
  spellchecker tabfocus table template textcolor textpattern visualblocks visualchars `,
]; //wordcount
const toolbar = [
  `bold italic underline strikethrough alignleft aligncenter
  alignright outdent indent  blockquote undo redo removeformat code`,
  `hr bullist numlist link image charmap	 preview anchor pagebreak
    fullscreen insertdatetime media table forecolor backcolor`,
];
export default {
  name: "tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
    },
    value: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      default: "file edit insert view format table",
    },
    height: {
      type: Number,
      required: false,
      default: 360,
    },
    width: {
      type: Number,
      required: false,
      default: 720,
    },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date(),
    };
  },
  watch: {
    value(val, old) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId).setContent(val);
        });
      }
    },
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      const _this = this;
      window.tinymce.init({
         ax_wordlimit_num:10,
    ax_wordlimit_callback: function(editor,txt,num){
        tipsJS('当前字数：' + txt.length + '，限制字数：' + num);
    },
        branding: false,
        elementpath: false,
        selector: `#${this.tinymceId}`,
        width: this.width,
        height: this.height,
        language: "zh_CN",
        body_class: "panel-body ",
        object_resizing: false,
        readonly: this.isDisabled,
        menubar: false,
        plugins: plugins,

        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,

        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    resetContent() {
      setTimeout(() => {
        window.tinymce.get(this.tinymceId).setContent("");
      }, 100);
      // this.$nextTick(() => {
      //   window.tinymce.get(this.tinymceId).setContent("");
      // });
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      window.tinymce.get(_this.tinymceId).setContent("");
      arr.forEach((v) => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v}" >`);
        // .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    },
  },
  destroyed() {
    this.destroyTinymce();
  },
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-container {
  width: 60vw;
}
.editor-container /deep/ .mce-container {
  width: 100% !important;
}
.editor-custom-btn-container {
  position: absolute;
  right: 10px;
  top: 10px;
  /*z-index: 2005;*/
}

.editor-upload-btn {
  display: inline-block;
}
</style>
