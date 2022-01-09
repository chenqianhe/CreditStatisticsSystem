import React from 'react';
import sha512 from 'js-sha512'
import './Reset.less';
import {checkId} from "../../../../common/check-id";
import {getVerifation} from "../../../../common/net-service";
import {checkPassword} from "../../../../common/check-password";
import {reset} from "../../../../common/net-service";

export class Reset extends React.Component {
    info = {id: "学      号",
        mailbox: "邮      箱",
        verification:"验证码",
        password: "密      码",
        password2: "重复密码",
        sendbutton: "发送验证码",
        verificationcode:" ",
    };
    input_type = {password: "text", password2: "text"};
    isShow = {send: false, doublepassword:false, passwordcompliance: true};
    state = {
        time: 120,
    };

    checkSame = () => {
        if (this.info.password2!="重复密码" && this.info.password2 != this.info.password) {
            let isShow = this.isShow;
            isShow.doublepassword = true;
            this.setState({
                isShow
            });
        }
        if (this.info.password2 == this.info.password){
            let isShow = this.isShow;
            isShow.doublepassword = false;
            this.setState({
                isShow
            });
        }
    }
    checkCompliance = () => {
        if (this.info.password != "密      码" && checkPassword(this.info.password)) {
            let isShow = this.isShow;
            isShow.passwordcompliance = false;
            this.setState({
                isShow
            });
        } else {
            let isShow = this.isShow;
            isShow.passwordcompliance = true;
            this.setState({
                isShow
            });
        }
    }

    reset = () => {
        console.log(this.info)
        if (checkId(this.info.id)) {
            if (checkPassword(this.info.password)) {
                if (this.info.password == this.info.password2) {
                    if (this.info.verificationcode != "" && this.info.verification.toLowerCase() == this.info.verificationcode.toLowerCase()) {
                        reset(this.info.id, sha512.sha512(this.info.password), (res:any)=>{
                            if (res.data.state==1) {
                                alert("重置密码成功");
                                location.reload();
                            } else if (res.data.state==-1) {
                                alert("账号不存在，请注册账号");
                                location.reload();
                            } else {
                                alert("异常。\n请稍后重试或联系服务人员");
                            }
                        })
                    } else {
                        alert("验证码错误");
                    }
                } else {
                    alert("两次密码不一致");
                }
            } else {
                alert("新密码不符合要求");
            }
        } else {
            alert("请输入正确的华中科技大学学号");
        }
    }


