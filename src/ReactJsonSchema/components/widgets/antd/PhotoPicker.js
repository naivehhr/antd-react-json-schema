import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { getErrorMsg } from './utils'
import './style.scss'
import SERVER_URL from '../../../../Ajax/Url'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp');
    if (!isJPG) {
        message.error('图片格式必须为jpeg png jpg bmp中的一种');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
        message.error('上传的图片大小上限为10M');
    }
    return isJPG && isLt2M;
}

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
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
        let _this = this;
        const uploadButton = () => {
            return (
                <div>
                    <Icon type={this.state.loading ? 'loading' : 'plus'} />
                    <div
                        className="ant-upload-text"
                        style={{
                            borderColor: ((this.props.errMsg && !this.props.imgUrl) ? 'red' : null),
                            color: ((this.props.errMsg && !this.props.imgUrl) ? 'red' : null)
                        }}
                    >
                        {
                            !this.props.imgUrl ?
                                (
                                    this.props.errMsg ?
                                        <div className="upload-error-mask">图片不能为空</div>
                                        :
                                        // this.props.holder
                                        "＋"
                                )
                                :
                                <div className="reupload-mask">点击重新上传</div>
                        }
                    </div>
                </div>
            )
        }
        const imageUrl = this.props.imgUrl;
        const fileList = this.state.fileList;
        return (
            <Upload
                listType="picture-card"
                className="selfimageuploader"
                showUploadList={false}
                action={SERVER_URL.FILE_UPLOAD}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton()}
                {uploadButton()}
            </Upload>
        );
    }
}

class PhotoPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img_path: [],
            options: {
                children: []
            },
            visible: false,
            modelSrc: ''
        }
    }

    componentWillMount() {
        this.setState({ options: this.props.options });
    }

    onItemChange(index, response) {
        let _tmpArr = this.state.img_path;
        _tmpArr[index] = `${SERVER_URL.IMAGE_PREVIEW}${response.value}`;
        this.setState({ img_path: _tmpArr }, () => {
            this.props.onChange(this.state.img_path.join(','));
        });
    }

    showModal(src) {
        this.setState({ modelSrc: src }, () => {
            this.setState({ visible: true });
        });

    }

    render() {
        const _child = this.state.options.children;
        let errMsg = getErrorMsg(this.props.errors)(this.props.id);
        return (
            <div className="ant-row ant-form-item ant-form-item-no-colon form-item" style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="ant-col-8 ant-form-item-label">
                    <label className="ant-form-item-required" title="图片图片">{this.props.schema.title}</label>
                </div>
                <div className="layout-wrapper layout-simple photo-picker-layout ant-form-item-control-wrapper" style={this.props.options.borderTop ? { borderTop: '1.2px dashed rgb(242,242,242)' } : {}}>
                    {/* <div className="photo-picker-descriptin">
                        {
                            this.state.options.description
                        }
                    </div> */}
                    {/* <div className=""> */}
                    <div className="photo-picker-container">
                        {
                            (!this.props.readonly) ?
                                (
                                    _child.map((item, index) => {
                                        return (
                                            <Avatar
                                                holder={item.label}
                                                onChange={this.onItemChange.bind(this, index)}
                                                imgUrl={this.props.value}
                                                errMsg={errMsg}
                                            />
                                        )
                                    })
                                )
                                :
                                (
                                    this.props.value.split(',').map((url, index) => {
                                        return (
                                            <span className="selfimageuploader example-image" >
                                                <img src={url} />
                                                {/* <div className="check-out-example" onClick={this.showModal.bind(this, url)} style={{cursor:'pointer'}}>点击查看</div> */}
                                                <div className="list-img-display-mask" onClick={this.showModal.bind(this, url)} style={{ marginTop: 0 }}>点击查看</div>
                                            </span>
                                        )
                                    })
                                )
                        }
                        {
                            (!this.props.readonly) ?
                                (
                                    <div className="example-image">
                                        {/* <img src={this.state.options.example.img_path} /> */}
                                        <div className="description-container" style={{ width: "240px" }}>{this.state.options.description}</div>
                                        <div className="check-out-example" onClick={this.showModal.bind(this, this.state.options.example.img_path)}>点击查看示例</div>
                                    </div>
                                ) :
                                null
                        }
                    </div>
                    {/* </div> */}

                    {/* {errMsg != null ? (<div>{errMsg}</div>) : null} */}
                    <Modal
                        className="photo-modal"
                        title={this.props.schema.title}
                        visible={this.state.visible}
                        onCancel={() => {
                            this.setState({ visible: false });
                        }}
                        cancelText="取消"
                    >
                        <img src={this.state.modelSrc} />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default PhotoPicker;
