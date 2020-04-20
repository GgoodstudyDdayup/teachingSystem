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
        }
    }
    handleChange = (editorState) => {
        this.props.getContent(editorState.toHTML())
        this.setState({ editorState })
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
            action: 'https://devjiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange2,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: localStorage.getItem("token"),
                username: localStorage.getItem("username"),
                companyid: localStorage.getItem("companyid"),

            },
            data: {
                type: 2
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
        return (
            <div>
                <div className="editor-wrapper my-component my-editor-component">
                    <BraftEditor
                        value={this.state.editorState}
                        onChange={this.handleChange}
                        controls={controls}
                        contentStyle={{ height: 300 }}
                        extendControls={extendControls}
                    />
                </div>
            </div>
        )

    }

}