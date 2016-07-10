# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Unit Project #2: Feedr

For our Unit 2 project we will build __Feedr__, a personalized feed reader. Our
feed reader will pull feeds from our favorite blogs, allowing the user to switch
between feeds and select articles to read.

## Overview

### Introduction

The web is an ever growing medium and it is getting more and more difficult to
filter useful information. In our journey to writing beautiful JavaScript we
have come and will come across a great many reference points that will guide our
learning. This is where personal feeds come in very useful. Online feeds are
like to-do lists in that they can be infinitely personalized and there is not
one solution that works for everybody.

### Functionality

In our _Feedr_ app, the user will be able to filter between publications through
a dropdown on the header menu. Clicking/tapping on one of the articles will load
a pop up with more information. The user from that point will be able to either
dismiss the additional information or go to the referenced article.

This will be our first single page app. All of our application views will be
contained in the single [index.html](index.html) file. Our task, after we pull
from the respective feed APIs, will be to render the appropriate HTML and
content for the current state of the application.

---

## Technical Requirements

### Your core application rules:

**Feed sources:**

Give the user the ability to pull from a multiple news sources. Here are a
couple news sources to get you started.

- [Mashable: http://mashable.com/stories.json](http://mashable.com/stories.json)
- [Reddit: https://www.reddit.com/top.json](https://www.reddit.com/top.json)

You should also feel free to use other news APIs.

**Feedr rules:**

- When the application first loads display the loading state. The loading state
  should also be shown whenever an asynchronous function (such as a `.fetch()`)
  is executing and the user is waiting.
- When you successfully retrieve information from an API, swap from the loading
  state to a state showing an article list from the feed. The DOM structure of
  each article should adhere to the `.article` structure example.
- When the user selects an article's title, show the `#pop-up` overlay with more
  details on that article (such as a link to read more at the original source,
  and a preview of the article).
- All content of your application should be shown within the `.container` class.
- Add an error message (either alert or a notification on the page) if the app
  cannot load from the selected feed.

**Additional UI interaction rules:**

- Add functionality to hide the pop-up when user selects the "X" button on the
  pop-up.
- Clicking/tapping the "Feedr" logo will display the main/default feed.


#### Alternate APIs

If you use your own feeds, they must have APIs with the following minimum
requirements. Feeds should;

- Provide images for articles. When no image is available, you should use a
  default _placeholder_ image.
- Provide either a category, tag, or custom taxonomy to display below the title
  (of course title of article is also required).
- Provide a point, ranking, or some type of total impressions for the respective
  article.
- Provide either a full version or a summary of the article for the pop up
  screen.

#### CORS & APIs

Keep in mind, if an API doesn't support CORS, your request will result in a CORS
restriction error such as _"No 'Access-Control-Allow-Origin' header is
present..."_ in the browser. To get around this, you can use the following proxy
server to filter your API requests.

Let's say you wanted to use the Reddit API, which has the following endpoint:

`https://www.reddit.com/top.json`

If you preface the request with the proxy server API as follows...

```
https://crossorigin.me/https://www.reddit.com/top.json
```

...you should be able to use the Reddit API without encountering a cross-domain
restriction error. Here's a code example of how you might use the proxy server:

_Note: The Reddit API doesn't need this extra proxy step, it is merely used here
for demonstrative purposes._

```js
fetch('https://crossorigin.me/https://www.reddit.com/top.json')
  .then((response) => {
    return response.json()
  }).then((result) => {
    result.data.children.forEach((item) => {
      console.log(item.title)
    })
  })
```


#### Bonus Tasks

These tasks are not required, but add extra functionality to your app which a
user may desire, and also extend your knowledge of JavaScript;

1. Merge all feeds into one main feed in chronological order for the initial
   view. When the user clicks/taps the "Feedr" logo at the top, they should be
   return to this feed. This will be the new "home view."
2. Filter articles by title according to user keyboard input on the search input
   box. This should run the filter on every keystroke. When the input box is
   cleared, all articles should display in the respective feed.
3. Add infinite scrolling. Start displaying only the first 20 articles and keep
   loading more on user scrolling.

---

## Getting Started

Begin by "forking" this starter code repository. You can do so by clicking the
"Fork" icon on the top right of [this
page](https://github.com/jesstelford/feedr). Once complete, clone the repository
to your computer by running the following commands:

```
git clone https://github.com/<your-username-here>/feedr.git
cd feedr
```

The `feedr` directory now contains a copy of this repository.

As you accomplish a feature, be sure to commit it to Git and push to GitHub.

### Pro Tips

- Take it one bit at a time. Start with the loading state, then see if you can
  switch to a temporary fake article list state.
- Map out all of the needed fields/properties from each respective feed.
  - Try out the [JSON View chrome extension](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en)
- Start by doing a console.log of the incoming feeds to confirm you have a
  successful transaction before you start mapping anything out.
- Think about ways to best standardize all of your incoming data.
- Test small pieces of functionality frequently, to make sure everything is
  working.
- Focus on keeping your state and views separated; your code will be much easier
  to maintain as the applicaiton becomes more complex.
- Use tools such as Stack Overflow, Google and documentation resources to solve
  problems.

---

## Necessary Deliverables

* A __working Feedr, built by you__, that can be run locally
* A __new git repository hosted on Github__, where your codebase is maintained.
  - Most of your work will be done in the `main.js` file. You may update the
    `index.html` and `style.css` files if you would like to further customize
    your app.
* A __`README.md` file__ describing your application and the functionality it
  contains.

### Due Date

Wednesday July 13th before class starts (at 6pm).

---

## Project Feedback + Evaluation

Students will fork the "feedr" application and commit their code as they
complete pieces of functionality.

The instructional team will grade each technical requirement and provide a
numeric grade on a scale.

- **Technical Requirements**: Did you deliver a project that met all the
  technical requirements? Given what the class has covered so far, did you build
  something that was reasonably complex?
- **Creativity**: Did you add a personal spin or creative element into your
  project submission? Did you deliver something of value to the end user (not
  just a hello world response)?
- **Code Quality**: Did you follow code style guidance and best practices
  covered in class, such modularity and semantic naming? Did you comment your
  code as your instructors have in class?
- **Total**: Your instructors will give you a total score on your project.

Each category is scored according to the below, where a `1` is a _pass_.

Score | Expectations
----- | ------------
**0** | _Does not meet expectations._
**1** | _Meets expectactions, good job!_
**2** | _Exceeds expectations, you wonderful creature, you!_

The total will serve as a helpful overall gauge of whether you met the project
goals, but __the more important scores are the individual ones__ above, which
can help you identify where to focus your efforts for the next project!
