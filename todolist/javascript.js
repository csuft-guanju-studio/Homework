window.onload = function () {
    var btn = document.querySelector('#texta').querySelector('button');
    var text = document.querySelector('#texta').querySelector('textarea');
    var ul = document.querySelector('#texta').querySelector('ul');
    var shanchu = document.querySelector('#texta').querySelector('.shanchu');
    btn.onclick = function () {
        if (text.value == '') {
            alert('您没有输入内容');
            return false;
        } else {
            // console.log(text.value);
            // (1) 创建元素
            var li = document.createElement('li');
            // 先有li 才能赋值
            li.innerHTML = text.value + "<a href='javascript:;'>删除</a>";    //href 里的 组织链接跳转
            // (2) 添加元素
            // ul.appendChild(li);
            ul.insertBefore(li, ul.children[0]);

            // (3) 删除元素 
            var as = ul.querySelectorAll('a');
            //想要动态删除 只能在这里绑定   如果在外部 则只能删除已经存在得
            for (var i = 0; i < as.length; i++) {
                as[i].onclick = function () {
                    var shanchu = document.querySelector('#texta').querySelector('.shanchu');  //定义删除区
                    var li = document.createElement('li');   //创建删除区的li
                    li.innerHTML = this.parentNode.innerHTML;    //给删除区的li 赋内容
                    shanchu.appendChild(li);                  //添加删除区的li
                    ul.removeChild(this.parentNode);           //删除ul的li
                    var ass = shanchu.querySelectorAll('li')
                    for (var i = 0; i < ass.length; i++) {
                        ass[i].onclick = function () {              //给删除区的li添加点击
                            shanchu.removeChild(this);            //删除删除区的li
                        }
                    }


                }
            }
        }
    }








    var time = document.querySelector('.time');
    var hour = time.querySelector('.hour');
    var minute = time.querySelector('.minute');
    var second = time.querySelector('.second');
    // countDown(); // 我们先调用一次这个函数，防止第一次刷新页面有空白 
    // 2. 开启定时器
    setInterval(countDown, 1000);

    function countDown() {
        var date = new Date(); // 返回的是当前时间总的毫秒数
        var h = date.getHours(); //时
        h = h < 10 ? '0' + h : h;
        hour.innerHTML = h;
        var m = date.getMinutes(); // 分
        m = m < 10 ? '0' + m : m;
        minute.innerHTML = m;
        var s = date.getSeconds(); // 当前的秒
        s = s < 10 ? '0' + s : s;
        second.innerHTML = s;
    }



    var tab_list = document.querySelector('.tab_list');
    var lis = tab_list.querySelectorAll('li');
    var items = document.querySelectorAll('.item');

    for (var i = 0; i < lis.length; i++) {

        lis[i].setAttribute('index', i);
        lis[i].onclick = function () {

            for (var i = 0; i < lis.length; i++) {
                lis[i].className = '';
            }

            this.className = 'current';
            // 2. 下面的显示内容模块
            var index = this.getAttribute('index');
            console.log(index);
            // 让其余的item 这些div 隐藏
            for (var i = 0; i < items.length; i++) {
                items[i].style.display = 'none';
            }
            //  让对应的item 显示出来
            items[index].style.display = 'block';
        }
    }

}