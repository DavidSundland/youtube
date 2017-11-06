// TARGET FORMATTING:  https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyARZvWGyJGL34FZQ2nzWqkP1b_ifUhlSfQ&q=trump

const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/search';
let NEXT_PAGE = '';  // I know that global variables should be avoided, but I was struggling to find ways for the next page token and the user's search term to be passed to all of the functions that needed them...
let SEARCH_TERM = '';

function getDataFromApi(searchTerm, callback) {
  console.log("In getDataFromApi");
    const query = {
    q: searchTerm,
    part: 'snippet',
    key: 'AIzaSyARZvWGyJGL34FZQ2nzWqkP1b_ifUhlSfQ',
    type: 'video',
    maxResults: 6,
    videoSyndicated: 'true',  // supposedly, avoid videos that cannot be embedded in a website (none of these values worked, though...)
    videoEmbeddable: 'true',  // supposedly, avoid videos that cannot be embedded in a website (none of these values worked, though...)
    safeSearch: 'strict',  // supposedly, avoid videos that cannot be embedded in a website (none of these values worked, though...)
    pageToken: NEXT_PAGE
  };
  $.getJSON(YOUTUBE_URL, query, callback);
}

function renderResult(result) {
  console.log("In renderResult");
  let whatnot = Object.keys(result);
  let returnArray = [];
  returnArray.push(`<img src = '${result["snippet"]["thumbnails"]["high"]["url"]}' title = 'http://www.youtube.com/embed/${result["id"]["videoId"]}'>`);
  return returnArray;
}

function displaySearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  console.log("In displaySearchData", results, data); // Good place to log the results in order to understand them...
  NEXT_PAGE = data["nextPageToken"];
  $('h2').text(`Your Results for "${SEARCH_TERM}" - Click on an image to watch the video!`);
  $('.js-search-results').text("");
  for (i = 0; i < results.length; i++)
  {
    $('.js-search-results').append(results[i][0]);
  }
  $('.js-buttonHole').html('<button id="nextResults">See More Results</button>');
}

function watchSubmit() {
   console.log("In watchSubmit");
    $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    SEARCH_TERM = queryTarget.val();
    queryTarget.val("");  // clear out the input
    $("input").attr("placeholder", " Enter a new search item");
    getDataFromApi(SEARCH_TERM, displaySearchData);
  });
}

function seeMore()
{
  $('.js-buttonHole').on('click', 'button', function(event)
  {
    getDataFromApi(SEARCH_TERM, displaySearchData);
  });
}

function watchPicClick()
{
  console.log("In watchPicClick");
  $('.js-search-results').on('click', 'img', function(event)
  {
    console.log("clicked");
    $('.js-view-video').html(`<iframe width='600' height='450' src='${this.title}'></iframe><br><button id="closeVideo">Close the Video</button>`);
    $('.js-view-video').addClass("videoVisible");
  });
}

function closeVideo()
{
  $('.js-view-video').on('click', '#closeVideo', function(event)
  {
    console.log("In click thingie");
    $('.js-view-video').removeClass("videoVisible");
    $('.js-view-video').html("<iframe width='600' height='450' src='https://youtu.be/OU03ls99W1A'></iframe>"); // replace with a random video so previous video stops playing
  });
}

$(watchSubmit);
$(watchPicClick);
$(closeVideo);
$(seeMore);