import React, { PureComponent } from "react";
import { Button, Modal, TreeSelect, Row, Col, Radio } from 'antd'
import _ from 'lodash'
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
export default class CacheTreeView {
  
  constructor(treeData) {
    this.treeNodeView = this.makeTreeView(_.cloneDeep(treeData))
    CacheTreeView.treeNodeView = this.treeNodeView
  }

  static getTreeView() {
    if(!CacheTreeView.treeNodeView) {
      CacheTreeView.treeNodeView = this.treeNodeView
    }
    return CacheTreeView.treeNodeView
  }

  makeTreeView = (treeData, id = '') => {
    let result = []
    let _view
    if (!treeData) return
    for (let itemKey in treeData) {
      let item = treeData[itemKey]
      // console.log(itemKey) 
      let v = {}
      let t
      if (item == null || item == undefined) continue
      if (itemKey == 'properties') {
        // console.log('id', id)
        // console.log('itemKey', itemKey)
        t = this.makeTreeView(item)
        item.id = id
        v = (
          <TreeNode disabled value={item} valuetitle={item.title} key={itemKey}>
            {t}
          </TreeNode>
        )
      } else if (item.properties) {
        t = this.makeTreeView(item.properties, `${itemKey}`)
        item.id = id
        v = (
          <TreeNode disabled value={item} title={item.title} key={itemKey} >
            {t}
          </TreeNode>
        )
      } else {
        if(item.constructor == Object) {
          item.id = id?`${id}.${itemKey}`: `${itemKey}`
          v = (
            <TreeNode value={item.title} title={item.title || '分组信息'} key={itemKey} item={item}/>
          )
        }
      }
      if(Object.keys(v).length > 0){
        result.push(v)
      }
    }
    return result
  }
}