import React from 'react'
import { ContentUtils } from 'braft-utils'
import { Upload, Icon, Radio } from 'antd'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
export default class EditorDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(props.data.ques_content || null),
            editorState3: BraftEditor.createEditorState(props.data.ques_analysis || null),
            panduan: props.panduanState,
            panduanAnswer: props.data.ques_answer
        }
    }
    componentDidMount() {
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    }
    // submitContent = async () => {
    //     // 在编辑器获得焦点时按下ctrl+s会执行此方法
    //     // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    //     const htmlContent = this.state.editorState.toHTML()
    //     const result = await saveEditorContent(htmlContent)
    // }

    //这个是内容
    handleChange = (editorState) => {
        this.props.ques_content(editorState.toHTML())
        this.setState({ editorState })
    }
    //这个是答案
    onchange = e => {
        this.props.panduan(e.target.value)
        this.setState({
            panduanAnswer: e.target.value
        })
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
    render() {
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
        const props = {
            action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange2,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: localStorage.getItem("token"),
                username: localStorage.getItem("username"),
                companyid: localStorage.getItem("companyid"),
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
                token: localStorage.getItem("token"),
                username: localStorage.getItem("username"),
                companyid: localStorage.getItem("companyid"),
                
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
                <div className="my-component my-editor-component">
                    <BraftEditor
                        value={this.state.editorState}
                        onChange={this.handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
                <div className="m-flex m-bottom" style={{ alignItems: 'center' }}>
                    <span style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }}>答案</span>
                    <div className="m-left">
                        <Radio.Group onChange={this.onchange} value={this.state.panduanAnswer}>
                            <Radio value='是'>是</Radio>
                            <Radio value='否'>否</Radio>
                        </Radio.Group>
                    </div>
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