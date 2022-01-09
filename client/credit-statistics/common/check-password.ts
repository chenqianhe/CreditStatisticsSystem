export function checkPassword(password:string) {
    const upperCaseOrlowerCase = /[a-zA-Z]/;// 判断是否有大写或小写
    const number = /[0-9]/;// 判断是否有数字
    const length = /^.{6,16}$/;// 判断是否长度为6-16位
    const space = /^\S+$/;// 判断必须非空格

    return upperCaseOrlowerCase.test(password) && number.test(password) && length.test(password) && space.test(password);

}