import React from 'react';
import List from './previewList'
const Preview = (props) => {
    const previewData = JSON.parse(sessionStorage.getItem('previewData'))
    return (
        <div>
            <div >
                <div className='paper-hd-title' style={{ background: '#fff', flex: 1 }} >
                    <h3>{previewData.pager_config.title}</h3>
                </div>
                <div className="paper-hd-title " style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} >
                    <div className="set-item" >总分：<span>{previewData.pager_config.score}分</span></div>
                    <div className="set-item">答题时间：{previewData.pager_config.total_minute}<span></span>分钟</div>
                    <div className="set-item" >日期：____________</div>
                    <div className="set-item">班级：____________</div>
                    <div className="set-item">姓名：____________</div>
                </div>
            </div>
            {previewData.list.map(res =>
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