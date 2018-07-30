import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import './tableLayout_kv.scss';
import { _format } from '../../../Util'
import DownloadLink from '../component/DownloadLink'
import PreviewDownloadLink from '../component/PreviewDownloadLink'
class TableLayout_KV extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    clipping(_v) {
        console.log(_v);
    }

    getTableUI() {
        let _this = this;

        function getItemKeyList() {
            let _tmpArr = Object.keys(_this.props.schema.properties);
            let _newTmpArr = [];
            _tmpArr.map((_v, index) => {
                if (!_this.props.schema.properties[_v].hidden) {
                    _newTmpArr.push(_v);
                }
            })

            return _newTmpArr;
        }

        function getValueList(_itemlist) {
            let _valueList = [];
            _itemlist.map((_v, index) => {
                _valueList.push(_this.props.formData[_v]);
            })
            return _valueList;
        }

        function getLabelList(_itemlist) {
            let _labelList = [];
            _itemlist.map((_v, index) => {
                let value = _this.props.formData[_v];
                let schema = _this.props.schema.properties[_v];
                if (schema.enumNames != null && schema.enum != null) {
                    for (let j = 0; j <= schema.enum.length; j++) {
                        if (schema.enum[j] == value) {
                            value = schema.enumNames[j];
                            break;
                        }
                    }
                }
                if (schema.type == "number" && schema.format == 'amount') {
                    value = _format.formatValue(schema, value)
                } else if (schema.type == "string" && schema.format == "file-upload") {
                    let obj = JSON.parse(value)
                    let _view = obj && obj.map(i => <DownloadLink item={i} />)
                    value = (
                        <div style={{ display: 'flex' }}>
                            {_view}
                        </div>
                    )
                } else if (schema.type == "boolean"
                    && schema.option
                    && schema.option.widget == "AgreementCheckboxWidget"
                    && value) {
                    // 勾选合同的展示
                    let obj = schema.option.agreement_list
                    let _view = obj && obj.map(i => <PreviewDownloadLink item={i} formData={_this.props.formData} />)
                    value = (
                        <div style={{ display: 'flex' }}>
                            {
                                _view
                            }
                        </div>
                    )
                }
                _labelList.push(value);
            })
            return _labelList;
        }

        function getTitleList(_itemlist) {
            let _titleList = [];
            _itemlist.map((_v, index) => {
                _titleList.push(_this.props.schema.properties[_v].title);
            })
            return _titleList;
        }

        function getClipList(_itemlist) {
            let _clipList = [];
            _itemlist.map((_v, index) => {
                _clipList.push(_this.props.schema.properties[_v].clippable);
            })
            // console.log(_clipList);
            return _clipList;
        }

        const itemlist = getItemKeyList();
        const titleList = getTitleList(itemlist);
        const labelList = getLabelList(itemlist);
        const clipList = getClipList(itemlist);
        const numperline = this.props.uiSchema.options.per_line;
        let linecount = parseInt((itemlist.length - 1) / numperline) + 1;
        let trlines = [];
        let j = 0;
        let z = -1;
        for (let i = 0; i < linecount; i++) {
            if (i % 2 === 0) {
                z++;
            }
            j = 0;
            let tdcols = [];
            for (; j < numperline; j++) {
                // console.log(j);
                let index = i * numperline + j;
                function veriOdd(e, q) {
                    if (!e && !q) {
                        return false;
                    }
                    return true;
                }
                let title = titleList[index];
                let _label = labelList[index];
                let _clip = clipList[index]
                tdcols.push(
                    veriOdd(title, _label) ?
                        <td className="tlname">{title}</td>
                        :
                        null
                )
                let colspan = 1;
                if (j != numperline - 1 && itemlist[index + 1] == null) {
                    colspan = (numperline - 1 - j) * numperline + 1;
                }
                tdcols.push(
                    veriOdd(title, _label) ?
                        < td className="tlval" colSpan={colspan} >
                            {_label}
                            {
                                _clip ?
                                    <span onClick={this.clipping.bind(this, _label)}>复制</span>
                                    :
                                    null
                            }
                        </td >
                        :
                        null
                )
            }
            trlines.push(<tr className={`tablecol${numperline}`}>{tdcols}</tr>)
        }
        return <table className="table-with-border">
            <tbody>{trlines}</tbody>
        </table>
    }

    render() {
        const { schema, uiSchema, formData } = this.props;
        let num = 24 / uiSchema.options.per_line;
        return (
            <div className="tab-view-display-layout">
                {
                    uiSchema.options.showTitle ?
                        <div className="title">{schema.title}</div>
                        :
                        null
                }
                <div className="table-body">
                    {
                        this.getTableUI()
                    }
                </div>
            </div>
        )
    }
}

export default TableLayout_KV;