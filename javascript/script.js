console.log("hello");
let currentSong = new Audio();
let song;
let currfolder;

function secondsToMinutesAndSeconds(seconds) {
  // Convert to integer if needed
  const totalSeconds = parseInt(seconds, 10);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  // Attaching songs
  currfolder = folder;
  let a = await fetch(`${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  song = a;
  playmusic(songs[0], true);
  let songName = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songName.innerHTML = "";
  for (const song of songs) {
    songName.innerHTML =
      songName.innerHTML +
      ` <li>
                                                        <img class="invert" src="song.svg" alt="">
                            <div class="info">
                                <div class="songName">${song.replaceAll(
                                  "%20",
                                  " "
                                )}</div>
                                <div class="artist">Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Background circle with green fill -->
                                    <circle cx="12" cy="12" r="10" fill="green" />
                                    <!-- Path for the icon -->
                                    <path
                                        d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                                        stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </li>`;
  }
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.getElementsByTagName("div")[0].firstElementChild.innerHTML);
      playmusic(e.getElementsByTagName("div")[0].firstElementChild.innerHTML);
    });
  });

  return songs;
}

const playmusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "svg/pause.svg";
  }

  document.querySelector(".songName-last").innerHTML = decodeURI(track);
  document.querySelector(".duration").innerHTML = `${secondsToMinutesAndSeconds(
    currentSong.currentTime
  )}/8:35`;
};

async function displayAlbum() {
  let a = await fetch(`songs`);
  let response = await a.text();

  let container = document.querySelector(".classContainer");

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let array = Array.from(anchor);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").splice(-1)[0];
      let a = await fetch(`songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      container.innerHTML =
        container.innerHTML +
        `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="44" height="44" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background circle with green fill -->
                    <circle cx="12" cy="12" r="10" fill="green" />
                    <!-- Path for the icon -->
                    <path
                        d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                        stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src= "${response.image}" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      song = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playmusic(song[0]);
    });
  });
}

async function main() {
  let a = await getsongs("songs/TuhaiKaha");

  song = a;

  // Display albums
  displayAlbum();

  // Attach event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.getElementsByTagName("div")[0].firstElementChild.innerHTML);
      playmusic(e.getElementsByTagName("div")[0].firstElementChild.innerHTML);
    });
  });

  // Attach event to play buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svg/play.svg";
    }
  });

  // play and pause music
  document.body.addEventListener("keyup", (element) => {
    if (element.key === " ") {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "svg/pause.svg";
      } else {
        currentSong.pause();
        play.src = "svg/play.svg";
      }
    }
  });

  // Timing of song
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".duration"
    ).innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/
        ${secondsToMinutesAndSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (currentSong.currentTime === currentSong.duration) {
      play.src = "svg/play.svg";
      currentSong.currentTime = 0;
    }
  });

  // Seekbar add event
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Hamburger icon
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".cancel").classList.add("cancel-display");
  });
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add previous and next button
  previous.addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    let length = song.length;
    if (index - 1 >= 0) {
      playmusic(song[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    let length = song.length;
    if (index + 1 < length) {
      playmusic(song[index + 1]);
    }
  });

  // Volume function
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // add click to card of songs
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      song = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });

  // Mute the song
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 1;
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 100;
    }
  });
}
main();
