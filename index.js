/*Webbplatsen innehåller sammanlagt tre olika webbsidor. Varje webbsida har sin
separata html, css och js-fil för att enkelt kunna underhållas. Vissa variablar
följer med mellan de olika js-filerna med hjälp av localstorage eftersom detta
har behövts.
Vid hämtning av både klasser och ID's så har jag använt mig av dels
querySelector samt getElementById för att variera lite. Variablar, klasser, ID's,
funktioner m.m är skapade med engelska namn för god praxis.
Har även slängt in lite tomma rader både i men också utanför funktioner. Detta är
för att koden inte ska bli för "klumpig" samt att det förhoppningsvis blir
enklare för dig att begripa vad som är vad och vad som hänger ihop*/

//Om slump-listan ej är tom vid laddning - grön Spotify-ikon
let newSongList = [];
if (localStorage.getItem("savedsongs")) {
  savedSongList = JSON.parse(localStorage.getItem("savedsongs"));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
} else {
  savedSongList = [];
}

//Om Spotify-token existerar - ladda ej välkomst-rutan
let savedToken;
savedToken = localStorage.getItem("access_token");
if (savedToken !== null) {
  document.querySelector("#entry-page").style.display = "none";
  document.querySelector("#entry-container").style.display = "none";
  document.querySelector("#entry-textbox").style.display = "none";
  document.querySelector("#intro-text-div").style.display = "flex";
}

//Accept-knappens funktionalitet vid välkomst-rutan
let acceptTokenBtn = document.querySelector(".accept-btn");
acceptTokenBtn.disabled = true;
//Token refreshar ju varje timma, men varje ny kod innehåller alltid 239 värden
const regExpToken = /^[a-z0-9-_]{239}$/i;
document.querySelector("#get-user-token").addEventListener("input", () => {
  const inputLength = document.querySelector("#get-user-token").value;
  if (regExpToken.exec(inputLength)) {
    acceptTokenBtn.disabled = false;
    acceptTokenBtn.classList.add("active-accept-btn");
  } else {
    acceptTokenBtn.disabled = true;
    acceptTokenBtn.classList.remove("active-accept-btn");
  }
});

//Vid korrekt inmatning - spara token i localstorage och stäng välkomst-ruta
document.querySelector(".accept-btn").addEventListener("click", () => {
  document.querySelector("#entry-page").style.display = "none";
  document.querySelector("#entry-container").style.display = "none";
  document.querySelector("#entry-textbox").style.display = "none";
  document.querySelector("#intro-text-div").style.display = "flex";
  let savedToken = document.querySelector("#get-user-token").value;
  localStorage.setItem("access_token", savedToken);
});

//Cancel-knappens funktionalitet ifall använderen väljer att inte mata in en token
document.querySelector("#cancel-btn").addEventListener("click", () => {
  document.querySelector("#entry-page").style.display = "none";
  document.querySelector("#entry-container").style.display = "none";
  document.querySelector("#entry-textbox").style.display = "none";
  document.querySelector("#intro-text-div").style.display = "flex";
});

//Slide-in effect på underrubriken vid main-page
function fadeIn() {
  document.querySelector(".intro-text-h2").classList.add("intro-text-fadein");
}
setTimeout(fadeIn, 2300);

//Skroll-effekter för respektive flexbox
window.addEventListener("scroll", scrollFunction);
let scroll = 1;
function scrollFunction() {
  if (window.scrollY >= 650 && scroll <= 1) {
    firstRow();
    scroll++;
  }
  if (window.scrollY >= 1300 && scroll <= 2) {
    secondRow();
    scroll++;
  }
  if (window.scrollY >= 1900 && scroll <= 3) {
    thirdRow();
    scroll++;
  }
}

//Funktion för att slumpa fram ett id i de inledande fetcharna.
function randomTrack() {
  return Math.floor(Math.random() * 100);
}

/*Skapelse av variablar för att spara specifika värden hämtade från respektive
track-fetch. Hade kunnat skapa separata const-variablar inuti varje fetch men
körde på detta istället*/
let songName,
  artistName,
  previewSong,
  albumUrl,
  heading,
  image,
  artistHeader,
  songHeader;
/*Testade här med att att skapa tre separata async-await funktioner med Promise.all
för att kunna ladda all tre tillhörande funktioner samtidigt vid scrollFunction.
Funktionerna fungerar, men dock verkar den inte vänta in alla tre funktioner
innan den exekvereras som jag hoppades på*/
async function firstRow() {
  await Promise.all([popMix(), rockMix(), edmMix()]);
}
async function secondRow() {
  await Promise.all([metalMix(), hiphopMix(), tranceMix()]);
}
async function thirdRow() {
  await Promise.all([rnbMix(), soundtracksMix(), reggaeMix()]);
}

