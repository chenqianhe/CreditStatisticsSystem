import React from 'react';
import sha512 from 'js-sha512'

import {getcolleges, getVerifation} from "../../../common/net-service";
import {register} from "../../../common/net-service";
import './Register.less';
import {checkPassword} from "../../../common/check-password";
import {checkId} from "../../../common/check-id";

export class Register extends React.Component {
    collegedata:{allcollegesinfo: {}, colleges: string[], major: string[], classtype: {}} =
        {allcollegesinfo: {}, colleges: ["学      院"], major: ["专      业"], classtype: {"专      业": ["班      级"]}};
    
    collegedataCopy:{allcollegesinfo: {}, colleges: string[], major: string[], classtype: {}} =
        {allcollegesinfo: {}, colleges: ["学      院"], major: ["专      业"], classtype: {"专      业": ["班      级"]}};
    grades: string[] = ["年      级", "大一", "大二", "大三", "大四", "大五"];

    info = {id: "学      号", name: "姓      名", grade:"年      级", college: "学      院", major: "专      业", mailbox:"邮      箱",
            classtype:"班      级", verification: "验证码", password:"密      码", password2:"重复密码", verificationcode: "",
            sendbutton: "发送验证码"};

    isShow = {send: false, doublepassword:false, passwordcompliance: true};

    input_type = {password: "text", password2: "text"};

    state = {
        time: 120,
    };

    register = () => {
        if (checkId(this.info.id)) {
            if (checkPassword(this.info.password)) {
                if (this.info.password == this.info.password2) {
                    if (this.info.grade != "年      级") {
                        if (this.info.college != "学      院") {
                            if (this.info.major != "专      业") {
                                if (this.info.classtype != "班      级") {
                                    if (this.info.verificationcode != "" && this.info.verification.toLowerCase() == this.info.verificationcode.toLowerCase()) {
                                        register(this.info.name, this.info.id, this.info.grade, this.info.college,
                                            this.info.major, this.info.classtype, sha512.sha512(this.info.password),
                                            (res:any)=>{
                                            if (res.data.state=="OK") {
                                                alert("注册成功");
                                                location.reload();
                                            } else if (res.data.state=="用户已存在") {
                                                alert("用户已存在，请登录");
                                                location.reload();
                                            } else {
                                                alert("异常。\n请稍后重试或联系服务人员");
                                            }
                                        })
                                    } else {
                                        alert("验证码错误");
                                    }
                                } else {
                                    alert("请选择班级");
                                }
                            } else {
                                alert("请选择专业");
                            }
                        } else {
                            alert("请选择学院");
                        }
                    } else {
                        alert("请选择年级");
                    }
                } else {
                    alert("两次密码不一致");
                }
            } else {
                alert("密码不符合要求");
            }
        } else {
            alert("请输入正确的华中科技大学学号");
        }
    }

    componentDidMount(){
        getcolleges((res:any)=>{
            let collegedata = this.collegedata;
            let collegedataCopy = this.collegedataCopy;
            collegedataCopy.allcollegesinfo = res.data;
            collegedata.allcollegesinfo = res.data;
            if (this.collegedata.allcollegesinfo != {}) {
                for (let college in this.collegedata.allcollegesinfo) {
                    this.collegedata.colleges.push(college);
                    this.collegedataCopy.colleges.push(college);
                    // @ts-ignore
                    for (const major in this.collegedata.allcollegesinfo[college]) {
                        this.collegedata.major.push(major);
                        this.collegedataCopy.major.push(major);
                        // @ts-ignore
                        this.collegedata.classtype[major] = ["班      级"]
                        // @ts-ignore
                        this.collegedataCopy.classtype[major] = ["班      级"]
                        // @ts-ignore
                        for (let _class in this.collegedata.allcollegesinfo[college][major]) {
                            // @ts-ignore
                            this.collegedata.classtype[major].push(this.collegedata.allcollegesinfo[college][major][_class]);
                            // @ts-ignore
                            this.collegedataCopy.classtype[major].push(this.collegedata.allcollegesinfo[college][major][_class]);
                            // @ts-ignore
                            this.collegedataCopy.classtype["专      业"].push(this.collegedata.allcollegesinfo[college][major][_class]);
                            // @ts-ignore
                            this.collegedata.classtype["专      业"].push(this.collegedata.allcollegesinfo[college][major][_class]);
                        }
                    }
                }
            }
            this.setState({
                collegedata
            });
            this.setState({
                collegedataCopy
            })
            // console.log(this.collegedata)
            // console.log(this.collegedataCopy)
        })
    }

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

