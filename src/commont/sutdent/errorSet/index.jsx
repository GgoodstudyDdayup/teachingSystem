import React, { useEffect, useState } from 'react'
import { Tabs, Button, Select, Pagination, Divider } from 'antd';
import 'braft-editor/dist/index.css'
import Finished from './finished'
import { get_user_wrong_question, Sget_xiaoguanjia_subject, Sget_xiaoguanjia_grade } from '../../../axios/http'
const { TabPane } = Tabs
const { Option } = Select
const Main = (props) => {
    //搜索
    const params = {
        xiaoguanjia_subject_id: [],
        xiaoguanjia_grade_id: [],
        mastery_level: '',
        ques_difficulty_id: '',
        state: -1,
        pagesize: 10,
        page: 1
    }
    let list = []
    let count = 0
    const [paramResult, setParams] = useState(params)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [height, setHeight] = useState('')
    const [dataList, setDataList] = useState(list)
    const [totalCount, setTotalCount] = useState(count)
    useEffect(() => {
        setHeight(document.body.clientHeight)
    }, [height])
    //获取默认的学科和年级数据
    useEffect(() => {
        get_user_wrong_question({
            xiaoguanjia_subject_id: '',
            xiaoguanjia_grade_id: '',
            state: -1,
            pagesize: 10,
            page: 1
        }).then(res => {
            setTotalCount(Number(res.data.count))
            setDataList([...res.data.list])
        })
        Sget_xiaoguanjia_subject().then(res => {
            const subjectchildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            setSubjectchildren([...subjectchildren])
        })
        Sget_xiaoguanjia_grade().then(res => {
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
    const search = () => {
        get_user_wrong_question(paramResult).then(res => {
            if (res.code === 0) {
                list = res.data.list
                count = Number(res.data.count)
                setTotalCount(count)
                setDataList([...list])
            }
        })
    }
    const getList = (page) => {
        get_user_wrong_question({
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
        setParams({ ...paramResult })
    }
    return (
        <div>
            <Tabs defaultActiveKey='1' >
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
                            <Button style={{ marginLeft: 10 }} onClick={search}>
                                查询
                            </Button>
                        </div>

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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Pagination className="m-Pleft" current={paramResult.page} onChange={changePage} total={totalCount} />
                </TabPane>
                <TabPane tab="已完成" key="3">
                    <Finished></Finished>
                </TabPane>
            </Tabs>
        </div >
    )
}

export default Main
