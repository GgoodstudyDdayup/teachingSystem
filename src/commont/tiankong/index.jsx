import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { Upload, Icon } from 'antd'

export default class UploadDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(props.data.ques_content || null),
            editorState2: BraftEditor.createEditorState(props.data.ques_answer || null),
            editorState3: BraftEditor.createEditorState(props.data.ques_analysis || null)
        }
    }
    handleChange = (editorState) => {
        this.props.ques_content(editorState.toHTML())
        this.setState({ editorState })
    }
    //这个是答案
    handleEditorChange2 = (editorState2) => {
        this.props.ques_answer(editorState2.toHTML())
        this.setState({ editorState2 })
    }
    //这个是解析
    handleEditorChange3 = (editorState3) => {
        this.props.ques_analysis(editorState3.toHTML())
        this.setState({ editorState3 })
    }
    handleChange2 = e => {
        if (e.file.status !== "uploading") {
            this.setState({
                editorState: ContentUtils.insertMedias(this.state.editorState, [{
                    type: 'IMAGE',
                    url: e.file.response.data.full_path
                }])
            })
        } else {
            return false
        }
    }
    handleChange3 = e => {
        if (e.file.status !== "uploading") {
            this.setState({
                editorState3: ContentUtils.insertMedias(this.state.editorState3, [{
                    type: 'IMAGE',
                    url: e.file.response.data.full_path
                }])
            })
        } else {
            return false
        }
    }
    uploadHandler = (param) => {
        if (!param.file) {
            return false
        }

        this.setState({
            editorState: ContentUtils.insertMedias(this.state.editorState, [{
                type: 'IMAGE',
                url: 'https://jiaoxueapi.yanuojiaoyu.com/upload/self_lecture/202003241722206911.jpg'
            }])
        })

    }

    render() {

        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
        const props = {
            action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange2,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: sessionStorage.getItem("token"),
                username: sessionStorage.getItem("username"),
                companyid: sessionStorage.getItem("companyid"),

            },
            data: {
                type: 1
            }
        }
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        {...props}
                        accept="image/*"
                        showUploadList={false}
                    // customRequest={this.uploadHandler}
                    // beforeUpload={this.beforeUpload}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]
        const props2 = {
            action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange3,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: sessionStorage.getItem("token"),
                username: sessionStorage.getItem("username"),
                companyid: sessionStorage.getItem("companyid"),
            },
            data: {
                type: 1
            }
        }
        const extendControls2 = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        {...props2}
                        accept="image/*"
                        showUploadList={false}
                    // customRequest={this.uploadHandler}
                    // beforeUpload={this.beforeUpload}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]
        return (
            <div>
                <div className="m-row" style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }}>题目</div>
                <div className="editor-wrapper my-component my-editor-component">
                    <BraftEditor
                        value={this.state.editorState}
                        onChange={this.handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
                <div style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }}>答案</div>
                <div className="my-component my-editor-component">
                    <BraftEditor
                        value={this.state.editorState2}
                        onChange={this.handleEditorChange2}
                        controls={controls}
                        onSave={this.submitContent}
                        contentStyle={{ height: 100 }}
                    />
                </div>
                <div style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }}>解析</div>
                <div className="my-component my-editor-component">
                    <BraftEditor
                        value={this.state.editorState3}
                        onChange={this.handleEditorChange3}
                        controls={controls}
                        onSave={this.submitContent}
                        contentStyle={{ height: 100 }}
                        extendControls={extendControls2}
                    />
                </div>
            </div>
        )

    }

}