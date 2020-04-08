import React, { Component } from 'react';
import { Tabs, Table } from 'antd';
const { TabPane } = Tabs;
const datasource = [
    {
        id: '1',
        query: 'tom hanks bests',
        area: 'movie',
        intention: 'search_movie_info',
        tag: 'W',
        source: 'Seed'
    },
    {
        id: '2',
        query: 'do you have recommendation for movie',
        area: 'movie',
        intention: 'search_movie_info',
        tag: 'W',
        source: 'Seed'
    },
    {
        id: '3',
        query: 'what is the release date of the titanic',
        area: 'movie',
        intention: 'search_movie_info',
        tag: 'W',
        source: 'Seed'
    },
    {
        id: '4',
        query: 'where is the nearest japanese restaurant',
        area: 'food',
        intention: 'search_food_info',
        tag: 'W',
        source: 'Seed'
    }
]

class test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: 0,
            start: false
        }
    }
    // action = () => {
    //     const start = !this.state.start
    //     this.setState({
    //         start
    //     })
    //     this.time(start)
    // }
    // time = (e) => {
    //     let time = null
    //     if (e) {
    //         time = setTimeout(() => {
    //             this.setState({
    //                 result: this.state.result + 1,
    //             })
    //             this.time(this.state.start)
    //         }, 1000)
    //     } else {
    //         clearTimeout(time)
    //     }
    // }
    render() {
        const columns = [
            {
                title: 'query',
                dataIndex: 'query',
                key: 'query',
            },
            {
                title: 'area',
                dataIndex: 'area',
                key: 'area',
            },
            {
                title: 'intention',
                dataIndex: 'intention',
                key: 'intention',
            },
            {
                title: 'tag',
                dataIndex: 'tag',
                key: 'tag',
            },
            {
                title: 'source',
                dataIndex: 'source',
                key: 'source',
            },
        ];
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="语句模块" key="1">
                        <div style={{ display: 'flex', justifyContent: 'spce-between' }}>
                            <div style={{ width: '80%' }}>
                                <Table dataSource={datasource} columns={columns} pagination={false} />
                            </div>
                            <div className="m-left" style={{ display: 'flex', flexFlow: 'column', width: '20%' }}>
                                <div className="m-bottom" style={{ border: '1px solid #333', width: '100%', height: 200 }}>
                                    <input type='text' value={this.state.result}></input>
                                    <button onClick={() => this.action('add')}>开始</button>
                                    {/* <button onClick={()=>this.action('falseadd')}>-1</button> */}
                                </div>
                                <div className="m-bottom" style={{ border: '1px solid #333', width: '100%', height: 200 }}></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="语句模板" key="2">
                        语句末班
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default test;