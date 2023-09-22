async function main() {
  const apiUrl = "http://localhost:8000/api/v1/titles/"

  // fetch & assign seven better films from "Action" "Romance" "Adventure" "seven_better" categories
  let data_list_action = await better_from_genre("Action", apiUrl);
  data_list_action = await data_list_action;
  assign_to_category("Action", data_list_action);
  let data_list_romance = await better_from_genre("Romance", apiUrl);
  assign_to_category("Romance", data_list_romance);
  let data_list_adventure = await better_from_genre("Adventure", apiUrl);
  assign_to_category("Adventure", data_list_adventure);
  let data_list_seven_better = await seven_better(apiUrl);
  assign_to_category("seven_better", data_list_seven_better);

  // fetch & assign better film at all
  better_film = await better_film(apiUrl);
  assign_better_film("Better_Film", better_film);

  // get more information about films (to put in modal)
  let data_list_all = [...data_list_action, ...data_list_romance, ...data_list_adventure, ...data_list_seven_better];
  let data_list_detailed = await more_details(data_list_all);

  //handle scrolling containers and modal
  handle_scrolling();
  handle_modal(data_list_detailed);
}


main();