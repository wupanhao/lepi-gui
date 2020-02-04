import React from 'react';
import {Component} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';

class KEYBOARD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key1: ['a', 'A', '+', '~'],
            key2: ['b', 'B', '-', '_'],
            key3: ['c', 'C', '×', '@'],
            key4: ['d', 'D', '÷', '#'],
            key5: ['e', 'E', '%', '$'],
            key6: ['f', 'F', '.', '^'],
            key7: ['g', 'G', '1', '&'],
            key8: ['h', 'H', '2', '*'],
            key9: ['i', 'I', '3', ','],
            key10: ['j', 'J', '=', ';'],
            key11: ['k', 'K', '>', ':'],
            key12: ['l', 'L', '4', '|'],
            key13: ['m', 'M', '5', '/'],
            key14: ['n', 'N', '6', '\\'],
            key15: ['o', 'O', '[', '?'],
            key16: ['p', 'P', '<', '"'],
            key17: ['q', 'Q', '7', '\''],
            key18: ['r', 'R', '8', '`'],
            key19: ['s', 'S', '9', '。'],
            key20: ['t', 'T', ']', '...'],
            key21: ['u', 'U', '(', '//'],
            key22: ['v', 'V', ')', '--'],
            key23: ['w', 'W', '0', '°'],
            key24: ['x', 'X', '{', '‰'],
            key25: ['y', 'Y', '}', '≈'],
            key26: ['z', 'Z', '!', '<>'],
            i: 0,
            m: 'XYZ',
            n: '123',
            j: -1,
            str: ''
        }
        this.listenPwdDiv = this.listenPwdDiv.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenPwdDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenPwdDiv)
    }
    listenPwdDiv = (e) => {
        const _this = this;
        const divs = $('.pk_div');
        const j = _this.state.j;
        console.log('i  == ', j, e.keyCode);
        if (j == -1) {
            _this.setState({
                j: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    if (divs.length > 0 && j != -1) {
                        divs[_this.state.j] ? divs[_this.state.j].click() : null;
                    }
                    /*if (i  == -1) {
                     _this.setState({
                     j: 0
                     });
                     }*/
                    break;
                case 38:
                    if (j - 5 >= 0 && j - 5 < divs.length) {
                        _this.setState({
                            j: j - 5
                        });
                    }
                    break;
                case 40:
                    if (j >= 0 && j + 5 < divs.length) {
                        _this.setState({
                            j: j + 5
                        });
                    }
                    break;
                case 37:
                    console.log('j : ', j , _this.state.j);
                    if (j - 1 >= 0 && j - 1 < divs.length) {
                        _this.setState({
                            j: j - 1
                        });
                    }
                    break;
                case 39:
                    if (j >= 0 && j + 1 < divs.length) {
                        _this.setState({
                            j: j + 1
                        });
                    }
                    break;
            }
        }
    }
    input(val){

    }
    changePage(str){
        if(str == 'XYZ'){
            this.setState({i: 1, m: 'xyz'});
        }
        if(str == 'xyz'){
            this.setState({i: 0, m: 'XYZ'});
        }
        if(str == '123'){
            this.setState({i: 2, n: '.,;'});
        }
        if(str == '.,;'){
            this.setState({i: 3, n: '123'});
        }
    }
    getValue(val){
        const str = this.state.str;
        this.setState({str: str + val});
        const {setValue, strV} = this.props;
        console.log('setValue : ', setValue, strV);
        setValue(this.state.str);
    }
    delValue(){
        const str = this.state.str;
        const s = str.substring(0,str.length-1);
        this.setState({str: s});
        const {setValue} = this.props;
        setValue(this.state.str);
    }
    getEnter(){
        console.log('v === ', this.state.str);
        const {setValue} = this.props;
        setValue(this.state.str);
    }
    render() {
        const {isOpen} = this.props;
        return (<div className="pwd_keyboard" style={{display: isOpen ? 'block' : 'none'}}>
                <input type="hidden" value={this.state.str} id="keyboard"/>
                            <div onClick={() => this.getValue(this.state.key1[this.state.i])} className={`pk_div ${this.state.j == 0 ? 'pk_active' : ''}`}>{this.state.key1[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key2[this.state.i])} className={`pk_div ${this.state.j == 1 ? 'pk_active' : ''}`}>{this.state.key2[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key3[this.state.i])} className={`pk_div ${this.state.j == 2 ? 'pk_active' : ''}`}>{this.state.key3[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key4[this.state.i])} className={`pk_div ${this.state.j == 3 ? 'pk_active' : ''}`}>{this.state.key4[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key5[this.state.i])} className={`pk_div ${this.state.j == 4 ? 'pk_active' : ''}`}>{this.state.key5[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key6[this.state.i])} className={`pk_div ${this.state.j == 5 ? 'pk_active' : ''}`}>{this.state.key6[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key7[this.state.i])} className={`pk_div ${this.state.j == 6 ? 'pk_active' : ''}`}>{this.state.key7[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key8[this.state.i])} className={`pk_div ${this.state.j == 7 ? 'pk_active' : ''}`}>{this.state.key8[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key9[this.state.i])} className={`pk_div ${this.state.j == 8 ? 'pk_active' : ''}`}>{this.state.key9[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key10[this.state.i])} className={`pk_div ${this.state.j == 9 ? 'pk_active' : ''}`}>{this.state.key10[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key11[this.state.i])} className={`pk_div ${this.state.j == 10 ? 'pk_active' : ''}`}>{this.state.key11[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key12[this.state.i])} className={`pk_div ${this.state.j == 11 ? 'pk_active' : ''}`}>{this.state.key12[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key13[this.state.i])} className={`pk_div ${this.state.j == 12 ? 'pk_active' : ''}`}>{this.state.key13[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key14[this.state.i])} className={`pk_div ${this.state.j == 13 ? 'pk_active' : ''}`}>{this.state.key14[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key15[this.state.i])} className={`pk_div ${this.state.j == 14 ? 'pk_active' : ''}`}>{this.state.key15[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key16[this.state.i])} className={`pk_div ${this.state.j == 15 ? 'pk_active' : ''}`}>{this.state.key16[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key17[this.state.i])} className={`pk_div ${this.state.j == 16 ? 'pk_active' : ''}`}>{this.state.key17[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key18[this.state.i])} className={`pk_div ${this.state.j == 17 ? 'pk_active' : ''}`}>{this.state.key18[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key19[this.state.i])} className={`pk_div ${this.state.j == 18 ? 'pk_active' : ''}`}>{this.state.key19[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key20[this.state.i])} className={`pk_div ${this.state.j == 19 ? 'pk_active' : ''}`}>{this.state.key20[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key21[this.state.i])} className={`pk_div ${this.state.j == 20 ? 'pk_active' : ''}`}>{this.state.key21[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key22[this.state.i])} className={`pk_div ${this.state.j == 21 ? 'pk_active' : ''}`}>{this.state.key22[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key23[this.state.i])} className={`pk_div ${this.state.j == 22 ? 'pk_active' : ''}`}>{this.state.key23[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key24[this.state.i])} className={`pk_div ${this.state.j == 23 ? 'pk_active' : ''}`}>{this.state.key24[this.state.i]}</div>
                            <div onClick={() => this.getValue(this.state.key25[this.state.i])} className={`pk_div ${this.state.j == 24 ? 'pk_active' : ''}`}>{this.state.key25[this.state.i]}</div>
                            <div className={`pk_div ${this.state.j == 25 ? 'pk_active' : ''}`} onClick={() => this.changePage(this.state.m)}>{this.state.m}</div>
                            <div className={`pk_div ${this.state.j == 26 ? 'pk_active' : ''}`} onClick={() => this.changePage(this.state.n)}>{this.state.n}</div>
                            <div onClick={() => this.getValue(this.state.key26[this.state.i])} className={`pk_div ${this.state.j == 27 ? 'pk_active' : ''}`}>{this.state.key26[this.state.i]}</div>
                            <div onClick={() => this.delValue()} className={`pk_div ${this.state.j == 28 ? 'pk_active' : ''}`}>del</div>
                            <div onClick={() => this.getEnter()} className={`pk_div ${this.state.j == 29 ? 'pk_active' : ''}`}>确定</div>
                            </div>

        )
    }
}

export default KEYBOARD


