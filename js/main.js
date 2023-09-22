/**
 * fetch from given url
 *
 * @param {string} url - apiUrl
 * @returns {number} - result of fetched url
 */
async function fetch_url(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

/**
 * find the better film of all by imdb rating
 *
 * @param {string} url - apiUrl
 * @returns {object} - object with film informations
 */
async function better_film(url){
  url = url + "?sort_by=-imdb_score"
  let data = await fetch_url(url)
  data = await fetch_url((data.results[0].url))
  return data
}

/**
 * asign the result of better_film in function in the html page
 *
 * @param {string} genre - genre of the film to asign
 * @param {object} data - object with film informations
 */

function assign_better_film(genre, data) {
  const container = document.getElementById(genre)
  const movieContent = container.querySelector('.row-container');
  const resumeContent = container.querySelector('.column-container');

  const resumeFilm = document.createElement('p')
  resumeFilm.textContent = data.long_description

  const img = document.createElement('img')
  img.src = data.image_url
  img.alt = `Meilleur film`
  img.classList.add("film-img")

  const nomFilm = document.createElement('p')
  nomFilm.textContent = data.title

  resumeContent.appendChild(resumeFilm);
  movieContent.appendChild(img);
  movieContent.appendChild(nomFilm);
}

/**
 * navigates page 1 and 2 of api result to find the seven better film
 * (only 5 film for each page)
 * @param {object} data - fetched data
 * @param {list} data_list - data list to return
 * @param {string} apiUrl - api url
 * @returns {list} - list with more informations about the seven films
 */
async function seven_first(data, data_list, url){
  let n = 0
  while (data_list.length < 7) {
    data_list.push(data.results[n])
    n++
    if (data_list.length == 5) {
      url = url.replace("page=1", "page=2")
      n = 0
      data = await fetch_url(url)
    }
  }
  return data_list;
}

/**
 * find the seven better at all
 * @param {url} - apiUrl
 * @returns {list} - list with more informations about the seven films
 */
async function seven_better(url) {
  url = url + "?sort_by=-imdb_score&page=1"
  let data = await fetch_url(url)
  let data_list = []

  return seven_first(data,data_list, url);

}

/**
 * finds the seven better films from a genre
 *
 * @param {string} genre - genre for the film
 * @param {string} url - apiUrl
 * @returns {list} - list with more informations about the films
 */
async function better_from_genre(genre, url) {
  url = url + "?genre=None&page=1&sort_by=-imdb_score"
  url = url.replace("genre=None", "genre=" + genre)
  let data = await fetch_url(url)
  let data_list = []

  return seven_first(data,data_list,url);

}


/**
 * assign fetched elements to the html page
 *
 * @param {string} genre - genre of the category to complete
 * @param {list} data_list - list with more informations about the films
 * @returns {} 
 */
function assign_to_category(genre, data_list) {
  const container = document.getElementById(genre)
  data_list.forEach((result, index) => {
    const filmDiv = document.createElement('div')
    filmDiv.classList.add("film")

    const img = document.createElement('img')
    img.src = result.image_url
    img.alt = `Film ${index + 1}`
    img.classList.add("film-img")
    const nomFilm = document.createElement('p')

    filmDiv.appendChild(img);
    filmDiv.appendChild(nomFilm);
    container.appendChild(filmDiv);

  })
  

}
/**
 * Returns more information about a film from his image url
 *
 * @param {string} url - url of the film image
 * @param {list} list - list with all of the previous fetched data
 * @param {value} value - value to compare with the list
 * @returns {string} - Valeur recherchée, ou erreur si non dispo
 */
function getvalueFromImgUrl(url, list, value) {
  const filmDetails = list.find(film => film.image_url === url);
  if (filmDetails) {
    const filmValue = filmDetails[value];
    if (filmValue !== null) {
      return filmValue;
    } else {
      return "N.C.";
    }
  }
}

/**
 * Handles modal opening
 *
 * @param {list} data_list_detailed - Détails of all displayed films on the website
 */
function modal_open(data_list_detailed){
  const filmImages = document.querySelectorAll(".film-img");
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalGenre = document.getElementById('modal-genre');
  const modalReleasedate = document.getElementById('modal-release-date');
  const modalRated = document.getElementById('modal-rated');
  const modalImdbScore = document.getElementById('modal-imdb-score');
  const modalDirector = document.getElementById('modal-director');
  const modalActors = document.getElementById('modal-actors');
  const modalDuration = document.getElementById('modal-duration');
  const modalCountry = document.getElementById('modal-country');
  const modalBoxOffice = document.getElementById('modal-box-office');
  const modalSummary = document.getElementById('modal-summary');

  filmImages.forEach(image => {
    image.addEventListener('click', () => {

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "title")
        modalGenre.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "genres")
        modalReleasedate.textContent = "Date de sortie : " + getvalueFromImgUrl(image.src, data_list_detailed, "year")
        modalRated.textContent = "Note : " + getvalueFromImgUrl(image.src, data_list_detailed, "rated")
        modalImdbScore.textContent = "Score IMDB : " + getvalueFromImgUrl(image.src, data_list_detailed, "imdb_score")
        modalDirector.textContent = "Réalisateur : " + getvalueFromImgUrl(image.src, data_list_detailed, "directors")
        modalActors.textContent = "Acteur(s) : " + getvalueFromImgUrl(image.src, data_list_detailed, "actors")
        modalDuration.textContent = "Durée (minutes) : " + getvalueFromImgUrl(image.src, data_list_detailed, "duration")
        modalCountry.textContent = "Pays d'origine : " + getvalueFromImgUrl(image.src, data_list_detailed, "countries")
        modalBoxOffice.textContent = " Résultats au box office ($): " + getvalueFromImgUrl(image.src, data_list_detailed, "worldwide_gross_income")
        modalSummary.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "long_description")
        modal.style.display = 'block';
    });
  });
}

