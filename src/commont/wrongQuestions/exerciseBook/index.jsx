import React, { Component, useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Radio, Upload, message, Card, Pagination } from 'antd'
import { get_xiaoguanjia_subject, get_xiaoguanjia_grade, create_book, book_get_list } from '../../../axios/http'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select
const { TextArea } = Input
const { Meta } = Card
class ExerciseBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//新增练习册modal,
            params: {
                name: '',
                xiaoguanjia_grade_id: [],
                xiaoguanjia_subject_id: [],
                upordown: '',
                page_size: 10,
                page: 1
            },//这是搜索条件
            exBookList: [],
            gradechildren: [],
            subjectchildren: [],
            totalCount: 0
        }
    }
    componentDidMount = () => {
        const params = this.state.params
        book_get_list(params).then(res => {
            this.setState({
                exBookList: res.data.list,
                totalCount: Number(res.data.count)
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
    }
    paramsChange = (e, res) => {
        const params = { ...this.state.params }
        params[res] = e
        this.setState({
            params
        })
    }
    paramsRChange = (e, res) => {
        const params = { ...this.state.params }
        params[res] = e.target.value
        this.setState({
            params
        })
    }
    addModal = () => {
        this.setState({
            visible: true
        })
    }
    //新增练习册操作
    okAddModal = (e) => {
        create_book(e).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                this.setState({
                    visible: false
                })
            } else {
                message.error(res.message)
                this.setState({
                    visible: false
                })
            }
        })

    }
    cancelAddModal = () => {
        this.setState({
            visible: false
        })
    }
    searchList = () => {
        const params = this.state.params
        console.log(params)
        book_get_list(params).then(res => {
            if (res.code === 0) {
                this.setState({
                    exBookList: res.data.list,
                    totalCount: Number(res.data.count)
                })
            } else {
                message.error(res.message)
            }

        })
    }
    changePage = page => {
        const params = { ...this.state.params }
        params.page = page
        book_get_list(params).then(res => {
            this.setState({
                exBookList: res.data.list,
                totalCount: Number(res.data.total_count),
                params
            })
        })
    };
    info = (id) => {
        localStorage.setItem('infoId',id)
        this.props.history.push("/main/wrongQuestion/exerciseBook/info")
    }
    render() {
        return (
            <div>
                <div className="m-flex" style={{ justifyContent: 'space-between' }}>
                    <div className="m-flex" style={{ alignItems: 'center' }}>
                        <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }} >
                            <span style={{ textAlign: 'right' }}>名称：</span>
                            <Input style={{ width: 140 }} placeholder="请填写练习册名称" onChange={(e) => this.paramsChange(e, 'name')} value={this.state.params.name}></Input>
                        </div>
                        <div className="m-flex m-bottom m-left" style={{ flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }} >
                            <span style={{ textAlign: 'right' }}>学科选择：</span>
                            <Select style={{ width: 120 }} placeholder="请选择学科" onChange={(e) => this.paramsChange(e, 'xiaoguanjia_subject_id')} value={this.state.params.xiaoguanjia_subject_id}>
                                {this.state.subjectchildren}
                            </Select>
                        </div>
                        <div className="m-flex m-bottom m-left" style={{ flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }} >
                            <span style={{ textAlign: 'right' }}>年级选择：</span>
                            <Select style={{ width: 120 }} placeholder="请选择年级" onChange={(e) => this.paramsChange(e, 'xiaoguanjia_grade_id')} value={this.state.params.xiaoguanjia_grade_id}>
                                {this.state.gradechildren}
                            </Select>
                        </div>
                        <div className="m-flex m-bottom m-left" >
                            <span>学期选择：</span>
                            <Radio.Group value={this.state.params.upordown} onChange={(e) => this.paramsRChange(e, 'upordown')}>
                                <Radio value='1'>上册</Radio>
                                <Radio value='-1'>下册</Radio>
                            </Radio.Group>
                        </div>
                        <Button onClick={this.searchList}>查询</Button>
                    </div>
                    <Button type="primary" onClick={this.addModal}>新增练习册</Button>
                </div>
                <AddBook visible={this.state.visible} okAddModal={this.okAddModal} cancelAddModal={this.cancelAddModal}></AddBook>
                <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', maxHeight: 600, overflowY: 'scroll' }} >
                    {this.state.exBookList.map(res =>
                        <div className="m-bottom" style={{ marginLeft: 30 }} key={res} onClick={() => this.info(res.id)}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src={res.image ? res.image : require('../../../img/missExbook.png')} />}
                            >
                                <Meta title={res.name} description={res.remark} />
                            </Card>
                        </div>
                    )}
                </div>
                <Pagination className="m-Pleft" current={this.state.params.page} onChange={this.changePage} total={this.state.totalCount} />
            </div>
        );
    }
}
const AddBook = (props) => {
    const params = {
        name: '',
        xiaoguanjia_grade_id: [],
        xiaoguanjia_subject_id: [],
        upordown: '',
        remark: '',
        image: ''
    }
    const [modalParamResult, setModalParamResult] = useState(params)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [loading, setLoading] = useState(false)
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传</div>
        </div>
    );
    const handleChange2 = (e) => {
        if (e.file.status !== "uploading") {
            modalParamResult.image = e.file.response.data.full_path
            setModalParamResult({ ...modalParamResult })
            setLoading(false)
        } else {
            setLoading(true)
            return false
        }
    }
    const prop = {
        action: 'https://devjiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
        onChange: handleChange2,
        multiple: true,
        name: 'upload_control',
        headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("username"),
            companyid: localStorage.getItem("companyid"),
        },
        data: {
            type: 4
        }
    }
    useEffect(() => {
        get_xiaoguanjia_subject().then(res => {
            const subjectchildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            setSubjectchildren([...subjectchildren])
        })
        get_xiaoguanjia_grade().then(res => {
            const gradechildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            setGradechildren([...gradechildren])
        })
    }, [])
    const modalChange = (e, res) => {
        modalParamResult[res] = e
        setModalParamResult({ ...modalParamResult })
    }
    const exbookChange = (e, res) => {
        modalParamResult[res] = e.target.value
        setModalParamResult({ ...modalParamResult })
    }
    const okAddModal = () => {
        props.okAddModal(modalParamResult)
        setModalParamResult({ ...params })
    }
    return (
        <div>
            <Modal
                title="新增练习册"
                visible={props.visible}
                onOk={okAddModal}
                onCancel={props.cancelAddModal}
                okText="确认"
                cancelText="取消"
            >
                <Upload
                    {...prop}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                >
                    {modalParamResult.image ? <img src={modalParamResult.image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>名称：</span>
                    <Input style={{ width: '100%' }} onChange={(e) => exbookChange(e, 'name')} value={modalParamResult.name} placeholder="请填写练习册名称"></Input>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_subject_id')} value={modalParamResult.xiaoguanjia_subject_id} placeholder="请选择学科">
                        {subjectchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>年级选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_grade_id')} value={modalParamResult.xiaoguanjia_grade_id} placeholder="请选择年级">
                        {gradechildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" >
                    <span className="m-row" >学期选择：</span>
                    <Radio.Group onChange={(e) => exbookChange(e, 'upordown')} value={modalParamResult.upordown}>
                        <Radio value='1'>上册</Radio>
                        <Radio value='-1'>下册</Radio>
                    </Radio.Group>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>备注：</span>
                    <TextArea placeholder="备注" onChange={(e) => exbookChange(e, 'remark')} value={modalParamResult.remark}></TextArea>
                </div>

            </Modal>
        </div>
    )
}
export default ExerciseBook;