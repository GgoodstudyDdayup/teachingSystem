import React from 'react';
import List from './previewList'
const Preview = (props) => {
    const previewData = JSON.parse(localStorage.getItem('previewData'))
    console.log(previewData)
    return (
        <div>
            <List data={previewData} >
            </List>
        </div>
    )
}
export default Preview;