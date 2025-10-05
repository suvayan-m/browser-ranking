'use strict';

// --- CONFIGURATION AND CONSTANTS ---

// API Configuration
const BASE_URL = 'https://privacytests.org/';
const ANDROID_ENDPOINT = 'android.json';
const DESKTOP_ENDPOINT = 'index.json';

// Utility for score-based color coding
const SCORE_COLORS = [
  { min: 91, bg: '#16a34a', color: '#f0fdf4' }, // green-600
  { min: 81, bg: '#22c55e', color: '#f0fdf4' }, // green-500
  { min: 71, bg: '#4ade80', color: '#064e3b' }, // green-400
  { min: 61, bg: '#86efac', color: '#052e16' }, // green-300
  { min: 51, bg: '#facc15', color: '#78350f' }, // yellow-400
  { min: 41, bg: '#fbbf24', color: '#78350f' }, // yellow-500
  { min: 31, bg: '#f97316', color: '#fff7ed' }, // orange-500
  { min: 21, bg: '#ea580c', color: '#fff7ed' }, // orange-600
  { min: 11, bg: '#dc2626', color: '#fef2f2' }, // red-600
  { min: 0, bg: '#b91c1c', color: '#fef2f2' }, // red-700 (default)
];

// Custom Browser Data
const BROWSER_DATA = {
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
  // NOTE: Mullvad is a VPN, the data might be for a related project or an error.
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
  cromite: {
    website: 'https://github.com/uazo/cromite',
    description:
      'Cromite Browser is a privacy-focused Chromium fork for Android, designed to block ads and reduce tracking. It builds on Bromite’s foundation, removing Google integrations and adding features like anti-fingerprinting, DNS customization, and user-agent spoofing. Cromite is lightweight, fast, and ideal for users who want a hardened mobile browser without sacrificing usability.',
  },
};

// --- DOM ELEMENTS ---

// Glance View lists
const androidGlanceList = document.querySelector(
  '#card-glance-browsers-android ol'
);
const desktopGlanceList = document.querySelector(
  '#card-glance-browsers-desktop ol'
);
// Full Browser View containers
const androidBrowsersContainer = document.querySelector('#browsers-android');
const desktopBrowsersContainer = document.querySelector('#browsers-desktop');
const bodyEl = document.querySelector('body');
const modeToggle = document.querySelector('.mode-toggler');

// --- UTILITY FUNCTIONS ---

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 */
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Calculates a browser's score based on its test results.
 * @param {object} browser - A browser object containing testResults.
 */
const calculateScore = browser => {
  let passes = 0;
  let fails = 0;
  let unsupported = 0;
  let unsupportedFalse = 0;
  let testFailed = 0;
  let testFailedFalse = 0;

  for (const groupKey of Object.keys(browser.testResults)) {
    const testGroup = browser.testResults[groupKey];
    for (const testKey of Object.keys(testGroup)) {
      const testResult = testGroup[testKey];

      // Direct comparison with boolean, more robust than checking string 'true'/'false'
      if (testResult.passed === true) passes++;
      if (testResult.passed === false) fails++;
      if (testResult.unsupported === true) unsupported++;
      if (testResult.unsupportedFalse === false) unsupportedFalse++; // Note: Check on logic 'unsupportedFalse === false'
      if (testResult.testFailed === true) testFailed++;
      if (testResult.testFailedFalse === false) testFailedFalse++; // Note: Check on logic 'testFailedFalse === false'
    }
  }

  const totalTests =
    passes +
    fails +
    unsupported +
    unsupportedFalse +
    testFailed +
    testFailedFalse;

  browser.generatedScore = (
    totalTests > 0 ? (passes / totalTests) * 100 : 0
  ).toFixed(0);
};

/**
 * Finds unique browsers from the API data, calculates their scores, and sorts them.
 * @param {object} data - The raw API data object.
 * @returns {Array<object>} The sorted array of unique browser objects.
 */
const processBrowserData = data => {
  // Find unique browsers by name and keep the latest entry for each
  const uniqueBrowsers = [
    ...new Set(data.all_tests.map(obj => obj.browser)),
  ].map(name => data.all_tests.find(obj => obj.browser === name));

  // Generate scores for each unique browser
  uniqueBrowsers.forEach(calculateScore);

  // Sort browsers by score (descending)
  uniqueBrowsers.sort((a, b) => b.generatedScore - a.generatedScore);

  return uniqueBrowsers;
};

// --- RENDERING FUNCTIONS ---

/**
 * Determines the correct DOM element based on platform type ('desktop' or 'android').
 * @param {string} platform - 'desktop' or 'android'.
 * @param {boolean} isGlance - True for glance list (ol), false for main container (div).
 * @returns {HTMLElement|null} The corresponding DOM element.
 */
