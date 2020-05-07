import React, { Component } from 'react';

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 0
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
    }
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    componentWillUnmount() {
        // 移除监听事件
        this.state.unsubscribe()//移除监听
        window.removeEventListener('resize', this.handleSize);
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        return (
            <div>
                <div className="data-img" style={{ width: '100%', height: this.state.height }}></div>
            </div>
        );
    }
}

export default index;