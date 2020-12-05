window.onload = function () {

    /*
     *点击文本框时,文本框最开始的文字消失
     */
    var newList = document.getElementById("newList");
    newList.onclick = function () {
        newList.value = "";
    };


    //统计正在进行的日程总数量
    var totalDoing = function () {
        var doing = document.getElementById("doing");
        var li = doing.getElementsByTagName("li");
        var DoingNumber = document.getElementById("DoingNumber");
        DoingNumber.innerHTML = li.length;
    }

    // 统计已完成的日程总数量
    var totalDone = function () {
        var done = document.getElementById("done");
        var li = done.getElementsByTagName("li");
        var DoneNumber = document.getElementById("DoneNumber");
        DoneNumber.innerHTML = li.length;
    }


    //创建新的日程添加到正在进行表单中(添加新日常)
    var creatNewList = function (newList) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.innerHTML = newList;
        var btn = document.createElement("button");
        btn.class = "finish";
        btn.innerHTML = "完成";
        li.appendChild(a);
        li.appendChild(btn);
        var doing = document.getElementById("doing");
        doing.appendChild(li);
        //为新增的button设置点击事件
        btn.onclick = finButton;
        a.onclick = modA;
    };

    /*
     * 添加新日常
     * 在文本框内输入文字,按下按钮,加入新todo;
     * 
     * 1.输入文字,按下回车获取value值;
     * 2.value不能为空;
     * 3.加入新todo;
     * 4.检验正在进行的日程数量;
     */
    var add = document.getElementById("add");
    add.onclick = function () {
        var newList = add.previousElementSibling;
        if (newList.value == "") {
            alert("不能添加空日程");
        } else {
            creatNewList(newList.value);
            newList.value = "";
            totalDoing();
        };
    };


    /*
     * 添加新日常
     * 在文本框内输入文字,按下回车,加入新todo;
     */
    var newList = document.getElementById("newList");
    newList.onkeydown = function (e) {
        if (e.key == "Enter") {
            if (newList.value == "") {
                alert("不能添加空日程");
            } else {
                creatNewList(newList.value);
                newList.value = "";
                totalDoing();
            };
        };
    };

    // 将完成的日程放入已完成表单中(点击事件功能)
    var listIntoDone = function (fList) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "";
        a.innerHTML = fList;
        li.appendChild(a);
        var done = document.getElementById("done");
        done.appendChild(li);
        // 为a添加点击事件方法
        a.onclick = deleteA;
    };

    /*
     * finish按钮点击事件
     *  功能
     *	1.点击按钮,正在进行的日程消失
     *	2.正在进行的日程加入已完成日程
     *	3.修正正在进行的和已完成的日程数量
     */
    function finButton() {
        var listInfo = this.previousElementSibling.innerHTML;
        listIntoDone(listInfo);
        var li = this.parentElement;
        li.parentElement.removeChild(li);
        totalDoing();
        totalDone();
    };

    //删除已完成日程点击事件方法
    function deleteA() {
        var li = this.parentElement;
        li.parentElement.removeChild(li);
        totalDoing();
        totalDone();
        return false;
    };

    //修改日程
    function modA() {
        var pr;
        var li = this.parentElement;
        var input = document.createElement("input");
        input.type = "text";
        input.value = this.innerHTML;
        li.appendChild(input);
        input.focus();
        // 失去焦点时
        input.onblur = function () {
            pr = this.parentElement;
            pr.firstElementChild.innerHTML = this.value;
            this.parentElement.removeChild(this);
        };
        // 按下回车时
        input.onkeydown = function (e) {
            if (e.key == "Enter") {
                pr = this.parentElement;
                pr.firstElementChild.innerHTML = this.value;
                this.style.display = "none";
            };
        };
        return false;
    };




};