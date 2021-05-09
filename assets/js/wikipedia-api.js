
// wikipedia Api call
const searchWikiAPIUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=";
// endpoint for page summary and page url
const getWikiPageSummaryAPIUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/"

/* findWikiPage:
Search for possible pages. 
Look through each page and see if it mentions the artist. 
Return html of page summary that matches the art's name and mentions the artist. */

/*   *** artName and artist must be strings returned from the chicago API ***   */
const findWikiPage = async function (artName, artist) {

    let wikiPageInfo = {
        summary: "No information available",
        url: ""
    };

    //if there is no artist, don't grab wikipage. Don't want dissociative data
    if (!artist) {
        console.warn("no artist");
        return wikiPageInfo;
    }

    const response = await fetch(searchWikiAPIUrl + artName);
    if (!response.ok) {
        console.error("Wikipedia API query not okay", response);
        wikiPageInfo.summary = "Problem connecting to Wikipedia. Try again later";
        return wikiPageInfo;
    }

    const data = await response.json();

    // data format data.query.search[#].title
    const results = data.query.search;

    for (let result of results) {
        
        //returns object contiaining: summary, url, and isMatch
        wikiPageInfo = await getWikiPageInfo(result.title, artist);

        if (wikiPageInfo.isMatch) {
            break;
        }
    }

    if (!wikiPageInfo.isMatch) {
        console.warn("no art & artist match");
    }

    return wikiPageInfo;
};

const getWikiPageInfo = async function (pageName, artist) {

    const wikiInfo = {};

    const response = await fetch(getWikiPageSummaryAPIUrl + pageName);
    if (!response.ok) {
        console.error("Wikipedia REST API not okay", response);
        wikiInfo.summary = "Problem connecting to Wikipedia. Try again later";
        return wikiInfo;
    }

    const data = await response.json();

    //check to see if this is the page we want
    if (data.extract.toLowerCase().includes(artist.toLowerCase())) {
        wikiInfo.summary = data.extract;
        wikiInfo.url = data.content_urls.desktop.page;
        wikiInfo.isMatch = true;
    }
    else {
        wikiInfo.summary = "No information available";
        wikiInfo.url = "";
        wikiInfo.isMatch = false;
    }

    return wikiInfo;
};
