//Identiska variablar från songplaylist.js
let usernameInput;
let playlistInput;
let descriptionInput;
let savedUri = [];
let savedPlaylistId;
savedToken = localStorage.getItem("access_token");

//Identisk knapp från songplaylist.js som kräver inmatning från användaren
createListBtn = document.querySelector("#new-playlist-btn");
createListBtn.disabled = true;

const regExp = /[a-z0-9-_]+/i;
document.querySelector(".input-container").addEventListener("input", () => {
  usernameInput = document.getElementById("spotify-username").value;
  playlistInput = document.getElementById("playlist-name").value;
  descriptionInput = document.getElementById("playlist-description").value;
  if (
    regExp.exec(usernameInput) !== null &&
    regExp.exec(playlistInput) !== null
  ) {
    createListBtn.disabled = false;
    createListBtn.classList.add("active-btn");
  } else {
    createListBtn.disabled = true;
    createListBtn.classList.remove("active-btn");
  }
});

/*Ändrar värdet visuellt beroende på vad användaren väljer för tal i range-inputen.
Eftersom valueRequest används senare i koden deklareras den utanför funktionen*/
let valueRequest = document.querySelector("#requests").value;
document.querySelector("#requests").addEventListener("input", () => {
  valueRequest = document.querySelector("#requests").value;
  valueContainer = document.querySelector("#current-value");
  valueContainer.textContent = valueRequest;
});

/*Fyra nästlade fetchar för att först skapa en lista, hämta en befientlig spellista
, välja ut en slumpad låt, och sedan applicera i den nyproducerade spellistan.
Har även skapat en ny variabel här "countSong" som används på rad 70 i en
while-loop*/
let countSong = 1;
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

      document.querySelector("#playlist-creating").classList.add("fade");
      document.querySelector(".input-container").classList.add("fade");
      document.querySelector("#playlist-creating h2").style.display = "block";
      document.querySelector("#pig-goes-brrr").style.display = "block";

      /*I och med att jag noterade hur den tappade en och annan fetch vid ett
      större antal requests så valde jag att skapa en while-loop här istället för
      en förutbestämd for-loop. Tanken var att countSong skulle subtraheras med
      ett (countSong--) för varje förlorad fetch, men implementerade istället
      så att en funktion, applySongs, körs istället*/
      while (countSong <= valueRequest) {
        countSong++;
        applySongs();
        function applySongs() {
          fetch("https://api.spotify.com/v1/playlists/5RhyxlHe1yEFFCGDTHhcwW", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + savedToken,
            },
            method: "GET",
          })
            .then((response) => response.json())
            .then((result) => {
              randomSong = result.tracks.items[randomTrack()].track.id;
              addSong = "https://api.spotify.com/v1/tracks/" + randomSong;
              fetch(addSong, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + savedToken,
                },
                method: "GET",
              })
                .then((response) => response.json())
                .then((result) => {
                  savedUri = result.uri;
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
                  )
                    .then((response) => {
                      if (response.ok) {
                        return response.json();
                      }
                      return Promise.reject(response);
                    })
                    .then((result) => {
                      console.log(result);
                    })
                    .catch((error) => {
                      console.log("Error:", error);
                      console.log("Retrying in 5 seconds");
                      setTimeout(applySongs, 5000);
                    });
                });
            });
        }
      }
    });
});
