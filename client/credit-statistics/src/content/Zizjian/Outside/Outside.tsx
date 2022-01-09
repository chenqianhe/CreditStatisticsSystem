import React from 'react';


import "../Professional/Professional.less"
import "./Outside.less"
import {changecourses, getcourses} from "../../../../common/net-service";
import {OuList} from "./OuList/OuList";
import {OuPageButton} from "./OuPageButton/OuPageButton";
import {PageButton} from "../Required/PageButton/PageButton";
import {List} from "../Required/List/List";
import {SpageButton} from "../Required/SpageButton/SpageButton";


export class Outside extends React.Component<any> {

    state = {
        userid: "",
        user_data: {re: '', to: ''},

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

        pageSize: 11,
        goValue: 0,

        self_course: {
            outside: {course: "", credit: 0, course_code: [], course_name: [], course_crs: []},
        },
        credit: 0,
        course_code: [],
    }

    componentWillReceiveProps = (nextProps: any) => {
        if (nextProps.search_value === '') {
            this.setState({
                S_switch: false,
            })
            this.pageNext(this.state.goValue)
        } else if (nextProps.search_value != this.props.search_value && nextProps.search_value != '') {
            this.setState({
                S_switch: true,
            })
            this.filter(nextProps.search_value.toUpperCase())
        }
    }

    componentDidMount = () => {
        getcourses(this.props._id, (res: any) => {
            let dic = res.data.outside_course;
            let li2: any = this.state.totalData

            const {course, credit} = res.data.self_course.outside;
            // console.log(res.data.self_course.outside);
            // console.log('credit: ' + credit);
            const {outsidescore} = res.data.score

            let self_out: any = {course: "", credit: 0, course_code: [], course_name: [], course_crs: []}
            self_out.course = res.data.self_course.outside.course
            self_out.course_code = self_out.course.split(',')
            for (let i = 0; i < dic.length; i++) {
                let tmp = {
                    "idx": (i % this.state.pageSize).toString(), "activityCode": dic[i]["activityCode"],
                    "activityCondition": dic[i]["activityCondition"], "activityName": dic[i]["activityName"],
                    "crs": dic[i]["crs"], "tianjia": false,
                }
                tmp["tianjia"] = self_out.course_code.indexOf(tmp["activityCode"]) != -1 ? true : false
                li2.push(tmp)
            }

            this.setState({
                totalData: li2,
                user_data: {re: credit, to: outsidescore},
                totalPage: Math.ceil(this.state.totalData.length / this.state.pageSize),
                userid: this.props._id,

                course_code: self_out.course_code,
                credit: res.data.self_course.outside.credit,
            })
            this.pageNext(this.state.goValue)
        })
    }

    addCourse = (courseid: string, credit: number) => {
        let courseid_arr: string[] = [];
        let courseids = "";
        let credits: number;
        credits = this.state.credit + credit;
        // console.log(this.state.course_code);
        // @ts-ignore
        this.state.course_code.map((item: string, index) => {
                courseid_arr.push(item.trim());
            }
        );
        courseid_arr.push(courseid);
        courseids = courseid_arr.join(',');
        // console.log(courseids);
        changecourses(this.state.userid, "outside", credits, courseids, (res: any) => {
            if (res.data.state == 1) {
                alert('添加成功!');
                let totalData = this.state.totalData;
                // console.log(totalData);
                for (let id in totalData) {
                    if (totalData[id]["activityCode"] == courseid) {
                        // @ts-ignore
                        totalData[id]["tianjia"] = !totalData[id]["tianjia"];
                        break;
                    }
                }
                let user_data = {
                    re: credits,
                    to: this.state.user_data.to,
                }
                this.setState({
                    totalData: totalData,
                    user_data: user_data,
                    course_code:courseid_arr,
                    credit:credits,
                });


            } else {
                alert('出现了问题，请先联系管理员处理');
            }
        });
    }

    //设置内容
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

    // 筛选搜索
    filter = (value: string) => {
        let dic: any = this.state.totalData
        let tmp = [], j = 1
        for (let i = 0; i < dic.length; i++) {
            if (dic[i].activityCode.indexOf(value) != -1 || dic[i].activityName.indexOf(value) != -1) {
                let _tmp = {
                    "idx": (j % this.state.pageSize).toString(), "activityCode": dic[i]["activityCode"],
                    "activityCondition": dic[i]["activityCondition"], "activityName": dic[i]["activityName"],
                    "crs": dic[i]["crs"],
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


    render() {
        const {re, to} = this.state.user_data
        const {S_switch} = this.state
        let Li: any = []
        if (S_switch == false) {
            Li = this.state.indexList
        } else {
            Li = this.state.s_indexList
        }
        return (
            <div>
                <div id={"Ou_tip_box"} style={{userSelect: "none"}}>
                    <div className={"Ou_tip_item"}>课外学分:&nbsp;&nbsp;&nbsp;&nbsp;<span
                        style={{color: "#1D68C1"}}>{re}</span>/{to}</div>
                </div>
                <div id={"Ou_course_box"}>
                    <div id={"Ou_course_head"} style={{order: 1, userSelect: "none"}}>
                        <div className={"Ou_course_item"} style={{order: 1}}>序号</div>
                        <div className={"Ou_course_item"} style={{order: 2}}>课外活动名称</div>
                        <div className={"Ou_course_item_1"} style={{order: 3}}>课外活动和社会实践的要求</div>
                        <div className={"Ou_course_item_2"} style={{order: 4}}>课外学分</div>
                        <div className={"Ou_course_item"} style={{order: 5}}>状态</div>
                    </div>
                    {Li.map((cont: any) => {
                        return <OuList {...cont} key={cont["idx"]} addCourse={this.addCourse}/>
                    })}
                </div>
                {
                    S_switch == false ?
                        <OuPageButton {...this.state} pageNext={this.pageNext}/> :
                        <SpageButton {...this.state} pageNext2={this.pageNext2}/>
                }
            </div>
        )
    }
}