import React from 'react';
import { Empty  } from 'antd';
const empty = ()=>{
    return (
        <div>
            <Empty description={`暂无数据`}/>
        </div>
    )
}
export default empty