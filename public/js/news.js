$.getJSON("/news", function (news) {
    for (var i = 0; i < news.length; i++) {
        var dropNum = 0;
        dropNum++;
        $("#articlesDiv").append("<li class='collection-item avatar'> <img src='https://picsum.photos/200/300/?random' alt='" +
            news[i].title + "' class='circle'> <a href='" +
            news[i].link + "'><h4 class='title'> " +
            news[i].title + "</h4></a> <p>" +
            news[i].story + "</p> <a id='commentadd' data-id='" +
            news[i]._id + "' href='#modal1' class='waves-effect waves-light btn modal-trigger'>" +
            "<i class='material-icons'>comment</i></a>" +
            "<a class='dropdown-trigger btn' id='showCom' data-id='" +
            news[i]._id + "' data-target='dropdown1'>View Comments</a>" +
            "<ul id='dropdown1' class='dropdown-content'></ul></li>");
    }
});

// <!-- Dropdown Trigger -->
//   <a class='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>

//   <!-- Dropdown Structure -->
//   <ul id='dropdown1' class='dropdown-content'>
//     <li><a href="#!">one</a></li>
//     <li><a href="#!">two</a></li>
//     <li class="divider" tabindex="-1"></li>
//     <li><a href="#!">three</a></li>
//     <li><a href="#!"><i class="material-icons">view_module</i>four</a></li>
//     <li><a href="#!"><i class="material-icons">cloud</i>five</a></li>
//   </ul>

$(document).ready(function () {
    $('.modal').modal();
    $('.dropdown-trigger').dropdown();
});

$(document).on("click", "#showCom", function () {

    var Id = $(this).attr("data-id");
        console.log(Id);
    $.ajax({
        method: "GET",
        url: "/article/" + Id
    }).then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            $("#dropdown1").append("<li class='comment'>" + data[i].comment + "</li>");
        }
    });
});

$(document).on("click", "#commentadd", function () {

    $("#commentText").empty();

    var Id = $(this).attr("data-id");
        
    $("#modal1").on("click", "#submitbtn", function (Id) {
        $.ajax({
                method: "POST",
                url: "/article/" + Id,
                data: {
                    comm: $("#commentArea").val(),
                    artId: $("#commentadd").attr("data-id")
                }
            })
            .then(function (data) {
                console.log(data);
            });
        $("#commentArea").val("");

    });

});
// <li class="collection-item avatar">                                                                                                                                                                                                      
//     <img src="images/yuna.jpg" alt="" class="circle">
//     <span class="title">Title</span>
//     <p>First Line <br>
//        Second Line
//     </p>
//     <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
//   </li>