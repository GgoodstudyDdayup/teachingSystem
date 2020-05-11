import React, { Component } from 'react';
import { Table, Button, DatePicker, Modal, Upload, Input, Checkbox, Pagination, message, Tag, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN'
import { paike, zidingyikejian, kechendizhi, get_course_file } from '../../axios/http'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn')
// const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select
const plainOptions = ['知识精讲', '三点剖析', '例题', '随练', '扩展'];
const dateFormat = 'YYYY-MM-DD'
class bk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //这个是查询条件
            parmas: {
                starttime: '2020-02-01',
                endtime: '',
                isfinished: '',
                page: 1,
                page_size: 10,
            },
            visible2: false,
            title: '',
            course_url: '',
            //这个是自定义课件
            upParmas: {
                subject_id: '',
                grade_id: '',
                course_id: '',
                title: '',
                has_zhishijingjiang: -1,
                has_sandianpouxi: -1,
                has_liti: -1,
                has_suilian: -1,
                has_kuozhan: -1,
                file: ''
            },
            //这是上传直播地址的地方
            upParmas2: {
                course_id: '',
                course_url: ''
            },
            totalCount: 100,
            count: this.totalCount,
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
            ]
        }
    }
    componentDidMount() {
        let myDate = new Date();
        let time = myDate.toLocaleDateString().split("/").join("-");
        const parmas = this.state.parmas
        parmas['starttime'] = time
        parmas['endtime'] = time
        paike(parmas).then(res => {
            const list = res.data.list.map((res, index) => {
                res.key = `${index}`
                return res
            })
            this.setState({
                data: list,
                totalCount: Number(res.data.total_count),
                time,
                parmas,
                count: Number(res.data.total_count)
            })
        })
    }
    //日期改变
    onchange = (value, dateString) => {
        const parmas = this.state.parmas
        parmas['starttime'] = dateString
        this.setState({
            parmas
        })
    }
    onchangeEnd = (value, dateString) => {
        const parmas = this.state.parmas
        parmas['endtime'] = dateString
        this.setState({
            parmas
        })
    }
    onChangecheckbox = (e) => {
        this.setState({
            checkList: e
        })
    }
    showModal = (e) => {
        const upParmas = this.state.upParmas
        upParmas['course_id'] = e
        this.setState({
            visible: true,
            upParmas,
            fileList: [],
        });
    };
    showModal2 = (e) => {
        const upParmas2 = this.state.upParmas2
        upParmas2['course_id'] = e
        this.setState({
            visible2: true,
            upParmas2,
        });
    }
    handleOk = () => {
        const fileList = this.state.fileList
        let path = ''
        fileList.forEach(file => {
            path += file.response.data.full_path + ',';
        })
        const checkList = this.state.checkList
        const obj = { ...this.state.obj }
        const upParmas = { ...this.state.upParmas }
        upParmas.file = path
        checkList.forEach(res => {
            Object.keys(obj).forEach(ele => {
                if (obj[ele] === res) {
                    upParmas[ele] = 1
                }
            })
        })
        zidingyikejian(upParmas).then(res => {
            console.log(res)
            if (res.code === 0) {
                const parmas = { ...this.state.parmas }
                paike(parmas).then(res => {
                    const list = res.data.list.map((res, index) => {
                        res.key = `${index}`
                        return res
                    })
                    this.setState({
                        data: list,
                        totalCount: Number(res.data.total_count),
                    })
                })
                message.success(res.message)
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
            upParmas: {
                subject_id: '',
                grade_id: '',
                course_id: '',
                title: '',
                has_zhishijingjiang: -1,
                has_sandianpouxi: -1,
                has_liti: -1,
                has_suilian: -1,
                has_kuozhan: -1,
                file: ''
            },
        });
    };
    handleOk2 = () => {
        const upParmas2 = { ...this.state.upParmas2 }
        kechendizhi(upParmas2).then(res => {
            console.log(res)
            if (res.code === 0) {
                const parmas = { ...this.state.parmas }
                paike(parmas).then(res => {
                    const list = res.data.list.map((res, index) => {
                        res.key = `${index}`
                        return res
                    })
                    this.setState({
                        data: list,
                        totalCount: Number(res.data.total_count),
                    })
                })
                message.success(res.message)
                this.handleCancel2()
            } else {
                message.success(res.message)
                this.handleCancel2()
            }
        })
    };
    handleCancel2 = e => {
        this.setState({
            visible2: false,
            course_url: '',
            upParmas2: {
                course_id: '',
                course_url: ''
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
    changeTitleUrl = (e) => {
        const upParmas2 = { ...this.state.upParmas2 }
        upParmas2.course_url = e.target.value
        this.setState({
            course_url: e.target.value,
            upParmas2
        })
    }
    changePage = page => {
        const parmas = { ...this.state.parmas }
        parmas.page = page
        paike(parmas).then(res => {
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
        paike(parmas).then(res => {
            const list = res.data.list.map((res, index) => {
                res.key = `${index}`
                return res
            })
            this.setState({
                data: list,
                totalCount: Number(res.data.total_count),
                count: Number(res.data.total_count),
                parmas
            })
        })
    }
    actionFunt = (...canshu) => {
        if (canshu[0] === '-1' && canshu[1] === '1') {
            return <Button onClick={() => this.showModal(canshu[2])}>调整备课</Button>
        } else if (canshu[0] === '1' && canshu[1] === '1') {
            return <Button onClick={() => this.showModal2(canshu[2])}>我要直播</Button>
        } else if (canshu[0] === '2' && canshu[1] === '1') {
            return <Button type="danger" onClick={() => this.showModal(canshu[2])}>重新备课</Button>
        } else {
            return <Button type="primary" onClick={() => this.showModal(canshu[2])}>我要备课</Button>
        }
    }
    actionText = (...canshu) => {
        let text = ''
        let color = ''
        if (canshu[0] === '-1' && canshu[1] === '1') {
            text = '审核中'
            color = 'geekblue'
        } else if (canshu[0] === '1' && canshu[1] === '1') {
            text = '审核通过'
            color = 'green'
        } else if (canshu[0] === '2' && canshu[1] === '1') {
            text = '审核未通过'
            color = 'volcano'
        } else {
            text = ''
            color = 'geekblue'
        }
        return <Tag color={color}>{text}</Tag>
    }
    setPageSize = e => {
        const parmas = this.state.parmas
        const count = this.state.totalCount
        parmas.page_size = e
        this.setState({
            parmas,
            count: Math.ceil(Number(count) / Number(e) * 10)

        })
    }
    numberonChange = e => {
        const parmas = this.state.parmas
        parmas.page = e.target.value
        this.setState({
            parmas
        })
    }
    catchFile = e => {
        get_course_file({ course_id: e.course_id }).then(res => {
            console.log(res)
            if (res.code === 0 && res.data.model !== null) {
                res.data.model.file.split(',').forEach(res => {
                    if (res === 'undefined') {
                        return false
                    }
                    window.open(res)
                })
            }
        })
    }
    render() {
        const columns = [
            {
                title: '老师姓名',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                render: (text) => (
                    <span>
                        {text ? text : 'null'}
                    </span>
                ),
            },
            {
                title: '班级',
                dataIndex: 'classname',
                key: 'classname',
                sorter: (a, b) => a.classname.length - b.classname.length,
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
                title: '是否备课',
                key: 'is_beike',
                sorter: (a, b) => a.is_beike - b.is_beike,
                render: (text) => (
                    <span>
                        {text.is_beike === '1' ? <span className="linkTab2" onClick={() => this.catchFile(text)}>已备课</span> : '未备课'}
                    </span>
                ),
            },
            {
                title: '备课审核状态',
                key: 'beike_check_status',
                render: (text) => (
                    <span>
                        {this.actionText(text.beike_check_status, text.is_beike)}
                    </span>
                ),
            },
            {
                title: '是否上课',
                dataIndex: 'isfinished',
                key: 'isfinished',
                sorter: (a, b) => a.isfinished - b.isfinished,
                render: (text) => (
                    <span>
                        {text === '1' ? '已完成' : '未完成'}
                    </span>
                ),
            },

            {
                title: '操作',
                key: 'action',
                render: (text) => (
                    <span>
                        {this.actionFunt(text.beike_check_status, text.is_beike, text.course_id)}
                    </span>
                ),
            },
        ];
        const props = {
            action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: localStorage.getItem("token"),
                username: localStorage.getItem("username"),
                companyid: localStorage.getItem("companyid"),
            },
            data: {
                type: 5
            }
        };
        return (
            <div>
                <Modal
                    title="备课上传"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex">
                        <span className="m-row">标题：</span>
                        <Input style={{ marginBottom: 20 }} placeholder="请输入标题" value={this.state.title} onChange={this.changeTitle}></Input>
                    </div>
                    <div className="m-flex">
                        <span className="m-row">包含内容：</span>
                        <CheckboxGroup style={{ marginBottom: 20 }}
                            options={plainOptions}
                            onChange={this.onChangecheckbox}
                            value={this.state.checkList}
                        />
                    </div>
                    <Upload {...props} fileList={this.state.fileList}>
                        <Button>
                            上传文件
                        </Button>
                    </Upload>
                </Modal>
                <Modal
                    title="直播地址上传"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel2}
                    okText='确认'
                    cancelText='取消'
                >
                    <div className="m-flex">
                        <span className="m-row m-bottom">直播地址：</span>
                        <Input style={{ marginBottom: 20 }} placeholder="请输入地址" value={this.state.course_url} onChange={this.changeTitleUrl}></Input>
                    </div>
                </Modal>
                <div className="m-bottom" >
                    {/* <RangePicker locale={locale} onChange={this.onchange} defaultValue={[moment(this.state.time, dateFormat)]} /> */}
                    <span>开始时间：</span>
                    <DatePicker locale={locale} onChange={this.onchange} defaultValue={moment(this.state.time, dateFormat)} />
                    <span className="m-left">结束时间：</span>
                    <DatePicker locale={locale} onChange={this.onchangeEnd} defaultValue={moment(this.state.time, dateFormat)} />
                    <Button type="primary" style={{ marginLeft: 10 }} onClick={this.search}>
                        查询
                    </Button>
                </div>
                <Table rowKey={record => record.key} columns={columns} dataSource={this.state.data} pagination={false} scroll={{ y: 500 }} />
                <div className="m-Pleft m-flex">
                    <Pagination
                        onChange={this.changePage}
                        total={this.state.count}
                        showTotal={total => `共 ${this.state.totalCount} 条`}
                    />
                    <div className="m-left">
                        <Select defaultValue="10" style={{ width: 100 }} onChange={this.setPageSize}>
                            <Option value="10">10/页</Option>
                            <Option value="20">20/页</Option>
                        </Select>
                    </div>
                    <div className="m-left">
                        <span >跳转至 </span>
                        <Input style={{ width: 60 }} onChange={this.numberonChange} ></Input>
                        <span> 页 </span>
                    </div>
                    <div className="m-left">
                        <Button onClick={this.search}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default bk;