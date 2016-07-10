/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */

(function() {

  var container = document.querySelector('#container');
  var main = document.querySelector('#main');
  var header = document.querySelector('header');
  var popUpWrapper = document.querySelector('#pop-up-wrapper');

  var base = {
    crossoriginme: 'https://crossorigin.me/',
    url: 'https://www.reddit.com',
    auth: '/api/v1/authorize',
    access_token: 'F3tpaWDuvHjXn5xKjFZ_9oSOfms',
    redirectURL: 'http://localhost:3000/'
  };
  var state = {
    menu:[
      {id:"0", name: 'Top Reddit', api: '/top.json'},
      {id:"1", name: 'Mildly Interesting', api: '/r/mildlyinteresting/hot.json'},
      {id:"2", name: 'Controversial', api: '/controversial.json'}
    ],
    currentSource: null,
    articles:[
      {id:'0', image:'images/article_placeholder_1.jpg', source: '#', title:'Test article title', content:'Lifestyle', number:'526'},
      {id:'1', image:'images/article_placeholder_1.jpg', source: '#', title:'Test article title 2', content:'Lifestyle 2', number:'521'}
    ]
  };

  ///Init
  state.currentSource = state.menu[0];
  feed(state.currentSource);
  renderHeader(state, header);

  ////Actions
  //Select Source
  delegate('header', 'click', '.selectSource', (event) => {
    event.preventDefault();
    var a = closest(event.target, 'a'); 
    state.currentSource = state.menu[a.dataset.select];
    feed(state.currentSource);
    renderHeader(state, header);
  });
  //Close Pop-Up
  delegate('#pop-up-wrapper', 'click', '.close-pop-up', (event) => {      
    event.target.parentNode.remove();
    //is this next line needed?
    event.stopPropagation();      
  });
  //Open Pop-Up
  delegate('#main', 'click', 'article', (event) => {
      var article = closest(event.target.parentNode, 'article');       
      renderPopUp(state.articles[article.dataset.id], popUpWrapper);   
  });
  //Search
  delegate('#search', 'click', '#search-icon', (event) => {  
    var input = document.querySelector('input');
    search(input.value);   
  });
  ///////Render
  function renderError(data, into) {
    into.innerHTML = `
    <div id="error" class="loader">${data.message}</div>
    `
  }
  function renderLoading(data, into) {
      into.innerHTML = `
      <div id="pop-up" class="loader">
      </div>
      `;
    }
    function renderHeaderMenu(data) {
      return  `
      <ul>
          ${data.menu.map((item) => {
            return `<li class="selectSource"><a data-select="${item.id}" href="#">${item.name}</a></li>`;
          }).join('')}          
      </ul>
      `;
    }

    function renderHeader(data, into) {
      into.innerHTML = `
      <section class="wrapper">
        <a class="selectSource" data-select=0 href="#"><h1>Feedr</h1></a>
        <nav>
          <section id="search">
            <input type="text" name="name" value="">
            <div id="search-icon"><img src="images/search.png" alt="" /></div>
          </section>
          <ul>
            <li><a class="selectSource" data-select=${data.currentSource.id} href="#">News Source: <span>${data.currentSource.name}</span></a>
              ${renderHeaderMenu(data)}
            </li>
          </ul>
        </nav>
        <div class="clearfix"></div>
      </section>
      `;
    }

    function renderMain(data, into) {
      into.innerHTML = `
      ${data.map((article)=>{
        return renderArticle(article)
      }).join('')}
      `;    
    }

    function renderArticle(data) {
      if(!data.thumbnail.match(/(.jpg)|(.png)|(.jpeg)|(.gif)/)){
        data.thumbnail = `images/reddit.png`;
      }
      return `
      <article class="article" data-id=${data.id} >
        <section class="featured-image">
          <img src="${data.thumbnail}" alt="" />
        </section>
        <section class="article-content"">
          <a href="#"><h3>${data.title}</h3></a>
          <h6>${data.author}</h6>
        </section>
        <section class="impressions">
          ${data.number}
        </section>
        <div class="clearfix"></div>
      </article>
      `;
    }

    function renderPopUp(data, into) {   
      var imgv;  
      if(data.content.match(/(.gifv)/)){
        //iframe to allow gifv videos
        imgv = `<iframe src="${data.content}" frameborder="0" scrolling="no" width="300"></iframe>`;
      }else if(data.thumbnail.match(/(.jpg)|(.png)|(.jpeg)|(.gif)/)){
        imgv = `<img src="${data.thumbnail}"/>`;
      }else{
        imgv = data.thumbnail;
      }
      into.innerHTML = `
      <div id="pop-up">
        <a href="#" class="close-pop-up">X</a>
        <div class="wrapper">
          <h1>${data.title}</h1>
          <p>${imgv}</p>
          <a href="${base.url}${data.url}" class="pop-up-action" target="_blank">Read more from source</a>
        </div>
      </div>
      `;
    }

  //////Fetch
  function feed(source){
    renderLoading(state, main);
    var fetchURL = base.crossoriginme + base.url + source.api + '?access_token='
         + base.access_token + '&redirect_uri=' + base.redirectURL + 'duration=3600&scope=*&limit=20';
    //console.log(fetchURL);
    fetch(fetchURL)
    .then((response)=>{
      return response.json();
    })
    .then((response)=>{
      //debugger
      var res = [];
      response.data.children.forEach((r, index) => {
          res.push({
            id: index,
            number: r.data.score,
            title: r.data.title,
            author: r.data.author,
            url: r.data.permalink,
            thumbnail: r.data.thumbnail,
            content: r.data.url
          });                  
      });
      state.articles = res;
      renderMain(state.articles, main);
    })
    .catch((error) => {
      console.log(error);        
      var msg = {message:'Cannot fetch from ' + source.name, fullMessage: error}
      renderError(msg, main);
      throw new Error(error);
    });      
  }    
  /////

  ////Search
  function search(query) {
    if(query != ''){
      var articles = state.articles.filter((article)=>{
        return article.title.match(query)
      });
      renderMain(articles, main);
    }else{
      renderMain(state.articles, main);
    }
  }
  ////
})()
