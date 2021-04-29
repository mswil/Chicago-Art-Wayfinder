$(document).ready(function () {
  $('.carousel').carousel();
});

$('.dropdown-trigger').dropdown({
  coverTrigger: false,
  constrainWidth: false
});

$(document).ready(function () {
  $('.sidenav').sidenav();
});

// wikipedia Api call
// get page element we will stuff this into
// const mainEl = document.querySelector("main");

const searchWikiAPIUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch="

const getWikiPageAPIUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&formatversion=2&origin=*&page="
const getWikiPageSummaryAPIUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&pageids="

/* findWikiPage:
Search for possible pages. 
Look through each page and see if it mentions the artist. 
Return html of page summary that matches the art's name and mentions the artist. 
*** artName and artist must be strings returned from the chicago API ***   */
const findWikiPage = async function (artName, artist) {
  const response = await fetch(searchWikiAPIUrl + artName);

  if (!response.ok) {
    console.error("wiki query not okay", response);
    return "";
  }

  const data = await response.json();

  // data format data.query.search[#].title
  const results = data.query.search;

  for (let result of results) {
    const wikiPage = await getWikiPage(result.title);

    //check to see if the artist is mentioned anywhere on the page
    if (wikiPage.toLowerCase().includes(artist.toLowerCase())) {
      //get the summary of the page
      const wikiPageSummary = await getWikiPageSummary(result.pageid);

      return wikiPageSummary;
    }
  }

  console.warn("no art & artist match")
  return "";
}

/* gets a wikipedia page by the page's name returns its html */
const getWikiPage = async function (pageName) {
  const response = await fetch(getWikiPageAPIUrl + pageName);

  if (!response.ok) {
    console.error("no wiki page", response)
    return "";
  }

  const data = await response.json();
  return data.parse.text;
};

const getWikiPageSummary = async function (pageId) {
  pageId = parseInt(pageId);
  const response = await fetch(getWikiPageSummaryAPIUrl + pageId);

  if (!response.ok) {
    console.error("no wiki page", response)
    return "";
  }

  const data = await response.json();
  return data.query.pages[pageId].extract;
}

findWikiPage("mona lisa", "davinci").then(function (wikiPage) {
  if (!wikiPage) {
    wikiPage = "No Information Available";
  }
  //Stuff summary into page element
  // mainEl.innerHTML = wikiPage;
});
//end wikipedia api calls