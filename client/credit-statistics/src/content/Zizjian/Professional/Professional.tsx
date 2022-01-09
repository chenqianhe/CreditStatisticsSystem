import React from "react";
import "./Professional.less"

import {changecourses, getcourses} from "../../../../common/net-service";
import {PList} from "./PList/PList";
import {PPageButton} from "./PPageButton/PPageButton";
import {PYupageButton} from "./PYupageButton/PYupageButton";
import {PageButton} from "../Required/PageButton/PageButton";
import {SpageButton} from "../Required/SpageButton/SpageButton";
import {WpageButton} from "../Required/WpageButton/WpageButton";
import {YpageButton} from "../Required/YpageButton/YpageButton";


export class Professional extends React.Component<any> {

    state = {
        userid: "",
        user_data: {re: '', to: ''},
        selfcourse: {course: "", credit: 0},

        // 搜索筛选部分
        // 1.全部数据
        indexList: [],
        totalData: [],

        current: 1,
        totalPage: 0,

        // 2.搜索框数据
        s_current: 1,
        s_totalPage: 0,
        s_totalData: [],
        s_indexList: [],

        S_switch: false,

        // 3.未修
        w_current: 1,
        w_totalPage: 0,
        w_totalData: [],
        w_indexList: [],

        W_switch: false,

        // 4.未修
        y_current: 1,
        y_totalPage: 0,
        y_totalData: [],
        y_indexList: [],

        Y_switch: false,

        // 4.预选
        yu_current: 1,
        yu_totalPage: 0,
        yu_totalData: [],
        yu_indexList: [],

        Yu_switch: false,

        pageSize: 10,
        goValue: 0,

        // 进行课程已修匹配部分
        self_course: {
            professionalelective: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            professionalpreparation: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
        },

        ele_credit: 0,
        pre_credit: 0,
        elective_code: [],
        preparation_code: [],

    }

    changeCourse = (courseid: string, credit: number) => {
        let elective_courseid_arr: string[] = [];
        let prepared_courseid_arr: string[] = [];
        let elective_courseids = "";
        let prepared_courseids = "";

        let ele_credits = this.state.ele_credit;
        let pre_credits = this.state.pre_credit;

        let isElected: boolean = false;
        let isPrepared: boolean = false;

        // @ts-ignore
        isElected = this.state.elective_code.indexOf(courseid.trim()) != -1;
        // @ts-ignore
        isPrepared = this.state.preparation_code.indexOf(courseid.trim()) != -1;

        // console.log(isElected + '   ' + isPrepared);

        if (isElected && !isPrepared) { //已修->未修
            let elective_code = this.state.elective_code;
            for (let i in elective_code) {
                // @ts-ignore 已修删除course
                if (elective_code[i].trim() != courseid.trim()) {
                    // @ts-ignore
                    elective_courseid_arr.push(elective_code[i].trim());
                }
                //预选不变
                prepared_courseid_arr = this.state.preparation_code;
            }
            ele_credits -= credit;
        } else if (isPrepared && !isElected) { //预选->已修
            let prepared_code = this.state.preparation_code;
            //预选删除course
            for (let i in prepared_code) {
                // @ts-ignore
                if (prepared_code[i].trim() != courseid.trim()) {
                    // @ts-ignore
                    prepared_courseid_arr.push(prepared_code[i].trim());
                }
            }
            let elective_code = this.state.elective_code;
            //已修添加course
            for (let i in elective_code) {
                // @ts-ignore
                elective_courseid_arr.push(elective_code[i].trim());
            }
            elective_courseid_arr.push(courseid.trim());

            pre_credits -= credit;
            ele_credits += credit;

        } else { //未修->预选
            let prepared_code = this.state.preparation_code;
            //预选添加course
            for (let i in prepared_code) {
                // @ts-ignore
                prepared_courseid_arr.push(prepared_code[i].trim());
            }
            prepared_courseid_arr.push(courseid.trim());
            //已修不变
            elective_courseid_arr = this.state.elective_code;

            pre_credits += credit;
        }

        let totalData = this.state.totalData;
        // console.log(totalData);

        elective_courseids = elective_courseid_arr.join(',');
        prepared_courseids = prepared_courseid_arr.join(',');
        // console.log(elective_courseids);
        // console.log(prepared_courseids);

        this.setState({
            ele_credit: ele_credits,
            pre_credit: pre_credits,
            elective_code: elective_courseid_arr,
            preparation_code: prepared_courseid_arr,
            user_data: {re: ele_credits, to: this.state.user_data.to}
        });


        changecourses(this.state.userid, "professionalelective", ele_credits, elective_courseids, (res: any) => {
            if (res.data.state == 1) {
                changecourses(this.state.userid, "professionalpreparation", pre_credits, prepared_courseids, (res: any) => {
                    if (res.data.state == 1) {
                        alert('课程修改成功!');
                        let totalData = this.state.totalData;
                        // console.log(totalData);
                        for (let id in totalData) {
                            if (totalData[id]["courseCode"] == courseid) {
                                // @ts-ignore
                                if (isElected) {
                                    // @ts-ignore
                                    totalData[id]["yixiu"] = !totalData[id]["yixiu"];
                                } else if (isPrepared) {
                                    // @ts-ignore
                                    totalData[id]["yuxuan"] = !totalData[id]["yuxuan"];
                                    // @ts-ignore
                                    totalData[id]["yixiu"] = !totalData[id]["yixiu"];
                                } else {
                                    // @ts-ignore
                                    totalData[id]["yuxuan"] = !totalData[id]["yuxuan"];
                                }
                                break;
                            }
                        }
                        this.setState({
                            totalData: totalData
                        });
                    } else {
                        alert('出现了问题，请先联系管理员处理');
                    }
                });
            } else {
                alert('出现了问题，请先联系管理员处理');
            }
        });
    }

