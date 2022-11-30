let seasonsDetail = {};
const seasonContainer = document.querySelector(".season-container");
const subContainer = document.querySelector(".subtitle-container");
const title = document.querySelector(".title");

// Fetching season details
fetch("http://api.streamio.cx/player.php?action=getseasons&id=601")
  .then((response) => response.json())
  .then((data) => {
    seasonsDetail = data;
    console.log(seasonsDetail);
    createPoster();
    mapSeasons();
    mapSubtitles();
  })
  .catch((error) => {
    console.log(error);
  });

const createPoster = () => {
  const posterContainer = document.createElement("div");
  posterContainer.classList.add("poster-container");
  posterContainer.style.backgroundImage = `url(${seasonsDetail.serie_backdrop})`;
  posterContainer.style.transition = `opacity .75s`;
  posterContainer.innerHTML += `<div class="poster-text">
    <h1>${seasonsDetail.serie_name}</h1>
    <p>${seasonsDetail.serie_overview}</p>
    <div class="flex poster-buttons">
        <button onClick="playVideo()" class="poster-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Play</button>
        <button class="poster-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Add to Favourites</button>
        <button class="poster-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Add to watchlist</button>
    </div>
  </div>`;
  document.body.appendChild(posterContainer);
};

const mapSeasons = () => {
  seasonsDetail.seasons.map((season) => {
    const seasonContainer = document.getElementById("season-list");
    const el = document.createElement("div");
    el.classList.add("season-select-container");
    el.innerHTML += `<button class="season-select">
                <span>Season ${season.season_number}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>`;
    seasonContainer.appendChild(el);
    el.addEventListener("click", function () {
      seasonContainer.style.display = "none";
      showSeasonDetails(season);
    });
  });
  title.innerHTML = ``;
  title.innerHTML += `<span class="episode">Season ${seasonsDetail.seasons[0].season_number} </span> 
  <span class="episode">Episode ${seasonsDetail.seasons[0].episodes[0].episode_number}: </span>
  <span class="episode">${seasonsDetail.seasons[0].episodes[0].name}</span>`
};

const mapSubtitles = () => {
  const subtitles = [
    { label: "English", srclang: "en" },
    { label: "French", srclang: "de" },
    { label: "Spanish", srclang: "es" },
  ];
  subtitles.map((subtitle) => {
    const subtitleContainer = document.getElementById("subtitle-list");
    const el = document.createElement("div");
    el.classList.add("subtitle-select-container");
    el.innerHTML += `<button class="subtitle-select">
                  <span>${subtitle.label}</span>
                  </button>`;
    subtitleContainer.appendChild(el);
    el.addEventListener("click", function () {
      enableSubtitle(subtitle);
    });
  });
};

const enableSubtitle = (subtitle) => {
  const track = document.getElementsByTagName("track");

  if (track.length > 0) {
    track[0].remove();
  }
  video.innerHTML += `<track label=${subtitle.label} kind="subtitles" srclang=${subtitle.srclang} src="./assets/subtitles/sintel-${subtitle.srclang}.vtt">`;
  video.textTracks[video.textTracks.length - 1].mode = "showing";
};

const playVideo = () => {
  const posterContainer = document.querySelector(".poster-container");
  posterContainer.style.opacity = 0;
  setTimeout(() => {
    posterContainer.style.display = "none";
  }, 750);
  videoContainer.style.opacity = 1;
  videoContainer.style.display = "block";

  document.querySelector(".video-container").style.opacity = 1;
};

function showSeasonDetails(season) {
  const seasonContainer = document.getElementById("season-detail");
  seasonContainer.style.display = "block";
  seasonContainer.innerHTML += `<div class="episode-header" onClick="onEpisodeHeaderClick()">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    Season ${season.season_number}</div>`;

  season.episodes.map((episode, index) => {
    const el = document.createElement("div");
    el.classList.add("season-detail");

    el.innerHTML += `
                <button onClick="showDesc(${index})" class="episode-name-btn">Episode ${episode.episode_number}: ${episode.name}</button>
                <div class="episode-desc-container">
                    <div class="episode-cover" style="background-image:url(${episode.cover})">
                    <button class="play-option" onclick="onEpisodePlay(${JSON.stringify(season).split('"').join("&quot;")}, ${index})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg></div>
                    </button>
                    <p>${episode.description}</p>
                <div>
                </div>
            `;
    seasonContainer.appendChild(el);
  });
  showDesc(0);
}

const showDesc = (index) => {
  const prevActiveItem = document.getElementsByClassName(
    "episode-desc-active"
  )[0];
  if (prevActiveItem) {
    prevActiveItem.classList.remove("episode-desc-active");
  }
  const description = document
    .getElementsByClassName("season-detail")
  [index].getElementsByClassName("episode-desc-container")[0];
  description.classList.add("episode-desc-active");
};

const onEpisodeHeaderClick = () => {
  const seasonContainer = document.getElementById("season-list");
  seasonContainer.style.display = "block";

  const seasonDetailContainer = document.getElementById("season-detail");
  seasonDetailContainer.style.display = "none";
  seasonDetailContainer.innerHTML = "";
};

const onEpisodePlay = (season, index) => {
  title.innerHTML = ``;
  title.innerHTML += `<span class="episode">Season ${season.season_number} </span> 
     <span class="episode">Episode ${season.episodes[index].episode_number}: </span>
     <span class="episode">${season.episodes[index].name}</span>`
}

const onEpisodeButtonClick = () => {
  seasonContainer.style.display = "flex";
};

const removeSeasonControls = () => {
  seasonContainer.style.display = "none";
};

const onSubtitleButtonClick = () => {
  subContainer.style.display = "flex";
};

const removeSubtitleControls = () => {
  subContainer.style.display = "none";
};
