import React, { Component } from "react";
import * as CategoryPAction from "../../actions/category_product";
import { connect } from "react-redux";
import * as helper from "../../ultis/helpers";
import { compressed } from "../../ultis/helpers";
import { shallowEqual } from "../../ultis/shallowEqual";
import { isEmpty } from "../../ultis/helpers";
import * as Types from "../../constants/ActionType";
import themeData from "../../ultis/theme_data";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  image as imagePlugin,
  font,
  fontSize,
  formatBlock,
  paragraphStyle,
  blockquote,
  fontColor,
  textStyle,
  list,
  lineHeight,
  table as tablePlugin,
  link as linkPlugin,
  video,
  audio,
  align,
  template,
} from "suneditor/src/plugins";
import { handleImageUploadBefore } from "../../ultis/sun_editor";
import imageGallery from "../imageGallery";
import { getApiImageStore } from "../../constants/Config";
import * as userLocalApi from "../../data/local/user";


class ModalCreateChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtName: "",
      fileUpload: null,
      txtContent: ""
    };
  }

  componentDidMount() {
    var _this = this;

    window
      .$("#file-category-product-child")
      .on("fileloaded", function (event, file) {
        _this.setState({ fileUpload: file });
      });
    window
      .$("#file-category-product-child")
      .on("fileremoved", function (event, id, index) {
        _this.setState({ fileUpload: null });
      });

    helper.loadFileInput("file-category-product-child");
  }
  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    this.setState({
      [name]: value,
    });
  };
  componentWillReceiveProps(nextProps) {
    if (
      !shallowEqual(nextProps.category_product, this.props.category_product)
    ) {
      window.$(".modal").modal("hide");
      window.$("#file-category-product-child").fileinput("clear");
      this.setState({
        txtName: "",
        txtContent: "",
      });
    }
  }
  handleClear = () => {
    this.setState({
      txtName: "",
      fileUpload: null,
      txtContent: "",
    });
    window.$("#file-category-product-child").fileinput("clear");
  };
  onSave = async (e) => {
    e.preventDefault();
    // window.$('.modal').modal('hide');

    if (this.state.txtName == null || !isEmpty(this.state.txtName)) {
      this.props.showError({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: "Tên danh mục không được để trống",
        },
      });
      return;
    }

    var file = this.state.fileUpload;
    if (typeof file !== "undefined" && file != "" && file != null) {
      // window.$('#file-category-product').fileinput('clear');
      const fd = new FormData();
      fd.append("image", await compressed(file));
      fd.append("name", this.state.txtName);
      fd.append("description", this.state.txtContent);
      var { store_code, modal } = this.props;
      this.props.createCategoryChild(store_code, modal.id, fd);
      this.setState({ fileUpload: null });
    } else {
      window.$("#file-category-product-child").fileinput("clear");
      const fd = new FormData();
      fd.append("name", this.state.txtName);
      fd.append("description", this.state.txtContent);
      this.props.createCategoryChild(
        this.props.store_code,
        this.props.modal.id,
        fd
      );
    }
  };
  handleEditorChange = (editorState) => {
    console.log("editorState: ", editorState.srcElement.innerHTML);
    this.setState({
      txtContent: editorState.srcElement.innerHTML,
    });
  };

  render() {
    var { txtName, txtContent } = this.state;
    var { store_code } = this.props;
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="createModalChild"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 class="modal-title">Thêm danh mục con</h4>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={this.handleClear}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="createFormChild"
            >
              <div class="modal-body">
                <div class="form-group">
                  <label for="product_name">Tên danh mục con</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtName"
                    placeholder="Nhập tên danh mục"
                    autoComplete="off"
                    value={txtName}
                    onChange={this.onChange}
                    name="txtName"
                  />
                </div>
                <div class="form-group">
                  <label for="product_name">Hình ảnh</label>
                  <div className="file-loading">
                    <input
                      id="file-category-product-child"
                      type="file"
                      className="file"
                      data-overwrite-initial="false"
                      data-min-file-count="2"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="product_name">Nội dung bài viết</label>
                  <SunEditor
                    onImageUploadBefore={handleImageUploadBefore}
                    setContents={txtContent}
                    showToolbar={true}
                    // onChange={this.handleEditorChange}
                    setDefaultStyle="height: auto;font-family: Arial;font-size: 14px;"
                    setOptions={{
                      requestHeaders: {
                        "X-Sample": "sample",
                        token: userLocalApi.getToken(),
                      },
                      imageGalleryLoadURL: getApiImageStore(store_code),
                      plugins: [
                        imagePlugin,
                        imageGallery,
                        font,
                        fontSize,
                        formatBlock,
                        paragraphStyle,
                        blockquote,
                        fontColor,
                        textStyle,
                        list,
                        lineHeight,
                        tablePlugin,
                        linkPlugin,
                        video,
                        audio,
                        align,
                      ],
                      toolbar: {
                        codeView: "Code view",
                        tag_pre: "Code",
                        tag_blockquote: "Quote",
                        showBlocks: "Show blocks",
                      },
                      menu: {
                        code: "Code",
                      },

                      buttonList: [
                        [
                          "undo",
                          "redo",
                          "font",
                          "fontSize",
                          "formatBlock",
                          "paragraphStyle",
                          "blockquote",
                          "bold",
                          "underline",
                          "italic",
                          "fontColor",
                          "textStyle",
                          // "outdent",
                          "align",
                          "horizontalRule",
                          "list",
                          "lineHeight",
                          "table",
                          "link",
                          "image",
                          "video",
                          "audio",
                          "imageGallery",
                          "fullScreen",
                          "preview",
                          "codeView",
                          "removeFormat",
                        ],
                      ],
                    }}
                    onSave={(e, g) => {
                      console.log("e", e);
                      console.log("g", g);
                      this.setState({
                        txtContent: e,
                      });
                    }}
                    onInput={this.handleEditorChange}
                    onPaste={this.handleEditorChange}
                    onFocus={(e) => {
                      this.setState({
                        txtContent: e.target.innerHTML,
                      });
                    }}
                  />
                </div>
              </div>


              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                  onClick={this.handleClear}
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-warning">
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
    createCategoryChild: (store_code, id, form) => {
      dispatch(CategoryPAction.createCategoryChild(store_code, id, form));
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalCreateChild);
