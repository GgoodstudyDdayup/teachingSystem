import React from 'react';
import { Empty } from 'antd'
const lis = [1, 2, 3]
const Li = () =>
    lis.length > 0 ?
        lis.map((x, index) =>
            <li className="handout-list" key={index}>
                <i className="svg atf-ykt-default"></i>
                <span className="filename text-ellipsis pointer">第{x}讲01010</span>
            </li>
        )
        :
        <Empty></Empty>

const list = () => {
    return (
        <ul className="file-list">
            <Li></Li>
        </ul>
    )
}
export default list