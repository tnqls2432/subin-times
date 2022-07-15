let news = [];
let page = 1;
let total_pages=0;
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu =>
    menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만든다.
// api 호출 함수를 부른다.

const getNews = async () => {
    try{
        let header = new Headers({
            "x-api-key": "oKpdboVX3lwx7T5-vjXNLgamF3_lxQ89Sofzjhf9LBA",
        });
        url.searchParams.set("page", page); //&page=
        console.log(url);
        let response = await fetch(url, { headers: header }); // ajax, fetch
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.");
            }
            console.log("받는 데이터?",data);
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pagenation();
        }else{
            throw new Error(data.message)
        }
        // console.log("this is data:", data);
        // news = data.articles
        // console.log(news);
        // console.log("response는",response);
        // console.log("date는",data);

    }catch(error){
        // console.log("잡힌 에러는", error.message)
        errorRender(error.message);
    }

};

const getLatestNews = async () => {
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
    );
    getNews();
};

const getNewsByKeyword = async () => {
    
    // async,await,fetch
    //1. 검색 키워드 읽어오기
    //2. url에 검색 키워드 붙이기
    //3. 헤더준비
    //4. url 부르기
    //5. 데이터 가져오기
    //6. 데이터 보여주기

    let keyword = document.getElementById("search-input").value
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);

    getNews();
}

const getNewsByTopic = async (event) => {
    console.log("클릭됨", event.target.textContent);
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);

    getNews();
}

const render = () => {
    let newsHTML = ""
    newsHTML = news
        .map((news) => {
            return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${news.media}">
        </div>
        <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.summary}</p>
        </div>
        <div>
        ${news.rights} * ${news.published_date}
        </div>
    </div>`
        }).join('');

    console.log(newsHTML);

    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML
};

const pagenation = () => {
    let pagenationHTML = ``;
    // total_page 총 페이지
    //page 내가 현재 어떤 페이지를 보고 있는지
    // page group 내가 몇 번째 그룹에 있는지
    let pageGroup = Math.ceil(page/5)
    //last 마지막 페이지
    let last = pageGroup * 5
    //first 첫번째 페이지
    let first = last - 4
    // first ~ last 페이지 프린트, 첫번째부터 마지막까지 페이지 프린트

    pagenationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage"(${page - 1})>
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`
    for(let i = first; i <= last; i++){
        pagenationHTML += `<li class="page-item ${page == i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}
        </a>
        </li>`
    };

    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})>
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`;
    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
    //1. 이동하고싶은 페이지를 안다.
    page = pageNum
    console.log(page)
    
    //2. 이동하고싶은 페이지를 가지고 api를 다시 호출한다.
    getNews();
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
