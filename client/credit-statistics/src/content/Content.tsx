import React from 'react';

import './Content.less';
import background from "./background.svg";
import {Required} from "./Zizjian/Required/Required";
import {Professional} from "./Zizjian/Professional/Professional";
import {Public} from "./Zizjian/Public/Public";
import {Outside} from "./Zizjian/Outside/Outside";
import {Me} from "./Zizjian/Me/Me";
//tan jin 's public component
import {Header} from "./util/Header1";
// import {ShowInfo} from "./util/ShowInfo";
import {ChangeInfo} from "./util/ChangeInfo";
import {changecourses, getcourses, getuserinfo} from "../../common/net-service";
import {checkIsJsonString} from "../../common/check-json";


interface IdProp {
    id: string
}

export class Content extends React.Component<IdProp> {



    state = {
        //搜索栏
        id: this.props.id,
        search_value: "",
        //菜单
        page: "required",
        active: 1,
        showChangeInfo: false,
        changeinfo: 'none',
        course: {},
        showImport: false,
        inputCourse: ""
    };

    // Header组件修改上面所选菜单的值传回Content组件切换显示
    setPage = (newPage: string) => {
        this.setState({
            page: newPage,
        })
    }

    setSearch = (newData: string) => {
        this.setState({
            search_value: newData,
        })
    }

