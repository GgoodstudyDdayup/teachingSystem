import React, { Component } from 'react';
import { Modal, message, Select, Tag, Divider, List, Avatar } from 'antd'
import { xiaoguanjia_zuoyeba_list, get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_student, get_own_class_list, del_own_class, set_student_wrong_analysis, get_wrong_student_set } from '../../axios/http'
// import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
const { Option } = Select
const { confirm } = Modal

class creatnewclass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            zuoyebaClass: [],
            subjectchildren: [],
            nextSubjectChildren: [],
            gradechildren: [],
            zuoyebaClasschildren: [],
            studentchildren: [],
            ownClassList: [],
            changeTitle: true,
            zuoyeba: [],
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
            },
            newParams: {
                xiaoguanjia_class_id: "",
                xiaoguanjia_class_name: "",
                xiaoguanjia_student_list: [{
                    student_id: "",
                    student_name: ""

                }],
                subject_teacher_list: []
            },
            appearId: '',
            teachIndex: 0,
            zuoyebaTeacher: [],
            bottomData: []
        }
    }
    componentDidMount() {
        const params = { ...this.state.params }
        //作业吧接口获取作业班班级，并且将每一个作业吧老师进行分类
        xiaoguanjia_zuoyeba_list().then(res => {
            const zuoyebaTeacher = res.data.list.map(res => {
                const result = []
                res.employee_list.forEach(res2 => {
                    result.push(<Option key={res2.employee_id} value={res2.employee_id} >{res2.name}</Option>)
                })
                return result
            })
            this.setState({
                zuoyeba: res.data.list,
                zuoyebaTeacher

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
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleSize);
    }
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
            changeTitle: true,
        })
    }
    onOk = () => {
        const newParams = { ...this.state.newParams }
        console.log()
        set_student_wrong_analysis({ json_str: JSON.stringify(newParams) }).then(res => {
            console.log(res)
            if (res.code === 0) {
                message.success(res.message)
                get_xiaoguanjia_student({ xiaoguanjia_class_id: this.state.appearId }).then(res => {
                    this.setState({
                        studentchildren: res.data.list,
                        newParams,
                        bottomData: [],
                        visible: false
                    })
                })
            } else {
                message.error(res.message)
            }
        })
        // if (this.state.changeTitle) {
        //     create_own_class(creatParams).then(res => {
        //         if (res.code === 0) {
        //             message.success(res.message)
        //             get_own_class_list(params).then(res => {
        //                 this.setState({
        //                     ownClassList: res.data.list
        //                 })
        //             })
        //             this.setState({
        //                 visible: false,
        //                 creatParams: {
        //                     class_name: '',
        //                     xiaoguanjia_subject_id: [],
        //                     xiaoguanjia_grade_id: [],
        //                     xiaoguanjia_class_id: [],
        //                     xiaoguanjia_student_ids: [],
        //                     teacher_employee_id: []
        //                 }
        //             })
        //         } else {
        //             message.error(res.message)
        //         }
        //     })
        // } else {
        //     edit_own_class(creatParams).then(res => {
        //         if (res.code === 0) {
        //             message.success(res.message)
        //             get_own_class_list(params).then(res => {
        //                 this.setState({
        //                     ownClassList: res.data.list
        //                 })
        //             })
        //             this.setState({
        //                 visible: false,
        //                 creatParams: {
        //                     class_name: '',
        //                     xiaoguanjia_subject_id: [],
        //                     xiaoguanjia_grade_id: [],
        //                     xiaoguanjia_class_id: [],
        //                     xiaoguanjia_student_ids: [],
        //                     teacher_employee_id: []
        //                 }
        //             })
        //         } else {
        //             message.error(res.message)
        //         }
        //     })
        // }
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
    searchStudents = (e, res, index) => {
        const creatParams = { ...this.state.creatParams }
        creatParams[res] = e
        const newParams = this.state.newParams
        const shaixuanTeacherId = (subject_id) => {
            const result = this.state.bottomData.reduce((item, res) => {
                console.log(res, subject_id)
                if (res.subject_id === subject_id) {
                    item = res.teacher_employee_ids
                }
                return item
            }, [])
            console.log(result)
            return result
        }
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
        if (res === 'xiaoguanjia_subject_id') {
            const bottomData = this.state.subjectchildren.reduce((item, res) => {
                e.forEach(res2 => {
                    if (res.props.value === res2) {
                        item.push(
                            {
                                subject_id: res.props.value,
                                subject_name: res.props.children,
                                teacher_employee_ids: shaixuanTeacherId(res.props.value)
                            }
                        )
                    }
                })
                return item
            }, [])
            newParams.subject_teacher_list = bottomData
            this.setState({
                nextSubjectChildren: e,
                bottomData,
                newParams
            })
        }
        if (res === 'teacher_employee_id') {
            const bottomData = this.state.bottomData
            bottomData[index].teacher_employee_ids = e
            newParams.subject_teacher_list = bottomData
            this.setState({
                bottomData,
                newParams
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
    editStudent = (e, student_id,index) => {
        const creatParams = this.state.creatParams
        creatParams.xiaoguanjia_subject_id = []
        e.stopPropagation()
        const teacherListFunt = (res) => {
            const l1 = Array.isArray(res) ? res : [res]
            const result = l1.map(ress => {
                return ress.teacher_employee_id
            })
            return result
        }
        get_wrong_student_set({ student_id }).then(res => {
            const sbjList = res.data.list.map(res => {
                creatParams.xiaoguanjia_subject_id.push(res.xiaoguanjia_subject_id)
                return {
                    subject_id: res.xiaoguanjia_subject_id,
                    subject_name: res.xiaoguanjia_subject_name,
                    teacher_employee_ids: teacherListFunt(res.teacher_list)
                }
            })
            this.setState({
                bottomData:sbjList,
                creatParams,
                visible: true,
                teachIndex:index
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
    //点击时获取对应作业吧学生数据
    appear = (class_id, name) => {
        const newParams = this.state.newParams
        get_xiaoguanjia_student({ xiaoguanjia_class_id: class_id }).then(res => {
            if (this.state.appearId === class_id) {
                newParams.xiaoguanjia_class_id = ''
                newParams.xiaoguanjia_class_name = ''
                this.setState({
                    appearId: '',
                    studentchildren: res.data.list,
                    newParams
                })
            } else {
                newParams.xiaoguanjia_class_id = class_id
                newParams.xiaoguanjia_class_name = name
                this.setState({
                    appearId: class_id,
                    studentchildren: res.data.list,
                    newParams
                })
            }
        })
    }
    set = (e, student_id, index, student_name) => {
        e.stopPropagation()
        const newParams = this.state.newParams
        let bottomData = this.state.bottomData
        bottomData = []
        newParams.xiaoguanjia_student_list = []
        newParams.xiaoguanjia_student_list.push({ student_name, student_id })
        this.setState({
            visible: true,
            teachIndex: index,
            newParams,
            bottomData
        })
        console.log(student_id)
    }
    render() {
        const { zuoyeba, studentchildren, appearId } = this.state
        const prop = {
            visible: this.state.visible,
            onOk: this.onOk,
            onCancel: this.onCancel,
            subjectchildren: this.state.subjectchildren,
            gradechildren: this.state.gradechildren,
            studentchildren: this.state.studentchildren,
            teacherchildren: this.state.zuoyebaTeacher,
            zuoyebaClasschildren: this.state.zuoyebaClasschildren,
            searchStudents: this.searchStudents,
            creatParams: this.state.creatParams,
            teachIndex: this.state.teachIndex,
            bottomData: this.state.bottomData
        }
        return (
            <div>
                <div className="m-card" style={this.state.height > 638 ? { maxHeight: 600, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' } : { maxHeight: 400, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' }}>
                    {zuoyeba.map((res, index) =>
                        <div key={res.class_id} onClick={() => this.appear(res.class_id, res.name)}>
                            <div className="listT"  >
                                <div className="know-name-m m-flex" >
                                    <div dangerouslySetInnerHTML={{ __html: res.name }}></div>
                                </div>
                                <Divider dashed />
                                {appearId === res.class_id ? <List
                                    itemLayout="horizontal"
                                    dataSource={studentchildren}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[item.subject_str !== '' ? <div onClick={(e) => this.editStudent(e, item.student_id, index, item.name)}>编辑</div> : <div onClick={(e) => this.set(e, item.student_id, index, item.name)}>设置</div>]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                title={item.name}
                                                description={item.subject_str}
                                            />
                                        </List.Item>
                                    )}
                                /> : ''}
                            </div>
                        </div>
                    )}
                </div>
                <Cmodal {...prop}></Cmodal>
            </div>
        )
    }
}
const Cmodal = (props) => {
    const changeSelect = (e, res, index) => {
        props.searchStudents(e, res, index)
    }
    return (
        <div>
            <Modal
                title="学生错题解析分配"
                visible={props.visible}
                onOk={props.onOk}
                onCancel={props.onCancel}
                okText='确认'
                cancelText='取消'
            >
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} mode="multiple" optionFilterProp="children" showSearch placeholder="请选择学科" onChange={(e) => changeSelect(e, 'xiaoguanjia_subject_id')} value={props.creatParams.xiaoguanjia_subject_id}>
                        {props.subjectchildren}
                    </Select>
                </div>
                {props.bottomData.map((res, index) =>
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }} key={res.subject_id}>
                        <span className="m-row" style={{ textAlign: 'right' }}> {res.subject_name}：</span>
                        <Select style={{ width: '100%' }} placeholder="请选择对应学科老师(第一位为主教，之后为助教)" mode="multiple" optionFilterProp="children" showSearch onChange={(e) => changeSelect(e, 'teacher_employee_id', index)} value={res.teacher_employee_ids}>
                            {props.teacherchildren[props.teachIndex]}
                        </Select>
                    </div>
                )
                }
            </Modal>
        </div>
    )
}
export default creatnewclass;