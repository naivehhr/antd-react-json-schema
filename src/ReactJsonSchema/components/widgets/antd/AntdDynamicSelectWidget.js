import React, { Component } from 'react';
import { Row, Col, Select, Form } from 'antd';
import { getErrorMsg } from './utils'
import {
    deepEquals,
} from "../../../utils";
import { formItemLayout } from './constant'
import { fetch } from 'Ajax';
const FormItem = Form.Item;
const Option = Select.Option;

class AntdDynamicSelectWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentEnums: [],
            currentCareParams: this.getCareListParams(props)
        }
    }
    componentWillMount() {
        this.fetchEnumList();
    }

    componentWillReceiveProps(nextProps) {
        const currentCareParams = this.getCareListParams(nextProps);
        const lastCareParams = this.state.currentCareParams;
        if (!(deepEquals(currentCareParams, lastCareParams))) {
            //如果关联数据修改，那么置空列表，并且置空已选数据
            this.setState({
                currentCareParams: [],
                currentCareParams: currentCareParams
            }, function() {
                this.fetchEnumList();
                this.props.onChange(null, this.props.id);
            })
        }
	}

    getCareListParams(props) {
        let options = props.schema.options;
        if (options == null || options.form_params == null) {
            return null;
        }
        let rootData = this.props.allFormData;
        function getKeyData(tmproot, key) {
            if (tmproot[key] !== undefined) {
                return tmproot[key];
            }
            for (var tkey in tmproot) {
                if (tmproot[tkey] == null || typeof tmproot[tkey] != "object") {
                    continue;
                }
                let result = getKeyData(tmproot[tkey], key);
                if (result !== undefined) {
                    return result;
                }
            }
            return undefined;
        }
        let fetchParams = {};
        for (var i = 0; i < options.form_params; i++) {
            let key = options.form_params[i];
            fetchParams[key] = getKeyData(key);
        }
        return fetchParams;
    }

    fetchEnumList = async () => {
        let source_id = this.props.schema.options.option_group_id;
        const currentCareParams1 = this.state.currentCareParams;
        let params = {};
        params['groupId'] = source_id;
        params['form_params'] = {};
        if (currentCareParams1 != null) {
            for (var key in currentCareParams1) {
                params['form_params'][key] = currentCareParams1[key];
            }
        }
        let result = await fetch('/enterprise-web-oapi/platform/option/optionGroup/get', 'post', params);
        const currentCareParams2 = this.state.currentCareParams;
        if (!(deepEquals(currentCareParams1, currentCareParams2))) {
            return;
        }
        this.setState({
            currentEnums: result.value
        })
    }

    _onChange (event) {
        this.props.onChange(event, this.props.id)
    }

    render() {
        const {
            id,
            value,
            label,
            readonly,
            required,
            errors
        } = this.props;

        let errMsg = getErrorMsg(errors)(id)
        let validateStatus
        if (!errMsg && value) {
            validateStatus = 'success'
        } else if (errMsg) {
            validateStatus = 'error'
        }
        let optionsView = [];
        for (var i = 0; i < this.state.currentEnums.length; i++) {
            optionsView.push((
                <Option key={this.state.currentEnums[i].key} value={this.state.currentEnums[i].key}>{this.state.currentEnums[i].value}</Option>
            ));
        }

        return (
            <FormItem 
                colon={false} 
                required={required} 
                label={label}
                validateStatus={validateStatus}
                help={errMsg}
                className="form-item"
                {...formItemLayout}
            >
                {
                    readonly ?
                    <font>{value}</font>
                    :
                    <Select id={id} 
                        defaultValue={value}
                        onChange={this._onChange.bind(this)} >
                        {optionsView}
                    </Select>
                }
            </FormItem>
        )
    }
}

export default AntdDynamicSelectWidget;
/*

{
    "type": "string",
    "format": "dy-select",
    "options": {
        "source_id": "CM_GET_CITY_LIST",
        "static_params": {
            "type": "...."
        },
        "form_params": [
            "province"
        ]
    }
}


*/