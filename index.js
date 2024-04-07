'use strict';

// SELECTORS
const androidGlance = document.querySelector(
  '#card-glance-browsers-android ol'
);
const androidBrowsers = document.querySelector('#browsers-android');
const desktopGlance = document.querySelector(
  '#card-glance-browsers-desktop ol'
);
const desktopBrowsers = document.querySelector('#browsers-desktop');

// CUSTOM BROWSER DATA DESCRIPTION, WEBSITE...
const data = {
  brave: {
    website: 'https://brave.com/',
    description:
      'Brave is a privacy-focused browser that automatically blocks most advertisements and website trackers. Users can opt for ads that reward them with Basic Attention Tokens (BAT).',
  },
  chrome: {
    website: 'https://www.google.com/chrome/',
    description:
      'Developed by Google, Chrome is one of the most widely-used web browsers in the world, known for its speed and simplicity.',
  },
  duckduckgo: {
    website: 'https://duckduckgo.com/',
    description:
      "DuckDuckGo prioritizes user privacy by not tracking search history or personal information. It's a privacy-focused alternative to mainstream browsers.",
  },
  edge: {
    website: 'https://www.microsoft.com/en-us/edge',
    description:
      'Microsoft Edge is a modern browser built on Chromium, offering speed, security, and seamless integration with Windows 10 and other Microsoft services.',
  },
  firefox: {
    website: 'https://www.mozilla.org/en-US/firefox/',
    description:
      'Firefox is an open-source browser known for its extensibility, customization options, and commitment to user privacy.',
  },
  focus: {
    website: 'https://support.mozilla.org/en-US/kb/focus',
    description:
      'Firefox Focus is a privacy-centric mobile browser that blocks trackers, ads, and clears browsing data automatically.',
  },
  librewolf: {
    website: 'https://librewolf.net/',
    description:
      'LibreWolf is a privacy-focused fork of Firefox, emphasizing user control, privacy enhancements, and removal of proprietary components.',
  },
  mullvad: {
    website: 'https://mullvad.net/en',
    description:
      'Mullvad is a privacy-oriented VPN service, not a browser. It ensures secure browsing by encrypting your internet traffic.',
  },
  mull: {
    website: 'https://mullvad.net/en',
    description:
      'Mullvad is a privacy-oriented VPN service, not a browser. It ensures secure browsing by encrypting your internet traffic.',
  },
  opera: {
    website: 'https://www.opera.com/',
    description:
      "Opera offers a built-in ad blocker, free VPN, and various features like sidebar extensions. It's known for its speed and innovative features.",
  },
  safari: {
    website: 'https://www.apple.com/safari/',
    description:
      "Safari is Apple's default browser for macOS and iOS. It emphasizes performance, energy efficiency, and tight integration with Apple devices.",
  },
  samsung: {
    website: 'https://www.samsung.com/global/galaxy/apps/samsung-internet/',
    description:
      'Samsung Internet is the default browser on Samsung Galaxy devices. It offers features like ad blocking, dark mode, and cross-device syncing.',
  },
  tor: {
    website: 'https://www.torproject.org/',
    description:
      'Tor Browser prioritizes anonymity by routing internet traffic through a global network of volunteer-run servers, making it difficult to trace.',
  },
  ungoogled: {
    website: 'https://ungoogled-software.github.io/ungoogled-chromium/',
    description:
      "Ungoogled Chromium is a privacy-focused variant of Chromium (the open-source base for Chrome) with Google's tracking removed.",
  },
  vivaldi: {
    website: 'https://vivaldi.com/',
    description:
      'Vivaldi is a highly customizable browser with features like tab stacking, notes, and extensive theme options. It caters to power users.',
  },
  yandex: {
    website: 'https://browser.yandex.com/',
    description:
      'Yandex Browser is popular in Russia and offers features like Turbo mode (data compression), built-in security, and personalized recommendations.',
  },
};

// INITIALIZATION & VARIABLES
// const url = "https://privacytests.org/index.json";
const url = 'index.json';
let passes = 0;
let fails = 0;
let unsupported = 0;
let unsupportedFalse = 0;
let testFailed = 0;
let testFailedFalse = 0;

// FETCH API DATA
const getAPIData = async function (url, placeData) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Something went wrong. Try again later :(');
    const data = await res.json();
    // FIND UNIQUE AND REMOVE DUBLICATES
    findUnique(data, placeData);
  } catch (e) {
    console.error(e.message);
  }
};

// FIND UNIQUE AND REMOVE DUBLICATES
function findUnique(data, placeData) {
  const uniqueBrowsers = [
    ...new Set(data.all_tests.map(obj => obj.browser)),
  ].map(name => data.all_tests.find(obj => obj.browser === name));

  // GENERATE SCORES
  genScores(uniqueBrowsers, placeData);
}

