$(document).ready(function () {
  $(".carousel").carousel();
});

$(".dropdown-trigger").dropdown({
  coverTrigger: false,
  constrainWidth: false,
});

$(document).ready(function () {
  $(".sidenav").sidenav();
});

var imgEl = $("#display-img");
$("#submitBtn").on("click", (e) => {
  e.preventDefault();

  imgEl.empty();
  imagePull();
});

function imagePull() {
  var searchTerm = document.querySelector("#artist-form").value;

  fetch(
    "https://api.artic.edu/api/v1/artworks/search?q=" +
      searchTerm +
      "&query[term][is_public_domain]=true&limit=10&fields=id,title,image_id,alt_image_ids"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response.data[0]);

      var artImg = document.createElement("img");
      var imageUrl =
        "https://www.artic.edu/iiif/2/" +
        response.data[0].image_id +
        "/full/843,/0/default.jpg";
      artImg.setAttribute("src", imageUrl);
      imgEl.append(artImg);
    });
}
