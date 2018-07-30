// 发布/订阅事件
class Events {
    constructor(option){
        this.listenList = [];
    };
    listen(key,fn){
        if(!this.listenList[key]){
            this.listenList[key] = [];
        }
        this.listenList[key].push(fn);
    }
    on(key,params){
        let fnList = this.listenList[key];
        if(!fnList) return;
        fnList.forEach(fn=>{
            fn(params);
        });
    }
    remove(key,fn){
        let fnList = this.listenList[key];
        if(!fnList) return;
        for(let i=fnList.length-1;i>=0;i--){
            if(fnList[i]===fn){
                fnList.splice(i,1);
            }
        }
    }
}

export default Events;