import React from 'react';
import './Me.less';
import {changecourses, getcourses, getuserinfo} from "../../../../common/net-service";
import {MList} from "./MList/MList";
import {MPageButton} from "./MPageButton/MPageButton";
import {PPageButton} from "../Professional/PPageButton/PPageButton";
import {SpageButton} from "../Required/SpageButton/SpageButton";
import {WpageButton} from "../Required/WpageButton/WpageButton";
import {YpageButton} from "../Required/YpageButton/YpageButton";
import {PYupageButton} from "../Professional/PYupageButton/PYupageButton";
import {KpageButton} from "./KpageButton/KpageButton";

export class Me extends React.Component<any> {

    state = {
        // 展示个人信息部分
        class_type: "",
        college: "",
        grade: "",
        id: "",
        mailbox: "",
        major: "",
        name: "",

        // 所修课程部分数据

        total_course: {
            outside_course: [],
            professional_elective_courses: [],
            public_elective_courses: [],
            required_courses: [],
        },

        self_course: {
            outside: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            professionalelective: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            professionalpreparation: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            publicelective: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            publicpreparation: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
            required: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
        },

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

        // 3.必修
        w_current: 1,
        w_totalPage: 0,
        w_totalData: [],
        w_indexList: [],

        W_switch: false,

        // 4.专选
        y_current: 1,
        y_totalPage: 0,
        y_totalData: [],
        y_indexList: [],

        Y_switch: false,

        // 4.公选
        yu_current: 1,
        yu_totalPage: 0,
        yu_totalData: [],
        yu_indexList: [],

        Yu_switch: false,

        // 5.课外
        k_current: 1,
        k_totalPage: 0,
        k_totalData: [],
        k_indexList: [],

        K_switch: false,

        pageSize: 6,
        goValue: 0,


        required_re: '',
        required_to: '',
        _major_re: '',
        _major_to: '',
        selective_re: '',
        selective_to: '',
        outclass_re: '',
        outclass_to: '',
    }

    //params:    courseid:课程的代码 credit:该课程学分  classtype:如必修->required
    removeCourse = (courseid: string, credit: number, classtype: string) => {
        let courseid_arr: string[] = [];
        let courseids = "";
        let credits;
        if (classtype == "必修") {
            //新学分内容
            credits = this.state.self_course.required.credit - credit;
            this.state.self_course.required.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            // console.log(courseid_arr);
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "required", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        } else if (classtype == "课外") {
            //新学分内容
            credits = this.state.self_course.outside.credit - credit;
            this.state.self_course.outside.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            // console.log(courseids);
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "outside", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        } else if (classtype == '专选') {
            //新学分内容
            credits = this.state.self_course.professionalelective.credit - credit;
            this.state.self_course.professionalelective.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            // console.log(courseids);
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "professionalelective", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        } else if (classtype == '专选 (预选)') {
            //新学分内容
            credits = this.state.self_course.professionalpreparation.credit - credit;
            this.state.self_course.professionalpreparation.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            // console.log(courseids);
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "professionalpreparation", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        } else if (classtype == '公选') {
            // console.log(courseid);
            //新学分内容
            credits = this.state.self_course.publicelective.credit - credit;
            this.state.self_course.publicelective.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "publicelective", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        } else if (classtype == '公选 (预选)') {
            //新学分内容
            credits = this.state.self_course.publicpreparation.credit - credit;
            this.state.self_course.publicpreparation.course_code.map((item: string, index) => {
                    // console.log(item.trim());
                    if (item.trim() == courseid) {
                        // console.log('不添加');
                    } else {
                        courseid_arr.push(item.trim());
                    }
                }
            );
            // console.log(courseids);
            courseids = courseid_arr.join(',');
            // console.log(courseids);
            // console.log(credits);
            changecourses(this.state.id, "publicpreparation", credits, courseids, (res: any) => {
                if (res.data.state == 1) {
                    alert('修改成功!');
                } else {
                    alert('出现了问题，请先联系管理员处理');
                }
            });
        }
    }

    componentWillReceiveProps = (nextProps: any) => {
        if (nextProps.search_value === '') {
            this.setState({
                S_switch: false,
                W_switch: false,
                Y_switch: false,
                Yu_switch: false,
                K_switch: false,
            })
            this.pageNext(this.state.goValue)
        } else if (nextProps.search_value != this.props.search_value && nextProps.search_value != '') {
            this.setState({
                S_switch: true,
                W_switch: false,
                Y_switch: false,
                Yu_switch: false,
                K_switch: false,
            })
            this.filter(nextProps.search_value.toUpperCase())
        }
    }

