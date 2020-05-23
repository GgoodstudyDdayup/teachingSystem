import React, { useEffect, useState } from 'react'
import { Table, Descriptions, Badge, Select, Button, Result } from 'antd';
import { get_grade_by_teacher, getStudent_by_teacher, get_report, get_xiaoguanjia_subject } from '../../../axios/http'
const { Option } = Select
//配置每个表格的参数
const columns = [[
    {
        title: '章节名称',
        dataIndex: 'section_name',
        key: 'section_name',
        align: 'center',
    },
    {
        title: '题量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
    },
    {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center',
    },
    {
        title: '掌握程度',
        children: [
            {
                title: '完全不会',
                dataIndex: 'l1',
                key: 'l1',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较差',
                dataIndex: 'l2',
                key: 'l2',
                width: 200,
                align: 'center',
            },
            {
                title: '基本掌握',
                dataIndex: 'l3',
                key: 'l3',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较好',
                dataIndex: 'l4',
                key: 'l4',
                width: 200,
                align: 'center',
            },
            {
                title: '完全掌握',
                dataIndex: 'l5',
                key: 'l5',
                width: 200,
                align: 'center',
            },
        ],
    },
], [
    {
        title: '知识点',
        dataIndex: 'knowledge',
        key: 'knowledge',
        align: 'center',
    },
    {
        title: '题量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
    },
    {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center',
    },
    {
        title: '掌握程度',
        children: [
            {
                title: '完全不会',
                dataIndex: 'l1',
                key: 'l1',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较差',
                dataIndex: 'l2',
                key: 'l2',
                width: 200,
                align: 'center',
            },
            {
                title: '基本掌握',
                dataIndex: 'l3',
                key: 'l3',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较好',
                dataIndex: 'l4',
                key: 'l4',
                width: 200,
                align: 'center',
            },
            {
                title: '完全掌握',
                dataIndex: 'l5',
                key: 'l5',
                width: 200,
                align: 'center',
            },
        ],
    },
], [
    {
        title: '题型',
        dataIndex: 'ques_type_name',
        key: 'ques_type_name',
        align: 'center',
    },
    {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
    },
    {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center',
    },
    {
        title: '掌握程度',
        children: [
            {
                title: '完全不会',
                dataIndex: 'l1',
                key: 'l1',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较差',
                dataIndex: 'l2',
                key: 'l2',
                width: 200,
                align: 'center',
            },
            {
                title: '基本掌握',
                dataIndex: 'l3',
                key: 'l3',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较好',
                dataIndex: 'l4',
                key: 'l4',
                width: 200,
                align: 'center',
            },
            {
                title: '完全掌握',
                dataIndex: 'l5',
                key: 'l5',
                width: 200,
                align: 'center',
            },
        ],
    },
], [
    {
        title: '原因',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '题量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
    },
    {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center',
    },
    {
        title: '掌握程度',
        children: [
            {
                title: '完全不会',
                dataIndex: 'l1',
                key: 'l1',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较差',
                dataIndex: 'l2',
                key: 'l2',
                width: 200,
                align: 'center',
            },
            {
                title: '基本掌握',
                dataIndex: 'l3',
                key: 'l3',
                width: 200,
                align: 'center',
            },
            {
                title: '掌握较好',
                dataIndex: 'l4',
                key: 'l4',
                width: 200,
                align: 'center',
            },
            {
                title: '完全掌握',
                dataIndex: 'l5',
                key: 'l5',
                width: 200,
                align: 'center',
            },
        ],
    },
]];
const formTitle = [{ name: '章节分析' }, { name: '知识点分析' }, { name: '题型分析' }, { name: '错误原因分析' }]
const Main = (props) => {
    const params = {
        // xiaoguanjia_subject_id: '58513720-d34d-442a-880b-74398a23a7db',
        xiaoguanjia_grade_id: [],
        xiaoguanjia_subject_id: [],
        xiaoguanjia_student_id: []
        // xiaoguanjia_student_id: '6ad63167-f531-48de-938a-0229e3cd49e1'
    }
    const [paramResult, setParams] = useState(params)
    const [subjectchildren, setSubjectchildren] = useState('')
    const [gradechildren, setGradechildren] = useState('')
    const [studentchildren, setStudentchildren] = useState('')
    const [student, setstudent] = useState('')
    const [subject_name, setsubject_name] = useState('')
    const [data, setdata] = useState([])
    useEffect(() => {
        get_xiaoguanjia_subject().then(res => {
            const subjectchildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            setSubjectchildren([...subjectchildren])
        })
        getStudent_by_teacher({ teacher_employee_id: '', grade_id: '' }).then(res => {
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
            setStudentchildren(studentchildren)
        })
        get_grade_by_teacher({ teacher_employee_id: '' }).then(res => {
            const grandchildren = res.data.list.map(l1 => {
                return <Option key={l1.grade_id} value={l1.grade_id} >{l1.grade}</Option>
            })
            setGradechildren(grandchildren)
        })
    }, [])

    const paramsstudentChange = e => {
        paramResult.xiaoguanjia_student_id = e
        setParams({ ...paramResult })
    }
    const search = () => {
        get_report(paramResult).then(res => {
            console.log(res)
            const newData = []
            const section = res.data.list.section_list.reduce((item, res) => {
                item.push({
                    section_name: res.section_name ? res.section_name : '',
                    percent: res.percent,
                    count: res.count,
                    l1: res.mastery_level_data[0].count,
                    l2: res.mastery_level_data[1] ? res.mastery_level_data[1].count : 0,
                    l3: res.mastery_level_data[2] ? res.mastery_level_data[2].count : 0,
                    l4: res.mastery_level_data[3] ? res.mastery_level_data[3].count : 0,
                    l5: res.mastery_level_data[4] ? res.mastery_level_data[4].count : 0
                })
                return item
            }, [])
            const knowledge = res.data.list.knowledge_list.reduce((item, res) => {
                item.push({
                    knowledge: res.knowledge ? res.knowledge : '',
                    percent: res.percent,
                    count: res.count,
                    l1: res.mastery_level_data[0].count,
                    l2: res.mastery_level_data[1] ? res.mastery_level_data[1].count : 0,
                    l3: res.mastery_level_data[2] ? res.mastery_level_data[2].count : 0,
                    l4: res.mastery_level_data[3] ? res.mastery_level_data[3].count : 0,
                    l5: res.mastery_level_data[4] ? res.mastery_level_data[4].count : 0
                })
                return item
            }, [])
            const ques_type = res.data.list.ques_type_list.reduce((item, res) => {
                item.push({
                    ques_type_name: res.ques_type_name ? res.ques_type_name : '',
                    percent: res.percent,
                    count: res.count,
                    l1: res.mastery_level_data[0].count,
                    l2: res.mastery_level_data[1] ? res.mastery_level_data[1].count : 0,
                    l3: res.mastery_level_data[2] ? res.mastery_level_data[2].count : 0,
                    l4: res.mastery_level_data[3] ? res.mastery_level_data[3].count : 0,
                    l5: res.mastery_level_data[4] ? res.mastery_level_data[4].count : 0
                })
                return item
            }, [])
            const wrong_reason = res.data.list.wrong_reason_list.reduce((item, res) => {
                item.push({
                    wrong_reason_name: res.name ? res.name : '',
                    percent: res.percent,
                    count: res.count,
                    l1: res.mastery_level_data[0].count,
                    l2: res.mastery_level_data[1] ? res.mastery_level_data[1].count : 0,
                    l3: res.mastery_level_data[2] ? res.mastery_level_data[2].count : 0,
                    l4: res.mastery_level_data[3] ? res.mastery_level_data[3].count : 0,
                    l5: res.mastery_level_data[4] ? res.mastery_level_data[4].count : 0
                })
                return item
            }, [])
            newData.push(section, knowledge, ques_type, wrong_reason)
            setdata([...newData])
            setstudent(res.data.student)
            setsubject_name(res.data.subject_name)
        })
    }
    const paramsSelect = (e, res) => {
        paramResult[res] = e
        if (res === 'xiaoguanjia_grade_id') {
            getStudent_by_teacher({ teacher_employee_id: '', grade_id: e }).then(res => {
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
                setStudentchildren(studentchildren)
            })
        }
        setParams({ ...paramResult })
    }
    //获取当天日期
    const getCurrentDate = () => {
        var timeStr = '-';
        var curDate = new Date();
        var curYear = curDate.getFullYear();  //获取完整的年份(4位,1970-????)
        var curMonth = curDate.getMonth() + 1;  //获取当前月份(0-11,0代表1月)
        var curDay = curDate.getDate();       //获取当前日(1-31)
        var curHour = curDate.getHours();      //获取当前小时数(0-23)
        var curMinute = curDate.getMinutes();   // 获取当前分钟数(0-59)
        var curSec = curDate.getSeconds();      //获取当前秒数(0-59)
        var Current = curYear + timeStr + curMonth + timeStr + curDay + ' ' + curHour + ':' + curMinute + ':' + curSec;
        return Current;
    }
    return (
        <div style={{ background: '#fff', marginBottom: 24, padding: 24 }}>
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
                        <Select style={{ width: 240 }} onChange={paramsstudentChange} placeholder="请选择学生">
                            {studentchildren}
                        </Select>
                    </div>
                    {/* <div className="m-left">
                        <Input onChange={paramsstudentChange} placeholder="请选择姓名"></Input>
                    </div> */}
                    <Button style={{ marginLeft: 10 }} onClick={search}>
                        查询
                            </Button>
                </div>
            </div>
            {data.length > 1 ?
                <div>
                    <Descriptions title="小亚报表" bordered>
                        <Descriptions.Item label="姓名">{student}</Descriptions.Item>
                        <Descriptions.Item label="科目">{subject_name}</Descriptions.Item>
                        <Descriptions.Item label="报告日期" span={3}>
                            <Badge status="processing" text={getCurrentDate()} />
                        </Descriptions.Item>
                    </Descriptions>
                    {formTitle.map((res, index) =>
                        <div key={index}>
                            <div className="m-pingxingTitle m-left">
                                <p style={{ position: 'relative', zIndex: 9, marginBottom: 0 }}>{res.name}</p>
                            </div>
                            <Table
                                columns={columns[index]}
                                dataSource={data[index]}
                                bordered
                                size="middle"
                                pagination={false}
                            />
                        </div>
                    )}
                </div> : <Result
                    status="404"
                    title="请先选择学生"
                    subTitle="选择你要查询的学生即可生成报表"
                />
            }
        </div>
    )
}
export default Main
