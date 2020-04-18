import React, { useEffect, useState } from 'react'
import { Input, Button, Select, Pagination, Divider } from 'antd';
import Zmage from 'react-zmage'
import { get_xiaoguanjia_subject, get_xiaoguanjia_grade, get_xiaoguanjia_class, wrong_get_list } from '../../../axios/http'
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
    let list = []
    let count = 0
    const [paramResult, setParams] = useState(params)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [classchildren, setClasschildren] = useState('')
    const [height, setHeight] = useState('')
    const [dataList, setDataList] = useState(list)
    const [totalCount, setTotalCount] = useState(count)

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
    }, [])
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
                                    <Zmage style={{ width: 200, height: 200 }} alt="example" src={res.image} />
                                    {res.text}
                                </div>
                                <div style={{fontWeight:'bold'}} dangerouslySetInnerHTML={{ __html: res.analysis_content }}>

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
