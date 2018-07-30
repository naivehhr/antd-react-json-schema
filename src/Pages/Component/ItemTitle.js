/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import { post, get } from 'Ajax/method';
import {
	Button, Row, Col
} from 'antd';


function getActionButtons(buttons, props, warpComponentBySchema) {
  let buttonuis = [];
  if (buttons != null && buttons.length > 0) {
      for (var i = 0; i < buttons.length; i++) {
        buttonuis.push(warpComponentBySchema(buttons[i], props, warpComponentBySchema))
      }    
  }
  return buttonuis;
}

function warpComponent(schema, props, warpComponentBySchema) {
  let buttonuis = getActionButtons(schema.buttons, props, warpComponentBySchema);
  return <Row style={{ margin: '0px 0 10px 0'}}>
          <Col span="24">
            <h1 style={{ float: 'left' }}>{ schema.title }</h1>
            <div style={{ float: 'right' }}>
              { buttonuis }
            </div>
          </Col>
        </Row>;
}

    

function getSampleConfig() {
  return {
          component_type: 'ItemTitle',
            title: '客户列表',
            leftbtnlink: '/customer/create',
            leftbtnlabel: '新建客户'
        };
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;