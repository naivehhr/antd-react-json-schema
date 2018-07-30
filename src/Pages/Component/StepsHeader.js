/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import { Steps, Icon } from 'antd';
const Step = Steps.Step;

function warpComponent(schema, props) {
  let stepsui = [];
  for (var i = 0; i < schema.steps.length; i++) {
    let stepitem = schema.steps[i];
    let icon = (schema.currentIndex == i) ? stepitem.icon_current : ((schema.currentIndex > i) ? schema.icon_finish : schema.icon_unstart);
    let iconui = icon == null ? null : <Icon type={icon} />;
    stepsui.push(<Step title={stepitem.title} description={stepitem.description} icon={iconui} />);
  }
  return (<div style={{backgroundColor: 'white', padding: '10px 5px'}}>
            <Steps current={schema.currentIndex}>
              {stepsui}
            </Steps>
          </div>
          );
}

function getSampleConfig() {
  return {
          component_type: 'StepHeader',
          currentIndex: 0,
          steps: [
            {
              title: 'step1',
              description: 'step1\'s desc',
              icon_unstart: 'user',
              icon_current: 'user',
              icon_finish: 'user'
            },{
              title: 'step1',
              description: 'step1\'s desc'
            }
          ]
        };
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;