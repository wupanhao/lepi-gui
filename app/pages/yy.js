import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';

class YY extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: -1
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onYyKeyDown = this.onYyKeyDown.bind(this);

    }

    componentDidMount() {
        document.addEventListener("keydown", this.onYyKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onYyKeyDown)
    }

    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }

    onYyKeyDown = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.s-lan-l');
        const i = _this.state.a;
        if (i === -1) {
            _this.setState({
                a: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    //执行选择语言操作
                    /*if (i === -1) {
                        _this.setState({a: 0});
                    }*/
                    break;
                case 38:
                    if (i - 2 >= 0 && i - 2 < divs.length) {
                        _this.setState({
                            a: i - 2
                        });
                    }
                    break;
                case 40:
                    if (i >= 0 && i + 2 < divs.length) {
                        _this.setState({
                            a: i + 2
                        });
                    }
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            a: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            a: i + 1
                        });
                    }
                    break;
            }
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="v-body">
                    <div className={`s-lan-l ${this.state.a === 0 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">中文</div>
                    </div>
                    <div className={`s-lan-l ${this.state.a === 1 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">繁体中文</div>
                    </div>
                    <div className={`s-lan-l ${this.state.a === 2 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">英语</div>
                    </div>
                    <div className={`s-lan-l ${this.state.a === 3 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">日语</div>
                    </div>
                    <div className={`s-lan-l ${this.state.a === 4 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">俄语</div>
                    </div>
                    <div className={`s-lan-l ${this.state.a === 5 ? 'active' : ''}`}>
                        <div className="v-div-lan v-color-b">西班牙语</div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default YY