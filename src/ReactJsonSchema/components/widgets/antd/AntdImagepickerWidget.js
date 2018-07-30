import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import './style.scss'
import SERVER_URL from '../../../../Ajax/Url'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
    	let response = info.file.response;
    	let imageUrl = SERVER_URL.IMAGE_PREVIEW + response.value;
    	this.setState({
	      imageUrl,
	      loading: false,
	    });
	    this.props.onChange(response);
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{this.props.holder}</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        listType="picture-card"
        className="selfimageuploader"
        showUploadList={false}
        action={SERVER_URL.FILE_UPLOAD}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
      </Upload>
    );
  }
}

class AntdImagePickerWidget extends Component {
	constructor(props) {
		super(props);
		// onchange
		// value
		// label
		// description
		// readonly
		// require
		// schema(几张,对应描述)
	}

    onItemChange(index, response) {
    	//拼接字符串，兑出去
    	this.props.onChange();
    	console.log(index);
    	console.log(response);
    }

	render() {
		return <div style={{borderTop: '1px solid #cccccc'}}>
		           <div><label>{ this.props.label }</label></div>
		           <div>
		           	  <Avatar holder={"请上传身份证正面"} onChange={this.onItemChange.bind(this, 0)} />
		           	  <Avatar holder={"请上传身份证反面"} onChange={this.onItemChange.bind(this, 1)} />
		           </div>
			   </div>
	}
}

export default AntdImagePickerWidget;
