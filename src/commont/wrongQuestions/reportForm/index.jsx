import React, { useEffect } from 'react'
import { Table } from 'antd';
const columns = [
    {
        title: '章节名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '题量',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '占比',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: '掌握程度',
        children: [
            {
                title: 'L1',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 200,
                align: 'center',
            },
            {
                title: 'L2',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 200,
                align: 'center',
            },
            {
                title: 'L3',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 200,
                align: 'center',
            },
            {
                title: 'L4',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 200,
                align: 'center',
            },
        ],
    },
];
const data = [];
const formTitle = [{ name: '章节分析' }, { name: '知识点分析' }, { name: '题型分析' }, { name: '考试分析' }, { name: '难易程度分析' }, { name: '错误类型分析' }]
for (let i = 0; i < 5; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
    });
}
// import ErrorSet from './errorSet/index'
// import ExerciseBook from './exerciseBook/index'
// import ReportForm from './reportForm/index'
const Main = (props) => {
    useEffect(() => {

    })
    return (
        <div style={{ background: '#fff',marginBottom:24 ,padding:24}}>
            {formTitle.map(res =>
                <div key={res.name}>
                    <div className="m-pingxingTitle m-left">
                        <p style={{ position: 'relative', zIndex: 9, marginBottom: 0 }}>{res.name}</p>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered
                        size="middle"
                        pagination={false}
                    />
                </div>
            )}

        </div>
    )
}
export default Main
