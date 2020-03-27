(function (Vue) {

	var STOREGE_KEY = "todo-items";

	//定义localstorege对象
	const itemStorage = {
		//获取本地数据的方法
		fetch:function () {
			//获取数据并且数据反序列化，变成数组对象，如果为空，则是空数组
			return JSON.parse(localStorage.getItem(STOREGE_KEY) || '[]')
		},
		//保存数据到本地，items就是需要保存的数据源,并且以JSON字符串的格式存储
		save:function (items) {
			localStorage.setItem(STOREGE_KEY,JSON.stringify(items))
		},

	};


	var vm = new Vue({
		el: '.todoapp',
		data:{
			// items:[
			// 	{id:1, content:'dddd', completed:false},
			// 	{id:2, content:'aaaa', completed:false},
			// 	{id:3, content:'bbbb', completed:false},
			// 	{id:4, content:'cccc', completed:false},
			// ],
			items: itemStorage.fetch(),
			currentItem:null,
			visibility: "all"
		},
		// 用于自定义指令和钩子 文档：https://cn.vuejs.org/v2/guide/custom-directive.html
		directives:{
			"todo-focus":{
				update(el, binding){
					if(binding.value){
						// 获取焦点
						el.focus()
					}
				}
			}
		},

		//监听器，用于本地化数据的存储，一旦数组对象有变化，立即存储
		watch:{
		//监听items,一旦items发生变化就会执行
			items:{
				deep:true,//需要监听数组对象内部的变化，需要指定deep:true
				handler(newitems,olditems){
					// newitems:新的数组对象
					// olditems：之前的数组对象
					itemStorage.save(newitems)
				}
			},
		},

		computed:{
			// 未完成todo
			incomplete(){
				return this.items.filter(item=>!item.completed).length
			},

			isSelectAll:{
				get: function(){
					return this.incomplete===0;
				},
				set: function(newState){
					this.items.forEach(function (item) {
						item.completed = newState;
					})
				}
			},

			// 不同状态下的数据
			filterItems(){
				switch (this.visibility) {
					case "active":
						return this.items.filter(item=>!item.completed);
						break
					case "completed":
						return this.items.filter(item=>item.completed);
						break
					default:
						return this.items;
						break
				}
			},
		},

		methods:{
			// 添加新todo
			addTodo(event){
				const newValue = event.target.value.trim(); // 后期添加newTodo值
				if(!newValue.length){
					return
				}
				// 创建存入的新对象
				newObject = {
					id: this.items.length+1,
					content: newValue,
					completed: false
				};
				this.items.push(newObject);
				event.target.value=''
			},
			// 移除todo
			removeTodo(index){
				this.items.splice(index, 1)
			},

			// 双击修改todo
			editTodo(item){
				this.currentItem=item;
			},

			// 撤销点击修改
			cancelEdit(){
				this.currentItem=null;
			},

			// 修改保存的数据
			doneEdit(item,index,event){
				const content=event.target.value.trim();
				if(!content){
					this.removeTodo(index)
				}
				item.content = content;
				this.currentItem=null;
			},

			// 清除已经完成的
			removeCompleted(){
				this.items = this.items.filter((item)=>!item.completed)
			},
		},
	});

	//获取路由hash值,并且截取需要的路由，当截取的为空时返回‘all’
	window.onhashchange=function () {
	// window.location.hash  获取的是这样的数据 #/active
		const hash=window.location.hash.substr(2) || 'all';
		//将状态值赋值给vm实例中的visibility
		vm.visibility = hash
	};

	//第一次访问生效，手动调用一次
	window.onhashchange()


})(Vue);
