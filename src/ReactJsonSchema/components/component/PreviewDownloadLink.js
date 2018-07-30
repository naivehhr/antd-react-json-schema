import React, { Component } from 'react';
import { Link } from 'react-router';

/**
 * A标签 点击下载合同
 */
export default class PreviewDownloadLink extends Component {

	handleClick(i, formData, e) {
		e.preventDefault()
		let form = document.createElement("form");
		form.setAttribute("action", "/enterprise-web-oapi/platform/contract/preview" + i.url);
		form.setAttribute("method", "post");
		// form.setAttribute("target", "_blank");
		let input = document.createElement("input");
		input.type = "hidden";
		input.name = "formdata";
		input.value = JSON.stringify(formData);
		form.appendChild(input);
		document.body.appendChild(form)
		form.submit();
		document.body.removeChild(form)
	}

	render() {
		const { item, formData } = this.props
		return (
			<div>
				<Link onClick={this.handleClick.bind(this, item, formData)}>{`《${item.title}》`}</Link>
			</div>
		)
	}
};
