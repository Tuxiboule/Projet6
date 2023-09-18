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

async function better_film(){
  let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
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

async function seven_goat() {
  let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=1"
  let data = await fetch_url(url)
  let data_list = []
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

async function better_from_genre(genre) {
  // display only category and sort by top to low score
  let url = "http://localhost:8000/api/v1/titles/?genre=None&page=1&sort_by=-imdb_score"

  url = url.replace("genre=None", "genre=" + genre)
  let data = await fetch_url(url)
  let data_list = []
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
    nomFilm.textContent = result.title

    filmDiv.appendChild(img);
    filmDiv.appendChild(nomFilm);
    container.appendChild(filmDiv);

  })
  
  
}

function handle_modal(data_list) {
  //Gestion de la fenetre modale
  const filmImages = document.querySelectorAll(".film-img")
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  

  filmImages.forEach(image => {
    image.addEventListener('click', () => {
        // Mettez à jour la fenêtre modale avec les informations du film
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = "test titre"; // Utilisez un attribut de données pour stocker le titre du film
        modalSummary.textContent = "test Sommaire"; // Utilisez un attribut de données pour stocker le résumé du film


        // Affichez la fenêtre modale
        modal.style.display = 'block';
    });
  });

  // Ajoutez un gestionnaire d'événements pour fermer le modal en cliquant à l'extérieur
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    });
}

async function main() {
  const genres = ["Action", "Adult", "Adventure"]
  // Stocker les valeurs attendues
  let data_list_action = await better_from_genre("Action")
  assign_to_category("Action", data_list_action)
  let data_list_romance = await better_from_genre("Romance")
  assign_to_category("Romance", data_list_romance)
  let data_list_adventure = await better_from_genre("Adventure")
  assign_to_category("Adventure", data_list_adventure)
  let data_list_seven_goat = await seven_goat()
  assign_to_category("Seven_Goat", data_list_seven_goat)
  better_film = await better_film()
  assign_better_film("Better_Film", better_film)
  
  let data_list_all = [...data_list_action, ...data_list_romance, ...data_list_adventure, ...data_list_seven_goat]
  console.log(data_list_all)

  handle_modal(data_list_all)
}


main(); // Appel de la fonction principale
