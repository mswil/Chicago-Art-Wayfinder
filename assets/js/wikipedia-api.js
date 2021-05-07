const mainEl = document.querySelector("main");

// wikipedia Api call
const searchWikiAPIUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=";

const getWikiPageAPIUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&formatversion=2&origin=*&page="
const getWikiPageSummaryAPIUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/"

/* findWikiPage:
Search for possible pages. 
Look through each page and see if it mentions the artist. 
Return html of page summary that matches the art's name and mentions the artist. 
*** artName and artist must be strings returned from the chicago API ***   */
const findWikiPage = async function (artName, artist) {

    //if there is no artist, don't grab wikipage. Don't want dissociative data
    if (!artist) {
        return "No Wikipedia information available";
    }

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
            const wikiPageInfo = await getWikiPageInfo(result.title);

            return wikiPageInfo;
        }
    }

    console.warn("no art & artist match");
    return "No Wikipedia information available";
};

/* gets a wikipedia page by the page's name returns its html */
const getWikiPage = async function (pageName) {
    const response = await fetch(getWikiPageAPIUrl + pageName);

    if (!response.ok) {
        console.error("no wiki page", response);
        return "";
    }

    const data = await response.json();
    return data.parse.text;
};

const getWikiPageInfo = async function (pageName) {

    const response = await fetch(getWikiPageSummaryAPIUrl + pageName);

    if (!response.ok) {
        console.error("no wiki page", response);
        return "";
    }

    const data = await response.json();
    const wikiInfo = {
        summary: data.extract,
        url: data.content_urls.desktop.page
    };
    return wikiInfo;
};