// GENERATE SCORES
function genScores(uniqueBrowsers, placeData) {
  uniqueBrowsers.forEach(browser => {
    for (const [key, _value] of Object.entries(browser.testResults)) {
      for (const [_key, valueTest] of Object.entries(
        browser.testResults[key]
      )) {
        if (`${valueTest.passed}` === 'true') passes++;
        if (`${valueTest.passed}` === 'false') fails++;
        if (`${valueTest.unsupported}` === 'true') unsupported++;
        if (`${valueTest.unsupportedFalse}` === 'false') unsupportedFalse++;
        if (`${valueTest.testFailed}` === 'true') testFailed++;
        if (`${valueTest.testFailedFalse}` === 'false') testFailedFalse++;
        browser.generatedScore = (
          (passes /
            (passes +
              fails +
              unsupported +
              unsupportedFalse +
              testFailed +
              testFailedFalse)) *
          100
        ).toFixed(0);
      }
    }
    passes =
      fails =
      unsupported =
      unsupportedFalse =
      testFailed =
      testFailedFalse =
        0;
  });

  // SORT BROWSERS ACCORDING TO THEIR SCORES
  sortBrowsers(uniqueBrowsers, placeData);
}

// SORT BROWSERS ACCORDING TO THEIR SCORES
function sortBrowsers(uniqueBrowsers, placeData) {
  uniqueBrowsers.sort((a, b) => b.generatedScore - a.generatedScore);

  // RENDERS BROWSERS
  renderData(uniqueBrowsers, placeData);

  // RENDERS GLANCE VIEW
  renderGlance(uniqueBrowsers, placeData);
}

// RENDERS BROWSERS
function renderData(uniqueBrowsers, placeData) {
  uniqueBrowsers.forEach(browser => {
    const brw = browser.browser;
    const html = `    
    <div class="container-item col-lg-4 col-md-6">
      <a href="${data[brw].website}" target="_blank" rel="noopener noreferrer">
        <div class="browser-card" id="${placeData}-${brw}">
          <div class="score">${browser.generatedScore}</div>
          <div class="row">
            <div class="col-3">
              <img
                src="./img/${brw}.svg"
                alt="logo of ${brw} browser in svg format"
                onerror="this.src='./img/${brw}.png';this.alt='logo of ${brw} browser in png format';"
              />
            </div>
            <div class="col-9">
              <h3>${brw[0].toUpperCase()}${brw.slice(1)}</h3>
              <p class="description" title="${data[brw].description}">
                ${data[brw].description}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>    
    `;
    const placeAt =
      placeData === 'desktop'
        ? desktopBrowsers
        : placeData === 'android'
        ? androidBrowsers
        : null;

    placeAt.insertAdjacentHTML('beforeend', html);
  });
}

// RENDERS GLANCE VIEW
function renderGlance(uniqueBrowsers, placeData) {
  uniqueBrowsers.forEach((browser, i) => {
    console.log(browser);
    const html = `    
    <li>
      <a href="#${placeData}-${browser.browser}" class="link-browser">
        <span class="medal"
          >${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}
        </span>
        ${browser.browser[0].toUpperCase()}${browser.browser.slice(1)}: ${
      browser.generatedScore
    }
      </a>
    </li>    
    `;
    const placeAt =
      placeData === 'desktop'
        ? desktopGlance
        : placeData === 'android'
        ? androidGlance
        : null;

    placeAt.insertAdjacentHTML('beforeend', html);
  });

  // COLOR AS PER SCORE
  const scores = document.querySelectorAll('.score');
  scores.forEach(score => {
    if (Number(score.innerHTML) < 15) score.style.backgroundColor = '#c92a2a';
    if (Number(score.innerHTML) > 15) score.style.backgroundColor = '#c92a2a';
    if (Number(score.innerHTML) > 30) score.style.backgroundColor = '#e67700';
    if (Number(score.innerHTML) > 45) score.style.backgroundColor = '#fcc419';
    if (Number(score.innerHTML) > 60) score.style.backgroundColor = '#2b8a3e';
    if (Number(score.innerHTML) > 75) score.style.backgroundColor = '#37b24d';
  });
}

// HIGHLIGHTING EFFECT
document.querySelectorAll('.card-glance').forEach(card => {
  card.addEventListener('click', function (e) {
    if (e.target.classList.contains('link-browser')) {
      document
        .querySelector(`${e.target.getAttribute('href')}`)
        .classList.add('highlight');
      setTimeout(() => {
        document
          .querySelector(`${e.target.getAttribute('href')}`)
          .classList.remove('highlight');
      }, '2000');
    }
  });
});

// CALLING
getAPIData('index.json', 'desktop');
getAPIData('android.json', 'android');

// TOGGLE LIGHT?DARK MODES
const modeToggle = document.querySelector('.mode-toggler');
const bodyEl = document.querySelector('body');
modeToggle.addEventListener('click', function () {
  bodyEl.classList.toggle('mode-light');
});