    changeMajor = ()=> {
        if (this.info.college != "学      院") {
            let collegedata = this.collegedata;
            collegedata.major = [];
            // @ts-ignore
            for (let M in this.collegedataCopy.allcollegesinfo[this.info.college]) {
                collegedata.major.push(M);
            }
            this.setState({
                collegedata
            });
        } else {
            let collegedata = this.collegedata;
            collegedata.major = [];
            // @ts-ignore
            for (let id in this.collegedataCopy.major) {
                collegedata.major.push(this.collegedataCopy.major[id]);
            }
            this.setState({
                collegedata
            });
        }
        let info = this.info;
        info.major = this.collegedata.major[0];
        this.setState({
            info
        });
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
            <div id={"register"}>
                <div id={"registertitle"}>注册账号</div>
                <div id={"left"}>
                    <input type={"text"} value={this.info.id} onClick={()=>{
                        if (this.info.id=="学      号") {
                            let info = this.info;
                            info.id = "";
                            this.setState({
                                info
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
                    <input type={"text"} value={this.info.name} onClick={()=>{
                        if (this.info.name=="姓      名") {
                            let info = this.info;
                            info.name = "";
                            this.setState({
                                info
                            });
                        }
                    }} onChange={(e) => {
                        let info = this.info;
                        info.name = e.target.value.toLowerCase();
                        this.setState({
                            info
                        });
                    }} onBlur={()=>{
                        if (this.info.name=="") {
                            let input_info = this.info;
                            input_info.name = "姓      名";
                            this.setState({
                                input_info
                            });
                        }
                    }}/>
                    <select
                        name={'grade'}
                        value={this.info.grade}
                        style={{letterSpacing:this.info.grade=="年      级"?"1.8vh":""}}
                        onChange={(e) => {
                            let info = this.info;
                            info.grade = e.target.value;
                            this.setState({ info });
                            // console.log(this.info);
                        }}
                    >
                        {
                            this.grades.map((item: any, index: number) => (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
                    <select
                        name={'college'}
                        value={this.info.college}
                        style={{letterSpacing:this.info.college=="学      院"?"1.8vh":""}}
                        onChange={(e) => {
                            let info = this.info;
                            info.college = e.target.value;
                            this.setState({ info });
                            this.changeMajor();
                            // console.log(this.info);
                        }}
                    >
                        {
                            this.collegedata.colleges.map((item: any, index: number) => (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
                    <select
                        name={'major'}
                        value={this.info.major}
                        style={{letterSpacing:this.info.major=="专      业"?"1.8vh":""}}
                        onChange={(e) => {
                            let info = this.info;
                            info.major = e.target.value;
                            if (info.major=="专      业") {
                                info.classtype = "班      级";
                            }
                            this.setState({ info });

                        }}
                    >
                        {
                            this.collegedata.major.map((item: any, index: number) => (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
                </div>
                <div id={"right"}>
                    <select
                        name={'classtype'}
                        value={this.info.classtype}
                        style={{letterSpacing:this.info.classtype=="班      级"?"1.8vh":""}}
                        onChange={(e) => {
                            let info = this.info;
                            info.classtype = e.target.value;
                            this.setState({ info });
                            // console.log(this.info);
                        }}
                    >
                        {
                            //@ts-ignore
                            this.collegedata.classtype[this.info.major].map((item: any, index: number) => (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
                    <input type={"text"} value={this.info.mailbox} readOnly/>
                    <input type={"text"} style={{letterSpacing:"0.5vw"}} value={this.info.verification} onClick={()=>{
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
                    <input type={this.input_type.password} value={this.info.password} onClick={()=>{
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
                    <input type={this.input_type.password2} value={this.info.password2} onClick={()=>{
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
                </div>
                <button id={"registersubmitbutton"} onClick={this.register}>注&nbsp;&nbsp;册</button>
                <button id={"registersendbutton"} onClick={sendCode} disabled={this.isShow.send}>
                    {this.info.sendbutton}
                </button>
                <div id={"registermailtail"}>@hust.edu.cn</div>
                {
                    this.isShow.send?(
                    //     true?(
                        <div id={"registeremailtip"}>
                            验证码已发至您的校园邮箱，
                            <a href={"https://mail.hust.edu.cn/"} target={"_blank"} style={{color:"#1D68C1"}}>点击查看</a>
                        </div>
                    ):null
                }
                {
                    this.isShow.doublepassword?(
                    //         true?(
                        <div id={"registerdoublepasswordtip"}>
                            *两次密码不一致
                        </div>
                    ):null
                }
                {
                    this.isShow.passwordcompliance?(
                        <div id={"registerpasswordcompliance"}>
                            *密码至少包含一位大小写字母和一位数字，长度6-16
                        </div>
                    ):null
                }
            </div>

        );
    }
}