// Defining some variables

const img_height = 250;
const img_width = 250;
const num_questions = 6;
const res_img_width = 350;
const res_img_height = 350;
let outcomes;

// Generate HTML by reading JSON file
$(function () {
  $.getJSON("data.json", function (data) {
    $.each(data.questions, function (idx, question) {
      $(".questions").append(
        `<div class= "question_item">
            <div class= "question_title" ><h2>${question.text}</h2></div>
            <div class="question_answers ${question.question_name}">
            </div>
          </div>`
      );
      $.each(question.answers, function (idx, answer) {
        let group_id = Math.floor(idx / 3);
        let q_group_id = question.question_name + group_id;
        if (idx % 3 == 0) {
          $(`.question_answers.${question.question_name}`).append(
            `<div class= "question_answer_group" id="${q_group_id}"></div>`
          );
        }
        $(`#${q_group_id}`).append(
          `<div class="question_answer_item ${question.question_name}">
              <input type="radio" name="${question.question_name}" value="${answer.outcome}" />
              <div class="question_answer_image">
                <img src="${answer.img_url}" height="${img_height}" width="${img_width}}" />
              </div>
              <div class="question_answer_text">
                <p>${answer.text}</p>
              </div>
            </div>`
        );
      });
    });
    outcomes = data.outcomes;
  });
});

// On Answer click, select the current answer and mark all other answers for the relevant question as not selected

$(".questions").on(
  "click",
  ".question_answer_item:not(.selected)",
  function () {
    let radio_button = $(this).children("input");
    radio_button.prop("checked", true);

    const name = radio_button.prop("name");

    $(".question_answer_item." + name).removeClass("selected");
    $(".question_answer_item." + name).addClass("not_selected");
    $(this).removeClass("not_selected");
    $(this).addClass("selected");
  }
);

// Compute Answers when the 'Getr Results' button is pressed (based on code given on cs52 website)

$("#results_button").on("click", function (e) {
  // Check that all questions have been answered
  if ($(".selected").length < num_questions) {
    alert("Please answer all the questions");
    return;
  }
  $("#results_button").hide();

  // gather all checked radio-button values
  var choices = $("input[type='radio']:checked")
    .map(function (i, radio) {
      return $(radio).val().split(",");
    })
    .toArray();

  // Calculate the mode of the choices array
  // code taken from https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
  b = {};
  (result = ""), (maxi = 0);
  for (let k of choices) {
    if (b[k]) b[k]++;
    else b[k] = 1;
    if (maxi < b[k]) {
      result = k;
      maxi = b[k];
    }
  }

  let outcome = outcomes["outcome" + result];
  $(".final_result").append(
    `<img src=${outcome.img} alt=${outcome.img} width=${res_img_width}, height=${res_img_height}>`
  );
  $(".result_text").append(outcome.text);

  document.querySelector(".final_result").scrollIntoView({
    behavior: "smooth",
  });
});
