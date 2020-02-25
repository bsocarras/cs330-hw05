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
};

const getAlbums = term => {
  console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);
      fetch(baseURL+ "?type=tracks&q=" + term)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.length == 0) {
            document.querySelector('#tracks').innerHTML = `
              <section class="artist-card">
                <a>
                  Artist not in Spotify database. No tracks found. 
                <a>
              </section>
            `;
          }
          
          document.querySelector('#tracks').innerHTML = '';
          for (i = 0; i < 5; i++) {
            // if (data[i].length = 0) break;

            document.querySelector('#tracks').innerHTML += getTracksHTML(data[i]);
          }
    });

};

const getTracksHTML = (tData) => {
  const template = `
    <section class="track-item preview" data-preview-track="${tData.preview_url}">
    <img src="${tData.album.image_url}">
    <i class="fas play-track fa-play" aria-hidden="true"></i>
    <div class="label">
        <h3>"${tData.name}"</h3>
        <p>
          "${tData.artist.name}"
        </p>
    </div>
  </section>
  `;
  return template
}

const getArtist = term => {
  console.log(`
        get artists from spotify based on the search term
        "${term}" and load the first artist into the #artist section 
        of the DOM...`);

  fetch(baseURL + "?type=artist&q=" + term)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.length == 0) {
        document.querySelector('#artist').innerHTML = `
          <section class="artist-card">
            <a>
              Artist not in Spotify database. 
            <a>
          </section>
        `;
      }

      document.querySelector('#artist').innerHTML = `
        <section class="artist-card" id=${data[0].id}>
          <div>
              <img src="${data[0].img_url}">
              <h3>${data[0].name}</h3>
              <div class="footer">
                  <a href=${data[0].spotify_url} target="_blank">
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