    componentDidMount = () => {
        getuserinfo(this.props._id, (res: any) => {
            let dic = res.data
            this.setState({
                class_type: dic.classtype,
                college: dic.college,
                grade: dic.grade,
                id: dic.id,
                mailbox: dic.mailbox,
                major: dic.major,
                name: dic.name,
            })
        })

        getcourses(this.props._id, (res: any) => {
            let dic = res.data

            // 总课程信息
            let dic_out = dic.outside_course, li_out: Object[] = this.state.total_course.outside_course
            let dic_pro = dic.professional_elective_courses,
                li_pro: Object[] = this.state.total_course.professional_elective_courses
            let dic_pub = dic.public_elective_courses,
                li_pub: Object[] = this.state.total_course.public_elective_courses
            let dic_req = dic.required_courses, li_req: Object[] = this.state.total_course.required_courses

            for (let i = 0; i < dic_out.length; i++) {
                li_out.push(dic_out[i])
            }
            for (let i = 0; i < dic_pro.length; i++) {
                li_pro.push(dic_pro[i])
            }
            for (let i = 0; i < dic_pub.length; i++) {
                li_pub.push(dic_pub[i])
            }
            for (let i = 0; i < dic_req.length; i++) {
                li_req.push(dic_req[i])
            }

            // 我的课程信息
            let dic_self = dic.self_course
            let self_out: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }
            let self_pro_e: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }
            let self_pro_p: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }
            let self_pub_e: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }
            let self_pub_p: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }
            let self_req: { [index: string | number]: any } = {
                course: "",
                credit: 0,
                course_code: [],
                course_name: [],
                course_crs: []
            }

            let totalD = this.state.totalData
            // 1.out
            self_out.course = dic_self.outside.course, self_out.credit = dic_self.outside.credit
            self_out.course_code = self_out.course.split(",")

            for (let i = 0; i < self_out.course_code.length; i++) {
                for (let j = 0; j < li_out.length; j++) {
                    // @ts-ignore
                    if (self_out.course_code[i].trim() == li_out[j]["activityCode"].trim()) {
                        // @ts-ignore
                        self_out.course_name.push(li_out[j]["activityName"])
                        // @ts-ignore
                        self_out.course_crs.push(li_out[j]["crs"])
                        let tmp = {
                            "idx": (i % this.state.pageSize).toString(),
                            "type": "课外",
                            // @ts-ignore
                            "content": li_out[j]["activityName"],
                            // @ts-ignore
                            "crs": li_out[j]["crs"],
                            // @ts-ignore 每块都要加上一个课程代码
                            "code": li_out[j]["activityCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 2.pro_e
            self_pro_e.course = dic_self.professionalelective.course, self_pro_e.credit = dic_self.professionalelective.credit
            self_pro_e.course_code = self_pro_e.course.split(",")

            for (let i = 0; i < self_pro_e.course_code.length; i++) {
                for (let j = 0; j < li_pro.length; j++) {
                    // @ts-ignore
                    if (self_pro_e.course_code[i].trim() == li_pro[j]["courseCode"].trim()) {
                        // @ts-ignore
                        self_pro_e.course_name.push(li_pro[j]["courseName"])
                        // @ts-ignore
                        self_pro_e.course_crs.push(li_pro[j]["crs"])
                        let tmp = {
                            "idx": (i % 6).toString(),
                            "type": "专选",
                            // @ts-ignore
                            "content": li_pro[j]["courseName"],
                            // @ts-ignore
                            "crs": li_pro[j]["crs"],
                            // @ts-ignore 每块都要加上一个课程代码
                            "code": li_pro[j]["courseCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 3.pro_p
            self_pro_p.course = dic_self.professionalpreparation.course, self_pro_p.credit = dic_self.professionalpreparation.credit
            self_pro_p.course_code = self_pro_p.course.split(",")

            for (let i = 0; i < self_pro_p.course_code.length; i++) {
                for (let j = 0; j < li_pro.length; j++) {
                    // @ts-ignore
                    if (self_pro_p.course_code[i].trim() == li_pro[j]["courseCode"].trim()) {
                        // @ts-ignore
                        self_pro_p.course_name.push(li_pro[j]["courseName"])
                        // @ts-ignore
                        self_pro_p.course_crs.push(li_pro[j]["crs"])
                        let tmp = {
                            "idx": (i % 6).toString(),
                            "type": "专选 (预选)",
                            // @ts-ignore
                            "content": li_pro[j]["courseName"],
                            // @ts-ignore
                            "crs": li_pro[j]["crs"],
                            // @ts-ignore 每块都要加上一个课程代码
                            "code": li_pro[j]["courseCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 4.pub_e
            self_pub_e.course = dic_self.publicelective.course, self_pub_e.credit = dic_self.publicelective.credit
            self_pub_e.course_code = self_pub_e.course.split(",")

            for (let i = 0; i < self_pub_e.course_code.length; i++) {
                for (let j = 0; j < li_pub.length; j++) {
                    // @ts-ignore
                    if (self_pub_e.course_code[i].trim() == li_pub[j]["courseCode"].trim()) {
                        // @ts-ignore
                        self_pub_e.course_name.push(li_pub[j]["courseName"])
                        // @ts-ignore
                        self_pub_e.course_crs.push(li_pub[j]["crs"])
                        let tmp = {
                            "idx": (i % 6).toString(),
                            "type": "公选",
                            // @ts-ignore
                            "content": li_pub[j]["courseName"],
                            // @ts-ignore
                            "crs": li_pub[j]["crs"],
                            // @ts-ignore 每块都要加上一个课程代码
                            "code": li_pub[j]["courseCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 5.pub_p
            self_pub_p.course = dic_self.publicpreparation.course, self_pub_p.credit = dic_self.publicpreparation.credit
            self_pub_p.course_code = self_pub_p.course.split(",")

            for (let i = 0; i < self_pub_p.course_code.length; i++) {
                for (let j = 0; j < li_pub.length; j++) {
                    // @ts-ignore
                    if (self_pub_p.course_code[i].trim() == li_pub[j]["courseCode"].trim()) {
                        // @ts-ignore
                        self_pub_p.course_name.push(li_pub[j]["courseName"])
                        // @ts-ignore
                        self_pub_p.course_crs.push(li_pub[j]["crs"])
                        let tmp = {
                            "idx": (i % 6).toString(),
                            "type": "公选 (预选)",
                            // @ts-ignore
                            "content": li_pub[j]["courseName"],
                            // @ts-ignore
                            "crs": li_pub[j]["crs"],
                            // @ts-ignore 每块都要加上一个课程代码
                            "code": li_pub[j]["courseCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 6.req
            self_req.course = dic_self.required.course, self_req.credit = dic_self.required.credit
            self_req.course_code = self_req.course.split(",")

            for (let i = 0; i < self_req.course_code.length; i++) {
                for (let j = 0; j < li_req.length; j++) {
                    // @ts-ignore
                    if (self_req.course_code[i].trim() == li_req[j]["courseCode"].trim()) {
                        // @ts-ignore
                        self_req.course_name.push(li_req[j]["courseName"])
                        // @ts-ignore
                        self_req.course_crs.push(li_req[j]["crs"])
                        let tmp = {
                            "idx": (i % 6).toString(),
                            "type": "必修",
                            // @ts-ignore
                            "content": li_req[j]["courseName"],
                            // @ts-ignore
                            "crs": li_req[j]["crs"],
                            // @ts-ignore
                            "code": li_req[j]["courseCode"]
                        }
                        // @ts-ignore
                        totalD.push(tmp)
                    }
                }
            }

            // 归总 idx
            for (let i = 0; i < totalD.length; i++) {
                // @ts-ignore
                totalD[i]["idx"] = (i % this.state.pageSize).toString()
            }

            this.setState({
                total_course: {
                    outside_course: li_out,
                    professional_elective_courses: li_pro,
                    public_elective_courses: li_pub,
                    required_courses: li_req,

                },
                self_course: {
                    outside: self_out,
                    professionalelective: self_pro_e,
                    professionalpreparation: self_pro_p,
                    publicelective: self_pub_e,
                    publicpreparation: self_pub_p,
                    required: self_req,
                },
                totalData: totalD,
                totalPage: Math.ceil(this.state.totalData.length / this.state.pageSize),

                required_re: dic.self_course.required.credit,
                required_to: dic.score.requiredscore,
                _major_re: dic.self_course.professionalelective.credit,
                _major_to: dic.score.electivescore,
                selective_re: dic.self_course.publicelective.credit,
                selective_to: dic.score.publicscore,
                outclass_re: dic.self_course.outside.credit,
                outclass_to: dic.score.outsidescore,

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
    // 筛选必修
    pageNext_w = (num: any) => {
        this.setState({
            w_current: num / this.state.pageSize + 1,
            w_indexList: this.state.w_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选专选
    pageNext_y = (num: any) => {
        this.setState({
            y_current: num / this.state.pageSize + 1,
            y_indexList: this.state.y_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选公选
    pageNext_yu = (num: any) => {
        this.setState({
            yu_current: num / this.state.pageSize + 1,
            yu_indexList: this.state.yu_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选课外
    pageNext_k = (num: any) => {
        this.setState({
            k_current: num / this.state.pageSize + 1,
            k_indexList: this.state.k_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 筛选搜索
    filter = (value: string) => {
        let dic: any = this.state.totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].content.indexOf(value) != -1 || dic[i].type.indexOf(value) != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "type": dic[i]["type"],
                    "content": dic[i]["content"], "crs": dic[i]["crs"], "code": dic[i]["code"],
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
    // 筛选必修
    filter_w = () => {
        let {W_switch, Y_switch, Yu_switch, K_switch} = this.state
        W_switch = !W_switch, Y_switch = false, Yu_switch = false, K_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i]["type"].indexOf("必修") != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "type": dic[i]["type"],
                    "content": dic[i]["content"], "crs": dic[i]["crs"], "code": dic[i]["code"],
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                K_switch: K_switch,
                w_totalData: tmp,
                w_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_w(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选专选
    filter_y = () => {
        let {W_switch, Y_switch, Yu_switch, K_switch} = this.state
        Y_switch = !Y_switch, W_switch = false, Yu_switch = false, K_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i]["type"].indexOf("专选") != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "type": dic[i]["type"],
                    "content": dic[i]["content"], "crs": dic[i]["crs"], "code": dic[i]["code"],
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                K_switch: K_switch,
                y_totalData: tmp,
                y_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_y(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选公选
    filter_yu = () => {
        let {W_switch, Y_switch, Yu_switch, K_switch} = this.state
        Yu_switch = !Yu_switch, W_switch = false, Y_switch = false, K_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i]["type"].indexOf("公选") != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "type": dic[i]["type"],
                    "content": dic[i]["content"], "crs": dic[i]["crs"], "code": dic[i]["code"],
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                K_switch: K_switch,
                yu_totalData: tmp,
                yu_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_yu(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }
    // 筛选课外
    filter_k = () => {
        let {W_switch, Y_switch, Yu_switch, K_switch} = this.state
        K_switch = !K_switch, W_switch = false, Y_switch = false, Yu_switch = false
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i]["type"].indexOf("课外") != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "type": dic[i]["type"],
                    "content": dic[i]["content"], "crs": dic[i]["crs"], "code": dic[i]["code"],
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                Yu_switch: Yu_switch,
                K_switch: K_switch,
                k_totalData: tmp,
                k_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_k(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }

    render() {
        const {S_switch, W_switch, Y_switch, Yu_switch, K_switch} = this.state
        let Li: any = []
        if (S_switch === false) {
            if (W_switch == false && Y_switch == false && Yu_switch == false && K_switch == false) Li = this.state.indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
            else if (Yu_switch == true) Li = this.state.yu_indexList
            else if (K_switch == true) Li = this.state.k_indexList
        } else {
            if (W_switch == false && Y_switch == false && Yu_switch == false && K_switch == false) Li = this.state.s_indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
            else if (Yu_switch == true) Li = this.state.yu_indexList
            else if (K_switch == true) Li = this.state.k_indexList
        }
        return (
            <div>
                <div id={"Me_tip_box"} style={{userSelect:"none"}}>
                    <div className={"Me_tip_item"} style={{order: 1}}>{this.state.name}</div>
                    <div className={"Me_tip_item"} style={{order: 2}}>{this.state.id.toUpperCase()}</div>
                </div>
                <div id="Me_show-info-group">
                    <div id="Me_show-info-person">
                        <div className="Me_show-info-item" style={{order: 1}}>年级：{this.state.grade}</div>
                        <div className="Me_show-info-item" style={{order: 2}}>学院：{this.state.college}</div>
                        <div className="Me_show-info-item" style={{order: 3}}>专业：{this.state.major}</div>
                        <div className="Me_show-info-item" style={{order: 4}}>班级：{this.state.class_type}</div>
                    </div>
                    <div id="Me_show-info-credit">
                        <div className="Me_show-info-item" style={{order: 1}}>
                            必修学分：<span style={{ color:"#1D68C1"}}>{this.state.required_re}</span>/{this.state.required_to}</div>
                        <div className="Me_show-info-item" style={{order: 2}}>
                            专选学分：<span style={{ color:"#1D68C1"}}>{this.state._major_re}</span><span style={{color: "#F8316A", display: this.state.self_course.professionalpreparation.credit==0?"none":""}}>+{this.state.self_course.professionalpreparation.credit}</span>/{this.state._major_to}</div>
                        <div className="Me_show-info-item" style={{order: 3}}>
                            公选学分：<span style={{ color:"#1D68C1"}}>{this.state.selective_re}</span><span style={{color: "#F8316A", display: this.state.self_course.publicpreparation.credit==0?"none":""}}>+{this.state.self_course.publicpreparation.credit}</span>/{this.state.selective_to}</div>
                        <div className="Me_show-info-item" style={{order: 4}}>
                            课外学分：<span style={{ color:"#1D68C1"}}>{this.state.outclass_re}</span>/{this.state.outclass_to}</div>
                    </div>
                </div>
                <div id={"Me_choose_box"} style={{userSelect:"none"}}>
                    {
                        W_switch == false ?
                            <div className={"Me_choose_item_1 "} style={{order: 1,cursor:"pointer"}}
                                 onClick={this.filter_w}>必&nbsp;修</div> :
                            <div className={"Me_choose_item_2 "} style={{order: 1,cursor:"pointer"}}
                                 onClick={this.filter_w}>必&nbsp;修</div>
                    }
                    {Y_switch == false ?
                        <div className={"Me_choose_item_1 "} style={{order: 2,cursor:"pointer"}} onClick={this.filter_y}>专&nbsp;选</div> :
                        <div className={"Me_choose_item_2 "} style={{order: 2,cursor:"pointer"}} onClick={this.filter_y}>专&nbsp;选</div>
                    }
                    {
                        Yu_switch == false ?
                            <div className={"Me_choose_item_1 "} style={{order: 3,cursor:"pointer"}}
                                 onClick={this.filter_yu}>公&nbsp;选</div> :
                            <div className={"Me_choose_item_2 "} style={{order: 3,cursor:"pointer"}}
                                 onClick={this.filter_yu}>公&nbsp;选</div>
                    }
                    {
                        K_switch == false ?
                            <div className={"Me_choose_item_1 "} style={{order: 4,cursor:"pointer"}}
                                 onClick={this.filter_k}>课&nbsp;外</div> :
                            <div className={"Me_choose_item_2 "} style={{order: 4,cursor:"pointer"}}
                                 onClick={this.filter_k}>课&nbsp;外</div>
                    }
                </div>
                <div id={"Me_course_box"} style={{userSelect:"none"}}>
                    <div id={"Me_course_head"} style={{order: 1}}>
                        <div className={"Me_course_head_item"} style={{order: 1}}>类别</div>
                        <div className={"Me_course_head_item"} style={{order: 2}}>内容</div>
                        <div className={"Me_course_head_item"} style={{order: 3}}>学分</div>
                        <div className={"Me_course_head_item"} style={{order: 4}}>状态</div>
                    </div>
                    {Li.map((cont: any) => {
                        return <MList {...cont} key={cont["idx"]} remove={this.removeCourse}/>
                    })}
                </div>
                {
                    !W_switch && !Y_switch && !Yu_switch && !K_switch ? (
                        S_switch == false ?
                            <MPageButton {...this.state} pageNext={this.pageNext}/> :
                            <SpageButton {...this.state} pageNext2={this.pageNext2}/>
                    ) : (
                        W_switch == true ?
                            <WpageButton {...this.state} pageNext_w={this.pageNext_w}/> :
                            (
                                Y_switch == true ?
                                    <YpageButton {...this.state} pageNext_y={this.pageNext_y}/> :
                                    (
                                        Yu_switch == true ?
                                            <PYupageButton {...this.state} pageNext_yu={this.pageNext_yu}/> :
                                            <KpageButton {...this.state} pageNext_k={this.pageNext_k}/>
                                    )
                            )
                    )
                }
            </div>
        );
    }

}