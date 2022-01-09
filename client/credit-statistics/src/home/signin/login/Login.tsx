import React from 'react';
import sha512 from 'js-sha512'

import {login} from '../../../../common/net-service'

import './Login.less';
import {checkPassword} from "../../../../common/check-password";
import {checkId} from "../../../../common/check-id";

export class Login extends React.Component {
    input_info = {id:"学  号", password: "密  码"};
    input_type = {id:"text", password: "text"};

    login=()=>{
        if (checkId(this.input_info.id)) {
            if (checkPassword(this.input_info.password)) {
                let time = new Date();
                let nowtime = time.getTime();
                localStorage.setItem("tag",sha512.sha512(nowtime+this.input_info.id));
                login(this.input_info.id, sha512.sha512(this.input_info.password), sha512.sha512(nowtime+this.input_info.id), (res: any)=>{
                    if (res.data.state == -1) {
                        alert("账号不存在");
                        location.reload();
                    } else if (res.data.state == 0) {
                        alert("密码错误");
                    } else if (res.data.state == 1) {
                        location.reload();
                    }
                });
            } else {
                alert("密码错误");
            }
        } else {
            alert("账号错误\n请输入正确的华中科技大学学号");
        }


    }

    render() {
        return (
                <div id={"login"}>
                    <div id={"logintitle"}>账号登陆</div>
                    <input id={"idinput"} type={this.input_type.id} value={this.input_info.id} onClick={()=>{
                        if (this.input_info.id=="学  号") {
                            let input_info = this.input_info;
                            input_info.id = "";
                            this.setState({
                                input_info
                            });
                        }
                    }} onChange={(e) => {
                        let input_info = this.input_info;
                        input_info.id = e.target.value.toLowerCase();
                        if (input_info.id.length > 10) {
                            input_info.id = input_info.id.slice(0, 10);
                        }
                        this.setState({
                            input_info
                        });
                    }} onBlur={()=>{
                        if (this.input_info.id=="") {
                            let input_info = this.input_info;
                            input_info.id = "学  号";
                            this.setState({
                                input_info
                            });
                        }
                    }}/>
                    <input id={"passwordinput"} type={this.input_type.password} value={this.input_info.password} onClick={()=>{
                        let input_type = this.input_type;
                        input_type.password = "password";
                        this.setState({
                            input_type
                        });
                        if (this.input_info.password=="密  码") {
                            let input_info = this.input_info;
                            input_info.password = "";
                            this.setState({
                                input_info
                            });
                        }
                    }} onChange={(e) => {
                        let input_type = this.input_type;
                        input_type.password = "password";
                        this.setState({
                            input_type
                        });
                        let input_info = this.input_info;
                        input_info.password = e.target.value;
                        this.setState({
                            input_info
                        });
                    }} onBlur={()=>{
                        if (this.input_info.password == "") {
                            let input_type = this.input_type;
                            input_type.password = "text";
                            this.setState({
                                input_type
                            });
                            let input_info = this.input_info;
                            input_info.password = "密  码";
                            this.setState({
                                input_info
                            });
                        }
                    }}/>

                    <button id={"loginbuttonsmall"} onClick={this.login}>登&nbsp;&nbsp;录</button>
                </div>
        );
    }
}