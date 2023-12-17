"use strict";

// GETTING THE CURRENT YEAR TO RENDER IN THE WEBPAGE
const date = new Date().getFullYear();
document.querySelector(".year").innerHTML = date;

// INITIALIZATION
// const url =
//   "https://corsproxy.io/?" +
//   encodeURIComponent("https://privacytests.org/android.json");
const url = "https://privacytests.org/android.json";
// const url = "https://privacytests.org/android.json";
const container = document.getElementById("browsers");
let desktopBrowsers;
let browser;
let passes = 0;
let fails = 0;
let unsupported = 0;
let unsupportedFalse = 0;
let testFailed = 0;
let testFailedFalse = 0;
let score = 0;
let arr = [];
let arrSorted = [];

fetch(url)
  .then((response) => {
    // check if the response is ok
    if (!response.ok) {
      // throw an error with the status text
      throw new Error(response.statusText);
    }
    // parse the response as JSON
    return response.json();
  })
  .then((data) => {
    // do something with the data
    desktopBrowsers = data;

    getData();
  })
  .catch((error) => {
    // handle the error
    console.error(error);
  });

function getData() {
  desktopBrowsers.all_tests.forEach(function (browser, index) {
    browser = browser.browser;
    if (document.querySelector(`#${browser}`)) return;
    for (const [key, _value] of Object.entries(
      desktopBrowsers.all_tests[`${index}`].testResults
    )) {
      for (const [_key2, value2] of Object.entries(
        desktopBrowsers.all_tests[`${index}`].testResults[`${key}`]
      )) {
        if (`${value2.passed}` === "true") passes++;
        if (`${value2.passed}` === "false") fails++;
        if (`${value2.unsupported}` === "true") unsupported++;
        if (`${value2.unsupportedFalse}` === "false") unsupportedFalse++;
        if (`${value2.testFailed}` === "true") testFailed++;
        if (`${value2.testFailedFalse}` === "false") testFailedFalse++;
      }
    }

    const html = `
        <div class="container-item col-lg-3 col-md-4 col-sm-6">
          <article class="item px-3 py-4" id="${browser}">
            <div class="container-img mt-2 mb-2">
              <img
                src="./img/${browser}.svg"
                alt="logo of ${browser} browser in svg format"
              />
            </div>
            <h2 class="mb-3">${browser[0].toUpperCase()}${browser.slice(1)}</h2>
            <p class="results green text-success">Passes: ${passes}</p>
            <p class="results red text-danger">Fails: ${fails}</p>
            <p class="results green text-success">
              Unsupported(false): ${unsupportedFalse}
            </p>
            <p class="results red text-danger">
              Unsupported(true): ${unsupported}
            </p>
            <p class="results green text-success">
              Test failed(false): ${testFailedFalse}
            </p>
            <p class="results red text-danger">
              Test failed(true): ${testFailed}
            </p>
          </article>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
    // console.log(
    //   `${browser[0].toUpperCase()}${browser.slice(1)}`,
    //   passes +
    //     fails +
    //     unsupported +
    //     unsupportedFalse +
    //     testFailed +
    //     testFailedFalse,
    //   passes - fails - testFailed - unsupported
    // );
    arr.push({
      browser: `${browser[0].toUpperCase()}${browser.slice(1)}`,
      score: (
        (passes /
          (passes +
            fails +
            unsupported +
            unsupportedFalse +
            testFailed +
            testFailedFalse)) *
        100
      ).toFixed(0),
    });
    passes =
      fails =
      unsupported =
      unsupportedFalse =
      testFailed =
      testFailedFalse =
        0;
  });

  arr.sort((a, b) => {
    return b.score - a.score;
  });
  arr.forEach(function (el, index) {
    document.getElementById("score").insertAdjacentHTML(
      "beforeend",
      `<a href="#${el.browser.toLowerCase()}" class="link-browser"
    >${el.browser}: ${el.score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a
  >`
    );
    document
      .getElementById(`${el.browser.toLowerCase()}`)
      .closest(".container-item").style.order = index + 1;
  });
}

document.querySelector("#score").addEventListener("click", function (e) {
  if (e.target.classList.contains("link-browser")) {
    // console.log(e.target);
    document
      .querySelector(`${e.target.getAttribute("href")}`)
      .classList.add("highlight");
    setTimeout(() => {
      document
        .querySelector(`${e.target.getAttribute("href")}`)
        .classList.remove("highlight");
    }, "2000");
  }
});
