import React from 'react';

import './Pubt.less';

interface ButtonProp{
    idx:string,
    content:string,
}
export class Pubt extends React.Component<ButtonProp> {

    Introduce = () => {
        alert("该课程介绍还未完善")
    }
    render() {
        let st = Number(this.props.idx)
        return (
            <div className={"Pub_type_item"} style={{order:st}} >
                {this.props.content}
            </div>
        )
    }
}

