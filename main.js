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
    home:{ url: '#'},
    currentSource: state.menu[0],
    menu:[
      {name: 'Top Reddit', ulr: 'https://www.reddit.com/top.json'},
      {name:'Source 2', ulr:'#'},
      {name:'Source 3', ulr:'#'}
    ],
    articles:[
      {id:'0', image:'images/article_placeholder_1.jpg', source: '#', title:'Test article title', content:'Lifestyle', number:'526'},
      {id:'1', image:'images/article_placeholder_1.jpg', source: '#', title:'Test article title 2', content:'Lifestyle 2', number:'521'}
    ]
  }

  feed(state.currentSource)
  //renderLoading(state, container)

  renderHeader(state, header);
  renderMain(state, main);

  ///////Render
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
            return `<li><a href="${item.url}">${item.name}</a></li>`;
          }).join('')}          
      </ul>
      `;
    }

    function renderHeader(data, into) {
      into.innerHTML = `
      <section class="wrapper">
        <a href="${data.home.url}"><h1>Feedr</h1></a>
        <nav>
          <section id="search">
            <input type="text" name="name" value="">
            <div id="search-icon"><img src="images/search.png" alt="" /></div>
          </section>
          <ul>
            <li><a href="${data.currentSource.url}">News Source: <span>${data.currentSource.name}</span></a>
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
          <img src="${data.image}" alt="" />
        </section>
        <section class="article-content"">
          <a href="${data.source}"><h3>${data.title}</h3></a>
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
          ${data.content}
          </p>
          <a href="${data.source}" class="pop-up-action" target="_blank">Read more from source</a>
        </div>
      </div>
      `;
    }
    delegate('#main', 'click', '.close-pop-up', (event) => {      
        event.target.parentNode.remove();
        renderMain(state, main);  
    });
    delegate('#main', 'click', 'article', (event) => {
      var article = closest(event.target.parentNode, 'article');     
      renderPopUp(state.articles[article.id], main);   
    });
  //////
  
  //////Fetch
  function feed(source){
      fetch(source.url)
          .then((response)=>{
              return response.json();
          })
          .then((response)=>{
              state.articles = response;
          })
    }
  /////
})()
