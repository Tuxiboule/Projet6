// URL de l'API

async function fetch_url(url) {
  try {
    const response = await fetch(url);
    const data = await response.json(); // Convertir la réponse en JSON
    return data;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function better_film(url){
  url = url + "?sort_by=-imdb_score"
  let data = await fetch_url(url)
  return data.results[0]
}

function assign_better_film(genre, data) {
  const container = document.getElementById(genre)

  const filmDiv = document.createElement('div')
  filmDiv.classList.add("better_film")
  const img = document.createElement('img')
  img.src = data.image_url
  img.alt = `Meilleur film`
  const nomFilm = document.createElement('p')
  nomFilm.textContent = data.title

  filmDiv.appendChild(img);
  filmDiv.appendChild(nomFilm);
  container.appendChild(filmDiv);

}

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

async function seven_goat(url) {
  url = url + "?sort_by=-imdb_score&page=1"
  let data = await fetch_url(url)
  let data_list = []

  return seven_first(data,data_list, url);

}

async function better_from_genre(genre, url) {
  // display only category and sort by top to low score
  url = url + "?genre=None&page=1&sort_by=-imdb_score"
  url = url.replace("genre=None", "genre=" + genre)
  let data = await fetch_url(url)
  let data_list = []

  return seven_first(data,data_list,url);

}

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

function getvalueFromImgUrl(url, list, value) {
  list.forEach(film => {
    if (url == film.image_url){
      value = film[value]
    }
  })
  return value
}

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

  console.log(data_list_detailed)
  filmImages.forEach(image => {
    image.addEventListener('click', () => {
        // Mettez à jour la fenêtre modale avec les informations du film
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "title")
        modalGenre.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "genres")
        modalReleasedate.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "year")
        modalRated.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "rated")
        modalImdbScore.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "imdb_score")
        modalDirector.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "directors")
        modalActors.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "actors")
        modalDuration.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "duration")
        modalCountry.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "countries")
        modalBoxOffice.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "worldwide_gross_income")
        modalSummary.textContent = getvalueFromImgUrl(image.src, data_list_detailed, "long_description")


        // Affichez la fenêtre modale
        modal.style.display = 'block';
    });
  });
}

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


function handle_modal(data_list_detailed) {
  //Gestion de la fenetre modale
  modal_open(data_list_detailed)
  modal_close()
}

async function more_details(data_list) {
  let data_list_detailed = [];
  // Utilisez Promise.all pour attendre que tous les appels asynchrones se terminent
  await Promise.all(data_list.map(async (data) => {
    const temp = await fetch_url(data.url);
    data_list_detailed.push(temp);
  }));
  return data_list_detailed;
}

function handle_scrolling() {
  document.querySelectorAll('.category').forEach((category) => {
    const scrollingContainer = category.querySelector('.scrolling-container');
    const scrollLeftButton = category.querySelector('.scroll-left');
    const scrollRightButton = category.querySelector('.scroll-right');

    let isScrolling = false;

    // Fonction pour effectuer le défilement
    const scroll = (direction) => {
      if (!isScrolling) {
        isScrolling = true;

        const containerWidth = scrollingContainer.clientWidth;
        const scrollLeft = scrollingContainer.scrollLeft;

        if (direction === 'left') {
          scrollingContainer.scrollTo({
            left: scrollLeft - containerWidth, // Faites défiler d'une largeur de conteneur
            behavior: 'smooth',
          });
        } else {
          scrollingContainer.scrollTo({
            left: scrollLeft + containerWidth, // Faites défiler d'une largeur de conteneur
            behavior: 'smooth',
          });
        }
        // Réorganisez les éléments si vous atteignez la fin ou le début
        if (scrollLeft + containerWidth >= scrollingContainer.scrollWidth) {
          scrollingContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (scrollLeft <= 0) {
          scrollingContainer.scrollTo({ left: scrollingContainer.scrollWidth, behavior: 'smooth' });
        }

        // Attendez un court instant avant de permettre un autre défilement
        setTimeout(() => {
          isScrolling = false;
        }, 500); // Réglez la durée d'attente (en millisecondes) selon vos besoins
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
  const genres = ["Action", "Adult", "Adventure"]
  // Stocker les valeurs attendues
  let data_list_action = await better_from_genre("Action", apiUrl)
  data_list_action = await data_list_action
  assign_to_category("Action", data_list_action)
  let data_list_romance = await better_from_genre("Romance", apiUrl)
  assign_to_category("Romance", data_list_romance)
  let data_list_adventure = await better_from_genre("Adventure", apiUrl)
  assign_to_category("Adventure", data_list_adventure)
  let data_list_seven_goat = await seven_goat(apiUrl)
  assign_to_category("Seven_Goat", data_list_seven_goat)
  better_film = await better_film(apiUrl)
  assign_better_film("Better_Film", better_film)

  let data_list_all = [...data_list_action, ...data_list_romance, ...data_list_adventure, ...data_list_seven_goat]
  let data_list_detailed = await more_details(data_list_all)
  handle_scrolling()
  handle_modal(data_list_detailed)
}


main(); // Appel de la fonction principale
