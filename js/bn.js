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
        console.log(url)
        n = 0
        data = await fetch_url(url)
      }
    }
  
  
    return data_list;
  
  }