import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
class YL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            i: 0,
        }
        this.increase = this.increase.bind(this);
        this.reduce = this.reduce.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.onYlKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onYlKeyDown)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    onYlKeyDown = (e) => {
        this.onKeyDown(e)
        const _this = this;
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 37:
                    _this.reduce();
                    break;
                case 39:
                    _this.increase();
                    break;
            }
        }
    }
    reduce() {
        if (this.state.i > 0) {
            this.setState({
                i: this.state.i - 1
            });
        }
    }

    increase() {
        if (this.state.i < 100) {
            this.setState({
                i: this.state.i + 1
            });
        }
    }

    render() {
        var bar = document.getElementById("bar");
        var total = document.getElementById("total");
        if (bar && bar.style) {
            if (this.state.i <= 100) {
                bar.style.width = this.state.i + "%";
                total.innerHTML = bar.style.width;
            }
        }
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="d-center">
                        <span id="total">{this.state.i}</span>
                    </div>
                    <div className="d-bottom">
                        <div className="yl">
                            <a className="d-a-l" onClick={() => this.reduce()}>-</a>
                            <div
                                style={{height: '20px', width: '70%', border:'1px solid #b7ccf9', marginLeft: '10px', borderRadius: '5px', lineHeight: '20px', textAlign: 'center', float: 'left'}}>
                                <div id="bar"
                                     style={{background:'#78a8f7', width: '0%', float: 'left', height: '100%', borderRadius: '5px', textAlign: 'center', lineHeight:'150%'}}></div>
                            </div>
                            <a className="d-a-r" onClick={() => this.increase()}>+</a>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default YL