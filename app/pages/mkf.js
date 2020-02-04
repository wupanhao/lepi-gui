import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import mkf1 from '../public/images/mkf1.png';
import mkf2 from '../public/images/mkf2.png';
//import moment from 'moment';
class MKF extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            on: false,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onMkfKeyDown = this.onMkfKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.startClick = this.startClick.bind(this);
        this.endClick = this.endClick.bind(this);
        this.handleReset = this.handleReset.bind(this);

    }

    componentDidMount() {
        document.addEventListener("keydown", this.onMkfKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onMkfKeyDown)
    }
    handleClick = () => {
        if (this.state.on) {
            clearInterval(this.timer);
        } else {
            //计时器
            this.timer = setInterval(() => {
                this.setState({
                    time: ++this.state.time
                })
            }, 1000)
        }
        //改变开始、暂停状态
        this.setState({
            on: !this.state.on
        })
    }
    startClick = () => {
        if (this.state.on) {
            clearInterval(this.timer);
        } else {
            //计时器
            this.timer = setInterval(() => {
                this.setState({
                    time: ++this.state.time
                })
            }, 1000)
        }
        //改变开始、暂停状态
        this.setState({
            on: !this.state.on
        })
    }
    endClick = () => {
        this.setState({
            on: !this.state.on
        })
        clearInterval(this.timer);
    }

    //重置
    handleReset = () => {
        this.setState({
            time: 0,
            on: false
        });
        clearInterval(this.timer);
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    onMkfKeyDown = (e) => {
        this.onKeyDown(e)
        const _this = this;
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 38: //'ArrowUp': 38  ，暂停
                    _this.handleClick();
                    break;
                case 40: //'ArrowDown': 40 ，重置
                    _this.handleReset();
                    break;
                case 37: //'ArrowLeft': 37
                    _this.startClick();
                    break;
                case 39: // 'ArrowRight': 39
                    _this.endClick();
                    break;
            }
        }
    }

    render() {
        const time = this.state.time;
        const mm = parseInt(time / 60) > 9 ? parseInt(time / 60) : '0' + parseInt(time / 60);
        const ss = parseInt(time % 60) > 9 ? parseInt(time % 60) : '0' + parseInt(time % 60);

        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="s-time">{mm}:{ss}</div>
                    <div className="s-btn"><img src={mkf2} alt=""/><img src={mkf1} alt=""/></div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default MKF
