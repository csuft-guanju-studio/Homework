/*
 *用来提交查询信息的组件
 */
const InputForm = {
    template:`
    <div>
        <input type="text" v-model="introduce" placeholder="输入待办事项">
        <input type="date" v-model="deadLine">
        <select v-model="importance" >
            <option value ="普通">普通</option>
            <option value ="重要">重要</option>
        </select>

        <input type="button" @click="inputBtn" value="提交">
    </div>
    `,
    data(){
        return{
            introduce:"",
            deadLine:"",
            importance:""
        }
    },
    methods:{

       /*
        *得到“yyyy-mm-dd”格式的字符型当前日期
        *@return {string} - “yyyy-mm-dd”格式的字符型当前日期
        */
        getNowDate (){
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
        },
     
    
        /*
         *提交按钮点击事件，将用户提交的表单信息提交给父组件
         *@param {string} introduce - 对事项的简要描述。
         *@param {string} deadLine - 事项的截止日期。
         *@param {string} importance - 事项的重要性。
         */
        inputBtn(){
            if(this.introduce && this.importance && this.deadLine){
                let nowTime = this.getNowDate();
                 //“yyyy-mm-dd”格式的字符串可以直接比较日期大小，截止日期一定是今天或今天之后的日期，故做检查
                if(this.deadLine<nowTime){
                    alert("不能设置过去的时间！");
                }else{
                    this.$emit('onInput',this.introduce,this.deadLine,this.importance);
                    this.introduce="";
                }
            }else{
                alert("有未填好的项目！");
            }
        }
    }
}

/*
 *展示应该要做的事情表格，包含一个按顺序排序的按钮
 */
const TODOSection = {
    template:`
    <div>
        <h2>
            待完成
            <span> {{toDoNum}} </span>
        </h2>
    <table>
        <thead>
            <tr>
                <th>描述</th>
                <th>截止日期</th>
                <th>重要性</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in TODOArray">
                <td> {{item.introduce}} </td>
                <td> {{item.deadLine}} </td>
                <td> {{item.importance}} </td>
                <td>
                    <input type="button" value="删除" @click="delBtn(item)">
                    <input type="button" value="完成" @click="finishBtn(item)">
                    <input type="button" value="修改" @click="changeBtn(item)">
                </td>
            </tr>
        </tbody>
    </table>

<div>
        <input type="button" @click="sortByBtn" :value="criterion">
</div>

</div>
    `,
    props:{
        //待完成的任务数组
        TODOArray:{
            type: Array,
        },
        //排序判断的依据
        criterion:{
            type: String
        }
    },
    computed:{
        //待完成的任务数目
        toDoNum:function(){
            return this.TODOArray.length;
        }
    },
    methods:{
        /*
         *点击后，请求父组件把相应的项删除
         *@param {Object} item - TODOArray中的某一项
         */
        delBtn(item){
            this.$emit('onDelete',item);
        },

        /*
         *点击后，请求父组件完成相应的项
         *@param {Object} item - TODOArray中的某一项
         */
        finishBtn(item){
            this.$emit('onFinish',item);
        },
        /*
         *点击后，请求父组件修改相应的项
         *@param {Object} item - TODOArray中的某一项
         */
        changeBtn(item){
            this.$emit('onChange',item);
        },
        /*
         *点击后，根据criterion对TODOArray进行排序，向父组件发出请求
         */
        sortByBtn(){
            this.$emit('onSort',this.criterion);
        },
        
    }


}

/*
 *展示已经完成过的任务
 */
const FinishSection = {
    template:`
    <div>
        <h2>
            已完成
            <span> {{finishNum}} </span>
        </h2>
    <table id="finishDolist">
        <thead>
            <tr>
                <th>描述</th>
                <th>截止日期</th>
                <th>重要性</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in FinishArray">
                <td> {{item.introduce}} </td>
                <td> {{item.deadLine}} </td>
                <td> {{item.importance}} </td>
            </tr>
        </tbody>
    </table>
    </div>
    `,
    props:{
        FinishArray:{
            type: Array,
        },
    },
    computed:{
        //已经完成的任务数
        finishNum:function(){
            return this.FinishArray.length;
        }
    }
}

