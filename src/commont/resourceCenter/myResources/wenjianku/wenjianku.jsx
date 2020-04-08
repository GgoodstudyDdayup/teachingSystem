import React, { Component } from 'react';
import { Tabs, Input, Modal, message, Checkbox } from 'antd';
import SearchBtn from '../../recommended/index/hoverbtn'
import List from './list'
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Search } = Input;
const plainOptions = ['答案有误', '解析有误', '题干有误', '知识点标注有误'];
class Myresources extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            listAppear: '',
            searchList: [{
                name: '学科',
                h: 13,
                list: [{ id: 13, title: '不限' }, { id: 1, title: '解答' }, { id: 2, title: '判断' }, { id: 3, title: '填空' }]
            }, {
                name: '版本',
                h: 14,
                list: [{ id: 14, title: '不限' }, { id: 4, title: '171' }, { id: 5, title: '4171' }, { id: 6, title: '4141' }]
            }, {
                name: '课程',
                h: 15,
                list: [{ id: 15, title: '不限' }, { id: 7, title: '888' }, { id: 8, title: '888' }, { id: 9, title: '888' }]
            }],
            list: [
                { appear: false, btnc: true },
                { appear: true, btnc: true }
            ],
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
    changeSearchId = (e, index) => {
        const that = this
        const searchList = that.state.searchList
        searchList[index].h = e
        that.setState({
            searchList
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
    }
    componentWillUnmount() {
        // 移除监听事件
        window.removeEventListener('resize', this.handleSize);
    }
    // 自适应浏览器的高度
    handleSize = () => {
        console.log(document.body.clientHeight)
        this.setState({
            height: document.body.clientHeight,
        });
    }
    add = (e) => {
        let listAppear = this.state.listAppear
        if (e === listAppear) {
            this.setState({
                listAppear: ''
            })
        } else {
            this.setState({
                listAppear: e
            })
        }
    }
    jiucuo = (e, id) => {
        e.stopPropagation();
        // 阻止与原生事件的冒泡
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            visible: true,
        });
        console.log(111, id)
    }
    shoucang = (e, id) => {
        e.stopPropagation();
        // 阻止与原生事件的冒泡
        e.nativeEvent.stopImmediatePropagation();
        console.log(222, id)
        message.success('收藏成功')
    }
    handleOk = e => {
        this.setState({
            visible: false,
        });
        message.success('纠错成功')
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    jiucuotextarea = (e) => {
        console.log(e.target.name, e.target.value)
    }
    onChange = checkedList => {
        console.log(checkedList)
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };
    render() {
        const list = this.state.searchList
        return (
            <div>
                <Modal
                    title="纠错"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <div className="m-bottom" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="cuowuleixin m-bottom" style={{ width: 100 }}>错误类型：</div>
                        <CheckboxGroup
                            options={plainOptions}
                            value={this.state.checkedList}
                            onChange={this.onChange}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="cuowuleixin m-bottom" style={{ width: 100 }}>错误描述：</div>
                        <TextArea name='error' onChange={this.jiucuotextarea} rows={4} />
                    </div>

                </Modal>
                <Tabs defaultActiveKey="2" size="Default" onChange={this.onTabClick}>
                    <TabPane tab="文件库" key="1" className="m-tk" >

                    </TabPane>
                    <TabPane tab="我的题目" key="2" >
                        <SearchBtn list={list} funt={this.changeSearchId}></SearchBtn>
                        <Search placeholder="关键词" onSearch={value => console.log(value)} enterButton />
                        <div className="listMineZiyuan" style={this.state.height > 638 ? { height: 500, marginTop: 20 } : { height: 300, marginTop: 20 }}>
                            <List data={this.state.list} btn={this.shoucang} btn2={this.jiucuo} fun={this.add} appear={this.state.listAppear}></List>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default Myresources;