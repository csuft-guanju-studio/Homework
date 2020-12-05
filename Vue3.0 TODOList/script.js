const TODOListApp = Vue.createApp({
    data() {
        return {
            // 存入正在进行的日程
            doingList: [],
            // 存入已完成的日程
            doneList: [],
            // v-model 同步输入框中的数据
            NewTODOData: ""
        };
    },
    computed: {
        // 计算属性,监视两个列表的TODO数量
        doingNumber() {
            return this.doingList.length;
        },
        doneNumber() {
            return this.doneList.length;
        }
    },
    methods: {
        /**
         * addTODO按钮点击事件
         * 功能:
         * 1.按下按钮时,新增todo存入doingList数组
         * 2.当存入空日程时,进行提示'不可以添加空日程'
         * 3.完成功能后清空框内字符
         */
        ClickAddButton() {
            if (this.NewTODOData === "") {
                alert('不可以添加空日程');
                return;
            };
            this.doingList.push(this.NewTODOData);
            this.NewTODOData = "";
        },
        /**
         * input框内按下Enter事件
         * 功能:
         * 1.按下enter时,将新增todo存入doingList数组
         * 2.存入空日程时,进行提示'doingList数组'
         * 3.完成功能后清空框内字符
         */
        clickEnterInInput(event) {
            if (event.key === "Enter") {
                if (this.NewTODOData === "") {
                    alert('不可以添加空日程');
                    return;
                };
                this.doingList.push(this.NewTODOData);
                this.NewTODOData = "";
            };
        },
        /**
         * 创建change-doing-todo事件的响应事件
         *     index 为日程在doingList中的索引
         *     newTodoContent 为修改后的日程
         * 功能:
         *     1.接受doing-list组件传过来的索引和新事件的值
         *     2.修改doingList中相应索引的数据
         */
        changeDoingTODO(index, newTodoContent) {
            this.doingList[index] = newTodoContent;
        },
        /**
         * 创建finish-doing-todo事件的响应事件,
         *     index 为日程在doingList中的索引
         * 功能:
         *     接收doing-list组件传过来的索引并且处理对应的数据
         */
        finishDoingTODO(index) {
            // 将索引对应的日程添加到已完成列表
            this.doneList.push(this.doingList[index]);
            // 将对应的日程从doing列表删除
            this.doingList.splice(index, 1);
        },
        /**
         * 创建delete-done-todo事件的响应事件
         *     index 为日程在doneList中的索引
         * 功能:
         *     接受done-list组件传过来的索引并删除对应的日程
         */
        deleteDoneTODO(index) {
            // 将对应的日程从done列表删除
            this.doneList.splice(index, 1);
        },
    },

});


// 正在进行的日程列表组件
const doingList = TODOListApp.component('doing-list', {
    props: {
        value: String,
        index: Number
    },
    data() {
        return {
            // 控制input框的渲染与否
            show: false,
            // 让input框第一次出现时自动获得焦点
            focusOrNot: 'autofocus',
            // 一个存储input框中修改后的数据的值
            todoContent: this.value,
        }
    },
    methods: {
        /**
         * "完成日程"按钮点击事件方法
         * 功能:
         *     通过$emit方法,将要完成的日程索引传给TODOList应用,在应用中完成功能
         */
        clickFinishButton() {
            this.$emit('finish-doing-todo', this.index);
        },
        /**
         * 点击"日程"事件方法
         * 功能:
         *     修改正在进行的日程时 使input框可见
         */
        clickNowDoingContent() {
            this.show = true;
        },
        /**
         * input框失去焦点事件方法
         * 功能:
         *     1.通过$emit方法,将要修改的日程索引和新日程传给TODOList应用,在应用中完成功能
         *     2.input框失去焦点后隐藏
         */
        blurTheChangeTODOInput() {
            this.$emit('change-doing-todo', this.index, this.todoContent);
            this.show = false;
        },
        /**
         * input框中按下enter事件方法
         * 功能:
         *     1.判断是否按下的为enter
         *     2.通过$emit方法,将要修改的日程索引和新日程传给TODOList应用,在应用中完成功能
         *     3.input框隐藏
         */
        enterInChangeTODOInput(e) {
            if (e.key === "Enter") {
                this.$emit('change-doing-todo', this.index, this.todoContent);
                this.show = false;
            };
        }
    },
    template: `
    <li>
        <input v-if="show" v-model="todoContent" autofocus="focusOrNot" @blur="blurTheChangeTODOInput" @keydown="enterInChangeTODOInput"/>
        <a @click="clickNowDoingContent">{{value}}</a>
        <button @click="clickFinishButton">完成</button>
    </li>
    `
});


// 已经完成的日程列表组件
const doneList = TODOListApp.component('done-list', {
    props: {
        value: String,
        index: Number
    },
    methods: {
        /**
         * 点击"已经完成的日程"事件方法
         * 功能:
         *     通过$emit方法,将要删除的日程索引传给TODOList应用,在应用中完成删除功能
         */
        deleteDoneTODO() {
            this.$emit('delete-done-todo', this.index);
        },
    },
    // .prevent修饰符阻止默认事件
    template: `
        <li>
			<a href="" @click.prevent="deleteDoneTODO" >{{value}}</a>
		</li>
    `
})
const vm = TODOListApp.mount("#TODOList");