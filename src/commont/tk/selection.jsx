import React from 'react';
import { Cascader } from 'antd';

const Select = (props) => {
    return (<div>
        <Btn selectonChange={props.selectonChange} data={props.data} value={props.value}></Btn>
    </div>)
}
const Btn = props => {
    return (
        <div>
            <Cascader
                fieldNames={{ label: 'name', value: 'subject_id', children: 'items' }}
                options={props.data}
                expandTrigger="hover"
                allowClear={false}
                onChange={props.selectonChange}
                placeholder="选择年级学科"
                value={typeof (props.value) === 'object' ? props.value : []}
            />
        </div>)
}

export default Select