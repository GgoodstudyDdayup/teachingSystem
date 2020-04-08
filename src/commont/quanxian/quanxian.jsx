import React, { Component } from 'react';
import { Table, Button, Modal, Radio, Pagination, message, Input, Checkbox, Tag, Select } from 'antd';
import { add_user, quanxianList, loginUserList, grade_id_List, object_id_List, delete_user, get_user_detail, edit_user, change_password, get_user_by_set, get_company_list, set_user_school_rela } from '../../axios/http'
const { confirm } = Modal;
const { Option } = Select

class bk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //这个是查询条件
            parmas: {
                name: '',
                username: '',
                permission: '',
                page: 1,
                page_size: 10,
            },
            textArea: '',
            title: '',
            value: -1,
            value2: -1,
            value3: -1,
            //这个是评价自定义课件
            upParmas: {
                username: '',
                password: '',
                name: '',
                mobile: '',
                permission: '',
                teacher_type: '',
                grade_ids: '',
                own_subject_ids: ''
            },
            schoolParmas: {
                user_id: '',
                company_ids: ''
            },
            check: [],
            check2: [],
            grade_list: [],
            own_subject_list: [],
            totalCount: 100,
            obj: {
                has_zhishijingjiang: '知识精讲',
                has_sandianpouxi: '三点剖析',
                has_liti: '例题',
                has_suilian: '随练',
                has_kuozhan: '扩展',
            },
            time: new Date(),
            fileList: [],
            checkList: [],
            visible: false,
            visible3: false,
            permission: [],
            permission2: [],
            data: [
            ],
            selsectSchool: []
        }
    }
    componentDidMount() {
        let myDate = new Date();
        let time = myDate.toLocaleDateString().split("/").join("-");
        const parmas = this.state.parmas
        parmas['starttime'] = time
        if (sessionStorage.getItem('permission') === '1' || sessionStorage.getItem('permission') === '2') {
            quanxianList().then(res => {
                let permission = res.data.list
                if (sessionStorage.getItem('permission') === '2') {
                    const newPermission = permission.reduce((item, res) => {
                        if (res.id !== '1' && res.id !== '2') {
                            item.push(res)
                        }
                        return item
                    }, [])
                    permission.unshift({
                        id: '',
                        name: '不限'
                    })
                    this.setState({
                        permission: newPermission,
                        permission2: permission
                    })
                } else {
                    const newPermission = permission.reduce((item, res) => {
                        if (res.id !== '1') {
                            item.push(res)
                        }
                        return item
                    }, [])
                    permission.unshift({
                        id: '',
                        name: '不限'
                    })
                    this.setState({
                        permission: newPermission,
                        permission2: permission
                    })
                }

                // store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
            })
            get_company_list().then(res => {
                const company_list = res.data.company_list.map((res, index) => {
                    return <Option key={res.company} value={res.company} >{res.company}</Option>
                })
                this.setState({
                    companyList: res.data.company_list,
                    company_list
                })
                loginUserList(parmas).then(res => {
                    const list = res.data.list.map((res, index) => {
                        res.key = `${index}`
                        return res
                    })
                    this.setState({
                        data: list,
                        totalCount: Number(res.data.total_count)
                    })
                })
            })
            grade_id_List().then(res => {
                const grade_list2 = res.data.grade_list.map(res => {
                    return res.name
                })
                this.setState({
                    grade_list: res.data.grade_list,
                    grade_list2
                })
            })
            object_id_List().then(res => {
                const own_subject_list2 = res.data.own_subject_list.map(res => {
                    return res.name
                })
                this.setState({
                    own_subject_list: res.data.own_subject_list,
                    own_subject_list2
                })
            })
            get_user_by_set().then(res => {
                const user_byCanSet = res.data.list.map((res, index) => {
                    return <Option key={res.name} value={res.name} >{res.name}</Option>
                })
                this.setState({
                    user_byCanSet,
                    userbyCanSetList: res.data.list
                })
            })
        } else {
            this.props.history.push("/main")
            message.error('暂时无权限')
        }

    }
    quanxianList = (list) => {
        const result = list.map((res, index) => {
            return <Radio value={Number(res.id)} key={index}>{res.name}</Radio>
        })
        return result
    }
    //添加账户input框
    setUsername = (e, type) => {
        const upParmas = this.state.upParmas
        upParmas[type] = e.target.value
        this.setState({
            upParmas
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    schoolSet = () => {
        this.setState({
            schoolSet: true
        });
    }
    handleOk = () => {
        const upParmas = { ...this.state.upParmas }
        const parmas = { ...this.state.parmas }
        const grade_list = this.state.grade_list
        const own_subject_list = this.state.own_subject_list
        const check = this.state.check
        const check2 = this.state.check2
        if (check.length < 0) {
            message.error('请填写必填项')
            return false
        } else {
            let grade = ''
            let object = ''
            check.forEach(res => {
                grade_list.forEach(res2 => {
                    if (res2.name === res) {
                        grade += res2.id + ','
                    }
                })
            })
            check2.forEach(res => {
                own_subject_list.forEach(res2 => {
                    if (res2.name === res) {
                        object += res2.id + ','
                    }
                })
            })
            upParmas.grade_ids = grade
            upParmas.own_subject_ids = object
            add_user(upParmas).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    loginUserList(parmas).then(res => {
                        const list = res.data.list.map((res, index) => {
                            res.key = `${index}`
                            return res
                        })
                        this.setState({
                            data: list,
                            totalCount: Number(res.data.total_count),
                        })
                    })
                    this.handleCancel()
                } else {
                    message.success(res.message)
                    this.handleCancel()
                }
            })
        }
    };
    handleOk2 = () => {
        const upParmas = { ...this.state.upParmas }
        const parmas = { ...this.state.parmas }
        const grade_list = this.state.grade_list
        const own_subject_list = this.state.own_subject_list
        const check = this.state.check
        const check2 = this.state.check2
        if (check.length < 0) {
            message.error('请填写必填项')
            return false
        } else {
            let grade = ''
            let object = ''
            check.forEach(res => {
                grade_list.forEach(res2 => {
                    if (res2.name === res) {
                        grade += res2.id + ','
                    }
                })
            })
            check2.forEach(res => {
                own_subject_list.forEach(res2 => {
                    if (res2.name === res) {
                        object += res2.id + ','
                    }
                })
            })
            upParmas.grade_ids = grade
            upParmas.own_subject_ids = object
            edit_user(upParmas).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    loginUserList(parmas).then(res => {
                        const list = res.data.list.map((res, index) => {
                            res.key = `${index}`
                            return res
                        })
                        this.setState({
                            data: list,
                            totalCount: Number(res.data.total_count),
                        })
                    })
                    this.handleCancel()
                } else {
                    message.success(res.message)
                    this.handleCancel()
                }
            })
        }
    };
    handleOk3 = () => {
        const upParmas = this.state.upParmas
        const data = {
            user_id: this.state.user_id,
            password: upParmas.password
        }
        change_password(data).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                this.handleCancel()
            } else {
                message.error(res.message)
                this.handleCancel()
            }
        })
    };
    schoolSetOk = () => {
        const schoolParmas = { ...this.state.schoolParmas }
        set_user_school_rela(schoolParmas).then(res => {
            if (res.code === 0) {
                this.schoolSetCancel()
                message.success(res.message)
            } else {
                this.schoolSetCancel()
                message.error(res.message)
            }
        })
    }
    handleCancel = e => {
        this.setState({
            visible: false,
            visible2: false,
            visible3: false,
            fileList: [],
            title: '',
            checkList: [],
            textArea: '',
            check: [],
            check2: [],
            value: '',
            value3: '',
            upParmas: {
                id: '',
                status: null,
                comment: ''
            },
        });
    };
    schoolSetCancel = e => {
        this.setState({
            visible: false,
            visible2: false,
            visible3: false,
            schoolSet: false,
            fileList: [],
            title: '',
            checkList: [],
            textArea: '',
            check: [],
            check2: [],
            value: '',
            value3: '',
            schoolParmas: {
                user_id: '',
                company_ids: ''
            },
            upParmas: {
                id: '',
                status: null,
                comment: ''
            },
            selsectWatchUser: '',
            selsectSchool: []
        });
    }
    handleChange = info => {
        let fileList = [...info.fileList];
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);
        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                if (file.response.data.code !== 106) {
                    file.url = file.response.data.full_path;
                } else {
                    return false
                }
            }
            // Component will show file.url as link
            return file
        })
        this.setState({ fileList });
    };
    changeTitle = (e) => {
        const upParmas = { ...this.state.upParmas }
        upParmas.title = e.target.value
        this.setState({
            title: e.target.value,
            upParmas
        })
    }
    changePage = page => {
        const parmas = { ...this.state.parmas }
        parmas.page = page
        loginUserList(parmas).then(res => {
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
        loginUserList(parmas).then(res => {
            if (res.code === 0) {
                const list = res.data.list.map((res, index) => {
                    res.key = `${index}`
                    return res
                })
                message.success(res.message)
                parmas.name = ''
                parmas.username = ''
                this.setState({
                    data: list,
                    totalCount: Number(res.data.total_count),
                    parmas,
                    name: '',
                    username: ''
                })
            } else {
                message.error(res.message)
            }

        })
    }
    selectonChange = (value) => {
        const parmas = this.state.parmas
        parmas.subject_id = value[1]
        this.setState({
            parmas
        })
    }
    onChangecheckbox = (e) => {
        const upParmas = { ...this.state.upParmas }
        let check = this.state.check
        upParmas.grade_ids = e
        check = e
        this.setState({
            check,
            upParmas
        });
    }
    onChangecheckbox2 = (e) => {
        const upParmas = { ...this.state.upParmas }
        let check2 = this.state.check2
        upParmas.own_subject_ids = e
        check2 = e
        this.setState({
            check2,
            upParmas
        });
    }
    //这是查询的
    onchangeTuanduiRadio = (e) => {
        const parmas = this.state.parmas
        parmas.permission = e.target.value
        this.setState({
            value2: e.target.value,
            parmas
        })
    }

    //这是修改的
    onchangeStateRadio = (e) => {
        const upParmas = this.state.upParmas
        upParmas.permission = e.target.value
        this.setState({
            value: e.target.value,
            upParmas
        })
    }
    onChangeteachType = e => {
        const upParmas = this.state.upParmas
        upParmas.teacher_type = e.target.value
        this.setState({
            value3: e.target.value,
            upParmas
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
        parmas.username = e.target.value
        this.setState({
            username: e.target.value,
            parmas
        })
    }
    tagC = (e) => {
        if (e) {
            const tagList = e.split(',').map((res, index) => {
                return <Tag color='green' key={index}>{res}</Tag>
            })
            return tagList
        }
    }
    quanxianTag = (e) => {
        console.log(e)
        const permission = [{
            id: '1',
            name: "系统管理员"
        }, {
            id: '2',
            name: "管理员"
        }, {
            id: '3',
            name: "老师"
        }, {
            id: '4',
            name: "教务"
        }, {
            id: '5',
            name: "招生负责人"
        }, {
            id: '6',
            name: "前台"
        }]
        let name = ''
        permission.forEach(res => {
            if (res.id === e) {
                name = res.name
            }
        })
        return <Tag color='geekblue' >{name}</Tag>
    }
    teachTag = e => {
        let name = ''
        if (e === '1') {
            name = '校助'
        } else if (e === '2') {
            name = '教学主管'
        } else if (e === '3') {
            name = '教研组长'
        } else {
            name = '普通老师'
        }
        return <Tag color='geekblue' >{name}</Tag>
    }
    own_school = e => {
        const companyList = this.state.companyList
        const list = []
        if (e.mul_company_ids) {
            e.mul_company_ids.split(',').forEach((res, index) => {
                companyList.forEach((l1, index) => {
                    if (res === l1.id) {
                        list.push(<Tag color='geekblue' key={index}>{l1.company}</Tag>)
                    }
                })
            })
            return list
        } else {
            let company = ''
            companyList.forEach((l1) => {
                if (l1.id === e.company_id) {
                    company = l1.company
                }
            })
            return <Tag color='geekblue'>{company}</Tag>
        }
    }
    detail = e => {
        let user_id = { user_id: e.id }
        const grade_list = this.state.grade_list
        const own_subject_list = this.state.own_subject_list
        const upParmas = this.state.upParmas
        let value = this.state.value
        let value3 = this.state.value3

        get_user_detail(user_id).then(res => {
            upParmas.name = res.data.model.name
            upParmas.username = res.data.model.username
            upParmas.user_id = res.data.model.id
            upParmas.permission = res.data.model.permission
            upParmas.teacher_type = res.data.model.teacher_type
            value = Number(res.data.model.permission)
            value3 = Number(res.data.model.teacher_type)
            if (res.data.model.tags) {
                const tags = res.data.model.tags.split(',')
                const check = []
                const check2 = []
                tags.forEach(res => {
                    grade_list.forEach(l1 => {
                        if (res === l1.name) {
                            check.push(l1.name)
                        }
                    })

                })
                tags.forEach(res => {
                    own_subject_list.forEach(l1 => {
                        if (res === l1.name) {
                            check2.push(l1.name)
                        }
                    })
                })
                this.setState({
                    check,
                    check2,
                    upParmas,
                    value,
                    value3,
                    visible2: true,
                    user_id
                })
            } else {
                this.setState({
                    upParmas,
                    value,
                    value3,
                    visible2: true,
                    user_id
                })
            }

        })


    }
    delete = e => {
        const that = this
        let user_id = {
            user_id: e.id
        }
        const parmas = { ...this.state.parmas }
        confirm({
            title: `删除账号：${e.name}`,
            content: '你确定要删除吗',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                delete_user(user_id).then(res => {
                    if (res.code === 0) {
                        loginUserList(parmas).then(res => {
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
    detailPassword = e => {
        this.setState({
            user_id: e.id,
            visible3: true,
        })
    }
    quanxianAction = e => {
        if (sessionStorage.getItem('permission') === '1') {
            if (e.permission === '1') {
                const btnPermission = (
                    <div>
                        {/* <Button className="m-left" type="primary" onClick={() => this.detail(e)}>修改</Button> */}
                        <Button type="primary" onClick={() => this.detailPassword(e)}>修改密码</Button>
                    </div>
                )
                return btnPermission
            } else {
                const btnPermission = (
                    <div>
                        <Button type="primary" onClick={() => this.detailPassword(e)}>修改密码</Button>
                        <Button className="m-left" type="primary" onClick={() => this.detail(e)}>修改</Button>
                        <Button className="m-left" type="danger" onClick={() => this.delete(e)}>删除</Button>
                    </div>
                )
                return btnPermission
            }
        } else if (sessionStorage.getItem('permission') === '2') {
            if (e.permission === '1') {
                return <Tag color='volcano' >暂无权限</Tag>
            } else if (e.permission === '2' && e.username !== sessionStorage.getItem('username')) {
                return <Tag color='volcano' >暂无权限</Tag>
            } else if (e.permission === '2' && e.username === sessionStorage.getItem('username')) {
                const btnPermission = (
                    <div>
                        <Button type="primary" onClick={() => this.detailPassword(e)}>修改密码</Button>
                    </div>
                )
                return btnPermission
            } else {
                const btnPermission = (
                    <div>
                        <Button type="primary" onClick={() => this.detailPassword(e)}>修改密码</Button>
                        <Button className="m-left " type="primary" onClick={() => this.detail(e)}>修改</Button>
                        <Button className="m-left " type="danger" onClick={() => this.delete(e)}>删除</Button>
                    </div>
                )
                return btnPermission
            }

        }
    }
    selsectSchool = (e) => {
        const companyList = this.state.companyList
        const schoolParmas = { ...this.state.schoolParmas }
        let company_ids = ''
        e.forEach(res => {
            companyList.forEach(item => {
                if (res === item.company) {
                    company_ids += `${item.id},`
                }
            })
        })
        schoolParmas.company_ids = company_ids
        this.setState({
            schoolParmas,
            selsectSchool: e
        })
        console.log(schoolParmas)
    }
    selsectWatchUser = (e) => {
        const userbyCanSetList = this.state.userbyCanSetList
        const schoolParmas = { ...this.state.schoolParmas }
        let user_id = ''
        userbyCanSetList.forEach(item => {
            if (e === item.name) {
                user_id += `${item.id},`
            }
        })
        schoolParmas.user_id = user_id
        this.setState({
            schoolParmas,
            selsectWatchUser: e
        })
    }
    render() {
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                align: 'center',
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '拥有权限',
                dataIndex: 'permission',
                key: 'permission',
                align: 'center',
                render: (text) => (
                    <span>
                        {this.quanxianTag(text)}
                    </span>
                ),
            },
            {
                title: '老师类型',
                dataIndex: 'teacher_type',
                key: 'teacher_type',
                align: 'center',
                render: (text) => (
                    <span>
                        {this.teachTag(text)}
                    </span>
                ),
            },
            {
                title: '归属校区',
                key: 'mul_company_ids',
                align: 'center',
                render: (text) => (
                    <span>
                        {this.own_school(text)}
                    </span>
                ),
            },
            {
                title: '年级和学科',
                dataIndex: 'tags',
                key: 'tags',
                align: 'center',
                render: (text) => (
                    <span>
                        {this.tagC(text)}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                width: 300,
                render: (text) => (
                    <span>
                        {this.quanxianAction(text)}
                    </span>
                ),
            },
        ];
        return (
            <div>
                <Modal
                    title="添加账户"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>用户名：</span>
                        <Input value={this.state.upParmas.username} onChange={(e) => this.setUsername(e, 'username')} placeholder="请输入用户名"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>登录密码：</span>
                        <Input text='password' value={this.state.upParmas.password} onChange={(e) => this.setUsername(e, 'password')} placeholder="请输入登录密码"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>姓名：</span>
                        <Input text='password' value={this.state.upParmas.name} onChange={(e) => this.setUsername(e, 'name')} placeholder="请输入姓名"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>手机号码：</span>
                        <Input text='password' value={this.state.upParmas.mobile} onChange={(e) => this.setUsername(e, 'mobile')} placeholder="请输入手机号码"></Input>
                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">权限设置：</span>
                        <Radio.Group onChange={this.onchangeStateRadio} value={this.state.value}>
                            {this.quanxianList(this.state.permission)}
                        </Radio.Group>
                    </div>
                    <div className="m-flex m-bottom">

                        <span className="m-row">老师类型：</span>
                        <Radio.Group onChange={this.onChangeteachType} value={this.state.value3}>
                            <Radio value={1} >校助</Radio>
                            <Radio value={2} >教学主管</Radio>
                            <Radio value={3} >教研组长</Radio>
                            <Radio value={4} >普通老师</Radio>
                        </Radio.Group>
                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">年级(多选)：</span>
                        <Checkbox.Group
                            options={this.state.grade_list2}
                            value={this.state.check}
                            onChange={this.onChangecheckbox}
                        />

                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">学科(多选)：</span>
                        <Checkbox.Group
                            options={this.state.own_subject_list2}
                            value={this.state.check2}
                            onChange={this.onChangecheckbox2}
                        />
                    </div>
                </Modal>


                <Modal
                    title="修改账户"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>用户名：</span>
                        <Input value={this.state.upParmas.username} onChange={(e) => this.setUsername(e, 'username')} placeholder="请输入用户名"></Input>
                    </div>

                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>姓名：</span>
                        <Input text='password' value={this.state.upParmas.name} onChange={(e) => this.setUsername(e, 'name')} placeholder="请输入姓名"></Input>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>手机号码：</span>
                        <Input text='password' value={this.state.upParmas.mobile} onChange={(e) => this.setUsername(e, 'mobile')} placeholder="请输入手机号码"></Input>
                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">权限设置：</span>
                        <Radio.Group onChange={this.onchangeStateRadio} value={this.state.value}>
                            {this.quanxianList(this.state.permission)}
                        </Radio.Group>
                    </div>
                    <div className="m-flex m-bottom">

                        <span className="m-row">老师类型：</span>
                        <Radio.Group onChange={this.onChangeteachType} value={this.state.value3}>
                            <Radio value={1} >校助</Radio>
                            <Radio value={2} >教学主管</Radio>
                            <Radio value={3} >教研组长</Radio>
                            <Radio value={4} >普通老师</Radio>
                        </Radio.Group>
                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">年级(多选)：</span>
                        <Checkbox.Group
                            options={this.state.grade_list2}
                            value={this.state.check}
                            onChange={this.onChangecheckbox}
                        />

                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">学科(多选)：</span>
                        <Checkbox.Group
                            options={this.state.own_subject_list2}
                            value={this.state.check2}
                            onChange={this.onChangecheckbox2}
                        />
                    </div>
                </Modal>

                <Modal
                    title="修改密码"
                    visible={this.state.visible3}
                    onOk={this.handleOk3}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>密码：</span>
                        <Input value={this.state.upParmas.password} onChange={(e) => this.setUsername(e, 'password')} placeholder="请输新密码"></Input>
                    </div>
                </Modal>

                <Modal
                    title="跨校区设置"
                    visible={this.state.schoolSet}
                    onOk={this.schoolSetOk}
                    onCancel={this.schoolSetCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>查看者：</span>
                        <Select style={{ width: '100%' }} showSearch optionFilterProp="children" onChange={this.selsectWatchUser} value={this.state.selsectWatchUser} placeholder="点击添加跨校区查看者(单选)">
                            {this.state.user_byCanSet}
                        </Select>
                    </div>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>校区选择：</span>
                        <Select mode="multiple" style={{ width: '100%' }} onChange={this.selsectSchool} value={this.state.selsectSchool} tokenSeparators={[',']} placeholder="点击添加校区选择可多选O(∩_∩)O">
                            {this.state.company_list}
                        </Select>
                    </div>
                </Modal>
                <div className="m-bottom m-flex" style={{ alignItems: 'center' }}>
                    <div >
                        <Input value={this.state.name} onChange={this.changName} placeholder="请输入要查询的老师"></Input>
                    </div>
                    <div className="m-left">
                        <Input value={this.state.username} onChange={this.changUserName} placeholder="请输入要查询的用户名"></Input>
                    </div>
                    <div className="m-left">
                        <span>权限查询: </span>
                        <Radio.Group onChange={this.onchangeTuanduiRadio} value={this.state.value2}>
                            {this.quanxianList(this.state.permission2)}
                        </Radio.Group>
                    </div>
                    <Button style={{ marginLeft: 10 }} onClick={this.search}>
                        查询
                    </Button>
                </div>
                <div className="m-bottom m-flex">
                    <Button type="primary" onClick={this.showModal}>添加账号</Button>
                    {sessionStorage.getItem('permission') === '1' ? <Button className="m-left" type="primary" onClick={this.schoolSet}>跨校区账号设置</Button> : ''}
                </div>
                <Table rowKey={record => record.key} columns={columns} dataSource={this.state.data} pagination={false} scroll={{ y: 500 }} />
                <Pagination className="m-Pleft" current={this.state.parmas.page} onChange={this.changePage} total={this.state.totalCount} />
            </div>
        );
    }
}
export default bk;