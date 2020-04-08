import React, { useEffect, useState } from 'react';
import { get_self_paperinfo } from '../../axios/http'
import List from './previewList'
const Preview = (props) => {
    const [score, setScore] = useState('')
    const [total_minute, setTotal_minute] = useState('')
    const [title, setTitle] = useState('')
    const [qusetionList, setquestionList] = useState([])
    const self_paper_id = props.history.location.search.split('=')[1]
    useEffect(() => {
        get_self_paperinfo({ self_paper_id: self_paper_id }).then(res => {
            console.log(res)
            setScore(res.data.model.score)
            setTotal_minute(res.data.model.total_minute)
            setTitle(res.data.model.title)
            setquestionList(res.data.list)
        })
    }, [self_paper_id])
    return (
        <div>
            <div >
                <div className='paper-hd-title' style={{ background: '#fff', flex: 1 }} >
                    <h3>{title}</h3>
                </div>
                <div className="paper-hd-title " style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} >
                    <div className="set-item" >总分：<span>{score}分</span></div>
                    <div className="set-item">答题时间：{total_minute}<span></span>分钟</div>
                    <div className="set-item" >日期：____________</div>
                    <div className="set-item">班级：____________</div>
                    <div className="set-item">姓名：____________</div>
                </div>
            </div>
            {qusetionList.map(res =>
                <div style={{ width: '100%', background: '#fff', padding: 8 }} key={res.id}>
                    <div className="leixing-title" >
                        <span>{res.show_type_name}<span className="m-left">{res.ques_score + '分'}</span></span>
                    </div>
                    <List data={res.ques_list} key={res.id}>
                    </List>
                </div>
            )}
        </div>
    )
}
export default Preview;