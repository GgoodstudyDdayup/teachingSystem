import React from 'react'
import { ContentUtils } from 'braft-utils'
import { Upload, Icon, Radio, Select, Checkbox, Row, Col } from 'antd'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
const { Option } = Select
const plainOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const choose = ['A', 'B', 'C', 'D']
export default class EditorDemo extends React.Component {
    constructor(props) {
        super(props)
        console.log(props.ques_options)
        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(props.data.ques_content || null),
            editorState3: BraftEditor.createEditorState(props.data.ques_analysis || null),
            selectState: props.chooseList.length > 1 ? '2' : '1',
            chooseList: props.chooseList.length > 1 ? '' : props.chooseList[0],
            checkedList: props.chooseList.length > 1 ? props.chooseList : [],
            objSingle: {},
            disabled: false
        }
    }
    componentDidMount() {
        const objSingle = {}
        if (this.props.chooseList.length > 1) {
            plainOptions.forEach((res, index) => {
                if (this.props.ques_options.length > 1) {
                    objSingle[res] = BraftEditor.createEditorState(`${this.props.ques_options[index]}`)
                } else {
                    objSingle[res] = BraftEditor.createEditorState(null)
                }
            })
            this.setState({
                disabled: true
            })
        } else {
            choose.forEach((res, index) => {
                if (this.props.ques_options.length > 1) {
                    objSingle[res] = BraftEditor.createEditorState(`${this.props.ques_options[index]}`)
                } else {
                    objSingle[res] = BraftEditor.createEditorState(null)
                }
                this.setState({
                    disabled: true
                })
            })
        }
        this.setState({
            objSingle
        })
    }
    //这个是内容
    handleChange = (editorState, res, type) => {
        const objSingle = this.state.objSingle
        if (type === 'single') {
            objSingle[res] = editorState
            this.props.checkSingle(objSingle, type)
            this.setState({
                objSingle
            })
            return
        }
        if (type === 'multiple') {
            objSingle[res] = editorState
            this.props.checkSingle(objSingle, type)
            this.setState({
                objSingle
            })
            return
        }
        this.props.ques_content(editorState.toHTML())
        this.setState({ editorState })
    }
    //这个是答案
    onchange = e => {
        this.props.choose(e.target.value)
        this.setState({
            chooseList: e.target.value
        })
    }
    //这个是解析
    handleEditorChange3 = (editorState3) => {
        this.props.ques_analysis(editorState3.toHTML())
        this.setState({ editorState3 })
    }
    uploadHandler = (param) => {
        if (!param.file) {
            return false
        }
        // upload_file({ upload_control: fileList[0] }).then(res => {
        //     console.log(res)
        // })
        // this.setState({
        //     editorState: ContentUtils.insertMedias(this.state.editorState, [{
        //         type: 'IMAGE',
        //         url: 'https://jiaoxueapi.yanuojiaoyu.com/upload/self_lecture/202003241722206911.jpg'
        //     }])
        // })
    }
    handleChange2 = (e, res, type) => {
        const objSingle = { ...this.state.objSingle }
        if (type) {
            if (e.file.status !== "uploading") {
                objSingle[res] = ContentUtils.insertMedias(objSingle[res], [{
                    type: 'IMAGE',
                    url: e.file.response.data.full_path
                }])
                this.setState({
                    objSingle
                })
            }
            return
        }
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
    select = e => {
        this.setState({
            selectState: e,
            checkedList: []
        })
    }
    onChange2 = checkedList => {
        this.props.choose(checkedList)
        this.setState({
            checkedList
        });
    };
    render() {
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
        const props = {
            action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
            onChange: this.handleChange2,
            multiple: true,
            name: 'upload_control',
            headers: {
                token: localStorage.getItem("token"),
                username: encodeURI(localStorage.getItem("username")),
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
                username: encodeURI(localStorage.getItem("username")),
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
        const propsSingle = choose.map(res => {
            return {
                action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
                onChange: (e) => this.handleChange2(e, res, 'single'),
                multiple: true,
                name: 'upload_control',
                headers: {
                    token: localStorage.getItem("token"),
                    username: encodeURI(localStorage.getItem("username")),
                    companyid: localStorage.getItem("companyid")
                }
            }
        })
        const propsCheckBox = plainOptions.map(res => {
            return {
                action: 'https://jiaoxueapi.yanuojiaoyu.com/api/upload/upload_file',
                onChange: (e) => this.handleChange2(e, res, 'multiple'),
                multiple: true,
                name: 'upload_control',
                headers: {
                    token: localStorage.getItem("token"),
                    username: encodeURI(localStorage.getItem("username")),
                    companyid: localStorage.getItem("companyid")
                }
            }
        })
        const extendControlsSingle = choose.map((res, index) => {
            return [{
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        {...propsSingle[index]}
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
            }]
        })
        const extendControlsMultiple = plainOptions.map((res, index) => {
            return [{
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        {...propsCheckBox[index]}
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
            }]
        })
        const chooseEditr = choose.map((res, index) =>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 600 }} key={res}>
                <Radio value={res}>{res}</Radio>
                <div className="my-component my-editor-component m-bottom" style={{ width: '100%' }}>
                    <BraftEditor
                        value={this.state.objSingle[res]}
                        onChange={(e) => this.handleChange(e, res, 'single')}
                        controls={controls}
                        onSave={this.submitContent}
                        contentStyle={{ height: 100 }}
                        extendControls={extendControlsSingle[index]}
                    />
                </div>
            </div>
        )
        const checkBoxEditr = plainOptions.map((res, index) =>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 600 }} key={res}>
                <Col span={2}>
                    <Checkbox value={res}>{res}</Checkbox>
                </Col>
                <div className="my-component my-editor-component m-bottom" style={{ width: '100%' }}>
                    <BraftEditor
                        value={this.state.objSingle[res]}
                        onChange={(e) => this.handleChange(e, res, 'multiple')}
                        controls={controls}
                        onSave={this.submitContent}
                        contentStyle={{ height: 100 }}
                        extendControls={extendControlsMultiple[index]}
                    />
                </div>
            </div>
        )
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
                        <Select style={{ width: 150 }} onChange={this.select} value={this.state.selectState} placeholder='选择答案模式'>
                            <Option value='1' >单选</Option>
                            <Option value='2' >多选</Option>
                        </Select>
                    </div>
                </div>
                {this.state.selectState !== '' ?
                    <div>
                        {this.state.selectState === "1" ?
                            <Radio.Group size='large' onChange={this.onchange} value={this.state.chooseList} style={{ display: 'flex', flexFlow: 'column' }} >
                                {chooseEditr}
                            </Radio.Group> :
                            <Checkbox.Group value={this.state.checkedList} onChange={this.onChange2}>
                                <Row>
                                    {checkBoxEditr}
                                </Row>
                            </Checkbox.Group>
                        }
                    </div>
                    : ''}
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