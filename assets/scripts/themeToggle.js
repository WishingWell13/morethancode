class ThemeToggle extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });

    let rootElement = document.createElement("section");

    let styleElement = document.createElement("style");

    styleElement.textContent = ` 
        button {
        background-color: #00a5dc; /* Blue */
        border-radius: 8px;
        color: black;
        padding: 12px 28px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 20px;
        }

          button:hover {
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
        background-color: #00a5dc; /* Blue */
        border-radius: 8px;
        color: black;
        padding: 12px 28px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 20px;
        }
      `;

    rootElement.innerHTML = `
    <button
        type="button"
        data-theme-toggle
        aria-label="Change to light theme"
    >
        Change to light theme
    </button>
      `;

    this.shadowRoot.appendChild(styleElement);
    this.shadowRoot.appendChild(rootElement);

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
    const button = rootElement.querySelector("[data-theme-toggle]");
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

    console.log("ThemeToggle connected");
  }
}

customElements.define("theme-toggle", ThemeToggle);
