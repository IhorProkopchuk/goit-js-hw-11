import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';
import { createMarkUp } from './js/createMarkUp';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let query = '';
let totalHits = 0;
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  clearSearch();
  loadMoreButton.classList.add('is-hidden');
  if (query === '') {
    emptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        noContentFound();
      } else {
        createMarkUp(data.hits);
        const lightbox = new SimpleLightbox('.gallery a', {
          captionDelay: 250,
        }).refresh();
        imagesCounter(data);

        if (data.totalHits > perPage) {
          loadMoreButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      createMarkUp(data.hits);
      const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
      }).refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButton.classList.add('is-hidden');
        endOfContent();
      }
    })
    .catch(error => console.log(error));
}

function clearSearch() {
  gallery.innerHTML = '';
}

function imagesCounter(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function emptySearch() {
  Notiflix.Notify.failure('Input field must not be empty.');
}

function endOfContent() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}

function noContentFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
