window.onload = function () {
    var addlist = document.getElementById("add_list");//输入框对象
    //输入框按下回车键触发添加事宜
    addlist.onkeydown = function (event) {
        if (event.key == "Enter") {
            createlist(addlist.value);
            addlist.value = "";
        }

    };
    //添加新todo
    function createlist(value) {
        if (value == "") {
            alert("事宜不能为空");
            return;
        }
        else {
            let list = document.createElement("li");
            let ol = document.getElementById("todolist");
            list.innerHTML = "<input type='checkbox'>" +
                "<p>" + value + "</p>" +
                "<a>-</a>";
            let a = list.getElementsByTagName("a")[0];
            a.onclick = remove;
            let input = list.getElementsByTagName("input")[0];
            input.onchange = change;
            let p = list.getElementsByTagName("p")[0];
            p.onclick = edit;
            ol.appendChild(list);
            counttodo();
        }
    }
    //统计todo事项数量
    function counttodo() {
        let count = document.getElementById("todocount");
        let ol = document.getElementById("todolist");
        let list = ol.getElementsByTagName("li");
        count.innerHTML = list.length;
    }
    //统计done事项数量
    function countdone() {
        let count = document.getElementById("donecount");
        let ol = document.getElementById("donelist");
        let list = ol.getElementsByTagName("li");
        count.innerHTML = list.length;
    }
    //删除功能
    function remove() {
        let list = this.parentElement;
        list.parentElement.removeChild(list);
        counttodo();
        countdone();
    }
    //点击checkbox事件从todo转为done
    function change() {
        let ol = document.getElementById("donelist");
        let list1 = this.parentElement;
        let pel = list1.getElementsByTagName("p")[0];
        let list2 = document.createElement("li");
        list2.innerHTML = "<input type='checkbox' disabled='disabled'  checked='checked' >" +
            "<p>" + pel.innerHTML + "</p>" +
            "<a>-</a>";
        let a = list2.getElementsByTagName("a")[0];
        a.onclick = remove;
        let pel2 = list2.getElementsByTagName("p")[0];
        pel2.onclick = edit;
        ol.appendChild(list2);
        list1.parentElement.removeChild(list1);
        counttodo();
        countdone();
    }
    //点击文本框进行编辑
    function edit() {
        let par = this;
        let pcontent = this.innerHTML;
        par.innerHTML = "<input type='text' >";
        let input = par.getElementsByTagName("input")[0];
        input.value = pcontent;
        input.focus();
        input.onblur = confirm;   //表单控件失去焦点，调用confirm函数，即对页面内容进行更新
        input.onkeypress = enter;
        function confirm() {
            if (input.value == "") {
                par.innerHTML = pcontent;
                alert("事宜不能为空");
            }
            else {
                par.innerHTML = input.value;
            }
        }
        function enter(event) {
            if (event.key == "Enter") {
                confirm();
            }
        }
    }
}