const baseURL = "https://www.apitutor.org/spotify/simple/v1/search";

// Note: AudioPlayer is defined in audio-player.js
const audioFile =
  "https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c";
const audioPlayer = AudioPlayer(".player", audioFile);

const search = ev => {
  const term = document.querySelector("#search").value;
  console.log("search for:", term);
  // issue three Spotify queries at once...
  getTracks(term);
  getAlbums(term);
  getArtist(term);
  if (ev) {
    ev.preventDefault();
  }
};

const getTracks = term => {
  console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section
        of the DOM...`);

  const elem = document.querySelector("#tracks");
  elem.innerHTML = "";
  fetch(baseURL + "?type=track&q=" + term)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.length == 0) {
        document.querySelector("#tracks").innerHTML = `
        <section class="track-item preview" data-preview-track=null>
        <i class="fas play-track fa-play" aria-hidden="true"></i>
        <div class="label">
            <h3></h3>
            <p>
              No matching tracks found in Spotify Database.
            </p>
        </div>
      </section>
            `;
      }

      const first_five = data.slice(0, 5);
      for (e of first_five) {
        elem.innerHTML += `
          <section class="track-item preview" data-preview-track="${e.preview_url}">
            <img src="${e.album.image_url}">
            <i class="fas play-track fa-play" aria-hidden="true"></i>
            <div class="label">
              <h3>${e.name}</h3>
              <p>
                ${e.artist.name}
              </p>
            </div>
          </section>
          `;
      }
    })

    .then(eventListener());
};

const eventListener = () => {
  for (e of document.querySelectorAll(".track-item preview")) {
    e.onclick = playAudio(e);
  }
};

const playAudio = e => {
  const element = e.currentTarget;
  audioPlayer.setAudioFile(element.getAttribute("data-preview-track"));
  audioPlayer.play();
  console.log();
};

const getAlbums = term => {
  console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);

  const elem = document.querySelector("#albums");
  elem.innerHTML = "";
  fetch(baseURL + "?type=album&q=" + term)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.length == 0) {
        elem.innerHTML = `
            <section class="album-card" id=>
              <div>
                  <h3></h3>
                  <div class="footer">
                      <a href=" target="_blank">
                        No matching tracks found in Spotify Database.
                      </a>
                  </div>
              </div>
            </section>
        `;
      }

      for (e of data) {
        elem.innerHTML += `
          <section class="album-card" id=${e.id}>
            <div>
                <img src="${e.image_url}">
                <h3>${e.name}</h3>
                <div class="footer">
                    <a href="${e.spotify_url}" target="_blank">
                        view on spotify
                    </a>
                </div>
            </div>
          </section>
        `;
      }
    });
};

const getArtist = term => {
  console.log(`
        get artists from spotify based on the search term
        "${term}" and load the first artist into the #artist section 
        of the DOM...`);

  fetch(baseURL + "?type=artist&q=" + term)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.length == 0) {
        document.querySelector("#artist").innerHTML = `
          <section class="artist-card">
            <a>
              Artist not found in Spotify Database. 
            <a>
          </section>
        `;
      }

      document.querySelector("#artist").innerHTML = `
        <section class="artist-card" id=${data[0].id}>
          <div>
              <img src="${data[0].image_url}">
              <h3>${data[0].name}</h3>
              <div class="footer">
                  <a href="${data[0].spotify_url}" target="_blank">
                      view on spotify
                  </a>
              </div>
          </div>
      </section>
      `;
    });
};

document.querySelector("#search").onkeyup = ev => {
  // Number 13 is the "Enter" key on the keyboard
  console.log(ev.keyCode);
  if (ev.keyCode === 13) {
    ev.preventDefault();
    search();
  }
};
