const sreenHeight = window.screen.height;
console.log(sreenHeight);
$(".tv_content").height(sreenHeight - 305);

function getYearBasedOnMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다

  // 1월부터 3월까지는 작년 년도를 반환
  if (currentMonth >= 1 && currentMonth <= 3) {
    return currentYear - 1;
  } else {
    // 4월부터 12월까지는 현재 년도를 반환
    return currentYear;
  }
}

var base_year = getYearBasedOnMonth();

for (var i = 0; i < 5; i++) {
  var year = base_year - (4 - i);

  $("#search_year" + i).val(year + "");
  $("#search_year_label" + i).text(year + "年");
}

var last_date = new Date();

function refreshScreen() {
  var cur_date = new Date();

  var diff = Math.floor((cur_date - last_date) / 1000);
  var min = Math.floor((300 - diff) / 60);
  var sec = (300 - diff) % 60;
  $("#refresh_time").text(min + ":" + sec.toString().padStart(2, "0"));

  // 년, 월, 일, 요일 정보를 추출합니다.
  var year = last_date.getFullYear();
  var month = last_date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  var day = last_date.getDate();
  var dayOfWeek = last_date.toLocaleDateString("ko-KR", { weekday: "long" });

  // 포맷에 맞게 문자열을 구성합니다.
  var formattedDate =
    "기준일 : " + year + "년 " + month + "월 " + day + "일 (" + dayOfWeek + ")";

  $("#cur_date").text(formattedDate);

  if (diff >= 300) {
    last_date = cur_date;
    callData();
  }
}

setInterval(refreshScreen, 1000);

$("#search").on("click", function () {
  last_date = new Date();
  callData();
});

callData();

var data_list = null;
var chart_list = null;
var total_amount = 0;
var total_rate = 0;

