import React from 'react';
import {
    Component
} from 'react';

import $ from 'jquery';

import {
    Link
} from 'react-router-dom';
class Foot extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

    }
    componentDidMount() {
        // document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        // document.removeEventListener("keydown", this.onKeyDown)
    }



    render() {
        return (
            <div className="s-bottom">
                <div className="left"><Link name="jslp-home" to="/main">主页</Link></div>
                <div className="right"><a onClick={() => this.goBack()}>返回</a></div>
            </div>
        )
    }
}

export default Foot