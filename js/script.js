
var input = $(".checklist__input");
var template =
    `<div class='checklist__row checklist__row--new'>
      <label class='checklist__label'>
        <input class='checklist__checkbox icon' type='checkbox'> 
      </label>
      <div class='checklist__text'></div>
      <div class='checklist__row--return'>
        <i class='icon icon-ccw'></i>
      </div>
      <div class='checklist__row--remove'>
        <i class='icon icon-cancel'></i>
      </div>
    </div>`;
var item = ".checklist__row";
var activeTab = ".checklist__tabs-item--active";
var button = $(".checklist__button");1

// Загрузка из localStorage
function load() {
  $(".checklist__rows").html(localStorage["checklist"]);
  $(".checklist__row").each(function() {
    if ($(this).hasClass("checklist__row--checked")) {
      $(this).find(".checklist__checkbox").trigger("click");

    }
  })
}
load()

// Сохранение в localStorage
function save() {
  localStorage["checklist"] = $(".checklist__rows").html();
}

// Добавление элемента
function addItem() {
  var checklistArray = input.val().split(",");

  if (input.val() == "") return;
  
  for (var i = 0; i < checklistArray.length; i++) {
    if (checklistArray[i] == " ") continue
    if (checklistArray[i] == "") continue

    $(".checklist__rows").append(template).find(".checklist__row").last().find(".checklist__text").html(checklistArray[i]);
  }
  input.val("");
  $(activeTab).trigger("click");
  save()
}

button.on("click", addItem)

input.on("keydown", function(e) {
  if (e.keyCode == 13) {
    addItem();
  }
})

// REMOVE
$(document).on('click', '.checklist__row--remove', function() {
  var thisRow = $(this).closest(item);

  if (thisRow.hasClass("checklist__row--archive")) {
    thisRow.remove();
  }

  $(this).closest(item).addClass("checklist__row--archive").removeClass("checklist__row--new")
  $(".checklist__tabs-item--active").trigger("click");
  save()
});

// RETURN
$(document).on('click', '.checklist__row--return', function() {
  var thisRow = $(this).closest(item);
  if (thisRow.hasClass("checklist__row--archive")) {
    thisRow.removeClass("checklist__row--archive").addClass("checklist__row--new");
  }
})

// LABEL
$(document).on("click", ".checklist__label", function() {
  var checkbox = $(this).find(".checklist__checkbox");
  
  if (checkbox.is(":checked")) {
    $(this).closest(item).addClass("checklist__row--checked").removeClass("checklist__row--new");
    $(activeTab).trigger("click");
  } else {
    $(this).closest(item).removeClass("checklist__row--checked").addClass("checklist__row--new")
    $(activeTab).trigger("click");
  }
  save()
})

// TABS
$(".checklist__tabs-item").on("click", function() {
  var data = $(this).data("type");

  $(".checklist__tabs-item").removeClass("checklist__tabs-item--active");
  $(this).addClass("checklist__tabs-item--active")
  $(item).hide();
  $(".checklist__row--" + data).show();
  if (data == "all") {
    $(item).show();
  }
})


// TRIGGER
$(activeTab).trigger("click");