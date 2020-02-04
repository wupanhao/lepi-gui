import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import y1 from '../public/images/y1.png';
import y2 from '../public/images/y2.png';
import $ from 'jquery';

class CP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isClick: true,
            t: -1
        }
        this.onClick = this.onClick.bind(this);
        this.listenCPDiv = this.listenCPDiv.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenCPDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenCPDiv)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenCPDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.sel-btn');
        const i = _this.state.t;
        if (i === -1) {
            _this.setState({
                t: 0
            });
        }
        if (e && e.keyCode) {
            console.log('keyCode : ', e.keyCode);
            switch (e.keyCode) {
                case 13:
                    _this.onClick();
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            t: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            t: i + 1
                        });
                    }
                    break;

            }
        }

    }
    onClick() {
        this.setState({
            isClick: !this.state.isClick
        });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="s-roll">
                        <a onClick={() => this.onClick()}><img src={this.state.isClick ? y1 : y2} alt=""/></a>
                    </div>
                    <div className="text-p1">
                        <span className={`sel-btn ${this.state.t === 0 ? 's-active' : ''}`}>S1</span>
                        <span className={`sel-btn ${this.state.t === 1 ? 's-active' : ''}`}>S2</span>
                        <span className={`sel-btn ${this.state.t === 2 ? 's-active' : ''}`}>S3</span>
                        <span className={`sel-btn ${this.state.t === 3 ? 's-active' : ''}`}>S4</span>
                        <span className={`sel-btn ${this.state.t === 4 ? 's-active' : ''}`}>S5</span>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default CP