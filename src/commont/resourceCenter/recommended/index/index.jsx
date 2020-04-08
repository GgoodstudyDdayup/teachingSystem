import React, { Component } from 'react';
import { Tabs } from 'antd';
import HoverBtn from './hoverbtn'
import Tree from './hoverTree'
import List from './hoverList'
import { tree } from '../../../../axios/http'
const { TabPane } = Tabs;
class recommended extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shaixuan: false,
            xueke: {
                name: '学科',
                xuekeContent: '',
            },
            banben: {
                name: '版本',
                banbenContent: '',
            },
            kechen: {
                name: '课程',
                kechenContent: '',
            },
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
        }
    }
    componentDidMount = () => {
        const params = {
            subject_id: 38,
            name: ''
        }
        tree(params).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
    cardChange = (nameType, title) => {
        const banben = this.state.banben
        const kechen = this.state.kechen
        const xueke = this.state.xueke
        if (nameType === '学科') {
            xueke.xuekeContent = title
            this.setState({
                xueke
            })
        } else if (nameType === '课程') {
            kechen.kechenContent = title
            this.setState({
                kechen
            })
        } else {
            banben.banbenContent = title
            this.setState({
                banben
            })
        }
    }
    changeSearchId = (e, index, name, title) => {
        const that = this
        that.cardChange(name, title)
        const searchList = that.state.searchList
        searchList[index].h = e
        that.setState({
            searchList
        })

    }
    leave = () => {
        this.setState({
            shaixuan: false
        })
    }
    enter = () => {
        this.setState({
            shaixuan: true
        })
    }
    onTabClick = (e) => {
        switch (e) {
            case '1':
                this.props.history.push("/main/resourceCenter/recommended")
                break
            case '2':
                this.props.history.push("/main/resourceCenter/recommended/real")
                break
            case '3':
                this.props.history.push("/main/resourceCenter/recommended/jigousiku")
                break
            default:
                this.props.history.push("/main/resourceCenter/recommended/share")
        }
    }
    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1" size="Default" onChange={this.onTabClick}>
                    <TabPane tab="标准素材" key="1" className="m-tk" >
                        <div className="m-biaozhun">
                            <div className="m-biaozhunTree">
                                <div className="linkage-selected">
                                    <div className="linkage-container">
                                        <img className="linkage-icon" src={require('../../../../img/set.png')} alt="" onMouseLeave={this.leave} onMouseEnter={this.enter} />
                                        <div className="linkage-item">
                                            <label>{this.state.xueke.name}</label>
                                            <span>{this.state.xueke.xuekeContent}</span>
                                        </div>
                                        <div className="linkage-item">
                                            <label>{this.state.banben.name}</label>
                                            <span>{this.state.banben.banbenContent}</span>
                                        </div>
                                        <div className="linkage-item">
                                            <label>{this.state.kechen.name}</label>
                                            <span>{this.state.kechen.kechenContent}</span>
                                        </div>
                                    </div>
                                    <div >
                                        {
                                            this.state.shaixuan ? <HoverBtn list={this.state.searchList} funt={this.changeSearchId} funtL={this.leave} funtE={this.enter}></HoverBtn> : ''
                                        }
                                    </div>
                                </div>
                                <div>
                                    <Tree></Tree>
                                </div>
                            </div>
                            <div className="m-file-container">
                                <List></List>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="真题试卷" key="2" >

                    </TabPane>
                    <TabPane tab="机构私库" key="3" >

                    </TabPane>
                    <TabPane tab="分享" key="4" >

                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default recommended;