function callData() {
  if ($("#LOADYN").val() == "Y") {
    $.isLoading({
      tpl: '<span class="isloading-wrapper %wrapper%"><div class="loadingio-spinner-ellipsis-bus78131cg"><div class="ldio-8a4hfl22cb6"><div></div><div></div><div></div><div></div><div></div></div></div></span>',
    });
  }

  //get data
  var dataPost = {};
  dataPost.type = "get_data";
  dataPost.menucode = "M000000864";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.search_type = $('input[name="search_type"]:checked').val();
  dataPost.search_year = $('input[name="search_year"]:checked').val();
  dataPost.search_month04 = $("#search_month04").is(":checked") ? "Y" : "N";
  dataPost.search_month05 = $("#search_month05").is(":checked") ? "Y" : "N";
  dataPost.search_month06 = $("#search_month06").is(":checked") ? "Y" : "N";
  dataPost.search_month07 = $("#search_month07").is(":checked") ? "Y" : "N";
  dataPost.search_month08 = $("#search_month08").is(":checked") ? "Y" : "N";
  dataPost.search_month09 = $("#search_month09").is(":checked") ? "Y" : "N";
  dataPost.search_month10 = $("#search_month10").is(":checked") ? "Y" : "N";
  dataPost.search_month11 = $("#search_month11").is(":checked") ? "Y" : "N";
  dataPost.search_month12 = $("#search_month12").is(":checked") ? "Y" : "N";
  dataPost.search_month01 = $("#search_month01").is(":checked") ? "Y" : "N";
  dataPost.search_month02 = $("#search_month02").is(":checked") ? "Y" : "N";
  dataPost.search_month03 = $("#search_month03").is(":checked") ? "Y" : "N";

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
        if (response.status == 200) {
          data_list = response.data_list;
          chart_list = response.chart_list;

          var search_type = $('input[name="search_type"]:checked').val();
          if (search_type == "sale") {
            $("#total_title").text("매출");
          } else if (search_type == "buy") {
            $("#total_title").text("사입");
          } else {
            $("#total_title").text("재고");
          }

          total_amount = 0;
          total_rate = 0;
          if (data_list.length > 0) {
            total_amount = Number(
              data_list[data_list.length - 1]["cur_amount"]
            );
            total_rate = Number(data_list[data_list.length - 1]["cur_rate"]);
          }

          $("#total_amount").text(total_amount.toLocaleString());
          $("#total_rate").text(total_rate + "%");

          $(".list_row").remove();

          console.log(data_list);

          for (var i = 0; i < data_list.length; i++) {
            var item = data_list[i];
            var txt = "";
            if (i == data_list.length - 1) {
              txt += `<tr class="list_row">`;
              txt += `    <td class="al cell_yellow">${item.etc5}</td>`;
              txt += `    <td class="ac cell_yellow"></td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_qty == 0 ? "" : Number(item.prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_amount == 0
                  ? ""
                  : Number(item.prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.plan_qty == 0 ? "" : Number(item.plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.plan_amount == 0
                  ? ""
                  : Number(item.plan_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_qty == 0 ? "" : Number(item.cur_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_amount == 0
                  ? ""
                  : Number(item.cur_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_rate == 0 ? "" : item.cur_rate + "%"
              }</td>`;
              txt += `    <td class="ar cell_yellow ${
                item.diff_prev_qty < 0 ? "text_red" : ""
              }">${
                item.diff_prev_qty == 0
                  ? ""
                  : Number(item.diff_prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow ${
                item.diff_prev_amount < 0 ? "text_red" : ""
              }">${
                item.diff_prev_amount == 0
                  ? ""
                  : Number(item.diff_prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow ${
                item.diff_plan_qty < 0 ? "text_red" : ""
              }">${
                item.diff_plan_qty == 0
                  ? ""
                  : Number(item.diff_plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow ${
                item.diff_plan_amount < 0 ? "text_red" : ""
              }">${
                item.diff_plan_amount == 0
                  ? ""
                  : Number(item.diff_plan_amount).toLocaleString()
              }</td>`;
              txt += `</tr>`;
            } else if (nvl(item.sales_cd, "") == "") {
              txt += `<tr class="list_row">`;
              txt += `    <td class="al">${item.etc5}</td>`;
              txt += `    <td class="ac btn_toggle" data-id="${item.etc5}">┼</td>`;
              txt += `    <td class="ar">${
                item.prev_qty == 0 ? "" : Number(item.prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.prev_amount == 0
                  ? ""
                  : Number(item.prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.plan_qty == 0 ? "" : Number(item.plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.plan_amount == 0
                  ? ""
                  : Number(item.plan_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_qty == 0 ? "" : Number(item.cur_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_amount == 0
                  ? ""
                  : Number(item.cur_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.cur_rate == 0 ? "" : item.cur_rate + "%"
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_prev_qty < 0 ? "text_red" : ""
              }">${
                item.diff_prev_qty == 0
                  ? ""
                  : Number(item.diff_prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_prev_amount < 0 ? "text_red" : ""
              }">${
                item.diff_prev_amount == 0
                  ? ""
                  : Number(item.diff_prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_plan_qty < 0 ? "text_red" : ""
              }">${
                item.diff_plan_qty == 0
                  ? ""
                  : Number(item.diff_plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_plan_amount < 0 ? "text_red" : ""
              }">${
                item.diff_plan_amount == 0
                  ? ""
                  : Number(item.diff_plan_amount).toLocaleString()
              }</td>`;
              txt += `</tr>`;
            } else {
              txt += `<tr class="list_row" data-parent="${item.etc5}" style="display:none;">`;
              txt += `    <td class="al cell_yellow">${item.sales_cd}</td>`;
              txt += `    <td class="ac"></td>`;
              txt += `    <td class="ar">${
                item.prev_qty == 0 ? "" : Number(item.prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.prev_qty == 0 ? "" : Number(item.plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.plan_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.prev_qty == 0 ? "" : Number(item.cur_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.cur_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_red">${item.cur_rate}%</td>`;
              txt += `    <td class="ar ${
                item.diff_prev_qty < 0 ? "text_red" : ""
              }">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.diff_prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_prev_amount < 0 ? "text_red" : ""
              }">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.diff_prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_plan_qty < 0 ? "text_red" : ""
              }">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.diff_plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_plan_amount < 0 ? "text_red" : ""
              }">${
                item.prev_qty == 0
                  ? ""
                  : Number(item.diff_plan_amount).toLocaleString()
              }</td>`;
              txt += `</tr>`;
            }

            var tr = $(txt);
            $("#list").append(tr);
          }

          $(".btn_toggle").on("click", function () {
            if ($(this).text() == "┼") {
              $(this).text("─");

              var parent = $(this).attr("data-id");
              $(`tr[data-parent="${parent}"]`).show();
            } else {
              $(this).text("┼");
              var parent = $(this).attr("data-id");
              $(`tr[data-parent="${parent}"]`).hide();
            }
          });
        }
      }

      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
  });
}