    render() {
        let timeChange: number | undefined;
        let ti = this.state.time;
        //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
        const clock =()=>{
            if (ti > 0) {
                //当ti>0时执行更新方法
                ti = ti - 1;
                let state = this.state;
                state.time = ti;
                this.setState({
                    state
                });
                let info = this.info;
                info.sendbutton = "(" + ti + "s" + ")";
                this.setState({
                    info
                });
                // console.log(ti);
            }else{
                //当ti=0时执行终止循环方法
                clearInterval(timeChange);
                let info = this.info;
                info.sendbutton = "发送验证码";
                this.setState({
                    info
                });
                let state = this.state;
                state.time = 120;
                this.setState({
                    state
                });
                let isShow = this.isShow;
                isShow.send = false;
                this.setState({
                    isShow
                });
            }
        };

        const sendCode = () =>{
            if (checkId(this.info.id)) {
                getVerifation(this.info.id, (res: any)=>{
                    if (res.data.verificationcode != "error") {
                        let info = this.info;
                        info.verificationcode = res.data.verificationcode;
                        this.setState({
                            info
                        },()=>{
                            console.log("verification:", this.info.verificationcode);
                        });
                    }
                })
                let isShow = this.isShow;
                isShow.send = true;
                this.setState({
                    isShow
                });
                //@ts-ignore每隔一秒执行一次clock方法
                timeChange = setInterval(clock,1000);
            }
        };

        return (
            <div id={"reset"}>
                <div id={"resettitle"} >重置密码</div>
                <input className={"resetinput"} type={"text"} value={this.info.id} onClick={()=>{
                    if (this.info.id=="学      号") {
                        let input_info = this.info;
                        input_info.id = "";
                        this.setState({
                            input_info
                        });
                    }
                }} onChange={(e) => {
                    let info = this.info;
                    info.id = e.target.value.toLowerCase();
                    info.mailbox = e.target.value.toLowerCase();
                    if (info.id.length > 10) {
                        info.id = info.id.slice(0, 10);
                        info.mailbox = info.mailbox.slice(0, 10);
                    }
                    this.setState({
                        info
                    });
                }} onBlur={()=>{
                    if (this.info.id=="") {
                        let input_info = this.info;
                        input_info.id = "学      号";
                        input_info.mailbox = "邮      箱";
                        this.setState({
                            input_info
                        });
                    }
                }}/>
                <input className={"resetinput"} type={"text"} value={this.info.mailbox} readOnly/>
                <input className={"resetinput"} type={"text"} style={{letterSpacing:"0.5vw"}} value={this.info.verification} onClick={()=>{
                    if (this.info.verification=="验证码") {
                        let input_info = this.info;
                        input_info.verification = "";
                        this.setState({
                            input_info
                        });
                    }
                }} onChange={(e) => {
                    let info = this.info;
                    info.verification = e.target.value;
                    if (info.verification.length > 5) {
                        info.verification = info.verification.slice(0,5);
                    }
                    this.setState({
                        info
                    });
                }} onBlur={()=>{
                    if (this.info.verification=="") {
                        let input_info = this.info;
                        input_info.verification = "验证码";
                        this.setState({
                            input_info
                        });
                    }
                }}/>
                <input className={"resetinput"} type={this.input_type.password} value={this.info.password} onClick={()=>{
                    let input_type = this.input_type;
                    input_type.password = "password";
                    this.setState({
                        input_type
                    });
                    if (this.info.password=="密      码") {
                        let input_info = this.info;
                        input_info.password = "";
                        this.setState({
                            input_info
                        });
                    }
                    this.checkSame();
                    this.checkCompliance();
                }} onChange={(e) => {
                    let input_type = this.input_type;
                    input_type.password = "password";
                    this.setState({
                        input_type
                    });
                    let input_info = this.info;
                    input_info.password = e.target.value;
                    this.setState({
                        input_info
                    });
                    this.checkSame();
                    this.checkCompliance();
                }} onBlur={()=>{
                    if (this.info.password=="") {
                        let input_type = this.input_type;
                        input_type.password = "text";
                        this.setState({
                            input_type
                        });
                        let input_info = this.info;
                        input_info.password = "密      码";
                        this.setState({
                            input_info
                        });
                    }
                    this.checkSame();
                    this.checkCompliance();
                }}/>
                <input className={"resetinput"} type={this.input_type.password2} value={this.info.password2} onClick={()=>{
                    let input_type = this.input_type;
                    input_type.password2 = "password";
                    this.setState({
                        input_type
                    });
                    if (this.info.password2=="重复密码") {
                        let input_info = this.info;
                        input_info.password2 = "";
                        this.setState({
                            input_info
                        });
                    }
                    this.checkSame();
                }} onChange={(e) => {
                    let input_type = this.input_type;
                    input_type.password2 = "password";
                    this.setState({
                        input_type
                    });
                    let input_info = this.info;
                    input_info.password2 = e.target.value;
                    this.setState({
                        input_info
                    });
                    this.checkSame();
                }} onBlur={()=>{
                    if (this.info.password2=="") {
                        let input_type = this.input_type;
                        input_type.password2 = "text";
                        this.setState({
                            input_type
                        });
                        let input_info = this.info;
                        input_info.password2 = "重复密码";
                        this.setState({
                            input_info
                        });
                    }
                    this.checkSame();
                }}/>
                <button id={"resetbutton"} onClick={()=>{this.reset()}}>
                    <div id={"resetbuttoncontent"}>重  置</div>
                </button>
                <button id={"sendbutton"} onClick={sendCode} disabled={this.isShow.send}>
                    <div id={"sendbuttoncontent"}>{this.info.sendbutton}</div>
                </button>
                <div id={"mailtail"}>@hust.edu.cn</div>
                {
                    this.isShow.send?(
                        <div id={"emailtip"}>
                            验证码已发至您的校园邮箱，
                            <a href={"https://mail.hust.edu.cn/"} target={"_blank"} style={{color:"#1D68C1"}}>点击查看</a>
                        </div>
                    ):null
                }
                {
                    this.isShow.doublepassword?(
                        <div id={"doublepasswordtip"}>
                            *两次密码不一致
                        </div>
                    ):null
                }
                {
                    this.isShow.passwordcompliance?(
                        <div id={"passwordcompliance"}>
                            *密码至少包含一位大小写字母和一位数字，长度6-16
                        </div>
                    ):null
                }
            </div>
        );
}
}