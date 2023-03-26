import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34749443-1e34e441e5610bb05b56b6169';

export async function fetchImages(query, page, perPage) {
  const res = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return res;
}
