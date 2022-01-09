import React from 'react';

import './Public.less';
import "../Professional/Professional.less"
import {changecourses, getcourses} from "../../../../common/net-service";
import {PuList} from "./PuList/PuLIst";
import {PuPageButton} from "./PuPageButton/PuPageButton";
import {Pubt} from "./Pubt/Pubt";
import {SpageButton} from "../Required/SpageButton/SpageButton";
import {WpageButton} from "../Required/WpageButton/WpageButton";
import {YpageButton} from "../Required/YpageButton/YpageButton";
import {PYupageButton} from "../Professional/PYupageButton/PYupageButton";
import {LipageButton} from "./LipageButton/LipageButton";


export class Public extends React.Component<any> {

    state = {
        userid: "",
        user_data: {re: '0', to: '0'},
        selfcourse: {course: "", credit: 0},
        pubdemand: [],


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

        // 3.重构综合筛选 (test2 综合)
        tmp_current: 1,
        tmp_totalPage: 0,
        tmp_totalData: [],
        tmp_indexList: [],


        W_switch: false,         // 2.未修
        Y_switch: false,         // 3.已修
        Yu_switch: false,        // 4.预选

        Head_switch: false,      // 课程未修等状态判断

        Li_switch: false,        // 5.历史与文化
        Si_switch: false,        // 6.思维与方法
        We_switch: false,        // 7.文学与艺术
        Go_switch: false,        // 8.沟通与管理
        Sh_switch: false,        // 9.社会与经济
        Ke_switch: false,        // 10.科技与环境

        Type_switch: false,      // 课外类型历史等判断


        pageSize: 10,
        goValue: 0,

        // 进行课程已修匹配部分
        self_course: {
            publicelective: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            publicpreparation: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
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

        changecourses(this.state.userid, "publicelective", ele_credits, elective_courseids, (res: any) => {
            if (res.data.state == 1) {
                changecourses(this.state.userid, "publicpreparation", pre_credits, prepared_courseids, (res: any) => {
                    if (res.data.state == 1) {
                        alert('课程修改成功!');
                        let totalData = this.state.totalData;
                        // console.log(totalData);
                        for (let id in totalData) {
                            if (totalData[id]["courseCode"] == courseid) {
                                // @ts-ignore
                                if(isElected){
                                    // @ts-ignore
                                    totalData[id]["yixiu"] = !totalData[id]["yixiu"];
                                }else if(isPrepared){
                                    // @ts-ignore
                                    totalData[id]["yuxuan"] = !totalData[id]["yuxuan"];
                                    // @ts-ignore
                                    totalData[id]["yixiu"] = !totalData[id]["yixiu"];
                                }else {
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
                Head_switch: false,

                Li_switch: false, Si_switch: false,
                We_switch: false, Go_switch: false,
                Sh_switch: false, Ke_switch: false,
                Type_switch: false,

            })
            this.pageNext(this.state.goValue)
        } else if (nextProps.search_value != this.props.search_value && nextProps.search_value != '') {
            this.setState({
                S_switch: true,
                W_switch: false,
                Y_switch: false,
                Yu_switch: false,
                Head_switch: false,

                Li_switch: false, Si_switch: false,
                We_switch: false, Go_switch: false,
                Sh_switch: false, Ke_switch: false,
                Type_switch: false, Jueding: 0,
            })
            this.filter(nextProps.search_value.toUpperCase())
        }
    }

    componentDidMount = () => {
        getcourses(this.props._id, (res: any) => {
            let dic = res.data.public_elective_courses;
            let li2: any = this.state.totalData

            const {course, credit} = res.data.self_course.publicelective;
            const {publicscore} = res.data.score

            let self_pub_e: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}
            let self_pub_p: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}

            self_pub_e.course = res.data.self_course.publicelective.course
            self_pub_e.course_code = self_pub_e.course.split(',')

            self_pub_p.course = res.data.self_course.publicpreparation.course
            self_pub_p.course_code = self_pub_p.course.split(',')

            for (let i = 0; i < dic.length; i++) {
                let tmp = {
                    "idx": (i % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                    "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                    "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                    "yixiu": false, "yuxuan": false,
                }
                tmp["yixiu"] = self_pub_e.course_code.indexOf(tmp["courseCode"]) != -1 ? true : false
                tmp["yuxuan"] = self_pub_p.course_code.indexOf(tmp["courseCode"]) != -1 ? true : false
                li2.push(tmp)
            }
            let k_li = this.state.pubdemand, idx = 0
            for (let key in res.data.publicelectivedemand) {
                idx += 1
                let tmp = {"idx": idx.toString(), "content": key}
                // @ts-ignore
                k_li.push(tmp)
            }

            this.setState({
                totalData: li2,
                user_data: {re: credit, to: publicscore},
                totalPage: Math.ceil(this.state.totalData.length / this.state.pageSize),
                pubdemand: k_li,
                userid: this.props._id,

                ele_credit: res.data.self_course.publicelective.credit,
                pre_credit: res.data.self_course.publicpreparation.credit,
                elective_code: self_pub_e.course_code,
                preparation_code: self_pub_p.course_code
            })
            this.pageNext(this.state.goValue)
        })
    }

    //设置内容
    pageNext = (num: any) => {
        this.setState({
            current: num / this.state.pageSize + 1,
            indexList: this.state.totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 填充文字筛选内容
    pageNext2 = (num: any) => {
        this.setState({
            s_current: num / this.state.pageSize + 1,
            s_indexList: this.state.s_totalData.slice(num, num + this.state.pageSize)
        })
    }

    // 填充标签筛选内容
    pageNext_tmp = (num: any) => {
        this.setState({
            tmp_current: num / this.state.pageSize + 1,
            tmp_indexList: this.state.tmp_totalData.slice(num, num + this.state.pageSize)
        })
    }

    // 筛选搜索
    filter = (value: string) => {
        let dic: any = this.state.totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].courseCode.indexOf(value) != -1 || dic[i].courseName.indexOf(value) != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                    "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                    "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                    "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
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



    // 筛选历史 思维 文学 沟通 社会 科技
    test2 = (e:any) => {
        let obj = e.target.id
        let {S_switch} = this.state
        let {W_switch, Y_switch, Yu_switch, Head_switch} = this.state
        let {Li_switch, Si_switch, We_switch, Go_switch, Sh_switch, Ke_switch, Type_switch} = this.state

        let dic:any = this.state.totalData
        if (S_switch) dic = this.state.s_totalData
        let tmp = [], j = 1

        // head 部分
        if (obj == "W") {       //未修
            W_switch = !W_switch, Y_switch = false, Yu_switch = false
            Head_switch = W_switch

            let Class_type: any = ''
            if (Li_switch) Class_type = "历史与文化"
            else if (Si_switch) Class_type = "思维与方法"
            else if (We_switch) Class_type = "文学与艺术"
            else if (Go_switch) Class_type = "沟通与管理"
            else if (Sh_switch) Class_type = "社会与经济"
            else if (Ke_switch) Class_type = "科技与环境"

            for (let i = 0; i < dic.length; i++) {
                if (W_switch) {
                    if ((!dic[i].yixiu && !dic[i].yuxuan) && dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                Head_switch: Head_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
        else if (obj == "Y") {         // 已修
            W_switch = false, Y_switch = !Y_switch, Yu_switch = false
            Head_switch = Y_switch

            let Class_type: any = ''
            if (Li_switch) Class_type = "历史与文化"
            else if (Si_switch) Class_type = "思维与方法"
            else if (We_switch) Class_type = "文学与艺术"
            else if (Go_switch) Class_type = "沟通与管理"
            else if (Sh_switch) Class_type = "社会与经济"
            else if (Ke_switch) Class_type = "科技与环境"

            for (let i = 0; i < dic.length; i++) {
                if (Y_switch) {
                    if (dic[i].yixiu && dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                Head_switch: Head_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
        else if (obj == "Yu") {        // 预选
            W_switch = false, Y_switch = false, Yu_switch = !Yu_switch
            Head_switch = Yu_switch

            let Class_type: any = ''
            if (Li_switch) Class_type = "历史与文化"
            else if (Si_switch) Class_type = "思维与方法"
            else if (We_switch) Class_type = "文学与艺术"
            else if (Go_switch) Class_type = "沟通与管理"
            else if (Sh_switch) Class_type = "社会与经济"
            else if (Ke_switch) Class_type = "科技与环境"

            for (let i = 0; i < dic.length; i++) {
                if (Yu_switch) {
                    if (dic[i].yuxuan && dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (dic[i]["classtype"].indexOf(Class_type) != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                Head_switch: Head_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
        // type 部分

        else if (obj == "Li") {         //历史与文化
            Li_switch = !Li_switch, Si_switch = false
            We_switch = false, Go_switch = false
            Sh_switch = false, Ke_switch = false
            Type_switch = Li_switch


            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (Li_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("历史与文化") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }
            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }else if (obj == "Si") {        //思维与方法
            Li_switch = false, Si_switch = !Si_switch,
            We_switch = false, Go_switch = false
            Sh_switch = false, Ke_switch = false
            Type_switch = Si_switch

            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (Si_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("思维与方法") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }else if (obj == "We") {        //文学与艺术
            Li_switch = false, Si_switch = false
            We_switch = !We_switch, Go_switch = false
            Sh_switch = false, Ke_switch = false
            Type_switch = We_switch

            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (We_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("文学与艺术") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }else if (obj == "Go") {        //沟通与管理
            Li_switch = false, Si_switch = false
            We_switch = false, Go_switch = !Go_switch
            Sh_switch = false, Ke_switch = false
            Type_switch = Go_switch

            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (Go_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("沟通与管理") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }else if (obj == "Sh") {        //社会与经济
            Li_switch = false, Si_switch = false
            We_switch = false, Go_switch = false
            Sh_switch = !Sh_switch, Ke_switch = false
            Type_switch = Sh_switch

            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (Sh_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("社会与经济") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }else if  (obj == "Ke") {       //科技与环境
            Li_switch = false, Si_switch = false
            We_switch = false, Go_switch = false
            Sh_switch = false, Ke_switch = !Ke_switch
            Type_switch = Ke_switch

            for (let i = 0; i < dic.length; i++) {
                let Condition: any = true
                if (W_switch) Condition = !dic[i].yixiu && !dic[i].yuxuan
                else if (Y_switch) Condition = dic[i].yixiu
                else if (Yu_switch) Condition = dic[i].yuxuan

                if (Ke_switch) {
                    if (Condition && dic[i]["classtype"].indexOf("科技与环境") != -1) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }else {
                    if (Condition) {
                        let _tmp = {
                            "idx": (j % this.state.pageSize).toString(), "classtype": dic[i]["classtype"],
                            "courseCode": dic[i]["courseCode"], "courseName": dic[i]["courseName"],
                            "crs": dic[i]["crs"], "hrs": dic[i]["hrs"], "openObject": dic[i]["openObject"],
                            "yixiu": dic[i]["yixiu"], "yuxuan": dic[i]["yuxuan"],
                        }
                    j += 1
                    tmp.push(_tmp)
                    }
                }
            }

            this.setState({
                Li_switch: Li_switch, Si_switch: Si_switch,
                We_switch: We_switch, Go_switch: Go_switch,
                Sh_switch: Sh_switch, Ke_switch: Ke_switch,
                Type_switch: Type_switch,
                tmp_totalData: tmp,
                tmp_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_tmp(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })

        }

    }

    render() {
        const {re, to} = this.state.user_data
        const {pubdemand} = this.state
        const {S_switch, W_switch, Y_switch, Yu_switch, Head_switch} = this.state
        let {Li_switch, Si_switch, We_switch, Go_switch, Sh_switch, Ke_switch, Type_switch} = this.state

        let Li: any = []
        Li = this.state.indexList
        if (S_switch) Li = this.state.s_indexList
        if (Type_switch || Head_switch) Li = this.state.tmp_indexList

        return (
            <div>
                <div id={"Pub_tip_box"}>
                    <div className={"Pub_tip_item"} style={{userSelect: "none"}}>
                        公选学分:&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{color: "#1D68C1"}}>{re}</span><span style={{color: "#F8316A", display: this.state.pre_credit==0?"none":""}}>+{this.state.pre_credit}</span>/{to}
                    </div>
                </div>
                <div id={"Pub_choose_box"}>
                    {
                        <div className={"Pub_choose_item_1 "} id={"W"}
                             style={{order: 1, userSelect: "none", cursor: "pointer",
                                 background: this.state.W_switch ?  "#318AF3":"#FFFFFF",
                                 color: this.state.W_switch ? "#FFFFFF":"#333333",
                             }}
                             onClick={this.test2}>未&nbsp;修</div>
                    }
                    {
                        <div className={"Pub_choose_item_1 "} id={"Y"}
                             style={{order: 2, userSelect: "none", cursor: "pointer",
                                 background: this.state.Y_switch ? "#318AF3":"#FFFFFF",
                                 color: this.state.Y_switch ? "#FFFFFF":"#333333",
                             }}
                             onClick={this.test2}>已&nbsp;修</div>
                    }
                    {

                        <div className={"Pub_choose_item_1 "} id={"Yu"}
                             style={{order: 3, userSelect: "none", cursor: "pointer",
                                 background: this.state.Yu_switch ? "#318AF3":"#FFFFFF",
                                 color: this.state.Yu_switch ? "#FFFFFF":"#333333",
                             }}
                             onClick={this.test2}>预&nbsp;选</div>
                    }
                </div>
                <div id={"Pub_type_box"} style={{userSelect: "none"}}>
                    <div className={"Pub_type_item"} id={"Li"}
                         style={
                             {order:1, userSelect: "none", cursor: "pointer",
                                 color:this.state.Li_switch ? "#1D68C1":"#666666",
                                 border:this.state.Li_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }}
                             onClick={this.test2}>历史与文化</div>
                    <div className={"Pub_type_item"} id={"Si"}
                         style={
                             {order:2, userSelect: "none", cursor: "pointer",
                                 color:this.state.Si_switch ? "#1D68C1":"#666666",
                                 border:this.state.Si_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }} onClick={this.test2}>思维与方法</div>
                    <div className={"Pub_type_item"} id={"We"}
                         style={
                             {order:3, userSelect: "none", cursor: "pointer",
                                 color:this.state.We_switch ? "#1D68C1":"#666666",
                                 border:this.state.We_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }} onClick={this.test2}>文学与艺术</div>
                    <div className={"Pub_type_item"} id={"Go"}
                         style={
                             {order:4, userSelect: "none", cursor: "pointer",
                                 color:this.state.Go_switch ? "#1D68C1":"#666666",
                                 border:this.state.Go_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }} onClick={this.test2}>沟通与管理</div>
                    <div className={"Pub_type_item"} id={"Sh"}
                         style={
                             {order:5, userSelect: "none", cursor: "pointer",
                                 color:this.state.Sh_switch ? "#1D68C1":"#666666",
                                 border:this.state.Sh_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }} onClick={this.test2}>社会与经济</div>
                    <div className={"Pub_type_item"} id={"Ke"}
                         style={
                             {order:6, userSelect: "none", cursor: "pointer",
                                 color:this.state.Ke_switch ? "#1D68C1":"#666666",
                                 border:this.state.Ke_switch ? "1px solid #1D68C1":"1px solid #666666",
                             }} onClick={this.test2}>科技与环境</div>
                    {/*{*/}
                    {/*    this.state.pubdemand.map((cont: any) => {*/}
                    {/*        return <Pubt {...cont} key={cont["idx"]}/>*/}
                    {/*    })*/}
                    {/*}*/}
                </div>
                <div id={"Pub_course_box"} style={{userSelect: "none"}}>
                    <div id={"Pub_course_head"} style={{order: 1}}>
                        <div className={"Pub_course_item"} style={{order: 1}}>类别</div>
                        <div className={"Pub_course_item"} style={{order: 2}}>课程代码</div>
                        <div className={"Pub_course_item"} style={{order: 3}}>课程名称</div>
                        <div className={"Pub_course_item"} style={{order: 4}}>总学时</div>
                        <div className={"Pub_course_item"} style={{order: 5}}>学分</div>
                        <div className={"Pub_course_item"} style={{order: 6}}>开设对象</div>
                        <div className={"Pub_course_item"} style={{order: 7}}>介绍</div>
                        <div className={"Pub_course_item"} style={{order: 8}}>状态</div>
                    </div>
                    {Li.map((cont: any) => {
                        return <PuList {...cont} key={cont["idx"]} changeCourse={this.changeCourse}/>
                    })}
                </div>
                {
                    !Head_switch && !Type_switch ? (
                        S_switch == false ?
                            <PuPageButton {...this.state} pageNext={this.pageNext}/> :
                            <SpageButton {...this.state} pageNext2={this.pageNext2}/>
                    ) : <LipageButton {...this.state} pageNext_tmp={this.pageNext_tmp}/>
                }
            </div>
        )
    }
}
