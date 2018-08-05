const defaultSchema = {
  type: "object",
  title: "基础SchemaConfig",
  titleLevel: "form",
  layout: "WholeSchemaLayout", // Simple WholeSchemaLayout TitleChildLayout, Horizontal
  // required: ["name"],
  properties: {
    dd: {},
    // name11: {
    //   type: "object",
    //   title: "姓名11",
    //   layout: "WholeSchemaLayout",
    //   properties: {
    //     age1: {
    //       type: "string",
    //       title: "年龄2"
    //     }
    //   }
    // },
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
        // value: '2018-7-25'
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
      // restrain: {
      //   operation: "gt",
      //   value: '2018-7-10'
      // },
      dependency: {
        type: "date_compare",
        key: "begin_date", // bill_info.begin_date
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
  relation: {},
  formData: {
    name: "凹凸曼",
    age: "123",
    begin_date: "2018-8-1",
    due_date: "2018-8-9",
    multipleChoicesList: ["foo"],
    agreement_checkbox: true,
    blendMode: "one"
  }
};
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
  },
  formData: {
    minItemsList: [
      {
        Thing: {
          name: "默认名称s"
        }
      }
    ]
  }
};
const relativeSchema = {
  type: "object",
  title: "联动SchemaConfig",
  titleLevel: "form",
  layout: "ContainerPadding",
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
    }
  },
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
        }
      }
    }
  },
  formData: {
    jibenitem: {
      is_three_certificate_unit: true,
      isUnitInput: "",
      isUnitInput1: "",
      isUnitInput2: "",
      unUnitInput: "",
      unUnitInput1: ""
    }
  }
};
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
    count: {
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
  relation: {},
  formData: {
    name: "",
    pass1: "",
    count: null,
    firstName: ""
  }
};
const asyncErrorSchema = {
  type: "object",
  title: "手动设置表单错误信息",
  titleLevel: "form",
  layout: "Simple",
  relation: {},
  formData: {
    jibenitem1: {
      hy: "",
      hz: "",
      pkq: ""
    }
  },
  properties: {
    jibenitem1: {
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
};
const tabsLayoutSchema = {
  type: "object",
  title: "基础SchemaConfig",
  titleLevel: "form",
  layout: "Tabs",
  relation: {},
  formData: {
    userInfo: {
      name: "",
      age: ""
    },
    companyInfo: {
      address: "",
      scale: ""
    },
    tabOptions: {
      Simple: "Simple",
      WholeSchemaLayout: "WholeSchemaLayout",
      TitleChildLayout: "TitleChildLayout",
      Horizontal: "Horizontal"
    }
  },
  properties: {
    userInfo: {
      type: "object",
      title: "用户信息",
      layout: "Simple",
      properties: {
        name: {
          type: "string",
          title: "姓名"
        },
        age: {
          type: "string",
          title: "年龄"
        }
      }
    },
    companyInfo: {
      type: "object",
      title: "用户信息",
      layout: "Simple",
      properties: {
        address: {
          type: "string",
          title: "地址"
        },
        scale: {
          type: "string",
          title: "规模"
        }
      }
    },
    tabOptions: {
      type: "object",
      title: "可选Layout",
      layout: "Simple",
      properties: {
        Simple: {
          type: "string",
          title: "Simple"
        },
        WholeSchemaLayout: {
          type: "string",
          title: "WholeSchemaLayout"
        },
        TitleChildLayout: {
          type: "string",
          title: "TitleChildLayout"
        },
        Horizontal: {
          type: "string",
          title: "Horizontal"
        }
      }
    }
  }
};
const modalsSchema = {
  type: "object",
  title: "Modal SchemaConfig",
  titleLevel: "form",
  layout: "WholeSchemaLayout", // Simple WholeSchemaLayout TitleChildLayout, Horizontal
  // required: ["name"],
  formData: {
    jibenitem: {
      hy1: "",
      hz1: "",
      pkq: {
        hy1: "",
        hz1: ""
      }
    }
  },
  properties: {
    jibenitem: {
      type: "object",
      title: "基本信息",
      titleLevel: "one",
      layout: "Simple",
      properties: {
        hy1: {
          title: "火影",
          type: "string"
        },
        hz1: {
          title: "海贼",
          type: "string"
        },
        pkq: {
          type: "object",
          title: "Modal 表单",
          titleLevel: "one",
          modal: true, // 这来控制是否是弹窗喽
          layout: "Simple",
          properties: {
            hy1: {
              title: "柯南",
              type: "string"
            },
            hz1: {
              title: "七龙珠",
              type: "string"
            }
          }
        }
      }
    }
  },
  relation: {}
};
export {
  defaultSchema,
  relativeSchema,
  arraySchema,
  errorSchema,
  asyncErrorSchema,
  tabsLayoutSchema,
  modalsSchema
};
