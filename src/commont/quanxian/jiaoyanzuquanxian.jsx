import React, { Component } from 'react';
import { Table, Button, Modal, Pagination, message, Input, Select } from 'antd';
import { add_teaching_group, del_teaching_group, loginUserList, get_teaching_group, get_teaching_group_detail, edit_teaching_group } from '../../axios/http'
const { confirm } = Modal;
const { Option } = Select;
class bk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //这个是查询条件
            parmas: {
                name: '',
                group_leader: '',
                page: 1,
                page_size: 100,
            },
            value: -1,
            value2: -1,
            value3: -1,
            //这个是评价自定义课件
            upParmas: {
                name: '',
                group_admin_id: '',
                member_ids: [],
                page: 1,
                page_size: 100,
            },
            totalCount: 100,
            visible: false,
            visible2: false,
            data: [
                {
                    key: '11',
                    time: 32,
                    endtime: 'New York No. 1 Lake Park',
                },
                {
                    key: '2',
                    time: 42,
                    endtime: 'London No. 1 Lake Park',
                },
                {
                    key: '3',
                    time: 32,
                    endtime: 'Sidney No. 1 Lake Park',
                },
            ]
        }
    }
    componentDidMount() {
        const parmas = this.state.parmas
        get_teaching_group(parmas).then(res => {
            const list = res.data.list.map((res, index) => {
                res.key = `${index}`
                return res
            })
            this.setState({
                data: list,
                totalCount: Number(res.data.total_count)
            })
        })

    }
    //添加账户input框
    setUsername = (e, type) => {
        const upParmas = this.state.upParmas
        upParmas[type] = e.target.value
        this.setState({
            upParmas
        })
    }
    handleOk = () => {
        const upParmas = { ...this.state.upParmas }
        const parmas = this.state.parmas
        add_teaching_group(upParmas).then(res => {
            if (res.code === 0) {
                get_teaching_group(parmas).then(res => {
                    const list = res.data.list.map((res, index) => {
                        res.key = `${index}`
                        return res
                    })
                    this.setState({
                        data: list,
                        totalCount: Number(res.data.total_count)
                    })
                })
                message.success(res.message)
                this.handleCancel()
            } else {
                message.error(res.message)
            }
        })

    };
    handleOk2 = () => {
        const upParmas = { ...this.state.upParmas }
        const parmas = this.state.parmas
        upParmas.teaching_group_id = this.state.teaching_group_id
        edit_teaching_group(upParmas).then(res => {
            if (res.code === 0) {
                get_teaching_group(parmas).then(res => {
                    const list = res.data.list.map((res, index) => {
                        res.key = `${index}`
                        return res
                    })
                    this.setState({
                        data: list,
                        totalCount: Number(res.data.total_count)
                    })
                })
                message.success(res.message)
                this.handleCancel()
            } else {
                message.error(res.message)
                this.handleCancel()
            }
        })
    };
    handleCancel = e => {
        this.setState({
            visible: false,
            visible2: false,
            visible3: false,
            zuyuan: [],
            zuzhang: '',
            fileList: [],
            title: '',
            checkList: [],
            textArea: '',
            check: [],
            check2: [],
            value: '',
            value3: '',
            upParmas: {
                name: '',
                page: 1,
                group_admin_id: '',
                member_ids: [],
                page_size: 100,
            },
        });
    };
    changePage = page => {
        const parmas = { ...this.state.parmas }
        parmas.page = page
        get_teaching_group(parmas).then(res => {
            const list = res.data.list.map((res, index) => {
                res.key = `${index}`
                return res
            })
            this.setState({
                data: list,
                totalCount: Number(res.data.total_count),
                parmas
            })
        })
    };
    search = () => {
        const parmas = this.state.parmas
        get_teaching_group(parmas).then(res => {
            if (res.code === 0) {
                const list = res.data.list.map((res, index) => {
                    res.key = `${index}`
                    return res
                })
                message.success(res.message)
                parmas.name = ''
                parmas.group_leader = ''
                this.setState({
                    data: list,
                    totalCount: Number(res.data.total_count),
                    parmas,
                    name: '',
                    group_leader: ''
                })
            } else {
                message.error(res.message)
            }

        })
    }
    changName = (e) => {
        const parmas = this.state.parmas
        parmas.name = e.target.value
        this.setState({
            name: e.target.value,
            parmas
        })
    }
    changUserName = (e) => {
        const parmas = this.state.parmas
        parmas.group_leader = e.target.value
        this.setState({
            group_leader: e.target.value,
            parmas
        })
    }



    detail = e => {
        let teaching_group_id = { teaching_group_id: e.id }
        const upParmas = this.state.upParmas
        loginUserList({
            name: '',
            username: '',
            permission: '',
            page_size: 100,
        }).then(res => {
            const children = res.data.list.map((res, index) => {
                return <Option key={res.name} value={res.name}>{res.name}</Option>
            })
            this.setState({
                children,
                visible2: true,
                user_list: res.data.list,
                teaching_group_id: e.id
            })
            return res
        }).then(item => {
            get_teaching_group_detail(teaching_group_id).then(res => {
                upParmas.group_admin_id = res.data.model.group_admin_id
                let member_ids = ''
                let member_idsList = []
                res.data.teaching_group_teacher_rela.forEach(res => {
                    item.data.list.forEach(l1=>{
                        if (res.member_admin_id === l1.id) {
                            member_ids += l1.id + ','
                            member_idsList.push(l1.name)
                        }
                    })
                })
                upParmas.member_ids = member_ids
                upParmas.name = res.data.model.name
                this.setState({
                    upParmas,
                    zuzhang: res.data.model.group_leader,
                    zuyuan: member_idsList
                })
            })
        })
    }
    showModal = () => {
        loginUserList({
            name: '',
            username: '',
            permission: '',
            page_size: 100,
        }).then(res => {
            const children = res.data.list.map((res, index) => {
                return <Option key={res.name} value={res.name} >{res.name}</Option>
            })
            this.setState({
                visible: true,
                children,
                user_list: res.data.list
            })
        })

    };




    delete = e => {
        const that = this
        let teaching_group_id = {
            teaching_group_id: e.id
        }
        const parmas = { ...this.state.parmas }
        confirm({
            title: `删除教研组：${e.name}`,
            content: '你确定要删除吗',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                del_teaching_group(teaching_group_id).then(res => {
                    if (res.code === 0) {
                        get_teaching_group(parmas).then(res => {
                            const list = res.data.list.map((res, index) => {
                                res.key = `${index}`
                                return res
                            })
                            that.setState({
                                data: list,
                                totalCount: Number(res.data.total_count),
                            })
                        })
                        message.success(res.message)
                    } else {
                        message.error(res.message)
                    }

                })
            },
            onCancel() {
            },
        });
    }
    selsectZuyuan = e => {
        const user_list = this.state.user_list
        const upParmas = { ...this.state.upParmas }
        let member_ids = ''
        e.forEach(res => {
            user_list.forEach(item => {
                if (res === item.name) {
                    member_ids += `${item.id},`
                }
            })
        })
        upParmas.member_ids = member_ids
        this.setState({
            upParmas,
            zuyuan: e
        })
    }
    selsectZuzhang = e => {
        const user_list = this.state.user_list
        const upParmas = { ...this.state.upParmas }
        let group_admin_id = ''
        user_list.forEach(item => {
            if (e === item.name) {
                group_admin_id = item.id
            }
        })
        upParmas.group_admin_id = group_admin_id
        this.setState({
            upParmas,
            zuzhang: e
        })
    }
    render() {
        const columns = [
            {
                title: '教研组长',
                dataIndex: 'group_leader',
                key: 'group_leader',
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '教研组名称',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text) => (
                    <span>
                        <Button className="m-left" type="primary" onClick={() => this.detail(text)}>修改</Button>
                        <Button className="m-left" type="danger" onClick={() => this.delete(text)}>删除</Button>
                    </span>
                ),
            },
        ];

        return (
            <div>
                <Modal
                    title="添加教研组"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>组名：</span>
                        <Input value={this.state.upParmas.name} onChange={(e) => this.setUsername(e, 'name')} placeholder="请输入组名"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>教学组长：</span>
                        <Select style={{ width: '100%' }} showSearch optionFilterProp="children"  onChange={this.selsectZuzhang} value={this.state.zuzhang} placeholder="点击添加教学组长(单选)">
                            {this.state.children}
                        </Select>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>组员：</span>
                        <Select mode="multiple" style={{ width: '100%' }} onChange={this.selsectZuyuan} value={this.state.zuyuan} tokenSeparators={[',']} placeholder="点击添加教学组员可多选O(∩_∩)O">
                            {this.state.children}
                        </Select>
                    </div>

                </Modal>
                <Modal
                    title="修改教研组"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>组名：</span>
                        <Input value={this.state.upParmas.name} onChange={(e) => this.setUsername(e, 'name')} placeholder="请输入组名"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>教学组长：</span>
                        <Select style={{ width: '100%' }} showSearch optionFilterProp="children"  onChange={this.selsectZuzhang} value={this.state.zuzhang} placeholder="点击添加教学组长(单选)">
                            {this.state.children}
                        </Select>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>组员：</span>
                        <Select mode="multiple" style={{ width: '100%' }} onChange={this.selsectZuyuan} value={this.state.zuyuan} tokenSeparators={[',']} placeholder="点击添加教学组员可多选O(∩_∩)O">
                            {this.state.children}
                        </Select>
                    </div>

                </Modal>

                <div className="m-bottom m-flex" style={{ alignItems: 'center' }}>
                    <div >
                        <Input value={this.state.name} onChange={this.changName} placeholder="请输入教研组名称"></Input>
                    </div>
                    <div className="m-left">
                        <Input value={this.state.group_leader} onChange={this.changUserName} placeholder="请输入教研组长"></Input>
                    </div>
                    <Button style={{ marginLeft: 10 }} onClick={this.search}>
                        查询
                    </Button>
                </div>
                <div className="m-bottom">
                    <Button type="primary" onClick={this.showModal}>添加教研组</Button>
                </div>
                <Table rowKey={record => record.key} columns={columns} dataSource={this.state.data} pagination={false} scroll={{ y: 500 }} />
                <Pagination className="m-Pleft" current={this.state.parmas.page} onChange={this.changePage} total={this.state.totalCount} />
            </div>
        );
    }

}
export default bk;