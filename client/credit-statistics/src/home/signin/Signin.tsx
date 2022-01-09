import React from 'react';

import './Signin.less';
import {Login} from "./login/Login";
import {Reset} from "./reset/Reset";

export class Signin extends React.Component {

    isShow = {showElem: true};

    render() {
        return (
            <div id={"signin"}>
                {
                    this.isShow.showElem?(
                        <div>
                            <Login/>
                            <div id={"forgetpassword"} onClick={()=>{
                                let isShow = this.isShow;
                                isShow.showElem = !isShow.showElem;
                                this.setState({ isShow });
                            }}>忘记密码</div>
                        </div>
                    ):null
                }

                {
                    !this.isShow.showElem?(
                        <Reset/>
                    ):null
                }
            </div>
        );
    }
}