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
  var state = {
    crossoriginme: 'https://crossorigin.me/',
    menu:[
      {id:"0", name: 'Top Reddit', url: 'https://www.reddit.com/top.json', imageFallBack: 'images/article_placeholder_1.jpg'},
      {id:"1", name: 'Mildly Interesting', url:'https://www.reddit.com/r/mildlyinteresting/hot.json'},
      {id:"2", name: 'Source 3', url:'#'}
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
  delegate('header', 'click', 'li', (event) => {
    event.preventDefault();
    var a = closest(event.target, 'a'); 
    state.currentSource = state.menu[a.dataset.select];
    feed(state.currentSource);
    renderHeader(state, header);
  });
  //Close Pop-Up
  delegate('#main', 'click', '.close-pop-up', (event) => {      
        event.target.parentNode.remove();
        renderMain(state, main);  
  });
  //Open Pop-Up
  delegate('#main', 'click', 'article', (event) => {
      var article = closest(event.target.parentNode, 'article');     
      renderPopUp(state.articles[article.id], main);   
  });
  
  ///////Render
  function renderError(data, into) {
    into.innerHTML = `
    <div id="error" class="loader">${data.message}</div>
    `
  }
  function renderLoading(data, into) {
      // TODO: Add the template
      into.innerHTML = `
      <div id="pop-up" class="loader">
      </div>
      `;
    }
    function renderHeaderMenu(data) {
      return  `
      <ul>
          ${data.menu.map((item) => {
            return `<li><a data-select="${item.id}" href="#">${item.name}</a></li>`;
          }).join('')}          
      </ul>
      `;
    }

    function renderHeader(data, into) {
      into.innerHTML = `
      <section class="wrapper">
        <a class="selectSource" data-select=${data.currentSource.id} href="#"><h1>Feedr</h1></a>
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
      ${data.articles.map((article)=>{
        return renderArticle(article)
      }).join('')}
      `;    
    }

    function renderArticle(data) {
      return `
      <article class="article" id="${data.id}">
        <section class="featured-image">
          <img src="${data.image || source.imageFallBack}" alt="" />
        </section>
        <section class="article-content"">
          <a href="#"><h3>${data.title}</h3></a>
          <h6>${data.content}</h6>
        </section>
        <section class="impressions">
          ${data.number}
        </section>
        <div class="clearfix"></div>
      </article>
      `;
    }

    function renderPopUp(data, into) {
      into.innerHTML = `
      <div id="pop-up">
        <a href="#" class="close-pop-up">X</a>
        <div class="wrapper">
          <h1>${data.title}</h1>
          <p>
          ${data.full_content}
          </p>
          <a href="${data.currentSource}${data.source}" class="pop-up-action" target="_blank">Read more from source</a>
        </div>
      </div>
      `;
    }

  //////Fetch
  function feed(source){
    renderLoading(state, main)
      fetch(state.crossoriginme + source.url)
          .then((response)=>{
              return response.json();
          })
          .then((response)=>{
            //debugger
              var res = [];
              response.data.children.forEach((r, index)=>{
              var content, full_content;
              if(r.data.media && r.data.media.oembed){
                content = r.data.media.oembed.description || '';
                full_content = r.data.media.oembed.html || '';
              }
                  res.push({
                    id: index,
                    number: r.data.score,
                    title: r.data.title,
                    url: r.data.permalink,
                    image: r.data.url,
                    content: content,
                    full_content: full_content
                  });
                  console.log(state);
              });
              state.articles = res;
              renderMain(state, main);
          })
          .catch((error)=>{
            console.log(error);        
            var msg = {message:'Cannot fetch from ' + source.name, fullMessage: error}
            renderError(msg, main);
            throw new Error(error);
          })
    }
  /////
})()
