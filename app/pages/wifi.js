import React from 'react';
import {Component} from 'react';
import Header from './header';
import bt1 from '../public/images/bt1.png';
import bt2 from '../public/images/bt2.png';
import {history} from '../public/js/history';
import $ from  'jquery';
import wifi from '../public/images/wifi.png'
import {
    Link
} from 'react-router-dom';
class LY extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            deviceId: null,
            i: -1
        }
        this.onClick = this.onClick.bind(this);
        this.goBack = this.goBack.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this.onChecked = this.onChecked.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onWifiKeyDown = this.onWifiKeyDown.bind(this);

    }

    componentDidMount() {
        document.addEventListener("keydown", this.onWifiKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onWifiKeyDown)
    }

    onWifiKeyDown = (e) => {
        // console.log('keyCode : ', e.keyCode);
        const _this = this;
        const divs = $('[name="wifi"]');
        const i = _this.state.i;
        if (i === -1 && !_this.state.isOpen) {
            _this.setState({i: 0});
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13://回车事件
                    console.log('isOpen : ', _this.state.isOpen);
                    console.log('i : ', _this.state.i);
                    if (_this.state.isOpen) {
                        const links = $('a[name="li-a"]');
                        if (links.length > 0 && i != -1 && i != 0) {
                            console.log('click : ', links[_this.state.i]);
                            links[_this.state.i] ? links[_this.state.i].click() : null;
                        }
                    }
                    if (i == 0) {
                        _this.onClick();
                    }
                    break;
                case 38://上
                    if (_this.state.isOpen) {
                        if (i - 1 >= 0 && i - 1 < divs.length) {
                            _this.setState({i: i - 1});
                        }
                    }
                    break;
                case 40://下
                    if (_this.state.isOpen) {
                        if (i >= 0 && i + 1 < divs.length) {
                            _this.setState({i: i + 1});
                        }
                    }
                    break;
                case 66://B, 返回
                    $('#li-back')[0].click();
                    break;
                case 72://H， home
                    $('#ly-check')[0].click();
                    break;
            }
        }
    }

    onClick() {
        this.setState({isOpen: !this.state.isOpen});
    }

    goBack() {
        history.goBack(-1)
    }

    onSelected(devId) {
        this.setState({deviceId: devId})
    }

    onChecked() {
        console.log(this.state.deviceId);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="ly-down">
                        <ul>
                            <li name="wifi" className={`wifi-down-li ${this.state.i === 0 ? 'active' : ''}`}>
                                <div className="ly-l">wifi{this.state.isOpen ? '开启' : '关闭'}</div>
                                <div className="ly-r"><a onClick={() => this.onClick()}><img
                                    src={this.state.isOpen ? bt1 : bt2} alt=""/></a></div>
                            </li>
                            <div style={{display: this.state.isOpen ? 'block' : 'none'}}>
                                <li name="wifi" className={`wifi-down-li ${this.state.i === 1 ? 'li-active' : ''}`}>
                                    <img src={wifi} alt=""/><Link name="li-a" to="/wifi/111111">111111</Link>
                                </li>
                                <li name="wifi" className={`wifi-down-li ${this.state.i === 2 ? 'li-active' : ''}`}>
                                    <img src={wifi} alt=""/><Link name="li-a" to="/wifi/222222">222222</Link>
                                </li>
                                <li name="wifi" className={`wifi-down-li ${this.state.i === 3 ? 'li-active' : ''}`}>
                                    <img src={wifi} alt=""/><Link name="li-a" to="/wifi/333333">333333</Link>
                                </li>
                                <li name="wifi" className={`wifi-down-li ${this.state.i === 4 ? 'li-active' : ''}`}>
                                    <img src={wifi} alt=""/><Link name="li-a" to="/wifi/444444">444444</Link>
                                </li>
                                <li name="wifi" className={`wifi-down-li ${this.state.i === 5 ? 'li-active' : ''}`}>
                                    <img src={wifi} alt=""/><Link name="li-a" to="/wifi/555555">555555</Link>
                                </li>
                            </div>

                        </ul>
                    </div>
                </div>
                <div className="s-bottom">
                    <div className="left"><a id="ly-check" onClick={() => this.onChecked()}>选择</a></div>
                    <div className="right"><a id="li-back" onClick={() => this.goBack()}>返回</a></div>
                </div>
            </div>
        )
    }
}

export default LY