    componentWillReceiveProps = (nextProps: any) => {
        if (nextProps.search_value === '') {
            this.setState({
                S_switch: false,
                W_switch: false,
                Y_switch: false,
                Yu_switch: false,
            })
            this.pageNext(this.state.goValue)
        } else if (nextProps.search_value != this.props.search_value && nextProps.search_value != '') {
            this.setState({
                S_switch: true,
                W_switch: false,
                Y_switch: false,
                Yu_switch: false,
            })
            this.filter(nextProps.search_value.toUpperCase())
        }
    }

    componentDidMount = () => {
        getcourses(this.props._id, (res: any) => {
            let dic = res.data.professional_elective_courses;
            let li2: any = this.state.totalData

            const {course, credit} = res.data.self_course.professionalelective;
            const {electivescore} = res.data.score

            let self_pro_e: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}
            let self_pro_p: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}

            self_pro_e.course = res.data.self_course.professionalelective.course
            self_pro_e.course_code = self_pro_e.course.split(',')

            self_pro_p.course = res.data.self_course.professionalpreparation.course
            self_pro_p.course_code = self_pro_p.course.split(',')

            for (let i = 0; i < dic.length; i++) {
                let tmp = {
                    "idx": (i % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "semester": dic[i]["semester"],
                    "others": dic[i]["others"] + "组",
                    "yixiu": false, "yuxuan": false,
                }
                tmp["yixiu"] = self_pro_e.course_code.indexOf(tmp["courseCode"]) != -1 ? true : false
                tmp["yuxuan"] = self_pro_p.course_code.indexOf(tmp["courseCode"]) != -1 ? true : false


                li2.push(tmp)
            }

            this.setState({
                totalData: li2,
                user_data: {re: credit, to: electivescore},
                totalPage: Math.ceil(this.state.totalData.length / this.state.pageSize),
                userid: this.props._id,

                ele_credit: res.data.self_course.professionalelective.credit,
                pre_credit: res.data.self_course.professionalpreparation.credit,
                elective_code: self_pro_e.course_code,
                preparation_code: self_pro_p.course_code
                // course_code: self_req.course_code,
            })
            this.pageNext(this.state.goValue)
        })
    }
    // 设置内容
    pageNext = (num: any) => {
        this.setState({
            current: num / this.state.pageSize + 1,
            indexList: this.state.totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选内容
    pageNext2 = (num: any) => {
        this.setState({
            s_current: num / this.state.pageSize + 1,
            s_indexList: this.state.s_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选未修
    pageNext_w = (num: any) => {
        this.setState({
            w_current: num / this.state.pageSize + 1,
            w_indexList: this.state.w_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选已修
    pageNext_y = (num: any) => {
        this.setState({
            y_current: num / this.state.pageSize + 1,
            y_indexList: this.state.y_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选预选
    pageNext_yu = (num: any) => {
        this.setState({
            yu_current: num / this.state.pageSize + 1,
            yu_indexList: this.state.yu_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选搜索
    filter = (value: string) => {
        let dic: any = this.state.totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].courseCode.indexOf(value) != -1 || dic[i].courseName.indexOf(value) != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"],
                    "yuxuan": dic[i]["yuxuan"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                s_totalData: tmp,
                s_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选未修
    filter_w = () => {
        let {W_switch, Y_switch, Yu_switch} = this.state
        W_switch = !W_switch, Y_switch = false, Yu_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].yixiu == false && dic[i].yuxuan == false) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"],
                    "yuxuan": dic[i]["yuxuan"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                w_totalData: tmp,
                w_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_w(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选已修
    filter_y = () => {
        let {W_switch, Y_switch, Yu_switch} = this.state
        Y_switch = !Y_switch, W_switch = false, Yu_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].yixiu == true) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"],
                    "yuxuan": dic[i]["yuxuan"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                y_totalData: tmp,
                y_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_y(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选预选
    filter_yu = () => {
        let {W_switch, Y_switch, Yu_switch} = this.state
        Yu_switch = !Yu_switch, W_switch = false, Y_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].yuxuan == true) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"],
                    "yuxuan": dic[i]["yuxuan"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                yu_totalData: tmp,
                yu_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_yu(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }

    render() {
        const {re, to} = this.state.user_data
        const {S_switch, W_switch, Y_switch, Yu_switch} = this.state
        let Li: any = []
        if (S_switch === false) {
            if (W_switch == false && Y_switch == false && Yu_switch == false) Li = this.state.indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
            else if (Yu_switch == true) Li = this.state.yu_indexList
        } else {
            if (W_switch == false && Y_switch == false && Yu_switch == false) Li = this.state.s_indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
            else if (Yu_switch == true) Li = this.state.yu_indexList
        }

        return (
            <div style={{userSelect:"none"}}>
                <div id={"Pro_tip_box"}>
                    <div className={"Pro_tip_item"}>专选学分:&nbsp;&nbsp;&nbsp;&nbsp;<span
                        className={"Pro_tip_item_t"}>{re}</span><span style={{color: "#F8316A", display: this.state.pre_credit==0?"none":""}}>+{this.state.pre_credit}</span>/{to}</div>
                </div>
                <div id={"Pro_choose_box"}>
                    {
                        W_switch == false ?
                            <div className={"Pro_choose_item_1 "} style={{order: 1,userSelect:"none",cursor:"pointer"}}
                                 onClick={this.filter_w}>未&nbsp;修</div> :
                            <div className={"Pro_choose_item_2 "} style={{order: 1,userSelect:"none",cursor:"pointer"}}
                                 onClick={this.filter_w}>未&nbsp;修</div>
                    }
                    {Y_switch == false ?
                        <div className={"Pro_choose_item_1 "} style={{order: 2,userSelect:"none",cursor:"pointer"}}
                             onClick={this.filter_y}>已&nbsp;修</div> :
                        <div className={"Pro_choose_item_2 "} style={{order: 2,userSelect:"none",cursor:"pointer"}} onClick={this.filter_y}>已&nbsp;修</div>
                    }
                    {
                        Yu_switch == false ?
                            <div className={"Pro_choose_item_1 "} style={{order: 3,userSelect:"none",cursor:"pointer"}}
                                 onClick={this.filter_yu}>预&nbsp;选</div> :
                            <div className={"Pro_choose_item_2 "} style={{order: 3,userSelect:"none",cursor:"pointer"}}
                                 onClick={this.filter_yu}>预&nbsp;选</div>
                    }
                </div>
                <div id={"Pro_course_box"}>
                    <div id={"Pro_course_head"} style={{order: 1}}>
                        <div className={"Pro_course_item"} style={{order: 1}}>课程代码</div>
                        <div className={"Pro_course_item"} style={{order: 2}}>课程名称</div>
                        <div className={"Pro_course_item"} style={{order: 3}}>学时</div>
                        <div className={"Pro_course_item"} style={{order: 4}}>学分</div>
                        <div className={"Pro_course_item"} style={{order: 5}}>开设学期</div>
                        <div className={"Pro_course_item"} style={{order: 6}}>其他</div>
                        <div className={"Pro_course_item"} style={{order: 7}}>介绍</div>
                        <div className={"Pro_course_item"} style={{order: 8}}>状态</div>
                    </div>
                    {Li.map((cont: any) => {
                        return <PList {...cont} key={cont["idx"]} changeCourse={this.changeCourse}/>
                    })}
                </div>
                {
                    W_switch == false && Y_switch == false && Yu_switch == false ? (
                        S_switch == false ?
                            <PPageButton {...this.state} pageNext={this.pageNext}/> :
                            <SpageButton {...this.state} pageNext2={this.pageNext2}/>
                    ) : (
                        W_switch == true ?
                            <WpageButton {...this.state} pageNext_w={this.pageNext_w}/> :
                            (
                                Y_switch == true ?
                                    <YpageButton {...this.state} pageNext_y={this.pageNext_y}/> :
                                    <PYupageButton {...this.state} pageNext_yu={this.pageNext_yu}/>
                            )
                    )
                }
            </div>
        )
    }
}