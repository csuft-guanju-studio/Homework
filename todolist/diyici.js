window.onload = function() {
    var oUl = document.querySelector('#list');
    var jilu = document.querySelector('#jilu');
    jilu.onkeydown = function(e) {
        if (e.keyCode == 13) {
            var val = jilu.value;
            if (val) {
                var oLi = document.createElement('li');
                oLi.innerHTML = val + '<span>×</span>';
                oUl.append(oLi);
                jilu.value = '';
            }
        }
    }
    oUl.onclick = function(e) {
        //console.log(e.target) 
        oUl.removeChild(e.target.parentNode);
    }
    jilu.onkeyup = function(e) {
        var lis = document.querySelectorAll('#list li');
        if (lis) {
            for (var i = 0; i < lis.length; i++) {
                var liText = lis[i].innerText;
                var val = jilu.value;
                for (var j = 0; j < val.length; j++) {
                    if (liText.indexOf(val[j]) !== -1) {
                        oUl.prepend(lis[i]);
                        lis[i].style.backgroundColor = '#fff';
                    }
                }
            }
        }
        if (e.keyCode == 13) {
            for (var i = 0; i < lis.length; i++) {
                lis[i].style.backgroundColor = '#fff';
            }
        }
    }
}