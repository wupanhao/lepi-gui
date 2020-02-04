import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';

class HW extends Component {
    constructor(props) {
        super(props)
        this.sensorType = {
            0: '未连接',
            29: '红外传感器',
            30: '超声波传感器'
        }
        this.state = {
            value: 0,
            fz: 0,
            i: -1,
            data: {
                port: 0,
                id: 0,
                value: 0
            }
        }

        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.listenHwDiv = this.listenHwDiv.bind(this);
        this.onClick = this.onClick.bind(this);
        this.updateState = this.updateState.bind(this);

    }

    componentDidMount() {
        document.addEventListener("keydown", this.listenHwDiv)
        this.update = true
        this.updateState()
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenHwDiv)
        this.update = false
    }
    updateState() {
        var i = this.state.i
        if (i < 0 || i > 4) {
            return setTimeout(this.updateState, 500)
        }
        var ros = document.ros
        if (!(ros && ros.isConnected)) {
            console.log(ros)
            setTimeout(this.updateState, 1000)
            return
        }
        // var that = this
        ros.getSensorInfo(i + 1).then(data => {
            console.log(data)
            if (data.value != -101) {
                this.setState({
                    data: data
                })

            }
            if (this.update) {
                setTimeout(this.updateState, 200)
            }
        })
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    onClick() {
        const data = this.state.data;
        let i = this.state.i;
        if (i == -1) {
            i = 0;
        }
        this.setState({
            gz: data[i].gz,
            fz: data[i].fz
        });
    }

    listenHwDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.p-text-span');
        const i = _this.state.i;
        if (i === -1) {
            _this.setState({
                i: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13:
                    _this.onClick();
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            i: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            i: i + 1
                        });
                    }
                    break;
            }
        }

    }

    render() {
        // <div className="p-text">阈值：{this.state.fz}</div>
        return (
            <div>
                <Header />
                <div className="s-body">

                    <div className="p-center">
                        <div className="p-text">{`${this.state.data.id === 29 ? '光值：'+this.state.data.value : this.sensorType[this.state.data.id]?this.sensorType[this.state.data.id]:'未连接'}`}</div>
                    </div>
                    <div className="p-bottom">
                    </div>
                    <div className="">
                        <div className="p-text">
                            <span class={`p-text-span ${this.state.i === 0 ? 's-active' : ''}`}>S1</span>
                            <span class={`p-text-span ${this.state.i === 1 ? 's-active' : ''}`}>S2</span>
                            <span class={`p-text-span ${this.state.i === 2 ? 's-active' : ''}`}>S3</span>
                            <span class={`p-text-span ${this.state.i === 3 ? 's-active' : ''}`}>S4</span>
                            <span class={`p-text-span ${this.state.i === 4 ? 's-active' : ''}`}>S5</span>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default HW