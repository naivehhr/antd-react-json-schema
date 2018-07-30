import React, { Component } from 'react';
import { Upload,Button,message } from 'antd';

class UploadButton extends Component {
  /**
   * props...
   * action,上传地址
   * label,上传按钮文案
   * callback
   */
  constructor(props) {
    super(props);
  }

  render() {
    let self = this;
    const props = {
      name: 'file',
      action: this.props.action,
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          let result = info.file.response;
          if (result.code == 200) {
            message.success('操作成功', 2, function() {
              self.props.callback(result.value);
            });
          } else {
            message.error(result.msg);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return <Upload {...props}>
              <Button>
                  {this.props.label}
              </Button>
            </Upload>;
  }
}

export default UploadButton;