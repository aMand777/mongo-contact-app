// Async Await

// Ketika tombol search di-klik
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (err) {
    alert(err);
  }
});

// Event binding
document.addEventListener("click", async function (e) {
  try {
    if (e.target.classList.contains("modal-detail-button")) {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    }
  } catch (err) {
    alert(err);
  }
});

function updateUIDetail(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCard(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

function getMovieDetail(imdbid) {
  return fetch("http://www.omdbapi.com/?apikey=12de5229&i=" + imdbid)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response;
    });
}

function getMovies(keyword) {
  return fetch("http://www.omdbapi.com/?apikey=12de5229&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function showCard(m) {
  return `<div class="col-md-4 my-3">
    <div class="card">
        <img src="${m.Poster}" class="card-img-top" alt="${m.Title}">
        <div class="card-body">
            <h5 class="card-title">${m.Title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
            <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Detail</a>
        </div>
        </div>
</div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
    <div class="row">
        <div class="col-md-3">
            <img src="${m.Poster}" class="img-fluid" alt="${m.Title}">
        </div>
        <div class="col-md">
            <ul class="list-group">
                <li class="list-group-item"><h4>${m.Title}</h4></li>
                <li class="list-group-item"><strong>Genre : </strong>${m.Genre}</li>
                <li class="list-group-item"><strong>Director : </strong>${m.Director}</li>
                <li class="list-group-item"><strong>Actors : </strong>${m.Actors}</li>
                <li class="list-group-item"><strong>Writer : </strong>${m.Writer}</li>
                <li class="list-group-item"><strong>Plot : <br></strong>${m.Plot}</li>
            </ul>
        </div>
    </div>
</div>`;
}
