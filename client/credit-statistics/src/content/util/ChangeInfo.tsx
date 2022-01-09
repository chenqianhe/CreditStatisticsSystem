import React from 'react';
import './ChangeInfo.less';
import sha512 from 'js-sha512'

import title from './svg/changeinfo_title.svg'
import {changeinfo, getcolleges, getuserinfo, getVerifation, register} from "../../../common/net-service";
import {checkPassword} from "../../../common/check-password";

export class ChangeInfo extends React.Component<any, any> {

    grades: string[] = ["大一", "大二", "大三", "大四", "大五",];
    // majors: string[] = ["计算机科学与技术", "物联网", "计算机卓越班"];
    // colleges: string[] = ["计算机科学与技术学院", "光学与电子信息学院"];

    state = {
        student_number: "",
        email: "",
        grade: "",
        _class: "",
        college: "",
        major: "",
        password: "",
        password2: "",
        name: "",
        check_code: "",
        time: 120,
    }

    info = {sendbutton: "发送", verificationcode: ""};

    isShow = {send: false, doublepassword: false, passwordcompliance: true};

    prestate = this.state;

    college_data: { [index: string]: object } = {};
    college_arr: string[] = [];
    major_data: { [key: string]: string[] } = {};
    major_arr: string[] = [];
    class_arr: string[] = [];


    componentDidMount() {
        const userid: string = this.props.userid;
        let stu_num: string = userid.toUpperCase();
        let email: string = userid + '@hust.edu.cn';
        getuserinfo(userid, (res: any) => {
            let data = res.data;
            this.setState({
                student_number: stu_num,
                email: email,
                grade: data.grade,
                _class: data.classtype,
                college: data.college,
                major: data.major,
                name: data.name,
            }, () => {
                this.prestate = this.state;
                // console.log(this.prestate);
                this.forceUpdate();
                getcolleges((res: any) => {
                    this.college_data = res.data;
                    for (let item in res.data) {
                        this.college_arr.push(item);
                    }
                    //@ts-ignore
                    this.major_data = this.college_data[this.state.college];
                    for (let item in this.major_data) {
                        this.major_arr.push(item);
                    }
                    this.class_arr = this.major_data[this.state.major];
                    // console.log(this.college_arr);
                    // console.log(this.major_arr);
                    // console.log(this.class_arr);
                    // this.loaded = true;
                    this.forceUpdate();
                });
            });
        });

    }

