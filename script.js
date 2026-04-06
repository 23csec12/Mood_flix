// =========================
// BACK BUTTONS / PAGE NAVIGATION
// =========================
function backToLogin() {
  window.location.href = "login.html";
}

function backToAvatar() {
  window.location.href = "avatar.html";
}

function goToLogin() {
  window.location.href = "login.html";
}

// =========================
// LOGIN / SIGNUP SYSTEM FOR MULTIPLE USERS
// =========================
function login() {
  let user = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();
  let error = document.getElementById("error");

  if (user === "" || pass === "") {
    if (error) error.innerText = "Please enter username and password!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let existingUser = users.find(u => u.username === user);

  if (existingUser) {
    if (existingUser.password === pass) {
      localStorage.setItem("currentUser", user);

      if (existingUser.profiles && existingUser.profiles.length > 0) {
        window.location.href = "profiles.html";
      } else {
        window.location.href = "avatar.html";
      }
    } else {
      if (error) error.innerText = "Wrong password!";
    }
  } else {
    let newUser = {
      username: user,
      password: pass,
      profiles: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", user);

    alert("New account created successfully!");
    window.location.href = "avatar.html";
  }
}

// =========================
// CHOOSE AVATAR AND SAVE TO CURRENT USER
// =========================
function chooseAvatar(avatarSrc) {
  let currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1) {
    alert("User not found. Please login again.");
    window.location.href = "login.html";
    return;
  }

  let profiles = users[userIndex].profiles || [];

  let alreadySelected = profiles.some(profile => profile.avatar === avatarSrc);
  if (alreadySelected) {
    alert("This avatar is already selected!");
    return;
  }

  if (profiles.length < 5) {
    let profileName = prompt("Enter profile name:");

    if (profileName === null || profileName.trim() === "") {
      alert("Profile name is required!");
      return;
    }

    profileName = profileName.trim();

    let sameName = profiles.some(profile => profile.name.toLowerCase() === profileName.toLowerCase());
    if (sameName) {
      alert("This profile name already exists!");
      return;
    }

    profiles.push({
      name: profileName,
      avatar: avatarSrc,
      watchlist: []
    });

    users[userIndex].profiles = profiles;
    localStorage.setItem("users", JSON.stringify(users));

    if (profiles.length === 5) {
      alert("You have added all 5 profiles!");
      window.location.href = "profiles.html";
    } else {
      alert(profileName + " added successfully!");
    }
  } else {
    alert("You already created 5 profiles!");
    window.location.href = "profiles.html";
  }
}

// =========================
// SKIP AVATAR SELECTION
// =========================
function skipAvatarSelection() {
  window.location.href = "profiles.html";
}

// =========================
// EDIT EXISTING PROFILE NAME (PROFILES PAGE)
// =========================
function editProfileName(index) {
  let currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1) {
    alert("User not found!");
    return;
  }

  let profiles = users[userIndex].profiles;
  let oldName = profiles[index].name;
  let newName = prompt("Edit profile name:", oldName);

  if (newName === null || newName.trim() === "") {
    alert("Profile name cannot be empty!");
    return;
  }

  newName = newName.trim();

  let duplicate = profiles.some((profile, i) =>
    i !== index && profile.name.toLowerCase() === newName.toLowerCase()
  );

  if (duplicate) {
    alert("This profile name already exists!");
    return;
  }

  profiles[index].name = newName;
  users[userIndex].profiles = profiles;
  localStorage.setItem("users", JSON.stringify(users));

  loadProfiles();
}

// =========================
// DISPLAY CURRENT USER'S PROFILES
// =========================
// DISPLAY CURRENT USER'S PROFILES
function loadProfiles() {
  let profileList = document.getElementById("profileList");
  let addProfileBtn = document.getElementById("addProfileBtn");
  let currentUser = localStorage.getItem("currentUser");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let existingUser = users.find(u => u.username === currentUser);

  if (profileList && existingUser) {
    profileList.innerHTML = "";

    existingUser.profiles.forEach((profile, index) => {
      let div = document.createElement("div");
      div.className = "profile-item";
      div.innerHTML = `
        <img src="${profile.avatar}" alt="avatar">
        <div class="profile-info">
          <span>${profile.name}</span>
        </div>
      `;

      div.onclick = function () {
        localStorage.setItem("selectedProfileIndex", index);
        localStorage.setItem("selectedProfile", JSON.stringify(profile));
        window.location.href = "movies.html";
      };

      profileList.appendChild(div);
    });

    // SHOW + ONLY IF LESS THAN 5 PROFILES
    if (addProfileBtn) {
      if (existingUser.profiles.length < 5) {
        addProfileBtn.style.display = "flex";
      } else {
        addProfileBtn.style.display = "none";
      }
    }
  }
}

