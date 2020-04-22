import React, { Component } from 'react';
import { Button, Modal, message, Select, Input } from 'antd'
import { xiaoguanjia_zuoyeba_list, get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_student, create_own_class, get_own_class_list } from '../../axios/http'
const { Option } = Select
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
            params: {
                class_name: '',
                xiaoguanjia_subject_id: [],
                xiaoguanjia_grade_id: [],
                xiaoguanjia_class_id: [],
                xiaoguanjia_student_ids: [],
                teacher_employee_id: []
            },
            creatParams: {
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
        const params = {...this.state.params                                              }
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
                subjectchildren
            })
        })
        get_xiaoguanjia_grade().then(res => {
            const gradechildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            this.setState({
                gradechildren
            })
        })
        get_own_class_list(params).then(res=>{
            console.log(res)
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    onOk = () => {
        const creatParams = { ...this.state.creatParams }
        create_own_class(creatParams).then(res => {
            if (res.code === 0) {
                message.success(res.message)
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
        return (
            <div>
                <Button onClick={this.showModal} type='primary'>班级分配</Button>
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