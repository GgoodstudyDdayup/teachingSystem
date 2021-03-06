import React, { useEffect, useState } from 'react'
import { Tabs, Drawer, Input, Button, Radio, Col, Row, Select, Upload, Icon, Pagination, Modal, message, Divider } from 'antd';
import { ContentUtils } from 'braft-utils'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import ImageEditor from 'image-editor-little';
// import ImgCrop from 'antd-img-crop';
import Finished from './finished'
import { getStudent_by_teacher, get_grade_by_teacher, edit_wrong_question, analysis_question, get_knowledge, get_analysis_option, get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_class, submit_wrong_question, wrong_get_list, del_wrong_question } from '../../../axios/http'
const { TabPane } = Tabs
const { Option } = Select
const { confirm } = Modal
const Main = (props) => {
    //搜索
    const params = {
        xiaoguanjia_subject_id: [],
        xiaoguanjia_grade_id: [],
        xiaoguanjia_class_id: [],
        student: '',
        submit_teacher_id: '',
        analysis_teacher_id: localStorage.getItem('id'),
        state: -1,
        pagesize: 10,
        page: 1
    }
    //录入
    const modalParams = {
        // xiaoguanjia_subject_id: [],
        xiaoguanjia_grade_id: [],
        // xiaoguanjia_class_id: [],
        xiaoguanjia_student_ids: [],
        analysis_teacher_id: [],
        image: '',
        text: '',
        upload_channel_id: 1,
    }
    //点评
    const drawerParams = {
        id: '',
        ques_type_id: [],
        source_id: [],
        section_id: [],
        analysis_content: '',
        mastery_level: '',
        ques_difficulty_id: '',
        knowledge_ids: [],
        wrong_reason_id: [],
        upload_channel_id: 1
    }
    let list = []
    let count = 0
    const editorState = BraftEditor.createEditorState(null)
    const [visible, setVisible] = useState(false)
    const [paramResult, setParams] = useState(params)
    const [drawerParamResult, setDrawerParam] = useState(drawerParams)
    const [editor, setEditorState] = useState(editorState)
    const [modalParamResult, setModalParam] = useState(modalParams)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [classchildren, setClasschildren] = useState('')
    // const [teacherchildren, setTeacherchildren] = useState('')
    const [height, setHeight] = useState('')
    const [visible2, setVisible2] = useState(false)
    const [visible3, setVisible3] = useState(false)
    const [dataList, setDataList] = useState(list)
    const [totalCount, setTotalCount] = useState(count)
    const [tixingOptions, setTixingOptions] = useState([])
    const [sourceOptions, setSourceOptions] = useState([])
    const [wrong_reasonOptions, setWrong_reasonOptions] = useState([])
    // const [drawerImage, setDrawerImage] = useState('')
    const [drawerText, setDrawerText] = useState('')
    const [pubildzjList, setPubilcZjList] = useState([])
    const [zjList, setZjList] = useState([])
    const [zjChildrenList, setZjChildrenList] = useState([])
    const [knowlageList, setKnowlageList] = useState([])
    const [countNumber, setCount] = useState(0)
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
    useEffect(() => {
        setHeight(document.body.clientHeight)
    }, [height])
    //获取默认的学科和年级数据
    useEffect(() => {
        wrong_get_list({
            xiaoguanjia_subject_id: '',
            xiaoguanjia_grade_id: '',
            xiaoguanjia_class_id: '',
            xiaoguanjia_student_ids: '',
            analysis_teacher_id: localStorage.getItem('id'),
            state: -1,
            pagesize: 10,
            page: 1
        }).then(res => {
            setTotalCount(Number(res.data.count))
            setDataList([...res.data.list])
        })
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
        // loginUserList({
        //     name: '',
        //     username: '',
        //     permission: '',
        //     page_size: 100,
        // }).then(res => {
        //     console.log(res)
        //     const teachChildren = res.data.list.map(res => {
        //         return <Option key={res.id} value={res.id} >{res.name}</Option>
        //     })
        //     setTeacherchildren([...teachChildren])
        // })

    }, [])
    const handleChange = (editorState) => {
        drawerParamResult.analysis_content = editorState.toHTML()
        setDrawerParam({ ...drawerParamResult })
        setEditorState(editorState)
    }
    const handleChange2 = (e) => {
        if (e.file.status !== "uploading") {
            const result = ContentUtils.insertMedias(editor, [{
                type: 'IMAGE',
                url: e.file.response.data.full_path
            }])
            drawerParamResult.analysis_content = result.toHTML()
            setDrawerParam({ ...drawerParamResult })
            setEditorState(result)
        } else {
            return false
        }
    }
    const prop = {
        action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
        onChange: handleChange2,
        multiple: true,
        name: 'upload_control',
        headers: {
            token: localStorage.getItem("token"),
            username: encodeURI(localStorage.getItem("username")),
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
    const search = () => {
        wrong_get_list(paramResult).then(res => {
            if (res.code === 0) {
                list = res.data.list
                count = Number(res.data.count)
                setTotalCount(count)
                setDataList([...list])
            }
        })
    }
    const ok = () => {
        analysis_question(drawerParamResult).then(res => {
            if (res.code === 0) {
                const drawerParamResult = {
                    id: '',
                    ques_type_id: [],
                    source_id: [],
                    section_id: [],
                    analysis_content: '',
                    mastery_level: '',
                    ques_difficulty_id: '',
                    knowledge_ids: [],
                    wrong_reason_id: [],
                    upload_channel_id: 1
                }
                message.success(res.message)
                setDrawerParam({ ...drawerParamResult })
                setVisible(false)
                setEditorState(BraftEditor.createEditorState(null))
                search()
            } else {
                message.error(res.message)
            }
        })
    }
    const detail = (id, image, text, res) => {
        drawerParamResult['id'] = id
        setDrawerParam({ ...drawerParamResult })
        // setDrawerImage(image)
        setDrawerText(text)
        get_analysis_option({ id }).then(res => {
            if (res.code === 0) {
                const tixingOptions = res.data.type_list.map((res, index) => {
                    return <Option key={res.ques_type_id} value={res.ques_type_id} >{res.name}</Option>
                })
                const zhangjie = res.data.course_section_list.map(l1 => {
                    return <Option value={l1.section_id} key={l1.section_id}>{l1.section_name}</Option>
                })
                const wrong_reason = res.data.wrong_reason_list.map((res, index) => {
                    return <Option key={res.name} value={res.id} >{res.name}</Option>
                })
                const source = res.data.source_list.map((res, index) => {
                    return <Option key={res.name} value={res.id} >{res.name}</Option>
                })

                setPubilcZjList(res.data.course_section_list)
                setTixingOptions([...tixingOptions])
                setSourceOptions([...source])
                setWrong_reasonOptions([...wrong_reason])
                setZjList([...zhangjie])
                setVisible(true)
            }
        })
    }
    const showModal2 = () => {
        setVisible2(true)
    };
    const modalOk = params => {
        const studentString = params.xiaoguanjia_student_ids.reduce((item, res) => {
            item += res + ','
            return item
        }, '')
        params.xiaoguanjia_student_ids = studentString
        submit_wrong_question(params).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                search()
                modalCancel()
            } else {
                message.error(res.message)
            }
        })
    };
    const modalCancel = e => {
        setModalParam(modalParams)
        setVisible2(false)
    };
    const cancel = e => {
        setVisible(false)
        const drawerParamResult = {
            id: '',
            ques_type_id: [],
            source_id: [],
            section_id: [],
            analysis_content: '',
            mastery_level: '',
            ques_difficulty_id: '',
            knowledge_ids: [],
            wrong_reason_id: [],
            upload_channel_id: 1
        }
        setEditorState(BraftEditor.createEditorState(null))
        setDrawerParam({ ...drawerParamResult })
    };
    const getList = (page) => {
        wrong_get_list({
            xiaoguanjia_subject_id: '',
            xiaoguanjia_grade_id: '',
            xiaoguanjia_class_id: '',
            xiaoguanjia_student_ids: '',
            analysis_teacher_id: localStorage.getItem('id'),
            state: -1,
            pagesize: 10,
            page: 1
        }).then(res => {
            setTotalCount(Number(res.data.count))
            setDataList([...res.data.list])
        })
    }
    const changePage = (e) => {
        getList(e)
    }
    const paramsSelect = (e, res) => {
        paramResult[res] = e
        if (typeof paramResult.xiaoguanjia_subject_id !== 'object' && typeof paramResult.xiaoguanjia_grade_id !== 'object') {
            get_xiaoguanjia_class(paramResult).then(res => {
                const classchildren = res.data.list.map(l1 => {
                    return <Option key={l1.class_id} value={l1.class_id} >{l1.name}</Option>
                })
                setClasschildren([...classchildren])
            })
        }
        setParams({ ...paramResult })
    }
    //选择下拉框班级时的操作
    const paramsclassChange = e => {
        paramResult.xiaoguanjia_class_id = e
        setParams({ ...paramResult })
    }
    const paramsstudentChange = e => {
        console.log(e.target.value)
        paramResult.student = e.target.value
        setParams({ ...paramResult })
    }
    const deleteI = e => {
        const id = e
        confirm({
            title: `删除错题`,
            content: '你确定要删除吗',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                del_wrong_question({ id }).then(res => {
                    if (res.code === 0) {
                        message.success(res.message)
                        wrong_get_list(paramResult).then(res => {
                            setTotalCount(Number(res.data.count))
                            setDataList(res.data.list)
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            },
            onCancel() {
            },
        });

    }
    const drawerChange = (e, res) => {
        drawerParamResult[res] = e
        setDrawerParam({ ...drawerParamResult })
    }
    const radioChange = (e, res) => {
        drawerParamResult[res] = e.target.value
        setDrawerParam({ ...drawerParamResult })
    }
    const selsectzhangjie = e => {
        pubildzjList.forEach(res => {
            if (res.section_id === e) {
                const zhangjieChildren = res.children.map(l1 => {
                    return <Option value={l1.section_id} key={l1.section_id}>{l1.section_name}</Option>
                })
                setZjChildrenList(zhangjieChildren)
            }
        })
    }
    const selsectzhangjieChildren = e => {
        get_knowledge({ section_id: e }).then(res => {
            if (res.code === 0) {
                const knowlageList = res.data.list.map(l1 => {
                    return <Option value={l1.knowledge_id} key={l1.knowledge_id}>{l1.knowledge_name}</Option>
                })
                drawerParamResult.section_id = e
                setKnowlageList([...knowlageList])
                setDrawerParam({ ...drawerParamResult })
            }
        })
    }
    const knowlageChange = e => {
        drawerParamResult.knowledge_ids = e
        setDrawerParam({ ...drawerParamResult })
    }
    const tabchangeCount = e => {
        setCount(e)
    }
    const bianji = (id, res) => {
        modalParamResult.id = id
        modalParamResult.xiaoguanjia_subject_id = res.xiaoguanjia_subject_id
        modalParamResult.xiaoguanjia_grade_id = res.xiaoguanjia_grade_id
        // modalParamResult.xiaoguanjia_class_id = res.xiaoguanjia_class_id
        modalParamResult.xiaoguanjia_student_ids = res.xiaoguanjia_student_ids.split(',')
        modalParamResult.analysis_teacher_id = res.analysis_teacher_id
        modalParamResult.text = res.text
        setVisible3(true)
        setModalParam({ ...modalParamResult })
    }
    const eidtorOk = params => {
        // const studentString = params.xiaoguanjia_student_ids.reduce((item, res) => {
        //     item += res + ','
        //     return item
        // }, '')
        // params.xiaoguanjia_student_ids = studentString
        edit_wrong_question(params).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                setModalParam(modalParams)
                setVisible3(false)
                search()
            }
        })
    }
    const editormodalCancel = () => {
        setModalParam(modalParams)
        setVisible3(false)
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
                <div className=" m-bottom m-flex">
                    {/* <Zmage style={{ width: 200, height: 200 }} alt="example" src={drawerImage} /> */}
                    <span dangerouslySetInnerHTML={{ __html: drawerText }}></span>
                </div>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>题型</span>
                            <Select placeholder="请选择题型" onChange={(e) => drawerChange(e, 'ques_type_id')} value={drawerParamResult.ques_type_id}>
                                {tixingOptions}
                            </Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>题目来源</span>
                            <Select placeholder="请选择来源" onChange={(e) => drawerChange(e, 'source_id')} value={drawerParamResult.source_id}>
                                {sourceOptions}
                            </Select>
                        </div>
                    </Col>
                    {/* <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>上传渠道</span>
                            <Select placeholder="请选择上传渠道" onChange={(e) => drawerChange(e, 'upload_channel_id')} value={drawerParamResult.upload_channel_id}>
                                {upload_channelOptions}
                            </Select>
                        </div>
                    </Col> */}
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>错误原因</span>
                            <Select placeholder="请选择错误原因" onChange={(e) => drawerChange(e, 'wrong_reason_id')} value={drawerParamResult.wrong_reason_id}>
                                {wrong_reasonOptions}
                            </Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>学期</span>
                            <Select placeholder="请选择学期" onChange={selsectzhangjie} >
                                {zjList}
                            </Select>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>

                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>章节</span>
                            <Select placeholder="请选择章节" onChange={selsectzhangjieChildren} value={drawerParamResult.section_id}>
                                {zjChildrenList}
                            </Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>知识点</span>
                            <Select placeholder="请选择知识点" onChange={knowlageChange} mode="multiple" optionFilterProp="children" showSearch value={drawerParamResult.knowledge_ids}>
                                {knowlageList}
                            </Select>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div className="m-flex m-bottom" style={{ flexFlow: 'column' }}>
                            <span style={{ fontSize: 17, color: 'rgba(0,0,0,.85)' }}>掌握程度</span>
                            <Radio.Group defaultValue="a" onChange={(e) => radioChange(e, 'ques_difficulty_id')} value={drawerParamResult.ques_difficulty_id}>
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
                            <Radio.Group defaultValue="a" onChange={(e) => radioChange(e, 'mastery_level')} value={drawerParamResult.mastery_level}>
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
            <ModalCompent modalParams={modalParamResult} modalCancel={modalCancel} modalOk={modalOk} visible2={visible2} subjectchildren={subjectchildren} gradechildren={gradechildren} />
            <EditorModalCompent modalParams={modalParamResult} modalCancel={editormodalCancel} modalOk={eidtorOk} visible2={visible3} subjectchildren={subjectchildren} gradechildren={gradechildren}></EditorModalCompent>
            <Tabs defaultActiveKey='1' onChange={tabchangeCount}>
                <TabPane tab="未完成" key="1">
                    <div className="m-bottom m-flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="m-flex">
                            <div >
                                <Select style={{ width: 120 }} placeholder="请选择学科" onChange={(e) => paramsSelect(e, 'xiaoguanjia_subject_id')} value={paramResult.xiaoguanjia_subject_id}>
                                    {subjectchildren}
                                </Select>
                            </div>
                            <div className="m-left">
                                <Select style={{ width: 120 }} placeholder="请选择年级" onChange={(e) => paramsSelect(e, 'xiaoguanjia_grade_id')} value={paramResult.xiaoguanjia_grade_id}>
                                    {gradechildren}
                                </Select>
                            </div>
                            <div className="m-left">
                                <Select style={{ width: 240 }} onChange={paramsclassChange} placeholder="请选择班级">
                                    {classchildren}
                                </Select>
                            </div>
                            <div className="m-left">
                                <Input onChange={paramsstudentChange} placeholder="请选择学生姓名"></Input>
                            </div>
                            <Button style={{ marginLeft: 10 }} onClick={search}>
                                查询
                            </Button>
                        </div>
                        <Button type="primary" onClick={showModal2}>错题录入</Button>
                    </div>
                    <div className="m-card" style={height > 638 ? { maxHeight: 600, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' } : { maxHeight: 400, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' }}>
                        {dataList.map(res =>
                            <div key={res.id} >
                                <div className="listT"  >
                                    <div className="know-name-m m-flex" >
                                        <div dangerouslySetInnerHTML={{ __html: res.text }}></div>
                                    </div>
                                    <Divider dashed />
                                    <div className="shop-btn">
                                        <div className="know-title-div">
                                            <p className="know-title">
                                                错题学生姓名:
                                                <span>{res.student_str}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <Button className="z-index" onClick={() => deleteI(res.id)} type="danger">删除错题</Button>
                                            <span className="m-left">
                                                <Button className="z-index" onClick={() => bianji(res.id, res)} type="primary">编辑错题</Button>
                                            </span>
                                            <span className="m-left">
                                                <Button className="z-index" onClick={() => detail(res.id, res.image, res.text)} type="primary">错题点评</Button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Pagination className="m-Pleft" current={paramResult.page} onChange={changePage} total={totalCount} />
                </TabPane>
                <TabPane tab="已完成" key="3">
                    <Finished count={countNumber}></Finished>
                </TabPane>
            </Tabs>
        </div >
    )
}
const ModalCompent = (props) => {
    //录入
    const modalParams = props.modalParams
    modalParams.text = BraftEditor.createEditorState(props.modalParams.text || null)
    const [modalParamResult, setModalParam] = useState(modalParams)
    const [grandchildren, setgrandchildren] = useState([])
    const [studentchildren, setstudentchildren] = useState([])
    // const [classchildren, setClasschildren] = useState([])
    // const [studentchildren, setStudentchildren] = useState([])
    const [text, setText] = useState('')
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
    const [visible3, setVisible3] = useState(false)
    const [cImg, setcImg] = useState('')
    const addimg = e => {
        if (e.file.status !== "uploading") {
            setVisible3(true)
            setcImg(e.file.response.data.full_path)
            // console.log(modalParamResult.text)
            // modalParamResult.text = ContentUtils.insertMedias(modalParamResult.text, [{
            //     type: 'IMAGE',
            //     url: e.file.response.data.full_path
            // }])
            // setModalParam({ ...modalParamResult })
        } else {
            return false
        }
    }
    const props2 = {
        action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
        onChange: addimg,
        multiple: true,
        name: 'upload_control',
        headers: {
            token: localStorage.getItem("token"),
            username: encodeURI(localStorage.getItem("username")),
            companyid: localStorage.getItem("companyid"),
        },
        data: {
            type: 2
        }
    }
    // const props3 = {
    //     width:1000,
    //     height:900,
    //     resize: true, //裁剪是否可以调整大小
    //     resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
    //     modalTitle: "上传图片", //弹窗标题
    //     modalWidth: 800, //弹窗宽度
    // };
    const extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                // <ImgCrop {...props3}>
                <Upload
                    {...props2}
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
                // </ImgCrop>
            )
        }
    ]
    useEffect(() => {
        setModalParam({ ...props.modalParams })
    }, [props.modalParams])
    useEffect(() => {
        getStudent_by_teacher({ teacher_employee_id: '', grade_id: '', xiaoguanjia_subject_id: '' }).then(res => {
            console.log(res)
            const zuoyebalist = res.data.zuoyeba_list.map(res => {
                if (res.name) {
                    res.name += '(作业吧)'
                }
                return res
            })
            const result = zuoyebalist.concat(res.data.list)
            const studentchildren = result.map(l1 => {
                return <Option key={l1.student_id} value={l1.student_id} >{l1.name}</Option>
            })
            setstudentchildren(studentchildren)
        })
        get_grade_by_teacher({ teacher_employee_id: '' }).then(res => {
            const grandchildren = res.data.list.map(l1 => {
                return <Option key={l1.grade_id} value={l1.grade_id} >{l1.grade}</Option>
            })
            setgrandchildren(grandchildren)
        })
    }, [])
    // const teachChange = e => {
    //     modalParamResult.analysis_teacher_id = e
    //     setModalParam({ ...modalParamResult })
    // }
    //modal选择下拉框科目年级时的操作
    const modalChange = (e, res) => {
        modalParamResult[res] = e
        getStudent_by_teacher({ teacher_employee_id: '', grade_id: modalParamResult.xiaoguanjia_grade_id, xiaoguanjia_subject_id: modalParamResult.xiaoguanjia_subject_id }).then(res => {
            const studentchildren = res.data.list.map(l1 => {
                return <Option key={l1.student_id} value={l1.student_id}>{l1.name}</Option>
            })
            setstudentchildren(studentchildren)
        })
        // if (typeof modalParamResult.xiaoguanjia_subject_id !== 'object' && typeof modalParamResult.xiaoguanjia_grade_id !== 'object') {
        //     get_xiaoguanjia_class(modalParamResult).then(res => {
        //         const classchildren = res.data.list.map(l1 => {
        //             return <Option key={l1.class_id} value={l1.class_id} >{l1.name}</Option>
        //         })
        //         setClasschildren([...classchildren])
        //     })
        // }
        setModalParam({ ...modalParamResult })
    }
    // //modal选择下拉框班级时的操作
    // const modalclassChange = e => {
    //     get_xiaoguanjia_student({ xiaoguanjia_class_id: e }).then(res => {
    //         const studentchildren = res.data.list.map(l1 => {
    //             return <Option key={l1.student_id} value={l1.student_id} >{l1.name}</Option>
    //         })
    //         modalParamResult.xiaoguanjia_class_id = e
    //         setModalParam({ ...modalParamResult })
    //         setStudentchildren(studentchildren)
    //     })
    // }
    //modal选择下拉框选择学生时的操作
    const modalstudentChange = e => {
        modalParamResult.xiaoguanjia_student_ids = e
        setModalParam({ ...modalParamResult })
    }
    const modalOk = () => {
        modalParamResult.text = text
        console.log(modalParamResult)
        props.modalOk(modalParamResult)
    }
    const modalCancel = () => {
        props.modalCancel()
    }
    const modalOk2 = () => {
        setVisible3(false)
    }
    const modalCancel2 = () => {
        setVisible3(false)
    }
    const getContent = (editorState) => {
        setText(editorState.toHTML())
    }
    const handleChange = (editorState) => {
        const html = editorState
        getContent(html)
        modalParamResult.text = editorState
        setModalParam({ ...modalParamResult })
    }
    const caijian = (e) => {
        console.log(e)
        modalParamResult.text = ContentUtils.insertMedias(modalParamResult.text, [{
            type: 'IMAGE',
            url: e
        }])
        setVisible3(false)
    }
    return (
        <div>
            <Modal
                title="错题录入"
                visible={props.visible2}
                onOk={modalOk}
                onCancel={modalCancel}
                okText='确认'
                cancelText='取消'
            >
                {/* <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>老师选择：</span>
                    <Select style={{ width: '100%' }} optionFilterProp="children" showSearch onChange={teachChange} value={modalParamResult.analysis_teacher_id} placeholder="请选择老师">
                        {props.teacherchildren}
                    </Select>
                </div> */}
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_subject_id')} value={modalParamResult.xiaoguanjia_subject_id} placeholder="请选择学科">
                        {props.subjectchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>年级选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_grade_id')} placeholder="请选择年级" value={modalParamResult.xiaoguanjia_grade_id}>
                        {grandchildren}
                    </Select>
                </div>
                {/* <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>班级选择：</span>
                    <Select style={{ width: '100%' }} onChange={modalclassChange} value={modalParamResult.xiaoguanjia_class_id} placeholder="请选择班级">
                        {classchildren}
                    </Select>
                </div> */}
                <Modal
                    title="裁剪图片"
                    visible={visible3}
                    onOk={modalOk2}
                    onCancel={modalCancel2}
                    okText='确认'
                    cancelText='取消'
                >
                    <ImageEditor
                        width={470}
                        height={400}
                        src={cImg}
                        onConfirm={caijian}
                    />
                </Modal>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学生选择：</span>
                    <Select style={{ width: '100%' }} mode="multiple" optionFilterProp="children" showSearch onChange={modalstudentChange} placeholder="请选择学生姓名(可多选)" value={modalParamResult.xiaoguanjia_student_ids}>
                        {studentchildren}
                    </Select>
                </div>
                <div className="editor-wrapper my-component my-editor-component">
                    <BraftEditor
                        value={modalParamResult.text}
                        onChange={handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
            </Modal>
        </div>
    )
}
const EditorModalCompent = (props) => {
    //编辑录入
    const modalParams = props.modalParams
    modalParams.text = BraftEditor.createEditorState(props.modalParams.text || null)
    const [modalParamResult, setModalParam] = useState(modalParams)
    // const [classchildren, setClasschildren] = useState([])
    // const [studentchildren, setStudentchildren] = useState([])
    const [text, setText] = useState(modalParams.text.toHTML())
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
    const [visible3, setVisible3] = useState(false)
    const [cImg, setcImg] = useState('')
    const addimg = e => {
        if (e.file.status !== "uploading") {
            setVisible3(true)
            setcImg(e.file.response.data.full_path)
            // modalParamResult.text = ContentUtils.insertMedias(modalParamResult.text, [{
            //     type: 'IMAGE',
            //     url: e.file.response.data.full_path
            // }])
            // setModalParam({ ...modalParamResult })
        } else {
            return false
        }
    }
    const props2 = {
        action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
        onChange: addimg,
        multiple: true,
        name: 'upload_control',
        headers: {
            token: localStorage.getItem("token"),
            username: encodeURI(localStorage.getItem("username")),
            companyid: localStorage.getItem("companyid"),

        },
        data: {
            type: 2
        }
    }
    // const props3 = {
    //     width:1000,
    //     height:900,
    //     resize: true, //裁剪是否可以调整大小
    //     resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
    //     modalTitle: "上传图片", //弹窗标题
    //     modalWidth: 800, //弹窗宽度
    // };
    const extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                // <ImgCrop {...props3}>
                <Upload
                    {...props2}
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
                // </ImgCrop>
            )
        }
    ]
    useEffect(() => {
        setModalParam({ ...props.modalParams })
    }, [props.modalParams])
    // const teachChange = e => {
    //     modalParamResult.analysis_teacher_id = e
    //     setModalParam({ ...modalParamResult })
    // }
    //modal选择下拉框科目年级时的操作
    // const modalChange = (e, res) => {
    //     modalParamResult[res] = e
    //     if (typeof modalParamResult.xiaoguanjia_subject_id !== 'object' && typeof modalParamResult.xiaoguanjia_grade_id !== 'object') {
    //         get_xiaoguanjia_class(modalParamResult).then(res => {
    //             const classchildren = res.data.list.map(l1 => {
    //                 return <Option key={l1.class_id} value={l1.class_id} >{l1.name}</Option>
    //             })
    //             setClasschildren([...classchildren])
    //         })
    //     }
    //     setModalParam({ ...modalParamResult })
    // }
    //modal选择下拉框班级时的操作
    // const modalclassChange = e => {
    //     get_xiaoguanjia_student({ xiaoguanjia_class_id: e }).then(res => {
    //         const studentchildren = res.data.list.map(l1 => {
    //             return <Option key={l1.student_id} value={l1.student_id} >{l1.name}</Option>
    //         })
    //         modalParamResult.xiaoguanjia_class_id = e
    //         setModalParam({ ...modalParamResult })
    //         setStudentchildren(studentchildren)
    //     })
    // }
    //modal选择下拉框选择学生时的操作
    // const modalstudentChange = e => {
    //     modalParamResult.xiaoguanjia_student_ids = e
    //     setModalParam({ ...modalParamResult })
    // }

    const modalOk = () => {
        modalParamResult.text = text
        props.modalOk(modalParamResult)
    }
    const modalCancel = () => {
        props.modalCancel()
    }
    const modalOk2 = () => {
        setVisible3(false)
    }
    const modalCancel2 = () => {
        setVisible3(false)
    }
    const getContent = (editorState) => {
        setText(editorState.toHTML())
    }
    const handleChange = (editorState) => {
        const html = editorState
        getContent(html)
        modalParamResult.text = editorState
        setModalParam({ ...modalParamResult })
    }
    const caijian = (e) => {
        console.log(e)
        modalParamResult.text = ContentUtils.insertMedias(modalParamResult.text, [{
            type: 'IMAGE',
            url: e
        }])
        setVisible3(false)
    }
    return (
        <div>
            <Modal
                title="编辑错题"
                visible={props.visible2}
                onOk={modalOk}
                onCancel={modalCancel}
                okText='确认'
                cancelText='取消'
            >
                {/* <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>老师选择：</span>
                    <Select style={{ width: '100%' }} optionFilterProp="children" showSearch onChange={teachChange} value={modalParamResult.analysis_teacher_id} placeholder="请选择老师">
                        {props.teacherchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_subject_id')} value={modalParamResult.xiaoguanjia_subject_id} placeholder="请选择学科">
                        {props.subjectchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>年级选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_grade_id')} value={modalParamResult.xiaoguanjia_grade_id} placeholder="请选择年级">
                        {props.gradechildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>班级选择：</span>
                    <Select style={{ width: '100%' }} onChange={modalclassChange} value={modalParamResult.xiaoguanjia_class_id} placeholder="请选择班级">
                        {classchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学生选择：</span>
                    <Select style={{ width: '100%' }} mode="multiple" optionFilterProp="children" showSearch onChange={modalstudentChange} value={modalParamResult.xiaoguanjia_student_ids} placeholder="请选择学生姓名(可多选)">
                        {studentchildren}
                    </Select>
                </div> */}
                <Modal
                    title="裁剪图片"
                    visible={visible3}
                    onOk={modalOk2}
                    onCancel={modalCancel2}
                    okText='确认'
                    cancelText='取消'
                >
                    <ImageEditor
                        width={470}
                        height={400}
                        src={cImg}
                        onConfirm={caijian}
                    />
                </Modal>
                <div className="editor-wrapper my-component my-editor-component">
                    <BraftEditor
                        value={modalParamResult.text}
                        onChange={handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
            </Modal>
        </div>
    )
}
export default Main
