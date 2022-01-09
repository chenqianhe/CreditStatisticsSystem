export function checkIsJsonString(str: string){
    try {
        //通过JSON将str转换为json对象，如果转换出现异常，进入catch,返回false
        let obj = JSON.parse(str);
        return !!(typeof obj === 'object' && obj);
    } catch (error) {
        //转换异常，返回false
        return false;
    }
}
