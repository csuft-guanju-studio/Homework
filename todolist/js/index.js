// 1.按下回车键  将文本框中的文字提取  把值赋给新建的li   文本框中值变为空    
// 2.点击复选框  打上勾就放到ending中   取消勾就放回doing
// 3. 点击删除按钮   将任务清除
// 4.计数按钮


window.onload =function () {
    var doingSpan =document.querySelector('.doingNumber');
    var endingSpan = document.querySelector('.endingNumber');
    function init() {
        totalDoing();
        totalEnding();
    }
    // 1.添加事件
    // 绑定事件
    // 按下回车时添加
    var add =document.querySelector('[name="add"]');
    var doingUl =document.querySelector('.doingUl');
    var endingUl=document.querySelector('.endingUl');
    add.addEventListener('keyup',function(e){
        if(e.key=='Enter'){
            if(add.value==""){
                alert('请输入内容！');
            }
            else{
                var addValue = add.value;
                var doingLi=document.createElement('li');
                var doingUl =document.querySelector('.doingUl');
                doingLi.innerHTML="<input type='checkbox'>"+ '<p>'+addValue+'</p>'+'<button>X</button>';
                doingUl.appendChild(doingLi);
                //清空输入框中的内容
                add.value="";
                // 失去焦点
                add.blur();
                init();
            }
        }
    })

    //输入框获取焦点时内容为空
    add.addEventListener('click',function(){
        add.value="";
    })  

    // 失去焦点时添加
    add.addEventListener('blur',function(){
        if(add.value==""){
            add.value=" 添加ToDo";
        }
        else{
            var addValue = add.value;
            var doingLi=document.createElement('li');
            doingLi.innerHTML="<input type='checkbox'>"+ '<p>'+addValue+'</p>'+'<button>X</button>';
            doingUl.appendChild(doingLi);
            //清空输入框中的内容
            add.value="";
            init();
        }
    })
    //   因为是动态生成的元素 所以通过事件委托方式完成  原理是事件冒泡
    doingUl.addEventListener('click',function(e){
        // 删除事件
        if(e.target.tagName=='BUTTON'){
            e.target.parentNode.remove();
            init();
        }

        // 选择复选框 调整任务状态
        if(e.target.tagName=='INPUT'){
            change(e.target);
            init();
        }
        })

    endingUl.addEventListener('click',function(e){
        // 删除事件
        if(e.target.tagName=='BUTTON'){
            e.target.parentNode.remove();
            init();
        }

       // 选择复选框 调整任务状态
        if(e.target.tagName=='INPUT'){
            change(e.target);
            init();
        }
    })







    function change(e){
        if(e.checked==false){
            var doingLi = document.createElement('li');
                doingLi.innerHTML=e.parentNode.innerHTML;
                doingUl.appendChild(doingLi);
                var ckb = doingLi.querySelector('input');
                ckb.checked='';
                e.parentNode.remove();
                    init();
            }
            else{
                var endingLi = document.createElement('li');
                endingLi.innerHTML=e.parentNode.innerHTML;
                endingUl.appendChild(endingLi);
                var ckb = endingLi.querySelector('input');
                ckb.checked='checked';
                e.parentNode.remove();
                init();
            }
    }
    // 统计数目


    function totalDoing(){
        var doingLis = doingUl.querySelectorAll('li');
        var doingNum = doingLis.length;
        doingSpan.innerHTML=doingNum;
    }
    function totalEnding(){
        var endingLis = endingUl.querySelectorAll('li');
        var endingNum = endingLis.length;
        endingSpan.innerHTML=endingNum;
    }

}