//Nedan följer 9 identiska fetchar som är baserade på genrer
function popMix() {
  fetch("https://api.spotify.com/v1/playlists/3lro0N5fTyoXFZFbowlcdM", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addPop = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addPop, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-pop");
          image = document.querySelector(".image-pop");
          artistHeader = document.querySelector(".song-artist-pop");
          songHeader = document.querySelector(".song-name-pop");
          previewHeader = document.querySelector(".preview-pop");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function rockMix() {
  fetch("https://api.spotify.com/v1/playlists/5ZyAjPmaz9KOB4f73RFYvi", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addRock = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addRock, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-rock");
          image = document.querySelector(".image-rock");
          artistHeader = document.querySelector(".song-artist-rock");
          songHeader = document.querySelector(".song-name-rock");
          previewHeader = document.querySelector(".preview-rock");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);
          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function edmMix() {
  fetch("https://api.spotify.com/v1/playlists/1uWZROiHrssDnlG6AmSZSJ", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addEdm = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addEdm, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-edm");
          image = document.querySelector(".image-edm");
          artistHeader = document.querySelector(".song-artist-edm");
          songHeader = document.querySelector(".song-name-edm");
          previewHeader = document.querySelector(".preview-edm");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);
          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

//Testade på async och await lite sporadiskt
async function metalMix() {
  const response = await fetch(
    "https://api.spotify.com/v1/playlists/3VUB2aIVTu8kZP8gXktKpy",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + savedToken,
      },
      method: "GET",
    }
  );
  const result = await response.json();
  const randomSong = result.tracks.items[randomTrack()].track.id;
  addMetal = "https://api.spotify.com/v1/tracks/" + randomSong;

  fetch(addMetal, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      songName = result.name;
      artistName = result.artists[0].name;
      previewSong = result.preview_url;
      albumUrl = result.album.images[1].url;

      heading = document.querySelector(".container-randomize-metal");
      image = document.querySelector(".image-metal");
      artistHeader = document.querySelector(".song-artist-metal");
      songHeader = document.querySelector(".song-name-metal");
      previewHeader = document.querySelector(".preview-metal");

      heading.style.height = "80%";
      heading.style.display = "block";
      heading.style.opacity = "1";
      songHeader.style.fontStyle = "italic";
      artistHeader.textContent = artistName;
      songHeader.textContent = `"${songName}"`;
      image.setAttribute("src", albumUrl);

      if (previewSong !== null) {
        previewHeader.setAttribute("href", previewSong);
        previewHeader.textContent = "Pre-listen here!";
      } else if (previewSong === null) {
        previewHeader.textContent = "";
      }
    });
}

function hiphopMix() {
  fetch("https://api.spotify.com/v1/playlists/61T4XK1Wb3XxOzX463XUpy", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addHiphop = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addHiphop, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-hiphop");
          image = document.querySelector(".image-hiphop");
          artistHeader = document.querySelector(".song-artist-hiphop");
          songHeader = document.querySelector(".song-name-hiphop");
          previewHeader = document.querySelector(".preview-hiphop");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function tranceMix() {
  fetch("https://api.spotify.com/v1/playlists/2iTMQ36cvjhxgIYGv7uld5", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addTrance = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addTrance, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-trance");
          image = document.querySelector(".image-trance");
          artistHeader = document.querySelector(".song-artist-trance");
          songHeader = document.querySelector(".song-name-trance");
          previewHeader = document.querySelector(".preview-trance");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function rnbMix() {
  fetch("https://api.spotify.com/v1/playlists/5y2mPtg874tRlvuXMvkSRF", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addRnb = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addRnb, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-rnb");
          image = document.querySelector(".image-rnb");
          artistHeader = document.querySelector(".song-artist-rnb");
          songHeader = document.querySelector(".song-name-rnb");
          previewHeader = document.querySelector(".preview-rnb");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function soundtracksMix() {
  fetch("https://api.spotify.com/v1/playlists/1KDX2N0ZhUgRJfAxNmrzLW", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addSnd = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addSnd, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-sndtracks");
          image = document.querySelector(".image-sndtracks");
          artistHeader = document.querySelector(".song-artist-sndtracks");
          songHeader = document.querySelector(".song-name-sndtracks");
          previewHeader = document.querySelector(".preview-sndtracks");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

function reggaeMix() {
  fetch("https://api.spotify.com/v1/playlists/2Hlb71OJKq0t68pYxyc7Ce", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      const randomSong = result.tracks.items[randomTrack()].track.id;
      addReggae = "https://api.spotify.com/v1/tracks/" + randomSong;

      fetch(addReggae, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          songName = result.name;
          artistName = result.artists[0].name;
          previewSong = result.preview_url;
          albumUrl = result.album.images[1].url;

          heading = document.querySelector(".container-randomize-reggae");
          image = document.querySelector(".image-reggae");
          artistHeader = document.querySelector(".song-artist-reggae");
          songHeader = document.querySelector(".song-name-reggae");
          previewHeader = document.querySelector(".preview-reggae");

          heading.style.height = "80%";
          heading.style.display = "block";
          heading.style.opacity = "1";
          songHeader.style.fontStyle = "italic";
          artistHeader.textContent = artistName;
          songHeader.textContent = `"${songName}"`;
          image.setAttribute("src", albumUrl);

          if (previewSong !== null) {
            previewHeader.setAttribute("href", previewSong);
            previewHeader.textContent = "Pre-listen here!";
          } else if (previewSong === null) {
            previewHeader.textContent = "";
          }
        });
    });
}

/*Tidigare fetchar lades i funktioner för att minimera kod. Samma fetch körs
vid klick på "New song"*/
document.querySelector(".pop-btn").addEventListener("click", () => {
  popMix();
});
document.querySelector(".rock-btn").addEventListener("click", () => {
  rockMix();
});
document.querySelector(".edm-btn").addEventListener("click", () => {
  edmMix();
});
document.querySelector(".metal-btn").addEventListener("click", () => {
  metalMix();
});
document.querySelector(".hiphop-btn").addEventListener("click", () => {
  hiphopMix();
});
document.querySelector(".trance-btn").addEventListener("click", () => {
  tranceMix();
});
document.querySelector(".rnb-btn").addEventListener("click", () => {
  rnbMix();
});
document.querySelector(".sndtracks-btn").addEventListener("click", () => {
  soundtracksMix();
});
document.querySelector(".reggae-btn").addEventListener("click", () => {
  reggaeMix();
});

//Variablar för att spara värden till chart.js-grafen
let popCount = 0,
  rockCount = 0,
  edmCount = 0,
  metalCount = 0,
  hiphopCount = 0,
  tranceCount = 0,
  rnbCount = 0,
  sndCount = 0,
  reggaeCount = 0;

/*Add to list-knappen som lägger in sparade låtar i tidigare skapade array-variabel.
Låtarna sparas via localstorage för att kunna följa med vid laddning av
songplaylist.js samt addsongs.html. Samma sak gäller för chart.js variablarna */
document.querySelector("#add-pop-btn").addEventListener("click", () => {
  newSongList.push(addPop);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  popCount++;
  localStorage.setItem("savedPopCount", popCount);
});

document.querySelector("#add-rock-btn").addEventListener("click", () => {
  newSongList.push(addRock);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  rockCount++;
  localStorage.setItem("savedRockCount", rockCount);
});

document.querySelector("#add-edm-btn").addEventListener("click", () => {
  newSongList.push(addEdm);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  edmCount++;
  localStorage.setItem("savedEdmCount", edmCount);
});

document.querySelector("#add-metal-btn").addEventListener("click", () => {
  newSongList.push(addMetal);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  metalCount++;
  localStorage.setItem("savedMetalCount", metalCount);
});

document.querySelector("#add-hiphop-btn").addEventListener("click", () => {
  newSongList.push(addHiphop);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  hiphopCount++;
  localStorage.setItem("savedHiphopCount", hiphopCount);
});

document.querySelector("#add-trance-btn").addEventListener("click", () => {
  newSongList.push(addTrance);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  tranceCount++;
  localStorage.setItem("savedTranceCount", tranceCount);
});

document.querySelector("#add-rnb-btn").addEventListener("click", () => {
  newSongList.push(addRnb);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  rnbCount++;
  localStorage.setItem("savedRnbCount", rnbCount);
});

document.querySelector("#add-snd-btn").addEventListener("click", () => {
  newSongList.push(addSnd);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  sndCount++;
  localStorage.setItem("savedSndCount", sndCount);
});

document.querySelector("#add-reg-btn").addEventListener("click", () => {
  newSongList.push(addReggae);
  localStorage.setItem("savedsongs", JSON.stringify(newSongList));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
  reggaeCount++;
  localStorage.setItem("savedReggaeCount", reggaeCount);
});
