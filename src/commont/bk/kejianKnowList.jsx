import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Pagination } from 'antd';
import { get_list } from '../../axios/http'
const { Search } = Input;
const Knowlage = (props) => {
    const [total_count, setTotal_count] = useState(0)
    const [count, setCount] = useState(1)
    const [shijuanList, setShijuanList] = useState('')
    const onChangePage = (e) => {
        props.params.page = e
        setCount(e)
        get_list(props.params).then(res => {
            setTotal_count(Number(res.data.count))
            setShijuanList(res.data.list)
        })
    }
    useEffect(() => {
        props.params.page = 1
        get_list(props.params).then(res => {
            setTotal_count(Number(res.data.count))
            setShijuanList(res.data.list)
            setCount(1)
        })
    }, [props.params])
    return (
        <div style={{width:270}}>
            <Search
                placeholder="搜索公开组卷"
                onSearch={value => props.searchKeyWord(value)}
                style={{ width: 200 }}>
            </Search>
            <div className='m-know-list'>
                <List
                    className="list-hover"
                    itemLayout="vertical"
                    dataSource={shijuanList}
                    size='small'
                    renderItem={item => (
                        <List.Item
                            onClick={() => props.listView(item.id, item.total_minute, item.title,item.score)}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={require('../../img/shijuan.png')} />}
                                description={item.title}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <div className="m-pageination">
                <Pagination onChange={onChangePage} total={total_count} current={count} simple />
            </div>
        </div>
    )
}
export default Knowlage