import React, { useEffect, useState } from 'react';
import { preview_paper } from '../../axios/http'
import List from './previewList'
const Preview = (props) => {
    const [qusetionList, setquestionList] = useState([])
    const [ques_type_list, setques_type_list] = useState([])
    const paper_id = props.history.location.search.split('=')[1].split('&')[0]
    // 这个是token
    // console.log(props.history.location.search.split('=')[2])
    useEffect(() => {
        preview_paper({ paper_id: paper_id }).then(res => {
            console.log(res)
            const ques_type_list = res.data.ques_type_list.map(res => {
                return res.ques_list
            })
            setquestionList(res.data.ques_type_list)
            setques_type_list(ques_type_list)
        })
    }, [paper_id])
    return (
        <div >
            {qusetionList.map((res, index) =>
                <div style={{ width: '100%', background: '#fff', padding: 8 }} key={res.title}>
                    <div className="leixing-title" >
                        <span>{res.title}<span className="m-left">{res.total_score + '分'}</span></span>
                    </div>
                    <List data={ques_type_list[index]||ques_type_list} >
                    </List>
                </div>
            )}
        </div>
    )
}
export default Preview;