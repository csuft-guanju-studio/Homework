window.onload = function(){

    //待完成任务数与已完成任务数
    let finishNum = document.querySelector("#finishNum");
    let toDoNum = document.querySelector("#toDoNum");

    //用来储存toDolist中所有Dom对象的数组
    let toDolist = [];

    //保存toDolistBody与finishDolistBody的dom对象，便于之后向他加入元素
    let DomtoDolistBody=document.querySelector("#toDolistBody");
    let DomFinishDolistBody = document.querySelector("#finishDolistBody");

    //设立重要性从文字到数字的映射，方便后面的比较函数使用
    let importanceMap = new Map();
    importanceMap.set("重要",1);
    importanceMap.set("普通",0);

    /*
     *得到“yyyy-mm-dd”格式的字符型当前日期
     *@return {string} - “yyyy-mm-dd”格式的字符型当前日期
     */
    let getNowDate = function(){
        let date = new Date();
        let nowMonth = date.getMonth() + 1;
        let strDate = date.getDate();
        if (nowMonth >= 1 && nowMonth <= 9) {
            nowMonth = "0" + nowMonth;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let nowDate = date.getFullYear() + '-' + nowMonth + '-' + strDate;
        return nowDate;
    }

    //提交按钮及其点击事件
    let newTrBtn = document.querySelector("#newTrBtn");
    newTrBtn.onclick=()=>{
        let introduce = document.querySelector("#introduce");
        let importance = document.querySelector("#importance");
        let deadLine = document.querySelector("#deadLine");

        if(introduce.value && importance.value && deadLine.value){
            let nowTime = getNowDate();
             //“yyyy-mm-dd”格式的字符串可以直接比较日期大小，截止日期一定是今天或今天之后的日期，故做检查
            if(deadLine.value<nowTime){
                alert("不能设置过去的时间！");
            }else{
                createNewTr(introduce.value,deadLine.value,importance.value);
                introduce.value="";
            }
        }else{
            alert("有未填好的项目！");
        }
    };

    //排序按钮及其点击事件
    let sortByBtn = document.querySelector("#sortByBtn");
    sortByBtn.onclick=()=>{
        if(sortByBtn.value=="按截止日期排序"){
            reFresh(sortByBtn.value);
            sortByBtn.value="按重要性排序";
        }else if(sortByBtn.value=="按重要性排序"){
            reFresh(sortByBtn.value);
            sortByBtn.value="按截止日期排序";
        }
    };

    /*
     *用来创建新的tr元素，插入DomtoDolist列表中，并插入toDolist数组。
     *@param {string} introduce - 对事项的简要描述。
     *@param {string} deadLine - 事项的截止日期。
     *@param {string} importance - 事项的重要性。
     */
    let createNewTr = function(introduce,deadLine,importance){
        //创建新行中的各个dom元素
        let tr = document.createElement("tr");
        let tdIntroduce  = document.createElement("td");
        let tdDeadLine  = document.createElement("td");
        let tdImportance  = document.createElement("td");
        let tdOperation = document.createElement("td");
        let delBtn = document.createElement("input");
        let finishBtn = document.createElement("input");
        let changeBtn = document.createElement("input");

        //为新的一行添加相应内容，样式，及点击事件。
        changeBtn.value="修改";
        changeBtn.type="button";
        changeBtn.onclick=changeFun;
        delBtn.value = "删除";
        delBtn.type="button";
        delBtn.onclick= delFun;
        finishBtn.value="完成";
        finishBtn.type="button";
        finishBtn.onclick=finishFun;
        tdIntroduce.textContent=introduce;
        tdDeadLine.textContent=deadLine;
        tdImportance.textContent=importance;
        //将新的一行插入toDolist数组中,再重新生成表格,默认按截止时间排序。
        tdOperation.append(delBtn,finishBtn,changeBtn);
        tr.append(tdIntroduce,tdDeadLine,tdImportance,tdOperation);
        toDolist.push(tr);
        //console.log(toDolist);
        //console.log(DomFinishDolistBody.rows.length);
        reFresh(sortByBtn.value);

    }

    /*
     *数组toDolist用的排序函数，按截止时间从近到远排序，截止时间相同按重要性排序。
     */
    let sortByTime = function(s1,s2){
        if (s1.cells[1].innerText < s2.cells[1].innerText) {
            return -1;
        }
        if (s1.cells[1].innerText > s2.cells[1].innerText) {
            return 1;
        }
        if(s1.cells[1].innerText == s2.cells[1].innerText){
            let importanceS1 = importanceMap.get(s1.cells[2].innerText);
            let importanceS2 = importanceMap.get(s2.cells[2].innerText);
            if(importanceS1 < importanceS2)
                return 1;
            if(importanceS1 > importanceS2)
                return -1;
            if(importanceS2 == importanceS1)
                return 0;
        }
    }

    /*
     *数组toDolist用的排序函数，按重要性从大到小排序，重要性相同按截止时间排序。
     */
    let sortByImportance = function(s1,s2){
        let importanceS1 = importanceMap.get(s1.cells[2].innerText);
        let importanceS2 = importanceMap.get(s2.cells[2].innerText);
        if(importanceS1 < importanceS2)
                return 1;
        if(importanceS1 > importanceS2)
                return -1;
        if(importanceS2 == importanceS1){
            if (s1.cells[1].innerText < s2.cells[1].innerText) {
                return -1;
            }
            if (s1.cells[1].innerText > s2.cells[1].innerText) {
                return 1;
            }
            if(s1.cells[1].innerText == s2.cells[1].innerText){
                return 0;
            }
        }
                
    }

    /*
     *重新生成网页的toDolist表格
     *@param {string} criterion - 排序的依据，确定调用哪个排序函数。
     */
    let reFresh = function(criterion){

        if(criterion=="按截止日期排序"){
            toDolist.sort(sortByTime);
        }else if(criterion == "按重要性排序"){
            toDolist.sort(sortByImportance);
        }

        DomtoDolistBody.innerHTML="";

        toDolist.forEach(element => {
            DomtoDolistBody.append(element);
        });
        refreshTodo();
        reFreshFinish();
    }

    /*
     *删除按钮点击事件
     */
    let delFun = function(){
        let tr = this.parentElement.parentElement;
        toDolist.splice(tr.rowIndex-1,1);
        reFresh(sortByBtn.value);
    };

    /*
     *完成按钮点击事件
     */
    let finishFun=function(){
        let tr = this.parentElement.parentElement;
        toDolist.splice(tr.rowIndex-1,1);
        tr.removeChild(tr.cells[3]);
        DomFinishDolistBody.append(tr);
        reFresh(sortByBtn.value);
    };

    /*
     *修改按钮点击事件
     */
    let changeFun=function(){
       let newValue = prompt("请输入您的修改");
       this.parentElement.parentElement.firstChild.textContent=newValue;
    }

    /*
     *两个函数，分别刷新已完成的任务数和未完成的任务数
     */
     let refreshTodo = function(){
         toDoNum.textContent = toDolist.length;
     }
     
     let reFreshFinish = function(){
        finishNum.textContent =DomFinishDolistBody.rows.length;
     }

}