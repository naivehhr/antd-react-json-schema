const settingSchema = {
  "definitions": {
    "field_item": {
      "type": "object",
      "title": "字段",
      "required": [
        "field_id",
        "field_title"
      ],
      "properties": {
        "field_id": {
          "type": "string",
          "title": "字段ID",
        },
        "field_title": {
          "type": "string",
          "title": "字段标题"
        },
        "attribute": {
          "type": "object",
          "title": "字段属性",
          "modal":true,
          "layout":"Tabs",
          "properties": {
            "baseattr": {
              "type": "object",
              "title": "基本属性",
              "required": [
                "field_type",
                "data_type",
                "is_required",
                "invisible",
                "hidden",
                "readonly",
                "disabled"
              ],
              "properties": {
                "field_type": {
                  "type": "string",
                  "title": "输入类型",
                  "default": "blank",
                  "enum": [
                    "single",
                    "multi",
                    "blank",
                    "select"
                  ],
                  "enumNames": [
                    "单选",
                    "多选",
                    "文本",
                    "下拉列表"
                  ]
                },
                "option_group": {
                  "type": "string",
                  "title": "下拉选项",
                  "resource": "http://getoptions"
                },
                "data_type": {
                  "type": "string",
                  "title": "数据类型",
                  "default": "string",
                  "enum": [
                    "string",
                    "date",
                    "int",
                    "number",
                    "file"
                  ],
                  "enumNames": [
                    "字符型",
                    "日期型",
                    "整数型",
                    "数值型",
                    "附件型"
                  ]
                },
                "is_required": {
                  "type": "array",
                  "title": "必填场景",
                  "items": {
                    "type": "string",
                    "default": "create",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "invisible": {
                  "type": "array",
                  "title": "是否可见",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "hidden": {
                  "type": "array",
                  "title": "是否隐藏",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "readonly": {
                  "type": "array",
                  "title": "是否只读",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "disabled": {
                  "type": "boolean",
                  "title": "是否停用",
                  "default": false
                }
              }
            },
            "validate": {
              "type": "object",
              "title": "字段校验规则",
              "properties": {
                "maximum": {
                  "type": "integer",
                  "title": "最大值",
                  "default": 1000000,
                  "reftype": [
                    "number",
                    "integer"
                  ]
                },
                "minimum": {
                  "type": "integer",
                  "title": "最小值",
                  "default": 0,
                  "reftype": [
                    "number",
                    "integer"
                  ]
                },
                "maxLength": {
                  "type": "integer",
                  "title": "最大长度",
                  "default": 1000000,
                  "reftype": [
                    "string"
                  ]
                },
                "minLength": {
                  "type": "integer",
                  "title": "最小长度",
                  "default": 1,
                  "reftype": [
                    "string"
                  ]
                },
                "pattern": {
                  "type": "string",
                  "title": "正则表达式",
                  "default": "",
                  "reftype": [
                    "string"
                  ]
                },
                "format": {
                  "type": "string",
                  "title": "时间格式",
                  "default": "datetime",
                  "enums": [
                    "datetime",
                    "date"
                  ],
                  "enumNames": [
                    "年/月/日 时:分",
                    "年/月/日"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "db_field_item": {
      "type": "object",
      "title": "字段",
      "required": [
        "field_id",
        "field_title"
      ],
      "properties": {
        "field_id": {
          "type": "string",
          "title": "ID",
          "readonly":true
        },
        "field_title": {
          "type": "string",
          "title": "标题"
        },
        "attribute": {
          "type": "object",
          "title": "属性设置",
          "modal":true,
          "layout":"Tabs",
          "properties": {
            "baseattr": {
              "type": "object",
              "title": "基本属性",
              "required": [
                "field_type",
                "data_type",
                "is_required",
                "invisible",
                "hidden",
                "readonly",
                "disabled"
              ],
              "properties": {
                "field_type": {
                  "type": "string",
                  "title": "输入类型",
                  "default": "blank",
                  "enum": [
                    "single",
                    "multi",
                    "blank"
                  ],
                  "enumNames": [
                    "单选",
                    "多选",
                    "文本"
                  ]
                },
                "option_group": {
                  "type": "string",
                  "title": "下拉选项",
                  "resource": "http://getoptions"
                },
                "data_type": {
                  "type": "string",
                  "title": "数据类型",
                  "readonly": true,
                  "enum": [
                    "string",
                    "date",
                    "int",
                    "number",
                    "file"
                  ],
                  "enumNames": [
                    "字符型",
                    "日期型",
                    "整数型",
                    "数值型",
                    "附件型"
                  ]
                },
                "is_required": {
                  "type": "array",
                  "title": "是否必填",
                  "items": {
                    "type": "string",
                    "default": "create,update",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "invisible": {
                  "type": "array",
                  "title": "是否可见",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "hidden": {
                  "type": "array",
                  "title": "是否隐藏",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "readonly": {
                  "type": "array",
                  "title": "是否只读",
                  "items": {
                    "type": "string",
                    "enum": [
                      "create",
                      "update",
                      "view"
                    ],
                    "enumNames": [
                      "创建",
                      "更新",
                      "查看"
                    ]
                  },
                  "uniqueItems": true
                },
                "disabled": {
                  "type": "boolean",
                  "title": "是否停用",
                  "default": false
                }
              }
            },
            "validate": {
              "type": "object",
              "title": "校验规则",
              "properties": {
                "maximum": {
                  "type": "integer",
                  "title": "最大值",
                  "default": 1000000,
                  "reftype": [
                    "number",
                    "integer"
                  ]
                },
                "minimum": {
                  "type": "integer",
                  "title": "最小值",
                  "default": 0,
                  "reftype": [
                    "number",
                    "integer"
                  ]
                },
                "maxLength": {
                  "type": "integer",
                  "title": "最大长度",
                  "default": 1000000,
                  "reftype": [
                    "string"
                  ]
                },
                "minLength": {
                  "type": "integer",
                  "title": "最小长度",
                  "default": 1,
                  "reftype": [
                    "string"
                  ]
                },
                "pattern": {
                  "type": "string",
                  "title": "正则表达式",
                  "default": "",
                  "reftype": [
                    "string"
                  ]
                },
                "format": {
                  "type": "string",
                  "title": "时间格式",
                  "default": "datetime",
                  "enums": [
                    "datetime",
                    "date"
                  ],
                  "enumNames": [
                    "年/月/日 时:分",
                    "年/月/日"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "title": {
      "type": "object",
      "required": [
        "default"
      ],
      "properties": {
        "default": {
          "title": "默认标题",
          "type": "string"
        },
        "scenario": {
          "type": "object",
          "title": "场景标题",
          "modal":true,
          "properties": {
            "create": {
              "title": "新建",
              "type": "string"
            },
            "update": {
              "title": "更新",
              "type": "string"
            },
            "view": {
              "title": "查看",
              "type": "string"
            }
          }
        }
      }
    },
    "group_item": {
      "type": "object",
      "title": "分组",
      "required": [
        "group_key",
        "group_title"
      ],
      "properties": {
        "group_id": {
          "type": "string",
          "title": "分组ID",
          "hidden": true
        },
        "group_title": {
          "type": "string",
          "title": "分组标题"
        },
        "group_modal": {
          "type": "boolean",
          "title": "是否弹窗",
          "default": false
        },
        "group_layout": {
          "type": "string",
          "title": "分组布局",
          "default":"Simple",
          "enum": [
            "Simple",
            "Tabs",
            "Horizontal"
          ],
          "enumNames": [
            "默认",
            "标签",
            "水平"
          ]
        },
        "fields": {
          "type": "array",
          "title": "自定义字段",
          "items": {
            "$ref": "#/definitions/field_item"
          }
        },
        "groups": {
          "type": "array",
          "title": "自定义分组",
          "items": {
            "$ref": "#/definitions/group_item"
          }
        }
      }
    }
  },
  "type": "object",
  "title": "表单设置",
  "layout":"Tabs",
  "properties": {
    "form_title": {
      "title": "表单标题",
      "$ref": "#/definitions/title"
    },
    "db_fields": {
      "type": "array",
      "title": "保留字段",
      "items": [
      {
        "$ref": "#/definitions/db_field_item"
      },
      {
        "$ref": "#/definitions/db_field_item"
      }
      ]
    },
    "fields": {
      "type": "array",
      "title": "自定义字段",
      "items": {
        "$ref": "#/definitions/field_item"
      }
    },
    "groups": {
      "type": "array",
      "title": "自定义分组",
      "items": {
        "$ref": "#/definitions/group_item"
      }
    }
  }
}

export default settingSchema 