// =========================
// LOAD SELECTED PROFILE ON MOVIE PAGE
// =========================
function loadSelectedProfile() {
  let selectedProfile = JSON.parse(localStorage.getItem("selectedProfile"));
  let topProfile = document.getElementById("selectedProfileTop");

  if (selectedProfile && topProfile) {
    topProfile.innerHTML = `
      <img src="${selectedProfile.avatar}" alt="profile">
      <span>${selectedProfile.name}</span>
    `;
  }
}

// =========================
// TOGGLE PROFILE MENU
// =========================
function toggleProfileMenu() {
  let menu = document.getElementById("profileMenu");
  if (menu) {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  }
}

// =========================
// CHANGE SELECTED PROFILE NAME (MOVIES PAGE)
// =========================
function changeSelectedProfileName() {
  let currentUser = localStorage.getItem("currentUser");
  let selectedProfileIndex = localStorage.getItem("selectedProfileIndex");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1 || selectedProfileIndex === null) {
    alert("Profile not found!");
    return;
  }

  selectedProfileIndex = parseInt(selectedProfileIndex);
  let profile = users[userIndex].profiles[selectedProfileIndex];

  let newName = prompt("Enter new profile name:", profile.name);

  if (newName === null || newName.trim() === "") {
    alert("Profile name cannot be empty!");
    return;
  }

  newName = newName.trim();

  let duplicate = users[userIndex].profiles.some((p, i) =>
    i !== selectedProfileIndex && p.name.toLowerCase() === newName.toLowerCase()
  );

  if (duplicate) {
    alert("This profile name already exists!");
    return;
  }

  users[userIndex].profiles[selectedProfileIndex].name = newName;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("selectedProfile", JSON.stringify(users[userIndex].profiles[selectedProfileIndex]));

  alert("Profile name updated successfully!");
  loadSelectedProfile();

  let menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";
}

// =========================
// DELETE SELECTED PROFILE
// =========================
function deleteSelectedProfile() {
  let currentUser = localStorage.getItem("currentUser");
  let selectedProfileIndex = localStorage.getItem("selectedProfileIndex");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1 || selectedProfileIndex === null) {
    alert("Profile not found!");
    return;
  }

  selectedProfileIndex = parseInt(selectedProfileIndex);

  let confirmDelete = confirm("Are you sure you want to delete this profile?");
  if (!confirmDelete) return;

  users[userIndex].profiles.splice(selectedProfileIndex, 1);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("selectedProfile");
  localStorage.removeItem("selectedProfileIndex");

  alert("Profile deleted successfully!");
  window.location.href = "profiles.html";
}

// =========================
// ADD MOVIE TO WATCHLIST
// =========================
function addToWatchlist(title, poster, tags) {
  let currentUser = localStorage.getItem("currentUser");
  let selectedProfileIndex = localStorage.getItem("selectedProfileIndex");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1) {
    alert("User not found! Please login again.");
    window.location.href = "login.html";
    return;
  }

  if (selectedProfileIndex === null || selectedProfileIndex === "") {
    alert("No profile selected! Please choose a profile again.");
    window.location.href = "profiles.html";
    return;
  }

  selectedProfileIndex = parseInt(selectedProfileIndex);

  if (
    !users[userIndex].profiles ||
    !users[userIndex].profiles[selectedProfileIndex]
  ) {
    alert("Profile not found! Please choose your profile again.");
    window.location.href = "profiles.html";
    return;
  }

  let profile = users[userIndex].profiles[selectedProfileIndex];

  if (!profile.watchlist) {
    profile.watchlist = [];
  }

  let alreadyExists = profile.watchlist.some(movie => movie.title === title);

  if (alreadyExists) {
    alert(title + " is already in your watchlist!");
    return;
  }

  profile.watchlist.push({
    title: title,
    poster: poster,
    tags: tags
  });

  users[userIndex].profiles[selectedProfileIndex] = profile;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("selectedProfile", JSON.stringify(profile));

  alert(title + " added to your watchlist!");
  loadWatchlist();
}

