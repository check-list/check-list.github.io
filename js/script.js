var doc = $(document);
var input = $(".js-todolist-input");
var rows = $(".js-todolist-rows");
var tab = $(".js-todolist-tab-item");
var tasks = [];
var button = {
	add: $(".js-todolist-add"),
	mark: ".js-todolist-checkbox",
	remove: ".js-todolist-row-remove",
	return: ".js-todolist-row-return"
}
var classes = {
	row: "todolist__row",
	checked: "todolist__row--checked",
	archive: "todolist__row--archive",
	active: "todolist__tab-item--active"

}
var template = `
		<div class="todolist__row">
	      	<label class="todolist__label">
	        	<input class="todolist__checkbox js-todolist-checkbox" type="checkbox">
	      	</label>
	      	<div class="todolist__text"></div>
	      	<div class="todolist__row--return js-todolist-row-return"><i class="fal fa-undo"></i></div>
	      	<div class="todolist__row--remove js-todolist-row-remove"><i class="fal fa-times"></i></div>
    	</div>`;

var toDoList;

// DB localStorage

var database = {
	save: (array, db) => {
		localStorage[db] = JSON.stringify(window[array]);
	},
	load: (array, db) => {
		window[array] = JSON.parse(localStorage[db]);
	},
}

function trim(value) {
	return value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

function Task(text) {
	this.text = text;
	this.status = ["new"];
}

function ToDoList() {
	this.add = (array, item) => {
		array.push(item);
	}
	this.remove = (array, index) => {
		array = array.splice(index, 1);
	}
	this.changeStatus = (array, index, status) => {
		var pos = array[index].status.indexOf(status);

		if(pos == -1) {
			array[index].status.push(status);
		} else {
			array[index].status.splice(pos, 1);
		}
	}
	this.render = (el, array, temp) => {
		el.empty();

		function getClasses(prefix, index) {
			var result = "";

			array[index].status.forEach(status => {
				result += prefix + status + " ";
			})

			return result;
		}
 
		array.forEach((item, index) => {
			el.append(temp)
			.find("." + classes.row)
			.last()
			.addClass(getClasses("todolist__row--", index))
			.find(".todolist__text")
			.last()
			.html(item.text);
		})
	}
	this.template = template;
}

function addTask() {
	if(input.val() == "" || input.val() == " " || trim(input.val()).length == 0) return;

	var split = input.val().split(",");

	split.forEach(item => toDoList.add(tasks, new Task(trim(item))));
	database.save("tasks", "todolist");
	database.load("tasks", "todolist");
	toDoList.render(rows, tasks, toDoList.template);
	input.val("");
}

function clickActiveTab() {
	$("." + classes.active).click();
}

function init() {
	toDoList = new ToDoList();
	database.load("tasks", "todolist");
	toDoList.render(rows, tasks, toDoList.template);
}

// ADD KEYDOWN

doc.on("keydown", e => { e.keyCode == 13 && addTask() });

// ADD BUTTON

button.add.on("click", addTask);

// MARK

rows.on("click", button.mark, e => {
	var $this = $(e.target);
	var $row = $this.closest("." + classes.row);
	var $index = $row.index();

	toDoList.changeStatus(tasks, $index, "checked");
	database.save("tasks", "todolist");
	database.load("tasks", "todolist");
	toDoList.render(rows, tasks, toDoList.template);
	clickActiveTab();
})

// REMOVE

rows.on("click", button.remove, e => {
	var $this = $(e.target);
	var $row = $this.closest("." + classes.row);
	var $index = $row.index();

	if(tasks[$index].status.indexOf("archive") == -1) {
		toDoList.changeStatus(tasks, $index, "archive");
	} else {
		toDoList.remove(tasks, $index);
	}
	database.save("tasks", "todolist");
	database.load("tasks", "todolist");
	toDoList.render(rows, tasks, toDoList.template);
	clickActiveTab();
})

// RETURN

rows.on("click", button.return, e => {
	var $this = $(e.target);
	var $row = $this.closest("." + classes.row);
	var $index = $row.index();

	toDoList.changeStatus(tasks, $index, "archive");
	database.save("tasks", "todolist");
	database.load("tasks" , "todolist");
	toDoList.render(rows, tasks, toDoList.template);
	clickActiveTab();
})

// TAB

tab.on("click", e => {
	var $this = $(e.target);
	var status = $this.data("status");
	var prefix = "todolist__row--";
	var $row = rows.find("." + classes.row);

	tab.removeClass(classes.active);
	$this.addClass(classes.active);

	$row.hide();

	switch(status) {
		case "all":
			$row.show();
			break;
		case "archive":
			rows.find("." + classes.archive).show();
			break;
		case "new":
			$row.each((index, item)=>{
				var $item = $(item);

				if(!$item.hasClass(classes.checked) && !$item.hasClass(classes.archive)) {
					$item.show();
				}
			})
			break;
	}
})

init();