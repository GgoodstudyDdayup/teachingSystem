import React, { useEffect, useState } from 'react'
import { Button, Select, Pagination, Divider, Radio } from 'antd';
import { Sget_xiaoguanjia_subject, Sget_xiaoguanjia_grade, get_user_wrong_question } from '../../../axios/http'
const { Option } = Select
const Main = (props) => {
    //搜索
    const params = {
        xiaoguanjia_subject_id: [],
        xiaoguanjia_grade_id: [],
        mastery_level: '',
        ques_difficulty_id: '',
        state: 1,
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
        if (res === 'mastery_level' || res === 'ques_difficulty_id') {
            paramResult[res] = e.target.value
        } else {
            paramResult[res] = e
        }
        setParams({ ...paramResult })
    }
    return (
        <div>
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
                    <div className="m-flex " style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>掌握程度：</span>
                        <Radio.Group onChange={(e) => paramsSelect(e, 'mastery_level')} value={paramResult.mastery_level}>
                            <Radio value={1}>完全不会</Radio>
                            <Radio value={2}>掌握较差</Radio>
                            <Radio value={3}>基本掌握</Radio>
                            <Radio value={4}>掌握较好</Radio>
                            <Radio value={5}>完全掌握</Radio>
                        </Radio.Group>
                    </div>
                    <div className="m-flex " style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>难度：</span>
                        <Radio.Group onChange={(e) => paramsSelect(e, 'ques_difficulty_id')} value={paramResult.ques_difficulty_id}>
                            <Radio value={1}>简单</Radio>
                            <Radio value={2}>中等</Radio>
                            <Radio value={3}>困难</Radio>
                        </Radio.Group>
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
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Pagination className="m-Pleft" current={paramResult.page} onChange={changePage} total={totalCount} />
        </div >
    )
}
export default Main
