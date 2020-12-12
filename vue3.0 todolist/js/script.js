
const toDoListApp = Vue.createApp({
    data() {
        return {
            // 放的是正在进行的任务
            doingList: [],
            //放的是已经完成的任务
            endingList: [],
            Data: " 添加ToDo",
        };
    },
    computed: {
        doingNumber() {
            return this.doingList.length;
        },
        endingNumber() {
            return this.endingList.length;
        }
    },
    methods: {
        /* 
            添加事件  按下回车后将输入框中的内容存入doinglist中
        */
       keyDownEnter(e) {
        if (e.key === "Enter") {
            if (this.Data === "") {
                alert('请输入内容！');
            }
            else {
                this.doingList.push(this.Data);
                this.Data = "";
            }
        }
       },
       /* 
            添加事件   失去焦点时将输入框中的内容存入doingList中
        */
       blurInput() {
        if(this.Data===""){
            this.Data=" 添加ToDo";
        }
        else{
            this.doingList.push(this.Data);
            //清空输入框中的内容
            this.Data="";
        }
       },
       /* 
            添加事件     获得焦点时将输入框中的内容清空以方便用户输入

       */
      clickInput() {
            this.Data="";
      },
      //*************主组件事件完***************

      /* 
            创建delete-doing的响应事件
            接收传来的index值  将其移除
      */
      deleteDoing(index) {
          this.doingList.splice(index,1);
      },

      /* 
            创建change-doing-or-ending的响应事件
            如果为选中状态 放到ending中
            如果为未选中状态 放到doing中
      */
     changeDoingOrEnding(check,index){
         if(check) {    //选中状态
            this.endingList.push(this.doingList[index]);
            this.doingList.splice(index,1);
         }
         else {
             this.doingList.push(this.endingList[index]);
             this.endingList.splice(index,1);
         }
     },

     /* 
            创建delete-ending的响应事件
            接受传来的index  将其从endingList中移除
     */
    deleteEnding(index) {
        this.endingList.splice(index,1);
    },
    },
});
const doingApp = toDoListApp.component('doing-app',{
    props: {
        value: String,
        index: Number
    },
    data() {
        return{
            check: false
        };
    },
    methods: {
        /* 
            删除事件  点击button按钮时将任务的index传给父组件 让父组件调用deleteDoing方法将其移除
            通过$emit方法向父组件传值
       */
        clickButton() {
            this.$emit('deleteDoing',this.index);
        },
        clickCheckbox() {
            this.check=true;
            this.$emit('changeDoingOrEnding',this.check,this.index);
        }
    },

    // 通过.prevent修饰符 阻止默认行为
    template: `     
    <li>    
        <input type='checkbox' @click.prevent='clickCheckbox' :checked='check'>
        <p>{{value}}</p>
        <button @click='clickButton'>X</button>
    </li>
    `
});

const endingApp = toDoListApp.component('ending-app',{
    props: {
        value: String,
        index: Number
    },
    data() {
        return{
            check: true
        };
    },
    methods: {
        /* 
            删除事件  点击button按钮时将任务的index传给父组件 让父组件调用deleteEnding方法将其移除
            通过$emit方法向父组件传值
       */
        clickButton() {
            this.$emit('deleteEnding',this.index);
        },
        clickCheckbox() {
            this.check=false;
            this.$emit('changeDoingOrEnding',this.check,this.index);
        }
    },

    // 通过.prevent修饰符 阻止默认行为
    template: `     
    <li>    
        <input type='checkbox' @click.prevent='clickCheckbox' :checked='check'>
        <p>{{value}}</p>
        <button @click='clickButton'>X</button>
    </li>
    `
});

const vm = toDoListApp.mount("#todolist");
