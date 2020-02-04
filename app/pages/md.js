import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';
import bt1 from '../public/images/bt1.png';
import bt2 from '../public/images/bt2.png';

class MD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            t: -1,
            motors: [{
                position: 0,
                enable: 0,
                speed: 0,
                port: 1
            }, {
                position: 0,
                enable: 0,
                speed: 0,
                port: 2
            }, {
                position: 0,
                enable: 0,
                speed: 0,
                port: 3
            }, {
                position: 0,
                enable: 0,
                speed: 0,
                port: 4
            }, {
                position: 0,
                enable: 0,
                speed: 0,
                port: 5
            }]
        }
        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onMDKeyDown)
        // this.update = false
        this.update = true
        this.updateState()
    }

    componentWillUnmount() {
        this.update = false
        document.removeEventListener("keydown", this.onMDKeyDown)
    }

    updateState() {
        var ros = document.ros
        if (!(ros && ros.isConnected)) {
            console.log(ros)
            setTimeout(this.updateState, 1000)
            return
        }
        // var that = this
        ros.getMotorsInfo().then(data => {
            console.log(data)
            if (data && data.length == 5) {
                this.setState({
                    motors: data
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
    onMDKeyDown = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.s_table_tr');
        const i = _this.state.t;
        if (i === -1) {
            _this.setState({
                t: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    const links = $('.t_td');
                    const divAs = $('.md-r');
                    if (links.length > 0 && i != -1) {
                        links[this.state.t] ? links[this.state.t].click() : null;
                        divAs[this.state.t] ? divAs[this.state.t].click() : null;

                    }
                    break;
                case 38: //上
                    if (i - 1 >= 0 && i - 1 < divs.length) {
                        _this.setState({
                            t: i - 1
                        });
                    }
                    break;
                case 40: //下
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            t: i + 1
                        });
                    }
                    break;
                case 37:
                    _this.md_reduce();
                    break;
                case 39:
                    _this.md_increase();
                    break;
            }
        }
    }

    md_reduce() {
        var i = this.state.t
        console.log(i)
        if (i < 0 || i > 4) {
            return
        }
        var speed = this.state.motors[i].speed - 10
        speed = Math.round(speed / 10.0) * 10
        speed = speed > -100 ? speed : -100
        var ros = document.ros
        ros.setMotorSpeed(i + 1, speed)
    }

    md_increase() {
        var i = this.state.t
        console.log(i)
        if (i < 0 || i > 4) {
            return
        }
        var speed = this.state.motors[i].speed + 10
        speed = Math.round(speed / 10.0) * 10
        speed = speed > 100 ? 100 : speed
        var ros = document.ros
        ros.setMotorSpeed(i + 1, speed)
    }


    onClick(id) {
        console.log(id)
        var ros = document.ros
        if (this.state.motors[id].enable) {
            ros.setMotorEnable(id + 1, 0)
        } else {
            ros.setMotorEnable(id + 1, 1)
        }
        // this.updateState()
    }

    render() {
        return (
            <div>
                <Header />
                <div className="s-body-md">
                    <table className="s_table" rules="none">
                        <tbody>
                        <tr>
                            <th>开/关</th>
                            <th>端口</th>
                            <th>速度</th>
                            <th>编码器</th>
                        </tr>
                        { this.state.motors.map((motor,id) => {
                            return <tr className={`s_table_tr ${this.state.t === id ? 'active' : ''}`}>
                            <td><div><a className="md-r" onClick={() => this.onClick(id)}><img
                                src={motor.enable ? bt1 : bt2} alt=""/></a></div></td>
                            <td>M{id+1}</td>
                            <td className="t_td">{Math.round(motor.speed/10.0)*10}</td>
                            <td>{motor.position}</td>
                        </tr>
                        }) }
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        )
    }
}

export default MD