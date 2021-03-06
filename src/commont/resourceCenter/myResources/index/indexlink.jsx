import React from 'react';
import { Table } from 'antd';
import { get_questioninfo, get_paper_info } from '../../../../axios/http'
//此组件父组件负责数据，子组件负责数据操作及异步操作
const Tablelink = (props) => {
    const linkWenjian = (e) => {
        if (e.type_id === '2') {
            get_paper_info({ paper_id: e.file_id }).then(res => {
                localStorage.setItem('previewData', JSON.stringify(res.data.ques_list))
                window.open('/#/ztPreview')
            })
            return
        }
        if (e.type_id === '4') {
            get_questioninfo({ ques_id: e.file_id }).then(res => {
                props.questionInfo(res.data.model)
            })
            return
        }
        props.searchId(e)
    }
    //通过文件名来判断渲染哪一个icon图标
    const icon = (type_id) => {
        let item = ''
        switch (type_id) {
            case '4':
                item = require('../../../../img/iconshijuan.png')
                break
            case '2':
                item = require('../../../../img/iconjiangyi.png')
                break
            default:
                item = require('../../../../img/iconwenjianjia.png')
        }
        return item
    }
    const actionappear = (value, key) => {
        props.actionappear(value, key)
    }
    const columns = [
        {
            title: '文件名',
            align: 'left',
            key: 'wjj',
            render: text => (
                <div className="linkflex" onMouseLeave={() => actionappear(text, false)} onMouseEnter={() => actionappear(text, true)}>
                    <img src={icon(text.type_id)} alt="" style={{ marginRight: 10 }} />
                    <div className="link" onClick={() => linkWenjian(text)}>
                        {text.name || text.file_name}
                    </div>
                    <div className={props.l === text ? 'm-action' : 'appear'}>
                        <div className="link" onClick={text.type_id === '5' || text.type_id === undefined ? () => props.showModal(text) : () => props.showModal2(text)}>
                            重命名
                        </div>
                        {text.type_id === '5' || text.type_id === undefined ? '' :
                            <div className="link" onClick={() => props.fileMove(text)}>
                                移动
                            </div>
                        }
                        <div className="link" onClick={text.type_id === '5' || text.type_id === undefined ? () => props.showDeleteConfirm(text) : () => props.showDeleteConfirm2(text)}>
                            删除
                        </div>
                    </div>
                </div >
            )
        },
        // {
        //     title: '更新时间',
        //     dataIndex: 'time',
        //     align: 'right'
        // },

    ];
    return (
        <Table rowExpandable={(record) => false} columns={columns} dataSource={props.data} pagination={false} scroll={{ x: 0, y: 550 }} />
    )
}
export default Tablelink
