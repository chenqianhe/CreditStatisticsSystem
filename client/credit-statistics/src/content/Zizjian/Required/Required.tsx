import React from 'react';

import './Required.less';
import {changecourses, getcourses} from "../../../../common/net-service";
import {List} from "./List/List";
import {PageButton} from "./PageButton/PageButton";
import {SpageButton} from "./SpageButton/SpageButton";
import {WpageButton} from "./WpageButton/WpageButton";
import {YpageButton} from "./YpageButton/YpageButton";


export class Required extends React.Component<any> {

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

        pageSize: 10,
        goValue: 0,

        // 进行课程已修匹配部分
        self_course: {
            required: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
        },

        credit: 0,
        course_code: [],


    }

    changeCourse = (courseid: string, credit: number) => {
        let courseid_arr: string[] = [];
        let courseids = "";
        let credits;
        credits = this.state.credit;
        let isSelected: boolean = false;
        // @ts-ignore
        this.state.course_code.map((item: string, index) => {
                if (item == courseid) {
                    // console.log('该课程已修,将改为未修');
                    isSelected = true;
                } else {
                    courseid_arr.push(item.trim());
                }
            }
        );
        if (isSelected == false) {
            courseid_arr.push(courseid);
            credits += credit;
        } else {
            credits -= credit;
        }
        courseids = courseid_arr.join(',');
        // console.log(courseids);
        // console.log(credits);
        this.setState({
            course_code: courseid_arr,
            credit: credits,
            user_data: {re: credits, to: this.state.user_data.to}
        });

        changecourses(this.state.userid, "required", credits, courseids, (res: any) => {
            if (res.data.state == 1) {
                alert('课程修改成功!');
                let totalData = this.state.totalData;
                // console.log(totalData);
                for (let id in totalData) {
                    if (totalData[id]["courseCode"] == courseid) {
                        // @ts-ignore
                        totalData[id]["yixiu"] = !totalData[id]["yixiu"];
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
            let dic = res.data.required_courses;
            let li2 = this.state.totalData

            const {course, credit} = res.data.self_course.required;
            const {requiredscore} = res.data.score

            let self_req: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}
            self_req.course = course, self_req.credit = credit
            self_req.course_code = self_req.course.split(',')

            for (let i = 0; i < dic.length; i++) {
                let tmp = {
                    "idx": (i % 10).toString(), "courseCode": dic[i]["courseCode"].trim(),
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"],
                    "yixiu": false,
                }
                tmp["yixiu"] = self_req.course_code.indexOf(tmp["courseCode"]) != -1 ? true : false
                // @ts-ignore
                li2.push(tmp)
            }

            this.setState({
                totalData: li2,
                user_data: {re: credit, to: requiredscore},
                totalPage: Math.ceil(this.state.totalData.length / this.state.pageSize),
                userid: this.props._id,

                credit: res.data.self_course.required.credit,
                course_code: self_req.course_code,
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
    // 设置搜索内容
    pageNext2 = (num: any) => {
        this.setState({
            s_current: num / this.state.pageSize + 1,
            s_indexList: this.state.s_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 设置未修内容
    pageNext_w = (num: any) => {
        this.setState({
            w_current: num / this.state.pageSize + 1,
            w_indexList: this.state.w_totalData.slice(num, num + this.state.pageSize)
        })
    }
    // 设置已修内容
    pageNext_y = (num: any) => {
        this.setState({
            y_current: num / this.state.pageSize + 1,
            y_indexList: this.state.y_totalData.slice(num, num + this.state.pageSize)
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
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"]
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
        let {W_switch, Y_switch} = this.state
        Y_switch = false, W_switch = !W_switch
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].yixiu == false) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
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
        let {W_switch, Y_switch} = this.state
        W_switch = false, Y_switch = !Y_switch
        let dic: any = this.state.S_switch == false ? this.state.totalData : this.state.s_totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].yixiu == true) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "courseCode": dic[i]["courseCode"],
                    "courseName": dic[i]["courseName"], "crs": dic[i]["crs"],
                    "hrs": dic[i]["hrs"], "required/elective": dic[i]["required/elective"],
                    "semester": dic[i]["semester"], "yixiu": dic[i]["yixiu"]
                }
                j += 1
                tmp.push(_tmp)
            }
            this.setState({
                W_switch: W_switch,
                Y_switch: Y_switch,
                y_totalData: tmp,
                y_totalPage: Math.ceil(tmp.length / this.state.pageSize),
            }, () => {
                this.pageNext_y(this.state.goValue)
                this.pageNext(this.state.goValue)
                this.pageNext2(this.state.goValue)
            })
        }
    }

    render() {
        const {re, to} = this.state.user_data
        const {S_switch, W_switch, Y_switch} = this.state
        let Li: any = []
        if (S_switch === false) {
            if (W_switch == false && Y_switch == false) Li = this.state.indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
        } else {
            if (W_switch == false && Y_switch == false) Li = this.state.s_indexList
            else if (W_switch == true) Li = this.state.w_indexList
            else if (Y_switch == true) Li = this.state.y_indexList
        }


        return (
            <div style={{userSelect:"none"}}>
                <div id={"Required_tip_box"}>
                    <div className={"Required_tip_item"}>必修学分:&nbsp;&nbsp;&nbsp;&nbsp;<span
                        className={"Required_tip_item_t "}>{re}</span>/{to}</div>
                </div>
                <div id={"Required_choose_box"}>
                    {
                        W_switch == false ?
                            <div className={"Required_choose_item_1 "} style={{order: 1,cursor:"pointer"}}
                                 onClick={this.filter_w}>未&nbsp;修</div> :
                            <div className={"Required_choose_item_2 "} style={{order: 1,cursor:"pointer"}}
                                 onClick={this.filter_w}>未&nbsp;修</div>
                    }
                    {Y_switch == false ?
                        <div className={"Required_choose_item_1 "} style={{order: 2,cursor:"pointer"}}
                             onClick={this.filter_y}>已&nbsp;修</div> :
                        <div className={"Required_choose_item_2 "} style={{order: 2,cursor:"pointer"}}
                             onClick={this.filter_y}>已&nbsp;修</div>
                    }
                </div>
                <div id={"Required_course_box"}>
                    <div id={"Required_course_head"} style={{order: 1}}>
                        <div className={"Required_course_item"} style={{order: 1}}>课程代码</div>
                        <div className={"Required_course_item"} style={{order: 2}}>课程名称</div>
                        <div className={"Required_course_item"} style={{order: 3}}>学时</div>
                        <div className={"Required_course_item"} style={{order: 4}}>学分</div>
                        <div className={"Required_course_item"} style={{order: 5}}>开设学期</div>
                        <div className={"Required_course_item"} style={{order: 6}}>状态</div>
                    </div>
                    {Li.map((cont: any) => {
                        return <List {...cont} key={cont["idx"]} changeCourse={this.changeCourse}/>
                    })}
                </div>
                {
                    W_switch == false && Y_switch == false ? (
                        S_switch == false ?
                            <PageButton {...this.state} pageNext={this.pageNext}/> :
                            <SpageButton {...this.state} pageNext2={this.pageNext2}/>
                    ) : (
                        W_switch == true ?
                            <WpageButton {...this.state} pageNext_w={this.pageNext_w}/> :
                            <YpageButton {...this.state} pageNext_y={this.pageNext_y}/>
                    )
                }

            </div>
        )
    }
}