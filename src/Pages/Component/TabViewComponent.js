import React, { Component } from 'react';
import { Tabs } from 'antd';
import { warpComponentBySchema } from '../PageComponent';
import './tabViewAsync.scss';

const TabPane = Tabs.TabPane;

class TabViewComponentAsync extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedtab: this.parseInitedKey(props)
        }
    }

    parseInitedKey(props) {
        let { schema } = props;
        let { router } = props.oprops;
        let locationQuery = router == null ? null : router.location.query;
        if (locationQuery != null && schema.urltabkey != null) {
            let taburl = locationQuery[schema.urltabkey];
            if (taburl != null) {
                for (var i = 0; i < schema.items.length; i++) {
                    if (schema.items[i].key == taburl) {
                        return i;
                    }
                }
            }
        }
        return 0;
    }

    render() {
        if (this.props.schema.items) {
            let items = this.props.schema.items;
            let oprops = this.props.oprops;
            let defaultKey = this.state.selectedtab + "";
            return (
                <div className="tab-view-async-display">
                    <Tabs animated={false} defaultActiveKey={defaultKey}>
                        {
                            items.map((_v, index) => {
                                return (
                                    <TabPane tab={_v.title} key={index}>
                                        <div>
                                            {
                                                warpComponentBySchema(_v, oprops)
                                            }
                                        </div>
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
            )
        } else {
            throw ('Error: TabViewDisplayAsync must have the property "items"');
            return null
        }
    }
}

function warpComponent(schema, props) {
    return <TabViewComponentAsync schema={schema} oprops={props} />
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;
