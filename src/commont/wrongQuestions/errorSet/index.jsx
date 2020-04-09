import React, {  useEffect } from 'react'
import { Tabs } from 'antd';
// import ErrorSet from './errorSet/index'
// import ExerciseBook from './exerciseBook/index'
// import ReportForm from './reportForm/index'
const { TabPane } = Tabs;
const Main = (props) => {
    const onTabClick = (e) => {
        switch (e) {
            case '1':
                props.history.push("/main/wrongQuestion/errorSet")
                break
            default:
                props.history.push("/main/wrongQuestion/exerciseBook")
        }
    }
    useEffect(() => {

    })
    return (
        <div>
            <Tabs defaultActiveKey='1' onChange={onTabClick}>
                <TabPane tab="小亚错题集" key="1">
                    Content of Tab 1
                </TabPane>
                <TabPane tab="小亚练习册" key="3">
                    Content of Tab 3
                </TabPane>
            </Tabs>
        </div>
    )
}
export default Main