// =========================
// LOAD WATCHLIST OF CURRENT PROFILE
// =========================
function loadWatchlist() {
  let watchlistGrid = document.getElementById("watchlistGrid");
  let emptyWatchlist = document.getElementById("emptyWatchlist");

  if (!watchlistGrid) return;

  let currentUser = localStorage.getItem("currentUser");
  let selectedProfileIndex = localStorage.getItem("selectedProfileIndex");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1) return;
  if (selectedProfileIndex === null || selectedProfileIndex === "") return;

  selectedProfileIndex = parseInt(selectedProfileIndex);

  if (
    !users[userIndex].profiles ||
    !users[userIndex].profiles[selectedProfileIndex]
  ) {
    return;
  }

  let profile = users[userIndex].profiles[selectedProfileIndex];
  let watchlist = profile.watchlist || [];

  watchlistGrid.innerHTML = "";

  if (watchlist.length === 0) {
    if (emptyWatchlist) emptyWatchlist.style.display = "block";
    return;
  } else {
    if (emptyWatchlist) emptyWatchlist.style.display = "none";
  }

  watchlist.forEach((movie, index) => {
    let div = document.createElement("div");
    div.className = "movie-box";
    div.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.tags}</p>
        <button class="remove-btn" onclick="event.stopPropagation(); removeFromWatchlist(${index})">Remove</button>
      </div>
    `;
    watchlistGrid.appendChild(div);
  });
}

// =========================
// REMOVE MOVIE FROM WATCHLIST
// =========================
function removeFromWatchlist(index) {
  let currentUser = localStorage.getItem("currentUser");
  let selectedProfileIndex = localStorage.getItem("selectedProfileIndex");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userIndex = users.findIndex(u => u.username === currentUser);

  if (userIndex === -1) return;
  if (selectedProfileIndex === null || selectedProfileIndex === "") return;

  selectedProfileIndex = parseInt(selectedProfileIndex);

  let profile = users[userIndex].profiles[selectedProfileIndex];
  profile.watchlist.splice(index, 1);

  users[userIndex].profiles[selectedProfileIndex] = profile;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("selectedProfile", JSON.stringify(profile));

  loadWatchlist();
}

// =========================
// FILTER MOVIES BY GENRE / MOOD
// =========================
function filterGenre(genre) {
  let movies = document.querySelectorAll("#movieGrid .movie-box");
  let resultsTitle = document.getElementById("resultsTitle");
  let noResultsMessage = document.getElementById("noResultsMessage");
  let found = 0;

  if (resultsTitle) {
    resultsTitle.innerText = genre === "All" ? "Discover Movies" : genre + " Movies";
  }

  movies.forEach(movie => {
    let tags = movie.getAttribute("data-tags");

    if (genre === "All" || tags.includes(genre)) {
      movie.style.display = "block";
      found++;
    } else {
      movie.style.display = "none";
    }
  });

  if (noResultsMessage) {
    noResultsMessage.style.display = found === 0 ? "block" : "none";
  }
}

// =========================
// SHOW ALL MOVIES
// =========================
function showAllMovies() {
  let movies = document.querySelectorAll("#movieGrid .movie-box");
  let resultsTitle = document.getElementById("resultsTitle");
  let noResultsMessage = document.getElementById("noResultsMessage");

  if (resultsTitle) {
    resultsTitle.innerText = "Discover Movies";
  }

  movies.forEach(movie => {
    movie.style.display = "block";
  });

  if (noResultsMessage) {
    noResultsMessage.style.display = "none";
  }
}

// =========================
// SEARCH MOVIES
// =========================
function searchMovies() {
  let input = document.getElementById("searchInput");
  if (!input) return;

  let filter = input.value.toLowerCase().trim();
  let movies = document.querySelectorAll("#movieGrid .movie-box");
  let resultsTitle = document.getElementById("resultsTitle");
  let noResultsMessage = document.getElementById("noResultsMessage");
  let found = 0;

  if (resultsTitle) {
    resultsTitle.innerText = filter ? "Search Results" : "Discover Movies";
  }

  movies.forEach(movie => {
    let title = movie.querySelector("h3").innerText.toLowerCase();
    let tags = movie.getAttribute("data-tags").toLowerCase();

    if (title.includes(filter) || tags.includes(filter)) {
      movie.style.display = "block";
      found++;
    } else {
      movie.style.display = "none";
    }
  });

  if (noResultsMessage) {
    noResultsMessage.style.display = found === 0 ? "block" : "none";
  }
}

// =========================
// LOGOUT
// =========================
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedProfile");
  localStorage.removeItem("selectedProfileIndex");
  window.location.href = "login.html";
}

// =========================
// CLOSE PROFILE MENU IF CLICKED OUTSIDE
// =========================
document.addEventListener("click", function (event) {
  let profileTop = document.getElementById("selectedProfileTop");
  let profileMenu = document.getElementById("profileMenu");

  if (profileTop && profileMenu) {
    if (!profileTop.contains(event.target) && !profileMenu.contains(event.target)) {
      profileMenu.style.display = "none";
    }
  }
});

// =========================
// PAGE LOAD
// =========================
window.onload = function () {
  loadProfiles();
  loadSelectedProfile();
  loadWatchlist();
};