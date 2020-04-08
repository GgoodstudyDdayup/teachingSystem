import React, { Component } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
class zy extends Component {
    render() {
        return (
            <div>
                 <Tabs defaultActiveKey="1" size="large">
                    <TabPane tab="机构题库" key="1">
                        Content of tab 1
          </TabPane>
                    <TabPane tab="系统题库" key="2">
                        Content of tab 2
          </TabPane>
                    <TabPane tab="我的题库" key="3">
                        Content of tab 3
          </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default zy;