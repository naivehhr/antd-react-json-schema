export const pagination = {
    defaultPageSize: 20
}

export const VariableTypeMap = {
    'String': '字符型',
    'Number': '数值型',
    'Date': '日期型',
}

export const VariableCategoryMap = {
    'Output': '输出变量',
    'Derived': '衍生变量',
    'Input': '输入变量　',
}

export const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
}

export const modalInputStyle = {}

export const customerDefaultSegments = {
    "segments": [
        {
            "name": "true",
            "range": "true"
        },
        {
            "name": "false",
            "range": "false"
        }
    ]
}

export const rulesMap = {
    'number': /^(\+|-)?(([1-9]\d*(\.\d+)?)|(0|0\.\d+?))$/
}