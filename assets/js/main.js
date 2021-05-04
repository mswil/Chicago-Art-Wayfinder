const imgEl = $("#display-img");
// wikipedia Api call
const searchWikiAPIUrl =
  "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=";

const getWikiPageAPIUrl =
  "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&formatversion=2&origin=*&page=";
const getWikiPageSummaryAPIUrl =
  "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&pageids=";

let artName;
let artist;

$(document).ready(main);

$(".dropdown-trigger").dropdown({
  coverTrigger: false,
  constrainWidth: false,
  closeOnClick: false
});

$("#submitBtn").on("click", (e) => {
  e.preventDefault();

  imgEl.empty();
  imagePull();

  // findWikiPage(artName, artist).then(function (wikiPage) {
  //   if (!wikiPage) {
  //     wikiPage = "No Information Available";
  //   }
  //   console.log(this);
  //   //Stuff summary into page element
  // });
});

function main() {
  $('.collapsible').collapsible();
  $(".sidenav").sidenav();
  $(".carousel").carousel();
  $('.modal').modal({
    onCloseEnd: function () {
      $("#fav-btn").off("click");
    }
  });
}

function saveFavorite(artwork) {
  var savedFavorites = loadFavorite();
  savedFavorites.push(artwork);
  localStorage.setItem("favoriteArt", JSON.stringify(savedFavorites));
}

function loadFavorite() {
  var savedFavorites = localStorage.getItem("favoriteArt");
  if (!savedFavorites) {
    return [];
  }
  savedFavorites = JSON.parse(savedFavorites);
  return savedFavorites;
} 

/* findWikiPage:
Search for possible pages. 
Look through each page and see if it mentions the artist. 
Return html of page summary that matches the art's name and mentions the artist. 
*** artName and artist must be strings returned from the chicago API ***   */
async function findWikiPage(artName, artist) {
  const response = await fetch(searchWikiAPIUrl + artName);

  if (!response.ok) {
    console.error("wiki query not okay", response);
    return "";
  }

  const data = await response.json();

  // data format data.query.search[#].title
  const results = data.query.search;

  for (let result of results) {
    let pageName = result.title;
    const wikiPage = await getWikiPage(pageName);
    //check to see if the artist is mentioned anywhere on the page
    if (wikiPage.toLowerCase().includes(artist.toLowerCase())) {
      //get the summary of the page
      const wikiPageSummary = await getWikiPageSummary(result.pageid);
      return wikiPageSummary;
    }
  }

  console.warn("no art & artist match");
  return "";
};

/* gets a wikipedia page by the page's name returns its html */
async function getWikiPage(pageName) {
  const response = await fetch(getWikiPageAPIUrl + pageName);

  if (!response.ok) {
    console.error("no wiki page", response);
    return "";
  }
  const data = await response.json();
  return data.parse.text;
};

async function getWikiPageSummary(pageId) {
  pageId = parseInt(pageId);
  const response = await fetch(getWikiPageSummaryAPIUrl + pageId);

  if (!response.ok) {
    console.error("no wiki page", response);
    return "";
  }

  const data = await response.json();
  return data.query.pages[pageId].extract;
};
//end wikipedia api calls

async function imagePull() {
  var searchTerm = document.querySelector("#artist-form").value;

  fetch(
    "https://api.artic.edu/api/v1/artworks/search?q=" +
    searchTerm +
    "&query[term][is_public_domain]=true&limit=10&fields=id,title,image_id,alt_image_ids,artist_title,color"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      artName = response.data[0].title;
      artist = response.data[0].artist_title;
      //go inside card function
      var artImg = document.createElement("img");
      var imageUrl =
        "https://www.artic.edu/iiif/2/" +
        response.data[0].image_id +
        "/full/843,/0/default.jpg";
      artImg.setAttribute("src", imageUrl);
      imgEl.append(artImg);

      findWikiPage(artName, artist).then(function (wikiPage) {
        if (!wikiPage) {
          wikiPage = "No Information Available";
        }
        let wikiPageEl = document.createElement("p");
        wikiPageEl.textContent = wikiPage;
        imgEl.append(wikiPageEl);
        //create card from info
      });
    });
}

function showModal(artwork) {
  // If time Populate modal should show loading indicators for the wikipedia information

  const modal = $("#modal");
  modal.find("h4").text(artwork.title);
  modal.find("span").text(artwork.artist);
  modal.find("img").attr("src", artwork.imageUrl);

  findWikiPage(artwork.title, artwork.artist).then(function (summary) {
    modal.find("p").text(summary);
  });


  if (isFavorited(artwork)) {
    modal.find("#fav-btn").text("Unfavorite");
  }
  else {
    modal.find("#fav-btn").text("Favorite");
  }

  modal.find("#fav-btn").on("click", function () {
    toggleFavorite(artwork);
  });

  $('.modal').modal("open");
};
