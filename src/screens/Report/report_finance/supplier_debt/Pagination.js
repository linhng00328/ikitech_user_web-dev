import React, { Component } from "react";
import { connect } from "react-redux";
import * as reportAction from "../../../../actions/report"
class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page : 1
    }
  }

  passPagination = (page) => {
    // const params = `date_from=${this.props.txtStart}&date_to=${this.props.txtEnd}`
    const branch_id = localStorage.getItem("branch_id")
    this.props.fetchAllSupplierDebt(this.props.store_code,branch_id , page)    
}



  showData = (links) => {
    var result = null;
      var url = null
      if(typeof links == "undefined")
    {
      return result
    }
    if (links.length > 0) {
      result = links.map((data, index) => {
        var active = data.active == true ? "active" : null;
        var label = (data.label.includes("&laquo; ") || data.label.includes(" &raquo;")) 
        ? data.label.replace("&laquo; Previous", "Trước").replace("Next &raquo;", "Sau")
        : data.label
        if(data.url == null)
        {
          return (
            <li class={`page-item ${active} `}><a class="page-link">{label}</a></li>
          );
        }
        else{
     
          return (
            <li class={`page-item ${active} `}><a onClick = {()=> this.passPagination(data.url.split('?page=')[1])} class="page-link">{label}</a></li>
          );
        }
     
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    return (
        
   
<nav aria-label="Page navigation" className="float-pagination">
  <ul class="pagination  tab-pagination pg-blue">
    {this.showData(this.props.supplierDebt.links)}
  </ul>
</nav>
        
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllSupplierDebt: (store_code, branch_id,page, params) => {
      dispatch(reportAction.fetchAllSupplierDebt(store_code, branch_id,page, params))
    }
  };
};
export default connect(null, mapDispatchToProps)(Pagination);