    changeInfoWindow = () => {
        const preState = this.state.showChangeInfo;
        this.setState({showChangeInfo: !preState});
    }
    // 解析输入
    parseInput = () => {
        if (this.state.inputCourse == "" || !checkIsJsonString) {
            alert("输入内容错误");
            return;
        }
        let requiredcourse = "";
        let requiredcredit = 0.0;
        let professionalelective = "";
        let professionalcredit = 0.0;
        let publicelective = "";
        let publiccredit = 0.0;

        let inputCourse = JSON.parse(this.state.inputCourse);
        if (inputCourse["code"] == 200) {
            for (let year in inputCourse["data"]["result"]) {
                // @ts-ignore
                for (let index in inputCourse["data"]["result"][year]) {
                    // @ts-ignore
                    let coupleCourse = inputCourse["data"]["result"][year][index];
                    if(coupleCourse["KCMC1"] != "") {
                        if (coupleCourse["BZ1"]=="公选") {
                            // @ts-ignore
                            for (let index in this.state.course["public_elective_courses"]) {
                                // @ts-ignore
                                if (this.state.course["public_elective_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC1"].replace(/\s+/g,"")) {
                                    // @ts-ignore
                                    publicelective += this.state.course["public_elective_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                    // @ts-ignore
                                    publiccredit += parseFloat(this.state.course["public_elective_courses"][index]["crs"]);
                                    break;
                                }
                            }
                        } else {
                            let flag = false;
                            // @ts-ignore
                            for (let index in this.state.course["required_courses"]) {
                                // @ts-ignore
                                if (this.state.course["required_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC1"].replace(/\s+/g,"")) {
                                    // @ts-ignore
                                    requiredcourse += this.state.course["required_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                    // @ts-ignore
                                    requiredcredit += parseFloat(this.state.course["required_courses"][index]["crs"]);
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                // @ts-ignore
                                for (let index in this.state.course["professional_elective_courses"]) {
                                    // @ts-ignore
                                    if (this.state.course["professional_elective_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC1"].replace(/\s+/g,"")) {
                                        // @ts-ignore
                                        professionalelective += this.state.course["professional_elective_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                        // @ts-ignore
                                        professionalcredit += parseFloat(this.state.course["professional_elective_courses"][index]["crs"]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if(coupleCourse["KCMC2"] != "") {
                        if (coupleCourse["BZ2"]=="公选") {
                            // @ts-ignore
                            for (let index in this.state.course["public_elective_courses"]) {
                                // @ts-ignore
                                if (this.state.course["public_elective_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC2"].replace(/\s+/g,"")) {
                                    // @ts-ignore
                                    publicelective += this.state.course["public_elective_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                    // @ts-ignore
                                    publiccredit += parseFloat(this.state.course["public_elective_courses"][index]["crs"]);
                                    break;
                                }
                            }
                        } else {
                            let flag = false;
                            // @ts-ignore
                            for (let index in this.state.course["required_courses"]) {
                                // @ts-ignore
                                if (this.state.course["required_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC2"].replace(/\s+/g,"")) {
                                    // @ts-ignore
                                    requiredcourse += this.state.course["required_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                    // @ts-ignore
                                    requiredcredit += parseFloat(this.state.course["required_courses"][index]["crs"]);
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                // @ts-ignore
                                for (let index in this.state.course["professional_elective_courses"]) {
                                    // @ts-ignore
                                    if (this.state.course["professional_elective_courses"][index]["courseName"].replace(/\s+/g,"") == coupleCourse["KCMC2"].replace(/\s+/g,"")) {
                                        // @ts-ignore
                                        professionalelective += this.state.course["professional_elective_courses"][index]["courseCode"].replace(/\s+/g,"") + ",";
                                        // @ts-ignore
                                        professionalcredit += parseFloat(this.state.course["professional_elective_courses"][index]["crs"]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // console.log(requiredcourse);
            // console.log(requiredcredit);
            // console.log(professionalelective);
            // console.log(professionalcredit)
            // console.log(publicelective);
            // console.log(publiccredit);

            changecourses(this.props.id, "required", requiredcredit, requiredcourse, ()=>{
                changecourses(this.props.id, "professionalelective", professionalcredit, professionalelective, ()=>{
                    changecourses(this.props.id, "publicelective", publiccredit, publicelective, ()=>{
                        alert("成功添加课程");
                        location.reload();
                    })
                })
            })
        } else {
            alert("输入内容错误");
        }
    }

    componentDidMount() {
        const userid = this.props.id;
        console.log(userid);
        const getCourse = (res: any) => {
            this.setState({
                    course: res.data,
                },
                () => {
                    console.log(this.state.course);
                });
            let total = 0;
            // @ts-ignore
            for (let creditType in this.state.course["self_course"]) {
                // @ts-ignore
                console.log(this.state.course["self_course"][creditType])
                // @ts-ignore
                total += this.state.course["self_course"][creditType]["credit"];
            }
            if (total == 0) {
                this.setState({
                    showImport: true
                })
            }
            // console.log(total);
        }
        getcourses(userid, getCourse);
    }

    // selective outclass mine
    render() {

        const {page} = this.state;
        return (
            <div id={"content"}>
                <img id={"backgrd"} src={background} alt={"background"}/>
                <Header userid={this.props.id} changePage={this.setPage}
                        showChange={this.changeInfoWindow} setSearch={this.setSearch}/>
                <div style={{display:this.state.page == 'required' ? '' : 'none'}}>
                    <Required _id={this.props.id} search_value={this.state.search_value}/>
                </div>
                <div style={{display:this.state.page == 'major' ? '' : 'none'}}>
                    <Professional _id={this.props.id} search_value={this.state.search_value}/>
                </div>
                <div style={{display:this.state.page == 'selective' ? '' : 'none'}}>
                    <Public _id={this.props.id} search_value={this.state.search_value}/>
                </div>
                <div style={{display:this.state.page == 'outclass' ? '' : 'none'}}>
                    <Outside _id={this.props.id} search_value={this.state.search_value}/>
                </div>
                {/*<div style={{display:this.state.page == 'mine' ? '' : 'none'}}>*/}
                {
                    this.state.page == "mine" ?
                    <Me _id={this.props.id} search_value={this.state.search_value}/>
                        : null
                }
                {/*</div>*/}
                <div style={{display: this.state.showChangeInfo ? '' : 'none'}}>
                    <ChangeInfo userid={this.props.id} showChange={this.changeInfoWindow}/>
                </div>
                {
                    this.state.showImport ?
                        <div id={"autoimport"}>
                            <div id={"importbg"}/>
                            <div id={"importtitle"}>自动添加已修课程和学分</div>
                            <div id={"importcontent"}>如果你想要自动添加已修课程，可以首先访问 <a href={"http://hub.hust.edu.cn/"} target={"_blank"} style={{"color": "#1D68C1"}}>http://hub.hust.edu.cn/</a> 进行登录，然后访问<a href={"http://cxcyda.hust.edu.cn/xsjb/xxcjd/score"} target={"_blank"} style={{"color": "#1D68C1"}}>http://cxcyda.hust.edu.cn/xsjb/xxcjd/score</a>        并将页面内容复制到下方输入框中提交即可。</div>
                            <div id={"importtip"}>(我们不会额外保存您的信息，并且也不会存储您的hub系统密码，请放心使用。由于课程名称不一致，可能存在部分课程需要手动添加。)</div>
                            <textarea id={"importinput"} onChange={(e)=>{
                                this.setState({
                                    inputCourse: e.target.value
                                })
                            }
                            }>{this.state.inputCourse}</textarea>
                            <button id={"importbutton1"} onClick={()=>{
                                this.setState({
                                    showImport: false
                                })
                            }
                            }>取&nbsp;&nbsp;消</button>
                            <button id={"importbutton2"} onClick={this.parseInput}>提&nbsp;&nbsp;交</button>
                        </div> : null
                }

            </div>
        );
    }
}