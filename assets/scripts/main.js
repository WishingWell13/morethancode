// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

// Starts the program, all function calls trace back here
async function init() {
  initializeServiceWorker();

  initResetProgress();

  initNavbar();
}

function initResetProgress() {
  // Reset progress button
  let resetProgressHolder = document.querySelector("#reset-progress");

  let resetButton = document.createElement("button");

  resetButton.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  resetButton.textContent = "Reset Progress";

  resetButton.style = `

  `;

  resetProgressHolder.appendChild(resetButton);
}

function initNavbar() {
  // Navbar toggle
  let navbarToggle = document.querySelector("#navbar-toggle");

  let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") == "true";

  const toggleNavbarVisibility = () => {
    isNavbarExpanded = !isNavbarExpanded;
    navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
  };

  navbarToggle.addEventListener("click", toggleNavbarVisibility);

  const navbarMenu = document.querySelector("#navbar-menu");
  const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");

  navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
  navbarMenu.addEventListener("click", toggleNavbarVisibility);
}

function initializeServiceWorker() {
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.

  // Check if 'serviceWorker' is supported in the current browser
  if ("serviceWorker" in navigator) {
    console.log("It is supported");
  } else {
    console.log("Not supported");
    return;
  }

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    window.location.reload();
  });

  window.addEventListener("load", function () {
    this.navigator.serviceWorker
      .register("./sw.js") // Register './sw.js' as a service worker
      .then(console.log("Register ./sw.js success!"))
      .catch("Register ./sw.js failed :(");
  });
}

// Archive (TO DELETE)

function initThemeing() {
  /**
   * Utility function to calculate the current theme setting.
   * Look for a local storage value.
   * Fall back to system setting.
   * Fall back to light mode.
   */
  function calculateSettingAsThemeString({
    localStorageTheme,
    systemSettingDark,
  }) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }

    if (systemSettingDark.matches) {
      return "dark";
    }

    return "light";
  }

  /**
   * Utility function to update the button text and aria-label.
   */
  function updateButton({ buttonEl, isDark }) {
    const newCta = isDark ? "Change to light theme" : "Change to dark theme";
    // use an aria-label if you are omitting text on the button
    // and using a sun/moon icon, for example
    buttonEl.setAttribute("aria-label", newCta);
    buttonEl.innerText = newCta;
  }

  /**
   * Utility function to update the theme setting on the html tag
   */
  function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
  }

  /**
   * On page load:
   */

  /**
   * 1. Grab what we need from the DOM and system settings on page load
   */
  const button = document.querySelector("[data-theme-toggle]");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

  /**
   * 2. Work out the current site settings
   */
  let currentThemeSetting = calculateSettingAsThemeString({
    localStorageTheme,
    systemSettingDark,
  });

  /**
   * 3. Update the theme setting and button text accoridng to current settings
   */
  updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
  updateThemeOnHtmlEl({ theme: currentThemeSetting });

  /**
   * 4. Add an event listener to toggle the theme
   */
  button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;
  });
}
