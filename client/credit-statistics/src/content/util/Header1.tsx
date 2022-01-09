import React from 'react';

import './Header1.less';
import search_bg from './svg/search_icon.svg'
import profile_bg from './svg/profile_bg.svg'
import changeinfo from './svg/changeinfo_icon.svg'
import logout from './svg/logout_icon.svg'
import {getcourses, getuserinfo} from "../../../common/net-service";

export class Header extends React.Component<any> {
    state = {
        //搜索栏的输入值
        search_value: "",
        //菜单当前页
        page: "required",
        active: 1,
        //下载培养计划
        download_link: "",
        //头像图标
        student_number: "",
        student_name: "",
        profile_name: "",
        //头像浮窗
        profile_active: false,
    };

    render() {
        let countdown: NodeJS.Timeout;

        return (
            <div id={"header-group"}>
                <h2 id={"header-title"}>华中科技大学 | 学分统计系统</h2>
                <div id={"search"}>
                    <input
                        id={"search-input"}
                        placeholder="搜 索"
                        onChange={(e:any)=>{
                            this.setState({search_value:e.target.value});
                        }}
                        onClick={(e: any) => {
                            e.target.placeholder = "";
                        }}
                        onBlur={(e: any) => {
                            e.target.placeholder = "搜 索";
                        }}
                    />
                    <img
                        src={search_bg}
                        alt="搜索图标"
                        style={{
                            position: "absolute",
                            right: "1%",
                            cursor: "pointer",
                            width: "8%"
                        }}
                        onClick={this.search}
                    />
                </div>
                <div id={"menu"}>
                    <div
                        className={"menu-item"}
                        id={"required"}
                        style={{color: this.getColor(1)}}
                        onClick={this.changeView}
                    >必修
                    </div>
                    <div
                        className={"menu-item"}
                        id={"major"}
                        style={{color: this.getColor(2)}}
                        onClick={this.changeView}
                    >专选
                    </div>
                    <div
                        className={"menu-item"}
                        id={"selective"}
                        style={{color: this.getColor(3)}}
                        onClick={this.changeView}
                    >公选
                    </div>
                    <div
                        className={"menu-item"}
                        id={"outclass"}
                        style={{color: this.getColor(4)}}
                        onClick={this.changeView}
                    >课外
                    </div>
                    <div
                        className={"menu-item"}
                        id={"mine"}
                        style={{color: this.getColor(5)}}
                        onClick={this.changeView}
                    >我的
                    </div>
                </div>
                <div id={"download"}>
                    <a
                        id={"download-button"}
                        href={this.state.download_link}
                        target={"_blank"}
                        download={"培养计划.pdf"}
                    />
                    下载专业培养计划
                </div>
                <div id={"profile"}
                     onMouseEnter={() => {
                         clearTimeout(countdown);
                         this.setState({profile_active: true});
                     }}
                     onMouseLeave={() => {
                         countdown = setTimeout(() => {
                             this.setState({profile_active: false})
                         }, 1000);
                     }}
                >
                    <img
                        id={"profile-bg"}
                        src={profile_bg}
                        alt={"名字背景"}
                    />
                    <div id={"profile-name"}>
                        {this.state.profile_name}
                    </div>
                </div>
                <div style={{display:this.state.profile_active ?'':'none'}}
                     onMouseEnter={() => {
                         clearTimeout(countdown);
                         this.setState({profile_active: true});
                     }}
                     onMouseLeave={() => {
                         countdown = setTimeout(() => {
                             this.setState({profile_active: false})
                         }, 1000);
                     }}
                >
                    <ProfileWindow
                        stu_name={this.state.student_name}
                        stu_number={this.state.student_number}
                        showChange={this.props.showChange}
                    />
                </div>
                {/*{this.state.profile_active ?*/}
                {/*    <ProfileWindow*/}
                {/*        stu_name={this.state.student_name}*/}
                {/*        stu_number={this.state.student_number}*/}
                {/*        showChange={this.props.showChange}*/}
                {/*    /> : null}*/}
            </div>
        )
    }

    componentDidMount() {
        const userid: string = this.props.userid;
        let stu_num: string = userid.toUpperCase();
        getuserinfo(userid, (res: any) => {
                let name = res.data.name;
                let lastName = name.substring(name.length - 2);
                this.setState({
                    student_number: stu_num,
                    student_name: name,
                    profile_name: lastName,
                });
            }
        );
        getcourses(userid, (res: any) => {
                let link = res.data.url;
                // console.log(link);
                this.setState({download_link: link});
            }
        );
    }

    //搜索课程
    search = () => {
        this.setState({}, this.props.setSearch(this.state.search_value))
    }
    //下载培养计划
    //菜单栏切换下方的视图
    changeView = (e: any) => {
        const map: { [index: string]: number } = {"required": 1, "major": 2, "selective": 3, "outclass": 4, "mine": 5};
        const newActive: number = map[e.target.id];
        const newPage: string = e.target.id;
        this.setState(
            {
                page: e.target.id,
                active: newActive,
            },
            this.props.changePage(newPage)
        );
    };
    //渲染菜单栏字体颜色
    getColor = (position: number) => {
        // console.log(position, this.state.active);
        return this.state.active == position ? "#1D68C1" : "black";
    }


}

class ProfileWindow extends React.Component<any, any> {

    changeInfo = () => {
        // console.log("profile window : 修改个人信息");
        this.props.showChange();
    }

    logOut = () => {
        const tag = localStorage.getItem('tag')
        // console.log('tag: ' + tag);
        localStorage.removeItem('tag');
        alert("退出登录");
        // e.target.forceUpdate();
        window.location.reload()
    }

    render() {
        return (
            <div id={"profile-window"}>
                <div id={"profile-window-info"}>
                    <div
                        id="info-name"
                    >{this.props.stu_name}</div>
                    <div
                        id="info-number"
                    >{this.props.stu_number}</div>
                </div>
                <div id={"profile-window-change"}>
                    <img
                        src={changeinfo}
                        style={{
                            cursor: "pointer",
                            width: "100%",
                        }}
                        onClick={this.changeInfo}
                        alt={"changeinfo"}/>
                </div>
                <div id={"profile-window-logout"}>
                    <img
                        src={logout}
                        alt="logout"
                        style={{
                            cursor: "pointer",
                            width: "100%",
                        }}
                        onClick={this.logOut}
                    />
                </div>
            </div>
        );
    }
}