import axios from 'axios';

const devApiUrl = 'http://localhost:5000';

function request(url: string, params: object, callback: any) {

    axios.post(url, params).then((response) => {
        if (response.status === 200) {
            callback(response);
        } else {
            console.error(response);
        }
    })
        .catch((error) => {
            console.log(error);
        });
}

export function login(id: string, password: string, tag: string, callback: any) {
    const url = `${devApiUrl}/login`;
    let params = new URLSearchParams();
    params.append("id", id);
    params.append("password", password);
    params.append("tag", tag);
    request(url, params, callback);
}

export function getVerifation(id: string, callback: any) {
    const url = `${devApiUrl}/verification`;
    let params = new URLSearchParams();
    let mailbox: string = id + "@hust.edu.cn"
    params.append("mailbox", mailbox);
    request(url, params, callback);
}

export function reset(id: string, newpassword: string, callback: any) {
    const url = `${devApiUrl}/changepassword`;
    let params = new URLSearchParams();
    params.append("id", id);
    params.append("newpassword", newpassword);
    request(url, params, callback);
}

export function getcourses(id: string, callback: any) {
    const url = `${devApiUrl}/getcourses`;
    let params = new URLSearchParams();
    params.append("id", id);
    request(url, params, callback)
}

export function getcolleges(callback: any) {
    const url = `${devApiUrl}/getcollege`;
    let params = new URLSearchParams();
    request(url, params, callback);
}

export function register(name: string, id: string, grade: string, college: string, major: string, classtype: string,
                         password: string, callback: any) {
    const url = `${devApiUrl}/adduser`;
    let params = new URLSearchParams();
    params.append("name", name);
    params.append("id", id);
    params.append("grade", grade);
    params.append("college", college);
    params.append("major", major);
    params.append("classtype", classtype);
    params.append("mailbox", id + "@hust.edu.cn");
    params.append("password", password);

    request(url, params, callback);
}

export function checkstatus(tag: string, callback: any) {
    const url = `${devApiUrl}/checkstatus`;
    let params = new URLSearchParams();
    params.append("tag", tag);
    request(url, params, callback);
}

export function getuserinfo(id: string, callback: any) {
    const url = `${devApiUrl}/getuserinfo`;
    let params = new URLSearchParams();
    params.append("id", id);
    request(url, params, callback);
}

export function changeinfo(name: string, id: string, grade: string, college: string, major: string, classtype: string, password: string, callback: any) {
    const url = `${devApiUrl}/changeinfo`;
    let params = new URLSearchParams();

    params.append("name", name);
    params.append("id", id);
    params.append("grade", grade);
    params.append("college", college);
    params.append("major", major);
    params.append("classtype", classtype);
    params.append("mailbox", id + "@hust.edu.cn");
    params.append("password", password);

    request(url, params, callback);
}

export function changecourses(id:string,coursetype:string,credit:number,courseids:any,callback:any){
    const url = `${devApiUrl}/changecourses`;
    let params = new URLSearchParams();

    params.append("id", id);
    params.append("coursetype", coursetype);
    params.append("credit", credit.toString());
    params.append("courseids", courseids);

    request(url, params, callback);
}
