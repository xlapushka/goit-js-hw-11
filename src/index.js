
import Notiflix from 'notiflix';
import { getImages } from './js-partials/axios'


const BASE_URL ='https://pixabay.com/api/';
const API_KEY = '37474712-2dac32f03878bab58bae809d9';

let per_page = 40;
let currentPage = 1;
let keyWord = '';

const refs = {
  formSubmit : document.querySelector('#search-form'),
  formSubmitInput : document.querySelector('#search-form input'),
  list : document.querySelector('.js-list'),
  loadMoreBtn : document.querySelector('.btn')
};
  
refs.loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);
refs.formSubmit.addEventListener('submit', onFormSubmit);

refs.list.innerHTML = '';

function onFormSubmit(evt) {
  evt.preventDefault();
  // ====================name у submit = searchQuery, додається в elements у currentTarget==================
  keyWord = evt.currentTarget.elements.searchQuery.value.trim();

  if (!keyWord) {
    refs.list.innerHTML = '';
    Notiflix.Notify.warning('Please enter something to search!');
    return
  }

  refs.list.innerHTML = '';
  currentPage = 1;

  getImages(currentPage, keyWord)
  .then(resp => {

    if (resp.data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    };
    
    refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.data.hits));

    if (currentPage <= Math.floor(resp.data.total/per_page)) {
      refs.loadMoreBtn.hidden = false;
    };
  })
} 


// function getImages(page=1, keyWord) { 
//   const params = new URLSearchParams ({
//     image_type : 'photo',
//     orientation : 'horizontal',
//     safesearch : true 
//   });

//   const options = {
//     method: 'GET',
//     headers: {
//     }
//   };
  
//   return axios.get(`${BASE_URL}?key=${API_KEY}&q=${keyWord}&${params}&page=${page}&per_page=${per_page}`)
// }

function createMarkUp(arr) {

  if (arr.length === 0) {
    refs.loadMoreBtn.hidden = true;
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };

  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
  <li class="card">
    <div class="card-thumb">
      <img src="${webformatURL}" alt="${tags}" width="100%" loading="lazy"/>
    </div>
  
    <div class="card-descr">
      <ul class="list img-info">
        <li class="likes">
          <p class="p">Likes</p>
          <span>${likes}</span>
        </li>
        <li class="views">
          <p>Views</p>
          <span>${views}</span>
        </li>
        <li class="comments">
          <p>Comments</p>
          <span>${comments}</span>
        </li>
        <li class="downloads">
          <p>Downloads</p>
          <span>${downloads}</span>
        </li>
      </ul>
    </div>
  </li> 
  `).join('')
} 


function onLoadMoreButtonClick() {
  currentPage += 1;

  getImages(currentPage, keyWord)
  .then(resp => {
    if (currentPage > Math.floor(resp.data.total/per_page)) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.hidden = true;
    }
    refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.data.hits))
  })
}