const getContainerElement = (platform, isGlance = false) => {
  if (platform === 'desktop') {
    return isGlance ? desktopGlanceList : desktopBrowsersContainer;
  }
  if (platform === 'android') {
    return isGlance ? androidGlanceList : androidBrowsersContainer;
  }
  return null;
};

/**
 * Renders the full browser card view.
 * @param {Array<object>} uniqueBrowsers - Sorted browser data.
 * @param {string} platform - 'desktop' or 'android'.
 */
function renderBrowserCards(uniqueBrowsers, platform) {
  const container = getContainerElement(platform, false);
  if (!container) return; // Exit if container not found

  uniqueBrowsers.forEach(browser => {
    const brw = browser.browser;
    const browserInfo = BROWSER_DATA[brw] || {
      website: '#',
      description: 'No data available.',
    };

    // Destructuring for cleaner access
    const { website, description } = browserInfo;
    const capitalizedName = capitalize(brw);

    const html = ` 	 	
      <div class="container-item col-lg-4 col-md-6">
        <a href="${website}" target="_blank" rel="noopener noreferrer">
          <div class="browser-card" id="${platform}-${brw}">
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
                <h3>${capitalizedName}</h3>
                <p class="description" title="${description}">
                  ${description}
                </p>
              </div>
            </div>
          </div>
        </a>
      </div> 	 	
      `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

/**
 * Renders the "Glance View" list of top browsers.
 * Also calls the score color application.
 * @param {Array<object>} uniqueBrowsers - Sorted browser data.
 * @param {string} platform - 'desktop' or 'android'.
 */
function renderGlanceView(uniqueBrowsers, platform) {
  const container = getContainerElement(platform, true);
  if (!container) return; // Exit if container not found

  uniqueBrowsers.forEach((browser, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';

    const html = ` 	 	
      <li>
        <a href="#${platform}-${browser.browser}" class="link-browser">
          <span class="medal">${medal}</span>
          ${capitalize(browser.browser)}: ${browser.generatedScore}
        </a>
      </li> 	 	
      `;
    container.insertAdjacentHTML('beforeend', html);
  });

  // Apply colors after all browsers are rendered
  if (platform === 'desktop') applyScoreColors();
}

/**
 * Applies background and text color to score elements based on their value.
 */
function applyScoreColors() {
  document.querySelectorAll('.score').forEach(scoreEl => {
    const value = Number(scoreEl.textContent);

    // Find the first matching color rule
    const colorRule = SCORE_COLORS.find(rule => value >= rule.min);

    if (colorRule) {
      scoreEl.style.backgroundColor = colorRule.bg;
      scoreEl.style.color = colorRule.color;
    }
    // No else needed, as the last rule covers min: 0
  });
}

// --- CORE LOGIC ---

/**
 * Fetches API data, processes it, and initiates rendering.
 * @param {string} url - The full API URL.
 * @param {string} platform - 'desktop' or 'android'.
 */
const getAPIData = async (url, platform) => {
  try {
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(
        `HTTP error! Status: ${res.status} for ${platform} data.`
      );

    const data = await res.json();

    // Process data: find unique, calculate scores, sort
    const uniqueBrowsers = processBrowserData(data);

    // Render both views
    renderBrowserCards(uniqueBrowsers, platform);
    renderGlanceView(uniqueBrowsers, platform);
  } catch (e) {
    console.error(`Failed to fetch or process ${platform} data:`, e.message);
    // User-facing error message could be added here
  }
};

// --- EVENT LISTENERS ---

/**
 * Adds the temporary highlight effect when clicking a browser link in the glance view.
 */
const setupHighlighting = () => {
  document.querySelectorAll('.card-glance').forEach(card => {
    card.addEventListener('click', function (e) {
      // Ensure the click was on the link, not the card parent
      if (e.target.closest('.link-browser')) {
        const link = e.target.closest('.link-browser');
        const targetSelector = link.getAttribute('href');
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
          targetElement.classList.add('highlight');

          // Use a function reference for better memory management than an anonymous arrow function
          const removeHighlight = () =>
            targetElement.classList.remove('highlight');

          setTimeout(removeHighlight, 2000);
        }
      }
    });
  });
};

/**
 * Sets up the light/dark mode toggle functionality.
 */
const setupModeToggle = () => {
  modeToggle.addEventListener('click', () => {
    bodyEl.classList.toggle('mode-light');
  });
};

// --- INITIALIZATION ---

/**
 * Runs the main application logic.
 */
const init = () => {
  // Fetch and render data for both platforms
  getAPIData(`${BASE_URL}${DESKTOP_ENDPOINT}`, 'desktop');
  getAPIData(`${BASE_URL}${ANDROID_ENDPOINT}`, 'android');

  // Set up all interactive listeners
  setupHighlighting();
  setupModeToggle();
};

// Start the application
init();
