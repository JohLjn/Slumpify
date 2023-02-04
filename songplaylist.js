/*Variablar som används främst för input/formulärfälten. Savedtoken följer
med via localstorage från index.js*/
let usernameInput;
let playlistInput;
let descriptionInput;
let savedUri = [];
let savedPlaylistId;
let savedSongList;
savedToken = localStorage.getItem("access_token");

/* Hämtar låtar sparade från hemsidan (index.js) via localstorage och sparar dessa
i savedSongList variabeln. Ger även spotify-ikonen i navbaren en grön färg*/
if (localStorage.getItem("savedsongs")) {
  savedSongList = JSON.parse(localStorage.getItem("savedsongs"));
  document.querySelector(".bi").style.color = "rgb(50, 235, 50)";
} else {
  savedSongList = [];
}

//Chart.js
/*Hade troligtvis kunnat lösa det "proffsigare" med dessa variablar genom att
lägga de i en array som sedan loopas igenom. Men jag gjorde det lätt för mig :> */
popCount = localStorage.getItem("savedPopCount");
rockCount = localStorage.getItem("savedRockCount");
edmCount = localStorage.getItem("savedEdmCount");
metalCount = localStorage.getItem("savedMetalCount");
hiphopCount = localStorage.getItem("savedHiphopCount");
tranceCount = localStorage.getItem("savedTranceCount");
rnbCount = localStorage.getItem("savedRnbCount");
sndCount = localStorage.getItem("savedSndCount");
reggaeCount = localStorage.getItem("savedReggaeCount");
const ctx = document.getElementById("myChart").getContext("2d");
Chart.defaults.font.size = 26;
Chart.defaults.color = "rgb(206, 206, 206)";
const myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    backgroundColor: "red",
    labels: [
      "Pop",
      "Rock",
      "EDM",
      "Metal",
      "Hip Hop",
      "Trance",
      "R&B",
      "Soundtracks",
      "Reggae",
    ],
    datasets: [
      {
        data: [
          popCount,
          rockCount,
          edmCount,
          metalCount,
          hiphopCount,
          tranceCount,
          rnbCount,
          sndCount,
          reggaeCount,
        ],
        color: "#666",
        backgroundColor: [
          "rgba(255, 99, 132, 0.3)",
          "rgba(54, 162, 235, 0.3)",
          "rgba(255, 206, 86, 0.3)",
          "rgba(75, 192, 192, 0.3)",
          "rgba(153, 102, 255, 0.3)",
          "rgba(255, 159, 64, 0.3)",
          "rgba(33, 228, 35, 0.3)",
          "rgba(136, 82, 14, 0.3)",
          "rgba(173, 165, 155, 0.3)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(33, 228, 35, 1)",
          "rgba(136, 82, 14, 1)",
          "rgba(173, 165, 155, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Playlist contains",
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 17,
          },
          padding: 10,
        },
      },
    },
  },
});

/*Hämtar sparade låtar och publicerar sedan ut dessa visuellt på webbsidan genom
att skapa nya element och applicera dessa i container-list-page div'en*/
for (i = 0; i < savedSongList.length; i++) {
  fetch(savedSongList[i], {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      savedUri.push(result.uri);
      songName = result.name;
      artistName = result.artists[0].name;
      albumUrl = result.album.images[1].url;

      image = document.createElement("img");
      containerImg = document.createElement("div");
      image.setAttribute("src", albumUrl);
      containerImg.style.width = "30%";
      containerImg.appendChild(image);

      container = document.createElement("div");
      container.textContent = artistName + " - " + '"' + songName + '"';

      songContainer = document.createElement("div");
      songContainer.appendChild(containerImg);
      songContainer.appendChild(container);
      songContainer.classList.add("new-songs-added");
      mainContainer = document.querySelector(".container-list-page");
      mainContainer.appendChild(songContainer);
    });
}

/*Button för att skapa en ny spellista. För att den ska fungera krävs det att
både username & playlist-fältet är ifyllt med minst ett tecken*/
createListBtn = document.querySelector("#new-playlist-btn");
createListBtn.disabled = true;

