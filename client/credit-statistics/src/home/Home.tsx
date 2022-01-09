import React from 'react';

import background from "./background.svg"
import './Home.less';
import {Signin} from "./signin/Signin";
import {Register} from "./register/Register"

export class Home extends React.Component {

    isShow = {showElem: "default"};


    render() {
        return (
            <div>
                <div className={"background-group"}>
                    <div>
                        <img id={"background"} src={background} alt={"background"}/>
                    </div>
                    {
                        this.isShow.showElem!="default"?(
                            <div id={"hometitle"}  onClick={()=>{
                                let isShow = this.isShow;
                                isShow.showElem = "default";
                                this.setState({ isShow });
                            }}>华中科技大学 | 学分统计系统</div>
                        ):null
                    }
                    {
                        this.isShow.showElem=="login"?(
                            <Signin />
                        ):null
                    }
                    {
                        this.isShow.showElem=="register"?(
                            <Register />
                        ):null
                    }
                    {
                        this.isShow.showElem=="default"?(
                            <div>
                                <div className={"background-tip"} >
                                    <div id={"hust"}>
                                        华中科技大学
                                    </div>
                                    <div id={"credit-system"}>
                                        学分统计系统
                                    </div>
                                </div>
                                <button id={"loginbutton"} onClick={()=>{
                                    let isShow = this.isShow;
                                    isShow.showElem = "login";
                                    this.setState({ isShow });
                                }}>
                                    登&nbsp;&nbsp;录
                                </button>
                                <button id={"registerbutton"} onClick={()=>{
                                    let isShow = this.isShow;
                                    isShow.showElem = "register";
                                    this.setState({ isShow });
                                }}>
                                    注&nbsp;&nbsp;册
                                </button>
                            </div>
                        ):null
                    }
                </div>
            </div>
        );
    }
}