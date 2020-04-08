import React, { Component } from 'react';
import { Table, Button, DatePicker, Modal, Radio, Pagination, message, Input, Tag } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN'
import Select from '../tk/selection'
import { jindu, subjectList, jiangyishenghe } from '../../axios/http'
import store from '../../store/index'
import { XueKeActionCreators } from '../../actions/XueKeList'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn')
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD'
class bk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //这个是查询条件
            parmas: {
                subject_id: '',
                check_status: '',
                name: '',
                is_team: 1,
                starttime: '',
                endtime: '',
                page: 1,
                page_size: 10,
            },
            textArea: '',
            title: '',
            value2: 1,
            value3: -1,
            options: store.getState().XueKeList,
            unsubscribe: store.subscribe(() => {
                this.setState({
                    options: store.getState().XueKeList
                })
            }),
            //这个是评价自定义课件
            upParmas: {
                id: '',
                status: null,
                comment: '',
                course_id: ''
            },
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
        let myDate = new Date();
        let time = myDate.toLocaleDateString().split("/").join("-");
        const parmas = this.state.parmas
        parmas['starttime'] = time
        subjectList().then(res => {
            console.log(res)
            store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
        })
        jindu(parmas).then(res => {
            const list = res.data.list.map((res, index) => {
                res.key = `${index}`
                return res
            })
            this.setState({
                data: list,
                totalCount: Number(res.data.total_count),
                time,
                parmas
            })
        })
    }
    //日期改变
    onchange = (value, dateString) => {
        console.log(value, dateString)
        const parmas = this.state.parmas
        parmas['starttime'] = dateString[0]
        parmas['endtime'] = dateString[1]
        this.setState({
            parmas
        })
    }

    showModal = (e, file, course_id) => {
        const upParmas = this.state.upParmas
        const fileList = file.split(',')
        fileList.splice(fileList.length - 1, 1)
        upParmas['id'] = e
        upParmas['course_id'] = course_id
        this.setState({
            visible: true,
            upParmas,
            fileList
        });
    };
    handleOk = () => {
        const upParmas = { ...this.state.upParmas }
        const parmas = { ...this.state.parmas }
        jiangyishenghe(upParmas).then(res => {
            console.log(res)
            if (res.code === 0) {
                message.success(res.message)
                jindu(parmas).then(res => {
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

    };
    handleCancel = e => {
        this.setState({
            visible: false,
            fileList: [],
            title: '',
            checkList: [],
            textArea: '',
            value: '',
            upParmas: {
                id: '',
                status: null,
                comment: ''
            },
        });
    };
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
        console.log(e)
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
        // paike(parmas).then(res => {
        //     const list = res.data.list.map((res, index) => {
        //         res.key = `${index}`
        //         return res
        //     })
        //     this.setState({
        //         data: list,
        //         totalCount: Number(res.data.total_count),
        //         parmas
        //     })
        // })
    };
    search = () => {
        const parmas = this.state.parmas
        jindu(parmas).then(res => {
            console.log(res)
            if (res.code === 0) {
                const list = res.data.list.map((res, index) => {
                    res.key = `${index}`
                    return res
                })
                message.success(res.message)
                parmas.name = ''
                this.setState({
                    data: list,
                    totalCount: Number(res.data.total_count),
                    parmas,
                    name: ''
                })
            } else {
                message.error(res.message)
            }

        })
    }
    selectonChange = (value) => {
        console.log(value);
        const parmas = this.state.parmas
        parmas.subject_id = value[1]
        this.setState({
            parmas
        })
    }
    onChangecheckbox = (e) => {
        const upParmas = this.state.upParmas
        upParmas.status = e.target.value
        this.setState({
            value: e.target.value,
            upParmas
        });
    }
    onchangeTuanduiRadio = (e) => {
        const parmas = this.state.parmas
        parmas.is_team = e.target.value
        this.setState({
            value2: e.target.value,
            parmas
        })
        console.log(parmas)
    }
    onchangeStateRadio = (e) => {
        const parmas = this.state.parmas
        parmas.check_status = e.target.value
        this.setState({
            value3: e.target.value,
            parmas
        })
        console.log(parmas)
    }
    changName = (e) => {
        const parmas = this.state.parmas
        parmas.name = e.target.value
        this.setState({
            name: e.target.value,
            parmas
        })
    }
    textareaChange = (e) => {
        const upParmas = this.state.upParmas
        upParmas.comment = e.target.value
        this.setState({
            textArea: e.target.value,
            upParmas
        })
    }
    tabLinkFilePath = (url) => {
        window.open(url)
    }
    actionText = (canshu) => {
        let text = ''
        let color = ''
        if (canshu === '-1') {
            text = '未审核'
            color = 'geekblue'
        } else if (canshu === '1') {
            text = '审核通过'
            color = 'green'
        } else if (canshu === '2') {
            text = '审核未通过'
            color = 'volcano'
        }
        return <Tag color={color}>{text}</Tag>
    }
    render() {
        const columns = [
            {
                title: '老师姓名',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '上课时间',
                dataIndex: 'starttime',
                key: 'starttime',
            },
            {
                title: '下课时间',
                dataIndex: 'endtime',
                key: 'endtime',
            },
            {
                title: '审核状态',
                dataIndex: 'check_status',
                key: 'check_status',
                render: (text) => (
                    <span>
                        {this.actionText(text)}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text) => (
                    <div>
                        {sessionStorage.getItem("teacher_type") === '4' ? <Tag color='volcano'>暂无权限</Tag> : <span>
                            {text.check_status === '-1' || text.check_status === '2' ? <Button type="primary" onClick={() => this.showModal(text.id, text.file, text.course_id)}>审核课件</Button> : ''}
                        </span>}
                    </div>

                )
            },
        ];
        return (
            <div>
                <Modal
                    title="审核课件"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex m-bottom">
                        <span className="m-row">课件地址：</span>
                        {this.state.fileList.map((res, index) =>
                            <div key={index}>
                                {res === 'undefined' ? '暂未上传课件' : <div className='linkTab' onClick={() => this.tabLinkFilePath(res)}>{res}</div>
                                }
                            </div>
                        )}
                    </div>
                    <div className="m-flex m-bottom">
                        <span className="m-row">包含内容：</span>
                        <Radio.Group onChange={this.onChangecheckbox} value={this.state.value}>
                            <Radio value={1}>审核通过</Radio>
                            <Radio value={2}>审核未通过</Radio>
                        </Radio.Group>
                    </div>
                    <div className="m-flex">
                        <span className="m-row">评价内容：</span>
                        <TextArea rows={4} onChange={this.textareaChange} value={this.state.textArea}></TextArea>
                    </div>
                </Modal>
                <div className="m-bottom m-flex" style={{ alignItems: 'center' }}>
                    <RangePicker locale={locale} onChange={this.onchange} defaultValue={[moment(this.state.time, dateFormat)]} />
                    <div className="m-left">
                        <Select selectonChange={this.selectonChange} data={this.state.options}></Select>
                    </div>
                    <div className="m-left">
                        <Input value={this.state.name} onChange={this.changName} placeholder="请输入要查询的老师"></Input>
                    </div>
                    <div className="m-left">
                        <span >团队数据：</span>
                        <Radio.Group onChange={this.onchangeTuanduiRadio} value={this.state.value2}>
                            <Radio value={1}>是</Radio>
                            <Radio value={-1}>否</Radio>
                        </Radio.Group>
                    </div>
                    <div className="m-left">
                        <span>审核状态: </span>
                        <Radio.Group onChange={this.onchangeStateRadio} value={this.state.value3}>
                            <Radio value={-1}>未审核</Radio>
                            <Radio value={1}>审核通过</Radio>
                            <Radio value={2}>审核未通过</Radio>
                        </Radio.Group>
                    </div>
                    <Button type="primary" style={{ marginLeft: 10 }} onClick={this.search}>
                        查询
                    </Button>
                </div>
                <Table rowKey={record => record.key} columns={columns} dataSource={this.state.data} pagination={false} scroll={{ y: 500 }} />
                <Pagination className="m-Pleft" current={this.state.parmas.page} onChange={this.changePage} total={this.state.totalCount} />
            </div>
        );
    }
}
export default bk;