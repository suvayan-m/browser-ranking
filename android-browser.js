"use strict";

// GETTING THE CURRENT YEAR TO RENDER IN THE WEBPAGE
const date = new Date().getFullYear();
document.querySelector(".year").innerHTML = date;
const data = {
  brave: {
    website: "https://brave.com/",
    description:
      "Brave is a privacy-focused browser that automatically blocks most advertisements and website trackers. Users can opt for ads that reward them with Basic Attention Tokens (BAT).",
  },
  chrome: {
    website: "https://www.google.com/chrome/",
    description:
      "Developed by Google, Chrome is one of the most widely-used web browsers in the world, known for its speed and simplicity.",
  },
  duckduckgo: {
    website: "https://duckduckgo.com/",
    description:
      "DuckDuckGo prioritizes user privacy by not tracking search history or personal information. It's a privacy-focused alternative to mainstream browsers.",
  },
  edge: {
    website: "https://www.microsoft.com/en-us/edge",
    description:
      "Microsoft Edge is a modern browser built on Chromium, offering speed, security, and seamless integration with Windows 10 and other Microsoft services.",
  },
  firefox: {
    website: "https://www.mozilla.org/en-US/firefox/",
    description:
      "Firefox is an open-source browser known for its extensibility, customization options, and commitment to user privacy.",
  },
  focus: {
    website: "https://support.mozilla.org/en-US/kb/focus",
    description:
      "Firefox Focus is a privacy-centric mobile browser that blocks trackers, ads, and clears browsing data automatically.",
  },
  librewolf: {
    website: "https://librewolf-community.gitlab.io/",
    description:
      "LibreWolf is a privacy-focused fork of Firefox, emphasizing user control, privacy enhancements, and removal of proprietary components.",
  },
  mullvad: {
    website: "https://mullvad.net/",
    description:
      "Mullvad is a privacy-oriented VPN service, not a browser. It ensures secure browsing by encrypting your internet traffic.",
  },
  mull: {
    website: "https://mullvad.net/",
    description:
      "Mullvad is a privacy-oriented VPN service, not a browser. It ensures secure browsing by encrypting your internet traffic.",
  },
  opera: {
    website: "https://www.opera.com/",
    description:
      "Opera offers a built-in ad blocker, free VPN, and various features like sidebar extensions. It's known for its speed and innovative features.",
  },
  safari: {
    website: "https://www.apple.com/safari/",
    description:
      "Safari is Apple's default browser for macOS and iOS. It emphasizes performance, energy efficiency, and tight integration with Apple devices.",
  },
  samsung: {
    website: "https://www.samsung.com/global/galaxy/apps/samsung-internet/",
    description:
      "Samsung Internet is the default browser on Samsung Galaxy devices. It offers features like ad blocking, dark mode, and cross-device syncing.",
  },
  tor: {
    website: "https://www.torproject.org/",
    description:
      "Tor Browser prioritizes anonymity by routing internet traffic through a global network of volunteer-run servers, making it difficult to trace.",
  },
  ungoogled: {
    website: "https://ungoogled-software.github.io/ungoogled-chromium/",
    description:
      "Ungoogled Chromium is a privacy-focused variant of Chromium (the open-source base for Chrome) with Google's tracking removed.",
  },
  vivaldi: {
    website: "https://vivaldi.com/",
    description:
      "Vivaldi is a highly customizable browser with features like tab stacking, notes, and extensive theme options. It caters to power users.",
  },
  yandex: {
    website: "https://browser.yandex.com/",
    description:
      "Yandex Browser is popular in Russia and offers features like Turbo mode (data compression), built-in security, and personalized recommendations.",
  },
};

// INITIALIZATION
// const url =
//   "https://corsproxy.io/?" +
//   encodeURIComponent("https://privacytests.org/android.json");
// const url = "https://privacytests.org/android.json";
const url = "android.json";
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

    // const html = `
    //     <div class="container-item col-lg-3 col-md-4 col-sm-6">
    //       <article class="item px-3 py-4" id="${browser}">
    //         <div class="container-img mt-2 mb-2">
    //           <img
    //             src="./img/${browser}.svg"
    //             alt="logo of ${browser} browser in svg format"
    //           />
    //         </div>
    //         <h2 class="mb-3">${browser[0].toUpperCase()}${browser.slice(1)}</h2>
    //         <p class="results green text-success">Passes: ${passes}</p>
    //         <p class="results red text-danger">Fails: ${fails}</p>
    //         <p class="results green text-success">
    //           Unsupported(false): ${unsupportedFalse}
    //         </p>
    //         <p class="results red text-danger">
    //           Unsupported(true): ${unsupported}
    //         </p>
    //         <p class="results green text-success">
    //           Test failed(false): ${testFailedFalse}
    //         </p>
    //         <p class="results red text-danger">
    //           Test failed(true): ${testFailed}
    //         </p>
    //       </article>
    //     </div>
    // `;
    const html = `    <div class="container-item col-lg-4 col-md-6" ><a href="${
      data[browser].website
    }" target="_blank" rel="noopener noreferrer">
    <div class="browser-card" id="${browser}">
      <div class="score">${score}</div>
      <div class="row">
        <div class="col-3"><img src="./img/${browser}.svg" alt="logo of ${browser} browser in svg format"></div>
        <div class="col-9">
          <h3>${browser[0].toUpperCase()}${browser.slice(1)}</h3>
          <p class="description" title="${data[browser].description}">${
      data[browser].description
    }</p>
        </div>
      </div>
    </div></a>
  </div>`;
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
