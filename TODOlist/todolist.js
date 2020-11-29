//全局的获取元素
var deletes = document.getElementById("delete");//获取默认的修改按钮
var ceshi = document.getElementById("ceshi");//获取默认的列表项
var button4 =document.getElementById("button4");//获取清空按钮
var last = document.getElementById("last");//获取查询结果显示的盒子
var a = document.getElementById("rearch");//获取搜索框
var rearchbutton = document.getElementById("rearchbutton");//获取搜索按钮
var delsum = document.getElementById("delsum");//获取统计删除个数的元素
var todo = document.getElementById("new-todo");//获取输入框
var list = document.getElementById("list");//获取有序表单
var nums = document.getElementById("num");//未完成模块
var delnum = 0;
//定义函数
//1.修改
function tansform (element) {
    let oldhtml = element.firstChild.nodeValue;//获取元素之前的内容
    let newobj = document.createElement('input');//创建一个input元素
    newobj.type = 'text';
    newobj.value = oldhtml;
    element.firstChild.nodeValue = '';//设置元素内容为空
    element.appendChild(newobj);//Cannot read property 'appendChild' of null。一般是获取的节点不存在
    newobj.focus()//获取焦点
    newobj.onblur = function () {
    element.firstChild.nodeValue = newobj.value;
    newobj.remove();
   };
};
//2.增加
function add () {
    let newli = document.createElement("li");
    let remove = document.createElement("button");
    remove.setAttribute("class","button1");
    newli.setAttribute("class","lis")
    remove.innerHTML = "❌";
    remove.addEventListener('click',function () {
        this.parentNode.remove();
        delnum++;
        delsum.innerHTML = `已完成:${delnum}<span>&</span>`;
        sum();
    },false);
    newli.appendChild(remove);
    newli.innerHTML = todo.value;
    if(todo.value ==='') {
        alert("您还没有输入呢！")
        return false;
    }
    newli.addEventListener('dblclick',function () {
       tansform(this)},false);
    list.appendChild(newli);
    newli.appendChild(remove);
    sum();
};
//3.计算任务总数
function  sum() {
    let length = document.getElementsByTagName("li").length;
    nums.innerHTML = "未完成:"+parseInt(length);
};
//4.清空列表
function clear() {
    while(list.hasChildNodes()){
       list.removeChild(list.firstChild);
       delsum.innerHTML = `已完成:0<span>&</span>`;
   }
   //将查询的结果也删掉
   last.innerText = '';
};
//5.搜索查询
function rearch () {
    let s = new Array();
    let result = document.getElementsByClassName("lis");
    let b = `[\s\S]{0,}${a.value}[\s\S]{0,}`;
    let re = new RegExp(b);
    last.innerText = '';
    for (var i=0;i<=result.length;i++){
        s[i] = result[i].firstChild.nodeValue;
        if(re.test(s[i])){
           last.innerText = `搜索到任务：${s[i]}\n`+last.innerText;
       }
    };
};
//给清空按钮绑定函数
button4.addEventListener('click',function () {
    clear();  
    sum();  
},false);
//搜索按钮按钮绑定函数
rearchbutton.addEventListener('click',function () {
    rearch();
    changeBborder();
    alert('我执行le');
},false);

