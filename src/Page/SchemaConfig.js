const defaultSchema = {
  type: "object",
  title: "基础SchemaConfig",
  titleLevel: "form",
  layout: "Simple",
  // required: ["name"],
  properties: {
    name: {
      type: "string",
      title: "姓名"
    },
    age: {
      type: "string",
      title: "年龄"
    },
    begin_date: {
      type: "string",
      title: "起始日",
      format: "date",
      readonly: false,
      hidden: false,
      invisible: false,
      disable: false,
      needRequired: false,
      unique: false,
      precision: 0,
      exp: 0,
      restrain: {
        operation: "lt"
      }
    },
    due_date: {
      type: "string",
      title: "到期日",
      format: "date",
      readonly: false,
      hidden: false,
      invisible: false,
      disable: false,
      needRequired: false,
      unique: false,
      precision: 0,
      exp: 0,
      dependency: {
        type: "date_compare",
        key: "bill_info.begin_date",
        operation: "gt" //lt
      }
    },
    multipleChoicesList: {
      type: "array",
      title: "多选",
      uniqueItems: true,
      maxItems: 2,
      items: {
        type: "string",
        enum: ["foo", "bar", "fuzz"]
      }
    },
    agreement_checkbox: {
      type: "boolean",
      title: "协议信息",
      option: {
        widget: "AgreementCheckboxWidget",
        showCheckBox: true,
        agreement_list: [
          {
            title: "协议一",
            action_type: "form",
            url: "/dd4efc671d1511e8a090080027000c3b/BILL_OPEN_1"
          },
          {
            title: "协议二",
            action_type: "_blank",
            url: "www.baidu.com"
          }
        ]
      }
    },
    file: {
      type: "string",
      format: "data-url",
      title: "文件上传"
    },
    blendMode: {
      title: "选择器",
      type: "string",
      enum: ["one", "two", "three"],
      enumNames: ["1", "2", "3"]
    },
    img: {
      title: "图片",
      type: "string",
      format: "image"
    }
  },
  relation: {}
}
const arraySchema = {
  definitions: {
    Thing: {
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "名字",
          default: "Default name"
        }
      }
    }
  },
  type: "object",
  relation: {},
  properties: {
    minItemsList: {
      type: "array",
      title: "A list with a minimal number of items",
      minItems: 1,
      items: {
        $ref: "#/definitions/Thing"
      }
    }
  }
}
const relativeSchema = {
  type: "object",
  title: "联动SchemaConfig",
  titleLevel: "form",
  layout: "ContainerPadding",
  properties: {
    jibenitem: {
      type: "object",
      title: "基本信息",
      titleLevel: "one",
      layout: "Simple",
      properties: {
        is_three_certificate_unit: {
          type: "boolean",
          title: "是否三证合一"
        },
        isUnitInput: {
          type: "string",
          title: "营业执照注册号",
          hidden: false
        },
        isUnitInput1: {
          type: "string",
          title: "营业执照到期日",
          hidden: false
        },
        isUnitInput2: {
          type: "string",
          title: "组织机构代码",
          hidden: false
        },
        unUnitInput: {
          type: "string",
          title: "统一社会信用代码",
          hidden: false
        },
        unUnitInput1: {
          type: "string",
          title: "营业执照到期日",
          hidden: false
        },
        ysblLabel: {
          type: "array",
          title: "array关联测试",
          itemsExclude: true,
          items: {
            type: "string",
            enum: ["foo", "bar"]
          }
        },
        aa: {
          type: "string",
          title: "aaaaaaaaaaa",
          hidden: false
        },
        bb: {
          type: "string",
          title: "bbbbbbbbbbb",
          hidden: false
        }
      },
      relation: {
        "jibenitem.isUnitInput": {
          rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
          invalidHidden: true
        },
        "jibenitem.isUnitInput1": {
          rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
          invalidHidden: true
        },
        "jibenitem.isUnitInput2": {
          rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
          invalidHidden: true
        },
        "jibenitem.unUnitInput": {
          rely: { "jibenitem.is_three_certificate_unit": [false] },
          invalidHidden: true
        },
        "jibenitem.unUnitInput1": {
          rely: { "jibenitem.is_three_certificate_unit": [false] },
          invalidHidden: true
        },
        "jibenitem.aa": {
          rely: { "jibenitem.ysblLabel": ["foo"] },
          invalidHidden: true
        },
        "jibenitem.bb": {
          rely: { "jibenitem.ysblLabel": ["bar"] },
          invalidHidden: true
        }
      }
    }
  }
}
const errorSchema = {
  type: "object",
  title: "表单验证",
  titleLevel: "form",
  layout: "Simple",
  required: ["name"],
  properties: {
    name: {
      title: "必填校验",
      type: "string"
    },
    pass1: {
      title: "最小长度校验",
      type: "string",
      minLength: 3
    },
    age: {
      title: "最小数字校验",
      type: "number",
      minimum: 18
    },
    firstName: {
      type: "string",
      title: "异步校验",
      asyncText: true, // 这是干啥的来着
      option: {
        widget: "AsyncTextWidget",
        source_api: "/api/123",
        asyncSourceId: "firstNameAsyncSource" // 这里要配置相关联的ID
      }
    },
    firstNameAsyncSource: {
      type: "string",
      hidden: true,
      title: "AsyncSource"
    }
  },
  relation: {}
}
const asyncErrorSchema = {
  type: "object",
  title: "异步表单验证",
  titleLevel: "form",
  layout: "Simple",
  relation: {},
  properties: {
    jibenitem: {
      type: "object",
      title: "基本信息",
      titleLevel: "one",
      layout: "Simple",
      properties: {
        hy: {
          title: "火影",
          type: "string"
        },
        hz: {
          title: "海贼",
          type: "string"
        },
        pkq: {
          title: "皮卡丘",
          type: "string"
        }
      }
    }
  }
}
export {
  defaultSchema,
  relativeSchema,
  arraySchema,
  errorSchema,
  asyncErrorSchema
}