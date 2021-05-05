$(".dropdown-trigger").dropdown({
  coverTrigger: false,
  constrainWidth: false,
  closeOnClick: false,
});



$(document).ready(function () {
  $(".collapsible").collapsible();
  $(".sidenav").sidenav();
  $('.carousel').carousel(
    //{fullWidth: true},
    //{noWrap: true}
  );

  $(".modal").modal({
    onCloseEnd: function () {
      $("#fav-btn").off("click");
      $('.materialboxed').materialbox();
    },
  });
});



$("#color-btn").on("click", function () {
  const rgb = $("#color").val();
  const hue = hexToHue(rgb);

  searchByHue(hue).then(function (artwork) {
    if (!artwork) {
      //toast
    } else {
      showModal(artwork);
    }
  });
});

$("#artist-btn").on("click", function () {
  const artist = $("#artist").val().toLowerCase();

  searchByArtist(artist).then(function (artwork) {
    if (!artwork) {
      //toast
    } else {
      showModal(artwork);
    }
  });
});

$("#keyword-btn").on("click", function () {
  const keyword = $("#keyword").val();

  searchByKeyword(keyword).then(function (artwork) {
    if (!artwork) {
      //toast
    } else {
      showModal(artwork);
    }
  });
});

$("#random-btn").on("click", function () {
  getRandom().then(function (artwork) {
    if (!artwork) {
      //toast
    } else {
      showModal(artwork);
    }
  });
});

const showModal = function (artwork) {
  // If time Populate modal should show loading indicators for the wikipedia information

  const modal = $("#modal");
  modal.find("h4").text(artwork.title);
  modal.find("span").text(artwork.artist);
  modal.find("img").addClass("materialboxed").attr("src", artwork.imageUrl);

  findWikiPage(artwork.title, artwork.artist).then(function (summary) {
    modal.find("p").text(summary);
  });

  if (isFavorited(artwork)) {
    modal.find("#fav-btn").text("Unfavorite");
  } else {
    modal.find("#fav-btn").text("Favorite");
  }

  modal.find("#fav-btn").on("click", function () {
    toggleFavorite(artwork);
  });

  $(".modal").modal("open");
};

const hexToHue = function (hex) {
  const red = parseInt("0x" + hex.slice(1, 3));
  const green = parseInt("0x" + hex.slice(3, 5));
  const blue = parseInt("0x" + hex.slice(5, 7));

  const hsl = rgbToHsl(red, green, blue);

  return Math.floor(hsl.h);
};

/*from https://www.w3schools.com/lib/w3color.js */
function rgbToHsl(r, g, b) {
  var min,
    max,
    i,
    l,
    s,
    maxcolor,
    h,
    rgb = [];
  rgb[0] = r / 255;
  rgb[1] = g / 255;
  rgb[2] = b / 255;
  min = rgb[0];
  max = rgb[0];
  maxcolor = 0;
  for (i = 0; i < rgb.length - 1; i++) {
    if (rgb[i + 1] <= min) {
      min = rgb[i + 1];
    }
    if (rgb[i + 1] >= max) {
      max = rgb[i + 1];
      maxcolor = i + 1;
    }
  }
  if (maxcolor == 0) {
    h = (rgb[1] - rgb[2]) / (max - min);
  }
  if (maxcolor == 1) {
    h = 2 + (rgb[2] - rgb[0]) / (max - min);
  }
  if (maxcolor == 2) {
    h = 4 + (rgb[0] - rgb[1]) / (max - min);
  }
  if (isNaN(h)) {
    h = 0;
  }
  h = h * 60;
  if (h < 0) {
    h = h + 360;
  }
  l = (min + max) / 2;
  if (min == max) {
    s = 0;
  } else {
    if (l < 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }
  }
  s = s;
  return { h: h, s: s, l: l };
}

displayFavorites();
