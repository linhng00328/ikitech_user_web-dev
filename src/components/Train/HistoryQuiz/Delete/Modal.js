import React, { Component } from "react";
import { connect } from "react-redux";
import * as trainAction from "../../../../actions/train";
import themeData from "../../../../ultis/theme_data";

class Modal extends Component {

  onSave = (e) => {
    e.preventDefault();
    window.$('.modal').modal('hide');
    var course_id = this.props.modal.id;
    var { store_code } = this.props
    this.props.destroyCourse(store_code, course_id);
  };

  render() {
    var { modal } = this.props;
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="removeModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 style={{ color: "white" }}>Thông báo</h4>              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div class="modal-body">
                <input type="hidden" name="remove_id_store" />
                <div class="alert-remove"></div>
                Bạn có muốn xóa {modal.table} này không?
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-warning">
                  Xóa

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
    destroyCourse: (store_code, course_id) => {
      dispatch(trainAction.destroyCourse(store_code, course_id));
    },
  };
};
export default connect(null, mapDispatchToProps)(Modal);
