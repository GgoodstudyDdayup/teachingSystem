import React, { Component } from 'react';
import { Tabs, Button, Menu, Dropdown, Icon, Modal, Input, Upload, message } from 'antd';
import Tablelink from './indexlink'
const { confirm } = Modal;
const { TabPane } = Tabs;
class Myresources extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indeterminate: false,
            checkAll: false,
            l: '',
            visible: false,
            title: '',
            value: '',
            reWrite: {
            },
            newWrite: {
            },
            selectedRowKeys: [], // Check here to configure the default column
        }
    }
    onTabClick = (e) => {
        switch (e) {
            case '1':
                this.props.history.push("/main/resourceCenter/myresources/wenjianjia")
                break
            default:
                this.props.history.push("/main/resourceCenter/myresources")
        }
    }
    //初始化数据
    componentDidMount() {
        const data = [{
            key: 0,
            name: `Edward King 0`,
            time: `2020-2-22 14:50`,
            state: 1
        }, {
            key: 1,
            name: `Edward King 1`,
            time: `2020-2-22 14:50`,
            state: 2
        }, {
            key: 2,
            name: `Edward King 2`,
            time: `2020-2-22 14:50`,
            state: 3
        }];
        this.setState({
            data
        })
    }

    searchId = (e) => {
        console.log(e)
        //查询确认那个文件夹
        const data = this.state.data
        const id = data.reduce((res, ele) => {
            if (ele.name === e) {
                res['key'] = ele.key
            }
            return res
        }, {})
        //异步操作
        console.log(id)
    }
    onSelectChange = selectedRowKeys => {
        const data = this.state.data
        //将选择的文件夹汇总(chooseItem)参与和data的id判断
        const chooseItem = selectedRowKeys.reduce((res, item) => {
            data.forEach(element => {
                if (element.key === item) {
                    res.push({ id: element.key, name: element.name })
                }
            });
            return res
        }, [])
        console.log(chooseItem)
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    actionappear = (value, key) => {
        if (key) {
            this.setState({
                l: value
            })
        } else {
            this.setState({
                l: ''
            })
        }
    }

    //删除重命名方法
    showDeleteConfirm = (text) => {
        confirm({
            title: '你确定要删除吗',
            content: `${text}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                console.log(text);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    showRwriteConfirm = () => {
        if (this.state.title === '新建文件夹') {
            console.log('new')
            const data = this.state.data
            data.push({
                key: 6,
                name: `Edward King 5`,
                time: '000',
                state: 1
            })
            message.success('添加成功')
            this.setState({
                data,
                visible: false
            })
        } else {
            console.log('old')
        }
    }
    showRwriteCancel = () => {
        this.setState({
            visible: false,
        })
    }
    showModal = (e) => {
        //新建及重命名
        if (e.key) {
            this.setState({
                visible: true,
                value: '',
                title: '新建文件夹',
                titleValue: '请输入新建的文件夹名称'
            })
            console.log(e)
        } else {
            console.log(e)
            this.setState({
                visible: true,
                value: e,
                title: '重命名',
                titleValue: ''
            })
        }
    }
    handleMenuClick = (e) => {
        console.log('click', e);
        switch (e) {
            case 1:
                break
            case 2:
                break
            default:
                this.showModal(e)
                break
        }
    }
    //
    uoloadUrl = () => {
        const props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
            showUploadList: false,//控制上传列表
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传失败`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传成功`);
                }
            },
        }
        return props
    }
    creatfile = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">讲义</Menu.Item>
                <Menu.Item key="2">试卷</Menu.Item>
                <Menu.Item key="3">文件夹</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    onOk={this.showRwriteConfirm}
                    onCancel={this.showRwriteCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Input value={this.state.value} onChange={this.creatfile} placeholder={this.state.titleValue}></Input>
                </Modal>
                <Tabs defaultActiveKey="1" size="Default" onChange={this.onTabClick}>
                    <TabPane tab="文件库" key="1" className="m-tk" >
                        <div style={{ display: 'flex' }}>
                            <Upload {...this.uoloadUrl()}>
                                <Button>
                                    <Icon type="upload" />
                                    上传
                            </Button>
                            </Upload>
                            <div style={{ marginLeft: 10 }}>
                                <Dropdown overlay={menu}>
                                    <Button>
                                        新建 <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        <Tablelink showModal={this.showModal} showDeleteConfirm={this.showDeleteConfirm} actionappear={this.actionappear} l={this.state.l} data={this.state.data} onSelectChange={this.onSelectChange} selectedRowKeys={this.state.selectedRowKeys} searchId={this.searchId}></Tablelink>
                    </TabPane>
                    <TabPane tab="我的题目" key="2" >
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default Myresources;