const regExp = /[a-z0-9-_]+/i;
document.querySelector(".input-container").addEventListener("input", () => {
  usernameInput = document.getElementById("spotify-username").value;
  playlistInput = document.getElementById("playlist-name").value;
  descriptionInput = document.getElementById("playlist-description").value;
  if (regExp.exec(usernameInput) && regExp.exec(playlistInput)) {
    createListBtn.disabled = false;
    createListBtn.classList.add("active-btn");
  } else {
    createListBtn.disabled = true;
    createListBtn.classList.remove("active-btn");
  }
});

/*Fetch-anropet för att producera en ny spellista inuti Spotify appen.
Av okänd anledning så tappar den "description" till och från vid skapelse*/
document.querySelector("#new-playlist-btn").addEventListener("click", () => {
  fetch("https://api.spotify.com/v1/users/" + usernameInput + "/playlists", {
    body: JSON.stringify({
      name: playlistInput,
      description: descriptionInput,
      public: false,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      savedPlaylistId = result.id;
      /*Testar här att göra ett nytt anrop fast med PUT-metod som ska ge
      möjligheten att kunna ändra innehållet i listan vad gäller listans namn,
      beskrivning/description samt om den ska vara offentlig eller privat.
      Samma problem med description kan kvarstå men ökar chanserna aningen att
      det går igenom nu istället*/
      fetch("https://api.spotify.com/v1/playlists/" + savedPlaylistId, {
        body: JSON.stringify({
          name: playlistInput,
          description: descriptionInput,
          public: false,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "PUT",
      });
      document.querySelector("#add-container").classList.add("fade");
      document.querySelector("#apply-container").style.opacity = "1";
      document.querySelector("#apply-container").style.zIndex = "5";
    });
});

/*Knapp för att lägga in alla låtar i spellistan. Passar även på här att rensa
alla sparade låtar i localstorage*/
document.querySelector("#apply-songs-btn").addEventListener("click", () => {
  fetch(
    "https://api.spotify.com/v1/playlists/" +
      savedPlaylistId +
      "/tracks/?uris=" +
      savedUri,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + savedToken,
      },
      method: "POST",
    }
  );
  document.querySelector("#apply-container").classList.add("fade");
  document.querySelector("#apply-container").style.opacity = "0";
  document.querySelector("#delete-container").style.opacity = "1";
  document.querySelector("#delete-container").style.zIndex = "7";
  document.querySelector(".container-list-page").style.display = "none";

  localStorage.removeItem("savedsongs");
  localStorage.removeItem("savedPopCount");
  localStorage.removeItem("savedRockCount");
  localStorage.removeItem("savedEdmCount");
  localStorage.removeItem("savedMetalCount");
  localStorage.removeItem("savedHiphopCount");
  localStorage.removeItem("savedTranceCount");
  localStorage.removeItem("savedRnbCount");
  localStorage.removeItem("savedSndCount");
  localStorage.removeItem("savedReggaeCount");
});

/* Raderar alla låtar i spellistan. Tyvärr har api'n inget anrop för att radera
själva spellistan, utan endast innehållet*/
document.querySelector("#delete-playlist-btn").addEventListener("click", () => {
  for (i = 0; i < savedUri.length; i++) {
    fetch(
      "https://api.spotify.com/v1/playlists/" + savedPlaylistId + "/tracks",
      {
        body: JSON.stringify({
          tracks: [
            {
              uri: savedUri[i],
            },
          ],
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedToken,
        },
        method: "DELETE",
      }
    ).then((response) => {
      /*Likt tidigare bugg med description så kan den tappa en eller flera
        anrop och därmed inte radera allting. Åtgärdade detta med att låta den
        köra ytterligare ett varv beronde på hur många låtar som kvarstår*/
      for (i = 0; i < savedUri.length; i++) {
        fetch(
          "https://api.spotify.com/v1/playlists/" + savedPlaylistId + "/tracks",
          {
            body: JSON.stringify({
              tracks: [
                {
                  uri: savedUri[i],
                },
              ],
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + savedToken,
            },
            method: "DELETE",
          }
        );
        document.querySelector("#delete-container").classList.add("fade");
        document.querySelector("#delete-container").style.opacity = "0";
        document.querySelector("#songs-deleted").style.opacity = "1";
      }
    });
  }
});