/**
 * Handles modal closing
 *
 */
function modal_close(){
  const modal = document.getElementById('modal')
  const modalClose = document.getElementById('modal-close');
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    });

    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
}

/**
 * Main modal handler
 *
 */
function handle_modal(data_list_detailed) {
  modal_open(data_list_detailed)
  modal_close()
}

/**
 * Transform list with few details in list with more details about films
 *
 * @param {data} data_list - list of data to get more details about
 * @returns {list} - data list detailed
 */
async function more_details(data_list) {
  let data_list_detailed = [];
  await Promise.all(data_list.map(async (data) => {
    const temp = await fetch_url(data.url);
    data_list_detailed.push(temp);
  }));
  return data_list_detailed;
}

/**
 * handles horizontal scrolling in containers
 *
 */
function handle_scrolling() {
  document.querySelectorAll('.category').forEach((category) => {
    const scrollingContainer = category.querySelector('.scrolling-container');
    const scrollLeftButton = category.querySelector('.scroll-left');
    const scrollRightButton = category.querySelector('.scroll-right');

    let isScrolling = false;

    const scroll = (direction) => {
      if (!isScrolling) {
        isScrolling = true;

        const containerWidth = scrollingContainer.clientWidth;
        const scrollLeft = scrollingContainer.scrollLeft;

        if (direction === 'left') {
          scrollingContainer.scrollTo({
            left: scrollLeft - containerWidth,
            behavior: 'smooth',
          });
        } else {
          scrollingContainer.scrollTo({
            left: scrollLeft + containerWidth,
            behavior: 'smooth',
          });
        }
        if (scrollLeft + containerWidth >= scrollingContainer.scrollWidth) {
          scrollingContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (scrollLeft <= 0) {
          scrollingContainer.scrollTo({ left: scrollingContainer.scrollWidth, behavior: 'smooth' });
        }

        // Attendez un court instant avant de permettre un autre défilement
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      }
    };

    scrollLeftButton.addEventListener('click', () => {
      scroll('left');
    });

    scrollRightButton.addEventListener('click', () => {
      scroll('right');
    });
  });
}


async function main() {
  const apiUrl = "http://localhost:8000/api/v1/titles/"

  // fetch & assign seven better films from "Action" "Romance" "Adventure" "seven_better" categories
  let data_list_action = await better_from_genre("Action", apiUrl)
  data_list_action = await data_list_action
  assign_to_category("Action", data_list_action)
  let data_list_romance = await better_from_genre("Romance", apiUrl)
  assign_to_category("Romance", data_list_romance)
  let data_list_adventure = await better_from_genre("Adventure", apiUrl)
  assign_to_category("Adventure", data_list_adventure)
  let data_list_seven_better = await seven_better(apiUrl)
  assign_to_category("seven_better", data_list_seven_better)

  // fetch & assign better film at all
  better_film = await better_film(apiUrl)
  assign_better_film("Better_Film", better_film)

  // get more information about films (to put in modal)
  let data_list_all = [...data_list_action, ...data_list_romance, ...data_list_adventure, ...data_list_seven_better]
  let data_list_detailed = await more_details(data_list_all)

  //handle scrolling containers and modal
  handle_scrolling()
  handle_modal(data_list_detailed)
}


main();
