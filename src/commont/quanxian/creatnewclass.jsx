import React, { Component } from 'react';
import { Button, Modal, message, Select, Input, Tag } from 'antd'
import { xiaoguanjia_zuoyeba_list, get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_student, create_own_class, get_own_class_list, edit_own_class, del_own_class } from '../../axios/http'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
const { Option } = Select
const { confirm } = Modal

class creatnewclass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            zuoyebaClass: [],
            subjectchildren: [],
            gradechildren: [],
            zuoyebaClasschildren: [],
            studentchildren: [],
            ownClassList: [],
            changeTitle: true,
            params: {
                class_name: '',
                xiaoguanjia_subject_id: [],
                xiaoguanjia_grade_id: [],
                xiaoguanjia_class_id: [],
                xiaoguanjia_student_ids: [],
                teacher_employee_id: []
            },
            creatParams: {
                own_class_id: '',
                class_name: '',
                xiaoguanjia_subject_id: [],
                xiaoguanjia_grade_id: [],
                xiaoguanjia_class_id: [],
                xiaoguanjia_student_ids: [],
                teacher_employee_id: []
            }
        }
    }
    componentDidMount() {
        const params = { ...this.state.params }
        xiaoguanjia_zuoyeba_list().then(res => {
            const zuoyebaClasschildren = res.data.list.map(res => {
                return <Option key={res.class_id} value={res.class_id} >{res.name}</Option>
            })
            this.setState({
                zuoyebaClass: res.data.list,
                zuoyebaClasschildren
            })
        })
        get_xiaoguanjia_subject().then(res => {
            const subjectchildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            this.setState({
                subjectchildren,
                subjectList: res.data.list
            })
        })
        get_xiaoguanjia_grade().then(res => {
            const gradechildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            this.setState({
                gradechildren,
                grandList: res.data.list
            })
        })
        get_own_class_list(params).then(res => {
            this.setState({
                ownClassList: res.data.list
            })
        })

    }
    showModal = () => {
        this.setState({
            visible: true,
            changeTitle: true,
        })
    }
    onOk = () => {
        const creatParams = { ...this.state.creatParams }
        const params = { ...this.state.params }
        if (this.state.changeTitle) {
            create_own_class(creatParams).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    get_own_class_list(params).then(res => {
                        this.setState({
                            ownClassList: res.data.list
                        })
                    })
                    this.setState({
                        visible: false,
                        creatParams: {
                            class_name: '',
                            xiaoguanjia_subject_id: [],
                            xiaoguanjia_grade_id: [],
                            xiaoguanjia_class_id: [],
                            xiaoguanjia_student_ids: [],
                            teacher_employee_id: []
                        }
                    })
                } else {
                    message.error(res.message)
                }
            })
        } else {
            edit_own_class(creatParams).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    get_own_class_list(params).then(res => {
                        this.setState({
                            ownClassList: res.data.list
                        })
                    })
                    this.setState({
                        visible: false,
                        creatParams: {
                            class_name: '',
                            xiaoguanjia_subject_id: [],
                            xiaoguanjia_grade_id: [],
                            xiaoguanjia_class_id: [],
                            xiaoguanjia_student_ids: [],
                            teacher_employee_id: []
                        }
                    })
                } else {
                    message.error(res.message)
                }
            })
        }
    }
    onCancel = () => {
        const creatParams = {
            class_name: '',
            xiaoguanjia_subject_id: [],
            xiaoguanjia_grade_id: [],
            xiaoguanjia_class_id: [],
            xiaoguanjia_student_ids: [],
            teacher_employee_id: []
        }
        this.setState({
            visible: false,
            creatParams
        })
    }
    searchStudents = (e, res) => {
        const creatParams = { ...this.state.creatParams }
        creatParams[res] = e
        if (res === 'xiaoguanjia_class_id') {
            const zuoyebaClass = [...this.state.zuoyebaClass]
            get_xiaoguanjia_student({ xiaoguanjia_class_id: e }).then(res => {
                const studentchildren = res.data.list.map(res => {
                    return <Option key={res.student_id} value={res.student_id} >{res.name}</Option>
                })
                const teacherchildren = zuoyebaClass.reduce((item, res) => {
                    if (e === res.class_id) {
                        res.employee_list.forEach(l2 => {
                            item.push(<Option key={l2.employee_id} value={l2.employee_id} >{l2.name}</Option>)
                        })
                    }
                    return item
                }, [])
                this.setState({
                    studentchildren,
                    teacherchildren
                })
            })
        }
        if (res === 'class_name') {
            creatParams[res] = e.target.value
        }
        this.setState({
            creatParams
        })
    }
    teachInfo = (id, teachId) => {
        const teach = this.state.zuoyebaClass.reduce((item, res) => {
            if (res.class_id === id) {
                res.employee_list.forEach(l1 => {
                    if (l1.employee_id === teachId) {
                        item = l1.name
                    }
                })
            }
            return item
        }, '')
        return teach
    }
    zuoyebaInfo = (e) => {
        const zuoyeba = this.state.zuoyebaClass.reduce((item, res) => {
            if (res.class_id === e) {
                item = res.name
            }
            return item
        }, '')
        return <Tag color="purple">{zuoyeba}</Tag>
    }
    grandInfo = (e) => {
        if (this.state.grandList) {
            const grand = this.state.grandList.reduce((item, res) => {
                if (res.xiaoguanjia_id === e) {
                    item = res.value.split('-')[1]
                }
                return item
            }, '')
            return <Tag color="volcano">{grand}</Tag>
        }
    }
    subjectInfo = (e) => {
        if (this.state.subjectList) {
            const subject = this.state.subjectList.reduce((item, res) => {
                if (res.xiaoguanjia_id === e) {
                    item = res.value.split('-')[1]
                }
                return item
            }, '')
            return <Tag color="green">{subject}</Tag>
        }
    }
    edit = (e) => {
        const creatParams = { ...this.state.creatParams }
        creatParams.class_name = e.class_name
        creatParams.xiaoguanjia_subject_id = e.xiaoguanjia_subject_id
        creatParams.xiaoguanjia_grade_id = e.xiaoguanjia_grade_id
        creatParams.xiaoguanjia_class_id = e.xiaoguanjia_class_id
        creatParams.xiaoguanjia_student_ids = e.xiaoguanjia_student_ids.split(',')
        creatParams.teacher_employee_id = e.teacher_employee_id
        creatParams.own_class_id = e.id
        get_xiaoguanjia_student({ xiaoguanjia_class_id: e.xiaoguanjia_class_id }).then(res => {
            const studentchildren = res.data.list.map(res => {
                return <Option key={res.student_id} value={res.student_id} >{res.name}</Option>
            })
            const teacherchildren = this.state.zuoyebaClass.reduce((item, res) => {
                if (e.xiaoguanjia_class_id === res.class_id) {
                    res.employee_list.forEach(l2 => {
                        item.push(<Option key={l2.employee_id} value={l2.employee_id} >{l2.name}</Option>)
                    })
                }
                return item
            }, [])
            this.setState({
                studentchildren,
                teacherchildren,
                creatParams,
                visible: true,
                changeTitle: false
            })
        })
    }
    del = (e) => {
        const params = { ...this.state.params }
        del_own_class({ own_class_id: e }).then(res => {
            confirm({
                title: '你确定要删除吗',
                content: ``,
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    if (res.code === 0) {
                        message.success(res.message)
                        get_own_class_list(params).then(res => {
                            this.setState({
                                ownClassList: res.data.list
                            })
                        })

                    } else {
                        message.error(res.message)
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

        })
    }
    render() {
        const prop = {
            visible: this.state.visible,
            onOk: this.onOk,
            onCancel: this.onCancel,
            subjectchildren: this.state.subjectchildren,
            gradechildren: this.state.gradechildren,
            studentchildren: this.state.studentchildren,
            teacherchildren: this.state.teacherchildren,
            zuoyebaClasschildren: this.state.zuoyebaClasschildren,
            searchStudents: this.searchStudents,
            creatParams: this.state.creatParams
        }
        const { ownClassList } = this.state
        return (
            <div>
                <Button onClick={this.showModal} type='primary'>班级分配</Button>
                <div className="m-flex " style={{ flexWrap: 'wrap' }}>
                    {ownClassList.map((res, index) =>
                        <div className='creatClassCard m-bottom m-flex' style={{ marginTop: 10, flexFlow: 'column', marginLeft: 10 }} key={index}>
                            <div className="m-flex" style={{ justifyContent: 'space-between' }}>
                                <p className="card-classname">{res.class_name}</p>
                                <div>
                                    <EditTwoTone onClick={() => this.edit(res)} />
                                    <DeleteTwoTone onClick={() => this.del(res.id)} twoToneColor="#f40" className='m-left' />
                                </div>
                            </div>
                            <div className="m-flex" style={{ marginTop: 10 }}>
                                <span style={{ display: 'inline-block', width: 50, color: '#9B9BA3' }}>老师：</span>
                                <span>{this.teachInfo(res.xiaoguanjia_class_id, res.teacher_employee_id)}</span>
                            </div>
                            <div className="m-flex" style={{ marginTop: 10 }}>
                                <span style={{ display: 'inline-block', width: 50, color: '#9B9BA3' }}>学生：</span>
                                <span>{res.student_str}</span>
                            </div>
                            <div className="m-flex" style={{ marginTop: 10 }}>
                                <span style={{ display: 'inline-block', width: 50, color: '#9B9BA3' }}>信息：</span>
                                <span>{this.zuoyebaInfo(res.xiaoguanjia_class_id)}{this.subjectInfo(res.xiaoguanjia_subject_id)}{this.grandInfo(res.xiaoguanjia_grade_id)}</span>
                            </div>
                        </div>
                    )}
                </div>
                <Cmodal {...prop}></Cmodal>
            </div>
        );
    }
}
const Cmodal = (props) => {
    const changeSelect = (e, res) => {
        props.searchStudents(e, res)
    }
    return (
        <div>
            <Modal
                title="创建班级"
                visible={props.visible}
                onOk={props.onOk}
                onCancel={props.onCancel}
                okText='确认'
                cancelText='取消'
            >
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>班级名称：</span>
                    <Input placeholder='设置班级名' onChange={(e) => changeSelect(e, 'class_name')} value={props.creatParams.class_name}></Input>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} placeholder="请选择学科" onChange={(e) => changeSelect(e, 'xiaoguanjia_subject_id')} value={props.creatParams.xiaoguanjia_subject_id}>
                        {props.subjectchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>年级选择：</span>
                    <Select style={{ width: '100%' }} placeholder="请选择年级" onChange={(e) => changeSelect(e, 'xiaoguanjia_grade_id')} value={props.creatParams.xiaoguanjia_grade_id}>
                        {props.gradechildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>作业吧：</span>
                    <Select style={{ width: '100%' }} placeholder="请选择作业吧班级" onChange={(e) => changeSelect(e, 'xiaoguanjia_class_id')} value={props.creatParams.xiaoguanjia_class_id}>
                        {props.zuoyebaClasschildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学生：</span>
                    <Select style={{ width: '100%' }} mode="multiple" optionFilterProp="children" showSearch placeholder="请选择学生" onChange={(e) => changeSelect(e, 'xiaoguanjia_student_ids')} value={props.creatParams.xiaoguanjia_student_ids}>
                        {props.studentchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>老师：</span>
                    <Select style={{ width: '100%' }} placeholder="请选择老师" onChange={(e) => changeSelect(e, 'teacher_employee_id')} value={props.creatParams.teacher_employee_id}>
                        {props.teacherchildren}
                    </Select>
                </div>
            </Modal>
        </div>
    )
}
export default creatnewclass;