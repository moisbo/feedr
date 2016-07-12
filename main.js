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
      menu: [
        {id: '0', name: 'Top Reddit', api: '/top.json'}, 
        {id: '1', name: 'Mildly Interesting', api: '/r/mildlyinteresting/hot.json'}, 
        {id: '2', name: 'Controversial', api: '/controversial.json'}
      ],
      currentSource: null,
      articles: [],
      after: '',
      sameSource: false,
      index:0
    };

    ///Init
    state.currentSource = state.menu[0];
    feed(state.currentSource);
    renderHeader(state, header);

    ////Actions
    //Select Source
    delegate('header', 'click', '.selectSource', (event) => {
      event.preventDefault();
      state.sameSource = false;
      state.index = 0;
      state.articles = [];
      state.after = '';
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

    delegate('#search', 'change', 'input', (event) => {
      var input = event.target;
      search(input.value);
    });

    //When reaches the end of window feed again
    window.onscroll = function(event) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        feed(state.currentSource);
      }
    };

    ///////Render
    function renderError(data, into) {
      into.innerHTML = `
        <div id="error" class="loader">${data.message}</div>
      `;
    }

    function renderLoading(data, into) {
      into.innerHTML = `
        <div id="pop-up" class="loader">
        </div>
      `;
    }

    function renderHeaderMenu(data) {
      return `
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
              <input type="text" name="name" value="" placeHolder="Filter">
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
      if(state.sameSource){
          into.innerHTML += `
            ${data.map((article)=>{
              return renderArticle(article)
            }).join('')}
          `;
      }else{
          into.innerHTML = `
            ${data.map((article)=>{
              return renderArticle(article)
            }).join('')}
          `;    
          state.sameSource = true;
        }
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
        imgv = `<iframe src="${base.crossoriginme}${data.content}" frameborder="0" scrolling="no" width="640" height="480"></iframe>`;
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
      renderLoading(state, popUpWrapper);
      var fetchURL = base.crossoriginme + base.url + source.api + '?access_token='
          + base.access_token + '&redirect_uri=' + base.redirectURL + 'duration=3600&scope=*&limit=20';
      if(state.after){
        var after = '&after=' + state.after;
        var count = '&count=20';
        fetchURL += after + count;
      }      
      fetch(fetchURL)
      .then((response)=>{
        return response.json();
      })
      .then((response)=>{
        //remove Loading 
        document.querySelector('.loader').remove();
        //var res = [];
        response.data.children.forEach((r, index) => {
            state.articles.push({
              id: state.index++,
              number: r.data.score,
              title: r.data.title,
              author: r.data.author,
              url: r.data.permalink,
              thumbnail: r.data.thumbnail,
              content: r.data.url
            });                  
        });
        var last = response.data.children.length - 1 <= 0 ? 0: response.data.children.length - 1;
        state.after = response.data.children[last].data.name;
        //state.articles = res;
        renderMain(state.articles, main);
      })
      .catch((error) => {
        document.querySelector('.loader').remove();
        console.log(error);        
        var msg = {message:'Cannot fetch from ' + source.name, fullMessage: error}
        renderError(msg, main);
        throw new Error(error);
      });      
    }    

    ////Search
    function search(query) {
      if(query != ''){
        var articles = state.articles.filter((article)=>{
          return article.title.toLowerCase().match(query.toLowerCase())
        });
        renderMain(articles, main);
      }else{
        renderMain(state.articles, main);
      }
    }

})()