    render() {
        //验证码倒计时
        let timeChange: number | undefined;
        let ti = this.state.time;
        //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
        const clock = () => {
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
            } else {
                //当ti=0时执行终止循环方法
                clearInterval(timeChange);
                let info = this.info;
                info.sendbutton = "发送";
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
        const sendCode = () => {
            getVerifation(this.props.userid, (res: any) => {
                if (res.data.verificationcode != "error") {
                    let info = this.info;
                    info.verificationcode = res.data.verificationcode;
                    //打印验证码
                    console.log("Verification Code : " + res.data.verificationcode);
                    this.setState({
                        info
                    });
                }
            })
            let isShow = this.isShow;
            isShow.send = true;
            this.setState({
                isShow
            });
            //@ts-ignore每隔一秒执行一次clock方法
            timeChange = setInterval(clock, 1000);
        };
        //@ts-ignore
        return (
            <div id="change-info-group">
                <div id="change-info-window">
                    <img id="change-info-title" src={title} alt="changeinfotitle"/>
                    <div id="change-info-content">
                        {/*学号-自动生成*/}
                        <div className="change-info-item">学 号
                            <div className="change-info-static">{this.state.student_number}</div>
                        </div>
                        {/*班级-下拉框*/}
                        <div className="change-info-item">班 级
                            <select className="change-info-selectbox"
                                    defaultValue={this.state._class}
                                    onChange={(e: any) => {
                                        this.setState({_class: e.target.value})
                                    }}
                            >
                                {
                                    this.class_arr.map((item: string, index: number) => (
                                        <option value={item} key={index}
                                                selected={item == this.state._class}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/*姓名-输入框*/}
                        <div className="change-info-item">姓 名
                            <input className="change-info-input"
                                   placeholder="姓      名"
                                   defaultValue={this.state.name}
                                   onClick={(e: any) => {
                                       e.target.placeholder = "";
                                   }}
                                   onBlur={(e: any) => {
                                       e.target.placeholder = "姓      名";
                                   }}
                                   onChange={(e: any) => {
                                       this.setState({name: e.target.value});
                                   }}
                            />
                        </div>
                        {/*邮箱-自动生成*/}
                        <div className="change-info-item">邮 箱
                            <div className="change-info-static">{this.state.email}</div>
                        </div>
                        {/*年级-下拉框*/}
                        <div className="change-info-item">年 级
                            <select className="change-info-selectbox"
                                    onChange={(e: any) => {
                                        this.setState({grade: e.target.value});
                                    }}
                            >
                                {
                                    this.grades.map((item: string, index: number) => (
                                        <option value={item} key={index}
                                                selected={item == this.state.grade}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/*验证码-输入框*/}
                        <div className="change-info-item" id="info-item-checkcode">验 证 码
                            <input className="change-info-input" id="input-checkcode"
                                   type="text" maxLength={5} placeholder="验证码"
                                   onClick={(e: any) => {
                                       e.target.placeholder = "";
                                   }}
                                   onBlur={(e: any) => {
                                       e.target.placeholder = "验证码";
                                   }}
                                   onChange={(e: any) => {
                                       this.setState({check_code: e.target.value});
                                   }}/>
                            <button id={'send-check'} disabled={this.isShow.send}
                                // style={{userSelect : `${this.isShow.send ? "cursor":"not-allowed"}`}}
                                    onClick={sendCode}
                            >
                                {this.info.sendbutton}
                            </button>
                            {
                                this.isShow.send ? (
                                    //     true?(
                                    <div id={"check-tip"}>
                                        验证码已发至您的校园邮箱，
                                        <a href={"https://mail.hust.edu.cn/"} target={"_blank"}
                                           style={{color: "#1D68C1"}}>点击查看</a>
                                    </div>
                                ) : null
                            }
                        </div>
                        {/*学院-下拉框*/}
                        <div className="change-info-item">学 院
                            <select className="change-info-selectbox"
                                    defaultValue={this.state.college}
                                    onChange={this.setCollege}
                            >
                                {
                                    this.college_arr.map((item: string, index: number) => (
                                        <option value={item} key={index}
                                                selected={item == this.state.college}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/*密码-输入框*/}
                        <div className="change-info-item">密 码
                            <input className="change-info-input"
                                   type="password"
                                   placeholder="密      码"
                                   onClick={(e: any) => {
                                       e.target.placeholder = "";
                                   }}
                                   onBlur={(e) => {
                                       e.target.placeholder = "密      码";
                                   }}
                                   onChange={(e) => {
                                       this.isShow.passwordcompliance = !checkPassword(e.target.value);
                                       this.setState({password: e.target.value},
                                           this.checkSame);
                                   }}
                            />
                            {
                                this.isShow.passwordcompliance ? (
                                    <div id={"valid-password-tip"}>
                                        *密码至少包含一位大小写字母和一位数字，长度6-16
                                    </div>
                                ) : null
                            }
                        </div>
                        {/*专业-下拉框*/}
                        <div className="change-info-item">专 业
                            <select className="change-info-selectbox"
                                    defaultValue={this.state.major}
                                    onChange={this.setMajor}
                            >
                                {
                                    this.major_arr.map((item: string, index: number) => (
                                        <option value={item} key={index}
                                                selected={item == this.state.major}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/*重复密码-输入框*/}
                        <div className="change-info-item">重复密码
                            <input className="change-info-input"
                                   placeholder="请再次输入密码" type='password'
                                   onClick={(e: any) => {
                                       e.target.placeholder = "";
                                   }}
                                   onBlur={(e: any) => {
                                       e.target.placeholder = "请再次输入密码";
                                   }}
                                   onChange={(e) => {
                                       this.setState({password2: e.target.value},
                                           this.checkSame);
                                   }}
                            />
                            {
                                this.isShow.doublepassword ? (
                                    //         true?(
                                    <div id={"same-password-tip"}>
                                        *两次密码不一致
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                    <div id="change-info-button">
                        <button
                            id="change-info-button-cancel"
                            onClick={this.buttonBackToContent}
                        >取 消
                        </button>
                        <button
                            id="change-info-button-submit"
                            onClick={this.submitChange}
                        >提 交
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    //根据选定的学院更新专业
    setCollege = (e: any) => {
        const college = e.target.value;
        const majors = this.college_data[college];
        // console.log(majors);
        this.major_arr = [];
        for (let item in this.major_data) {
            this.major_arr.push(item);
        }
        this.setState({college: college});
    }
    //根据选定的专业更新班级
    setMajor = (e: any) => {
        const major = e.target.value;
        const classes = this.major_data[major];
        // console.log(classes);
        this.class_arr = classes;
        this.setState({major: e.target.value});
    }
    //检查密码同步
    checkSame = () => {
        if (this.state.password2 != "重复密码" && this.state.password2 != this.state.password) {
            let isShow = this.isShow;
            isShow.doublepassword = true;
            this.setState({
                isShow
            });
        }
        if (this.state.password2 == this.state.password) {
            let isShow = this.isShow;
            isShow.doublepassword = false;
            this.setState({
                isShow
            });
        }
    }
    //回到主界面
    buttonBackToContent = (e: any) => {
        const target: string = e.currentTarget.id;
        // console.log(target);
        if (target == "change-info-button-cancel")
            this.props.showChange();
    }
    //提交修改
    submitChange = () => {
        if (checkPassword(this.state.password)) {
            if (this.state.password == this.state.password2) {
                if (this.state.check_code.toLowerCase() == this.info.verificationcode.toLowerCase() && this.info.verificationcode != "") {
                    // alert("提交修改成功");
                    changeinfo(this.state.name, this.state.student_number.toLowerCase(), this.state.grade, this.state.college,
                        this.state.major, this.state._class, sha512.sha512(this.state.password),
                        (res: any) => {
                            // console.log(res.data);
                            if (res.data.state == 1) {
                                alert("信息修改成功！");
                                location.reload();
                            } else {
                                alert("异常。\n请稍后重试或联系服务人员");
                            }
                        });
                } else alert('验证码错误');
            } else alert('请输入两次相同的密码');
        } else alert('请输入符合规则的密码');
    }
}