import React, { useEffect, useState } from 'react'
import { Tabs, Card, Drawer, Input, Button, Radio, Col, Row, Select, Upload, Icon, Pagination, Modal, message } from 'antd';
import Zmage from 'react-zmage'
import { ContentUtils } from 'braft-utils'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { HighlightOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
// import ErrorSet from './errorSet/index'
// import ExerciseBook from './exerciseBook/index'
// import ReportForm from './reportForm/index'
const { TabPane } = Tabs
const { Meta } = Card;
const { Option } = Select

const Main = (props) => {
    const params = {
        student: '',
        finished: '1',
        pagesize: 10,
        page: 1
    }
    const editorState = BraftEditor.createEditorState(null)
    const [visible, setVisible] = useState(false)
    const [paramResult, setParams] = useState(params)
    const [editor, setEditorState] = useState(editorState)
    const [height, setHeight] = useState('')
    const [visible2, setVisible2] = useState(false)
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']

    const handleChange = (editorState) => {
        setEditorState(editorState)
    }
    const handleChange2 = (e) => {
        if (e.file.status !== "uploading") {
            const result = ContentUtils.insertMedias(editor, [{
                type: 'IMAGE',
                url: e.file.response.data.full_path
            }])
            setEditorState(result)
        } else {
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
            type: 1
        }
    }
    const extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                <Upload
                    {...prop}
                    accept="image/*"
                    showUploadList={false}
                // customRequest={this.uploadHandler}
                // beforeUpload={this.beforeUpload}
                >
                    {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                    <button type="button" className="control-item button upload-button" data-title="插入图片">
                        <Icon type="picture" theme="filled" />
                    </button>
                </Upload>
            )
        }
    ]
    const changName = (e) => {
        paramResult.student = e.target.value
        setParams({ ...paramResult })
    }
    const search = () => {
    }
    const ok = () => {
        setVisible(true)
    }
    const modalOk = e => {
        setVisible2(false)
    };
    const showModal = () => {
        setVisible(true)
    };
    const showModal2 = () => {
        setVisible2(true)
    };
    
    const modalCancel = e => {
        setVisible2(false)
    };
    const cancel = e => {
        setVisible(false)
    };
    useEffect(() => {
        setHeight(document.body.clientHeight)
    }, [height])
    const changePage = (e) => {
        paramResult.page = e
        setParams({ ...paramResult })
    }


    return (
        <div>
            <Drawer
                title="错题点评"
                placement="right"
                width={720}
                closable={false}
                onClose={cancel}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Zmage style={{ width: '100%' }} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>题型</span>
                            <Select placeholder="请选择题型"></Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>来源</span>
                            <Select placeholder="请选择来源"></Select>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>章节</span>
                            <Select placeholder="请选择题型"></Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>知识点</span>
                            <Select placeholder="请选择来源"></Select>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>掌握程度</span>
                            <Radio.Group defaultValue="a" value={paramResult.finished} >
                                <Radio value="1">完全不会</Radio>
                                <Radio value="2">掌握较差</Radio>
                                <Radio value="3">基本掌握</Radio>
                                <Radio value="4">掌握较好</Radio>
                                <Radio value="5">完全掌握</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>难易程度</span>
                            <Radio.Group defaultValue="a" value={paramResult.finished} >
                                <Radio value="1">简单</Radio>
                                <Radio value="2">中等</Radio>
                                <Radio value="3">困难</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                </Row>
                <div className="my-component my-editor-component m-bottom">
                    <BraftEditor
                        value={editor}
                        onChange={handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
                <div style={{ textAlign: 'right', }}>
                    <Button style={{ marginRight: 8 }} onClick={cancel}>取消</Button>
                    <Button type="primary" onClick={ok}>确认</Button>
                </div>
            </Drawer>
            <ModalCompent visible2={visible2} modalOk={modalOk} modalCancel={modalCancel}/>
            <Tabs defaultActiveKey='1' >
                <TabPane tab="未完成" key="1">
                    <div className="m-bottom m-flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="m-flex">
                            <div className="m-left ">
                                <Input value={paramResult.student} onChange={changName} placeholder="请输入要查询的学生"></Input>
                            </div>
                            <Button style={{ marginLeft: 10 }} onClick={search}>
                                查询
                            </Button>
                        </div>
                        <Button type="primary" onClick={showModal2}>错题录入</Button>

                    </div>
                    <div className="m-card" style={height > 638 ? { maxHeight: 600, overflowY: 'scroll', display: 'flex', flexWrap: 'wrap ', flexDirection: 'row', justifyContent: 'space-between' } : { maxHeight: 400, overflowY: 'scroll', display: 'flex', flexWrap: 'wrap ', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(res =>
                            <div key={res} >
                                <Card
                                    hoverable
                                    style={{ width: 240, marginBottom: 10 }}
                                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    actions={[
                                        <HighlightOutlined key="edit" onClick={showModal} />,
                                        <DeleteOutlined key="delete" />
                                    ]}
                                >
                                    <Meta title="God_T" description="很强" />
                                </Card>
                            </div>
                        )}
                    </div>
                    <Pagination className="m-Pleft" current={paramResult.page} onChange={changePage} />
                </TabPane>
                <TabPane tab="已完成" key="3">
                    Content of Tab 3
                </TabPane>
            </Tabs>
        </div >
    )
}
const ModalCompent = (props) => {
    console.log()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传</div>
        </div>
    );
    const handleChange2 = (e) => {
        if (e.file.status !== "uploading") {
            console.log(e.file.response.data.full_path)
        } else {
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
            type: 1
        }
    }
    return (
        <div>
            <Modal
                title="错题录入"
                visible={props.visible2}
                onOk={props.modalOk}
                onCancel={props.modalCancel}
                okText='确认'
                cancelText='取消'
            >
                <Upload
                    {...prop}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Modal>
        </div>
    )
}
export default Main
