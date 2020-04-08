import React from 'react';
import { Table } from 'antd';


//此组件父组件负责数据，子组件负责数据操作及异步操作
const Tablelink = (props) => {
    const linkWenjian = (e) => {
        props.searchId(e)
    }
    //通过文件名来判断渲染哪一个icon图标
    const icon = (text) => {
        const l1 = props.data.reduce((item, res) => {
            if (res.name === text) {
                switch (res.state) {
                    case 1:
                        item = require('../../../../img/iconwenjianjia.png')
                        break
                    case 2:
                        item = require('../../../../img/iconshijuan.png')
                        break
                    default:
                        item = require('../../../../img/iconjiangyi.png')
                }

            }
            return item
        }, [])
        return l1
    }
    const actionappear = (value, key) => {
        props.actionappear(value, key)
    }
    const columns = [
        {
            title: '文件名',
            dataIndex: 'name',
            align: 'left',
            render: text => (
                <div className="linkflex" onMouseLeave={() => actionappear(text, false)} onMouseEnter={() => actionappear(text, true)}>
                    <img src={icon(text)} alt="" style={{ marginRight: 10 }} />
                    <div className="link" onClick={() => linkWenjian(text)}>
                        {text}
                    </div>
                    <div className={props.l === text ? 'm-action' : 'appear'}>
                        <div className="link" onClick={()=>props.showModal(text)}>
                            重命名
                        </div>
                        
                        <div className="link" onClick={() => props.showDeleteConfirm(text)}>
                            删除
                        </div>
                    </div>
                </div >
            )
        },
        {
            title: '更新时间',
            dataIndex: 'time',
            align: 'right'
        },

    ];
    const rowSelection = {
        selectedRowKeys: props.selectedRowKeys,
        onChange: props.onSelectChange,
    };
    return (
        <Table rowSelection={rowSelection} columns={columns} dataSource={props.data} pagination={false} scroll={{ x: 0, y: 550 }} />
    )
}
export default Tablelink
