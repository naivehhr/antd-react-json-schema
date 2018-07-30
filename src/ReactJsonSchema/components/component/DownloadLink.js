import React, { Component } from 'react';
import { Link } from 'react-router';

/**
 * A标签 点击下载合同
 */
export default class DownloadLink extends Component {

  handleClick(i, e) {
    e.preventDefault()
		let form = document.createElement("form");
		form.setAttribute("action", "/enterprise-web-oapi/platform/file/download/" + i.value);
		form.setAttribute("method", "get");
		// form.setAttribute("target", "_blank");
		// let input = document.createElement("input");
		// input.type = "hidden";
		// input.name = "formdata";
		// input.value = JSON.stringify(allFormData);
		// form.appendChild(input);
		document.body.appendChild(form)
		form.submit();
		document.body.removeChild(form)
  }

  render() {
    const { item } = this.props
    return (
      <div>
        <Link onClick={this.handleClick.bind(this, item)}>{`《${item.name}》`}</Link>
      </div>
    )
  }
};
