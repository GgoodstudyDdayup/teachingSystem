import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Input, Badge, Button, Select, Pagination, Divider, Drawer, Row, Col, Radio, Upload, Icon, message, Modal } from 'antd';
import {
    get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_class, wrong_get_list, get_analysis_option, analysis_question, get_recommend_question,
    
    remove_wrong_cart,
    getques_ids_cart,
    get_wrong_question_cartstion_cart,
    add_wrong_question_cart
} from '../../../axios/http'
import { ContentUtils } from 'braft-utils'
import BraftEditor from 'braft-editor'
import List from './list'
const { Option } = Select
const Main = (props) => {
    //搜索
    const params = {
        xiaoguanjia_subject_id: [],
        xiaoguanjia_grade_id: [],
        xiaoguanjia_class_id: [],
        student: '',
        submit_teacher_id: '',
        analysis_teacher_id: localStorage.getItem('id'),
        state: 1,
        pagesize: 10,
        page: 1
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
    let history = useHistory()
    const editorState = BraftEditor.createEditorState(null)
    const [editor, setEditorState] = useState(editorState)
    const [paramResult, setParams] = useState(params)
    const [drawerParamResult, setDrawerParam] = useState(drawerParams)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [classchildren, setClasschildren] = useState('')
    const [drawerText, setDrawerText] = useState('')
    const [height, setHeight] = useState('')
    const [dataList, setDataList] = useState(list)
    const [totalCount, setTotalCount] = useState(count)
    const [visible, setVisible] = useState(false)
    const [tixingOptions, setTixingOptions] = useState([])
    const [sourceOptions, setSourceOptions] = useState([])
    const [modalVisible, setmodalVisible] = useState(false)
    const [cardTotal, setcardTotal] = useState(0)
    const [clear, setClear] = useState('none')
    const [listAI, setList] = useState([])
    const [recommend_ques_id, setrecommend_ques_id] = useState('')
    const [studentIds, setstudentIds] = useState('')
    const [quesIds, setquesIds] = useState('')
    const [question_cart, setquestion_cart] = useState([])
    // const [zjChildrenList, setZjChildrenList] = useState([])
    // const [knowlageList, setKnowlageList] = useState([])
    const [wrong_reasonOptions, setWrong_reasonOptions] = useState([])
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
    const handleChange = (editorState) => {
        drawerParamResult.analysis_content = editorState.toHTML()
        setDrawerParam({ ...drawerParamResult })
        setEditorState(editorState)
    }
    const handleChange2 = (e) => {
        if (e.file.status !== "uploading") {
            console.log(e.file.response.data.full_path)
            const result = ContentUtils.insertMedias(editor, [{
                type: 'IMAGE',
                url: e.file.response.data.full_path
            }])
            drawerParamResult.analysis_content = result
            setDrawerParam({ ...drawerParamResult })
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

    useEffect(() => {
        setHeight(document.body.clientHeight)
    }, [height])
    //获取默认的学科和年级数据
    useEffect(() => {
        get_wrong_question_cartstion_cart().then(res => {
            setquestion_cart(res.data.list)
            setcardTotal(res.data.list.length)
        })
        getques_ids_cart().then(res => {
            setquesIds(res.data.cart_ques_ids)
        })
        wrong_get_list({
            xiaoguanjia_subject_id: '',
            xiaoguanjia_grade_id: '',
            xiaoguanjia_class_id: '',
            xiaoguanjia_student_ids: '',
            analysis_teacher_id: localStorage.getItem('id'),
            state: 1,
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
    }, [props.count])
    const getCardIds = () => {
        getques_ids_cart().then(res => {
            setquesIds(res.data.cart_ques_ids)
        })
    }
    const getLists = () => {
        get_wrong_question_cartstion_cart().then(res => {
            
            setquestion_cart(res.data.list)
            setcardTotal(res.data.list.length)
        })
    }
    const removeQues = (id) => {
        remove_wrong_cart({ recommend_ques_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                getCardIds()
                getLists()
            } else {
                message.error(res.message)
            }
        })
    }
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
    const drawerChange = (e, res) => {
        drawerParamResult[res] = e
        setDrawerParam({ ...drawerParamResult })
    }
    const detail = (id, res, text) => {
        console.log(res)
        drawerParamResult['id'] = id
        drawerParamResult.ques_type_id = res.ques_type_id
        drawerParamResult.source_id = res.source_id
        drawerParamResult.section_id = res.section_id
        drawerParamResult.analysis_content = BraftEditor.createEditorState(res.analysis_content)
        drawerParamResult.mastery_level = res.mastery_level
        drawerParamResult.ques_difficulty_id = res.ques_difficulty_id
        drawerParamResult.knowledge_ids = res.knowledge_ids.split(',')
        drawerParamResult.wrong_reason_id = res.wrong_reason_id
        // setDrawerImage(image)
        setDrawerText(text)
        get_analysis_option({ id }).then(res => {
            if (res.code === 0) {
                const tixingOptions = res.data.type_list.map((res, index) => {
                    return <Option key={res.ques_type_id} value={`${res.ques_type_id}`} >{res.name}</Option>
                })

                const wrong_reason = res.data.wrong_reason_list.map((res, index) => {
                    return <Option key={res.name} value={`${res.id}`} >{res.name}</Option>
                })
                const source = res.data.source_list.map((res, index) => {
                    console.log(res.id)
                    return <Option key={res.name} value={`${res.id}`} >{res.name}</Option>
                })
                setTixingOptions([...tixingOptions])
                setSourceOptions([...source])
                setWrong_reasonOptions([...wrong_reason])
                setVisible(true)
            }
        }).then(() => {
            setDrawerParam({ ...drawerParamResult })
        })
    }
    const radioChange = (e, res) => {
        drawerParamResult[res] = e.target.value
        setDrawerParam({ ...drawerParamResult })
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
    //AI找题操作
    const aiquestion = (e, xiaoguanjia_student_ids) => {
        get_recommend_question({ ques_id: 231278 }).then(res => {
            setList(res.data.list)
            setrecommend_ques_id(231278)
            setstudentIds(xiaoguanjia_student_ids)
            setmodalVisible(true)
        })
    }
    const okModal = () => {
        setmodalVisible(false)
    }
    const cancle = () => {
        setmodalVisible(false)
    }
    //鼠标移动交互操作
    const mouse = (e) => {
        if (e) {
            setClear('block')
        } else {
            setClear('none')
        }
    }
    const zujuan = ()=>{
        localStorage.setItem('setquestion_cart',JSON.stringify(question_cart))
        history.push('/main/wrongQuestion/errorSet/zujuan')
    }
    return (
        <div>
            <div className="m-shopcar" onMouseEnter={() => mouse('enter')} onMouseLeave={() => mouse()}>
                <Icon type="container" style={{ margin: `0 15px 0 0` }} />
                    我的AI题篮
                    <Badge count={cardTotal} className="m-shopicon">
                </Badge>
            </div>
            <div className="topic-panel" style={{ display: clear, zIndex: 9999 }} onMouseEnter={() => mouse('enter')} onMouseLeave={() => mouse()}>
                <div className="topic-row header">
                    <div className="topic-col">题目</div>
                    <div className="topic-col">数量</div>
                    <div className="topic-col">删除</div>
                </div>
                {question_cart.map(res =>
                    <div className="topic-bd" key={res.id}>
                        <div className="topic-row">
                            <div className="topic-col">
                                {res.ques_type_name}
                            </div>
                            {/* <div className="topic-col">
                                {res.count}
                            </div> */}
                            <div className="topic-col">
                                <Icon type="close" onClick={() => removeQues(res.recommend_ques_id)} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="topic-ctrls">
                    {/* <div className="clear-btn" >清空全部</div> */}
                    <div className="see-btn" onClick={zujuan}>查看AI试卷</div>
                </div>
            </div>
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
                        value={drawerParamResult.analysis_content}
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
            </div>
            <div className="m-card" style={height > 638 ? { maxHeight: 600, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' } : { maxHeight: 400, overflowY: 'scroll', display: 'flex', flexFlow: 'column ' }}>
                {dataList.map(res =>
                    <div key={res.id} >
                        <div className="listT"  >
                            <div className="know-name-m m-flex" style={{ flexFlow: 'column' }}>
                                <div className="m-flex">
                                    <div dangerouslySetInnerHTML={{ __html: res.text }}></div>
                                </div>
                                <div style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: res.analysis_content }}>

                                </div>
                            </div>
                            <Divider dashed />
                            <div className="shop-btn">
                                <div className="know-title-div">
                                    <p className="know-title">
                                        错题学生姓名:
                                                <span>{res.student_str}</span>
                                    </p>
                                </div>
                                <div className="m-flex">
                                    <Button type="primary" onClick={() => aiquestion(res.id, res.xiaoguanjia_student_ids)}>AI找题</Button>
                                    <QuestionModal getLists={getLists} getCardIds={getCardIds} quesIds={quesIds} modalVisible={modalVisible} list={listAI} recommend_ques_id={recommend_ques_id} studentIds={studentIds} cancle={cancle} ok={okModal}></QuestionModal>
                                    <div style={{ width: 10 }}></div>
                                    <Button type="primary" onClick={() => detail(res.id, res, res.text)}>编辑点评</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Pagination className="m-Pleft" current={paramResult.page} onChange={changePage} total={totalCount} />
        </div >
    )
}
const QuestionModal = (props) => {
    const ok = () => {
        props.ok()
    }
    const cancle = () => {
        props.cancle()
    }
    const moveOrAdd = (id) => {
        let cart_ques_ids = props.quesIds
        let result = ''
        if (typeof (cart_ques_ids) !== 'object') {
            let strArray = cart_ques_ids.split(',')
            strArray.forEach(res => {
                if (res === id) {
                    result = true
                }
            })
        } else {
            result = false
        }
        return result
    }
    const addQuestoin = (e, id) => {
        e.stopPropagation()
        add_wrong_question_cart({ wrong_question_id: props.recommend_ques_id, recommend_ques_id: id, xiaoguanjia_student_ids: props.studentIds }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                props.getCardIds()
                props.getLists()
            } else {
                message.error(res.message)
            }
        })
    }
    const deleteQuestoin = (e, id) => {
        e.stopPropagation()
        remove_wrong_cart({ recommend_ques_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                props.getCardIds()
                props.getLists()
            } else {
                message.error(res.message)
            }
        })
    }
    return (
        <div>
            <Modal
                title="AI找题"
                visible={props.modalVisible}
                onOk={ok}
                onCancel={cancle}
                okText="确认"
                cancelText="取消"
            >
                <div style={{ height: 600, overflowY: 'scroll' }}>
                    <List data={props.list} deleteQuestoin={deleteQuestoin} addQuestoin={addQuestoin} moveOrAdd={moveOrAdd}>
                    </List>
                </div>
            </Modal>
        </div>
    )
}
export default Main