const TODOListApp = Vue.createApp({
    components:{
        InputForm:InputForm,
        TODOSection:TODOSection,
        FinishSection:FinishSection
    },
    template:`
    <h1>TODOList</h1>

    <InputForm 
    @onInput="(introduce,deadLine,importance)=>appendTODOArray(introduce,deadLine,importance)"/>

    <TODOSection :TODOArray="TODOArray" :criterion="criterion" @onDelete="item=>itemDelete(item)" 
    @onChange="item=>itemChange(item)" @onFinish="item=>itemFinish(item)" 
    @onSort="TODOArraySort(true)"/>

    <FinishSection :FinishArray="FinishArray"/>
    `,
    data(){
        return{
            //记录待完成事项的数组
            TODOArray:[],
            //记录已完成事项的数组
            FinishArray:[],
            //将重要性从文字转换为数字，方便后边的比较函数比较
            importanceMap:new Map(),
            //排序的依据，只有两种情况:"按截止日期排序"和"按重要性排序",初始为"按截止日期排序"
            criterion:"按截止日期排序"
        }
    },
    methods:{
        /*
         *由从InputForm组件中传来的值形成一个对象，追加到TODOArray中去
         *@param {string} introduce - 对事项的简要描述。
         *@param {string} deadLine - 事项的截止日期。
         *@param {string} importance - 事项的重要性。
         */
        appendTODOArray(introduce,deadLine,importance){
            let newThing = {
                "introduce":introduce,
                "deadLine":deadLine,
                "importance":importance
            }
            this.TODOArray.push(newThing);
            //重新排序
            this.TODOArraySort(false);
        },
        /*
         *在TODOArray中把相应的项删除
         *@param {Object} item - TODOArray中的某一项
         */
        itemDelete(item){
            this.TODOArray=this.TODOArray.filter(val=>{
                return(val!==item)
            });
            //重新排序
            this.TODOArraySort(false);
        },
        /*
         *先把这项加入FinishArray,再在TODOArray中把相应的项删除。
         *@param {Object} item - TODOArray中的某一项
         */
        itemFinish(item){
            this.FinishArray.push(item);
            this.itemDelete(item);
            //重新排序
            this.TODOArraySort(false);
        },
        /*
         *弹窗修改TODOArrat中相应项的introdu属性
         *@param {Object} item - TODOArray中的某一项
         */
        itemChange(item){
            let newValue = prompt("请重新输入您的事件描述",item.introduce);
            while(!newValue){
                alert("不可以输入空的事件描述");
                newValue = prompt("请重新输入您的事件描述",item.introduce);
            }
            this.TODOArray.forEach(val => {
                if(val===item){
                    val.introduce=newValue;
                }
            });
        },
        /*
         *对TODOArrat重新排序
         *@param {boolean} fromSortBtn - 排序请求是否来自子组件的sortBtn，两者的区别是:
         *来自sortBtn的排序请求要先修改criterion，而来自内部调用的不需要
         */
        TODOArraySort(fromSortBtn){
            if(fromSortBtn){
                //把criterion的值修改成相反的
                if(this.criterion=="按截止日期排序"){
                    this.criterion = "按重要性排序";
                }else if(this.criterion == "按重要性排序"){
                    this.criterion="按截止日期排序"
                }
            }

            if(this.criterion=="按截止日期排序"){
                this.TODOArray.sort(this.sortByTime);
            }else if(this.criterion=="按重要性排序"){
                this.TODOArray.sort(this.sortByImportance);
            }

            
        },
        /*
         *TODOArray用的排序函数，按截止日期排序
         */
        sortByTime(s1,s2){
            if (s1.deadLine < s2.deadLine) {
                return -1;
            }
            if (s1.deadLine > s2.deadLine) {
                return 1;
            }
            if(s1.deadLine == s2.deadLine){
                let importanceS1 = this.importanceMap.get(s1.importance);
                let importanceS2 = this.importanceMap.get(s2.importance);
                if(importanceS1 < importanceS2)
                    return 1;
                if(importanceS1 > importanceS2)
                    return -1;
                if(importanceS2 == importanceS1)
                    return 0;
            }
        },
        /*
         *TODOArray用的排序函数，按重要性排序
         */
        sortByImportance(s1,s2){
            let importanceS1 = this.importanceMap.get(s1.importance);
            let importanceS2 = this.importanceMap.get(s2.importance);
            if(importanceS1 < importanceS2)
                    return 1;
            if(importanceS1 > importanceS2)
                    return -1;
            if(importanceS2 == importanceS1){
                if (s1.deadLine < s2.deadLine) {
                    return -1;
                }
                if (s1.deadLine > s2.deadLine) {
                    return 1;
                }
                if(s1.deadLine == s2.deadLine){
                    return 0;
                }
            }
                    
        },
        /*
         *将importanceMap的值初始化
         */
        setImportanceMap(){
            this.importanceMap.set("重要",1);
            this.importanceMap.set("普通",0);
        }


    },
    mounted() {
        this.setImportanceMap();
    },
});

const vm = TODOListApp.mount("#TODOListApp");