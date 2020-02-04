import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';

class CP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '加速度',
            data: {
                x: 0,
                y: 0,
                z: 0
            },
            l: 0
        }
        this.sensors = ['加速度', '陀螺仪', '地磁']
        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onTlyKeyDown = this.onTlyKeyDown.bind(this);
        this.update = false
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onTlyKeyDown)
        this.update = true
        this.updateState()
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onTlyKeyDown)
        this.update = false
    }

    updateState() {
        var ros = document.ros
        if (!(ros && ros.isConnected)) {
            console.log(ros)
            setTimeout(this.updateState, 1000)
            return
        }
        // var that = this
        ros.get3AxesData(this.state.l + 1).then(data => {
            console.log(data)
            this.setState({
                data: data
            })
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

    onTlyKeyDown = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $("[name='tly-a']");
        const i = _this.state.l;
        if (i === -1) {
            _this.setState({
                l: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    const links = $('a[name="tly-a"]');
                    if (links.length > 0 && i != -1) {
                        links[this.state.l] ? links[this.state.l].click() : null;
                    }
                    /*if (i === -1) {
                        _this.setState({l: 0});
                    }*/
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            l: i - 1,
                            name: _this.sensors[i - 1]
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            l: i + 1,
                            name: _this.sensors[i + 1]
                        });
                    }
                    break;
            }
        }
    }

    onClick(str, x, y, z) {
        this.setState({
            name: str,
            X: x,
            Y: y,
            Z: z
        });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="s-top">
                        <table>
                            <tbody>
                            <tr>
                                <td></td>
                                <td>X：{this.state.data.x}</td>
                            </tr>
                            <tr>
                                <td>{this.state.name}</td>
                                <td>Y：{this.state.data.y}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Z：{this.state.data.z}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="s-center">

                        <div className={`s-center-div ${this.state.l === 0 ? 's-active' : ''}`}>
                            <a name="tly-a" onClick={() => this.onClick('加速度', 213, 213, 213)}>加速度</a>
                        </div>
                        <div className={`s-center-div ${this.state.l === 1 ? 's-active' : ''}`}>
                            <a name="tly-a" onClick={() => this.onClick('陀螺仪', 123, 123, 123)}>陀螺仪</a>
                        </div>                        
                        <div className={`s-center-div ${this.state.l === 2 ? 's-active' : ''}`}>
                            <a name="tly-a" onClick={() => this.onClick('地磁', 321, 321, 321)}>地&nbsp;磁</a>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default CP