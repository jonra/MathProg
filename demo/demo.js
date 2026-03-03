import { mathProgEditor, themeDefinitions } from "../src/index.ts";

var sampleCode = [
  "# Battery Storage Optimization Model",
  "# Determines optimal charge/discharge schedule to minimize electricity cost",
  "",
  "set T := 1..24;  # Time periods (hours)",
  "",
  "param demand{t in T};        # Electricity demand (kWh)",
  "param price{t in T};         # Electricity price ($/kWh)",
  "param solar{t in T};         # Solar generation (kWh)",
  "param battery_cap := 50;     # Battery capacity (kWh)",
  "param charge_rate := 10;     # Max charge rate (kW)",
  "param discharge_rate := 10;  # Max discharge rate (kW)",
  "param efficiency := 0.9;     # Round-trip efficiency",
  "",
  "var charge{t in T} >= 0, <= charge_rate;",
  "var discharge{t in T} >= 0, <= discharge_rate;",
  "var soc{t in T} >= 0, <= battery_cap;  # State of charge",
  "var grid{t in T} >= 0;  # Grid import",
  "",
  "# Minimize total electricity cost",
  "minimize cost: sum{t in T} price[t] * grid[t];",
  "",
  "# Energy balance",
  "s.t. balance{t in T}:",
  "    grid[t] + solar[t] + discharge[t]",
  "    = demand[t] + charge[t];",
  "",
  "# State of charge dynamics",
  "s.t. soc_init: soc[1] = battery_cap / 2;",
  "",
  "s.t. soc_update{t in T : t > 1}:",
  "    soc[t] = soc[t-1]",
  "        + efficiency * charge[t]",
  "        - discharge[t];",
  "",
  "# Cannot charge and discharge simultaneously",
  "s.t. no_simultaneous{t in T}:",
  "    charge[t] + discharge[t] <= charge_rate;",
  "",
  "solve;",
  "",
  "display cost;",
  "display {t in T}: t, charge[t], discharge[t], soc[t], grid[t];",
  "",
  "end;",
].join("\n");

// Split themes into light and dark
var lightThemeList = themeDefinitions.filter(function (d) { return !d.dark; });
var darkThemeList = themeDefinitions.filter(function (d) { return d.dark; });

function init() {
  var editorContainer = document.getElementById("editor");
  var mathContainer = document.getElementById("math-panel");
  var themePalette = document.getElementById("theme-palette");

  var currentTheme = "github-light";
  var view = createEditor(currentTheme);

  // Build theme switcher palette
  buildThemePalette(themePalette, currentTheme);

  function createEditor(themeName) {
    while (editorContainer.firstChild) editorContainer.removeChild(editorContainer.firstChild);
    while (mathContainer.firstChild) mathContainer.removeChild(mathContainer.firstChild);

    var isDark = themeDefinitions.some(function (d) { return d.name === themeName && d.dark; });
    document.body.className = isDark ? "dark" : "light";

    return mathProgEditor({
      parent: editorContainer,
      mathPanel: mathContainer,
      doc: sampleCode,
      theme: themeName,
    });
  }

  function switchTheme(themeName) {
    var doc = view.state.doc.toString();
    view.destroy();
    currentTheme = themeName;
    view = createEditor(themeName);
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: doc },
    });
    buildThemePalette(themePalette, currentTheme);
  }

  function buildThemePalette(container, activeTheme) {
    while (container.firstChild) container.removeChild(container.firstChild);

    // Light section
    var lightLabel = document.createElement("span");
    lightLabel.className = "theme-section-label";
    lightLabel.textContent = "Light";
    container.appendChild(lightLabel);

    lightThemeList.forEach(function (def) {
      var btn = createThemeButton(def, activeTheme);
      btn.addEventListener("click", function () { switchTheme(def.name); });
      container.appendChild(btn);
    });

    // Separator
    var sep = document.createElement("span");
    sep.className = "theme-separator";
    container.appendChild(sep);

    // Dark section
    var darkLabel = document.createElement("span");
    darkLabel.className = "theme-section-label";
    darkLabel.textContent = "Dark";
    container.appendChild(darkLabel);

    darkThemeList.forEach(function (def) {
      var btn = createThemeButton(def, activeTheme);
      btn.addEventListener("click", function () { switchTheme(def.name); });
      container.appendChild(btn);
    });
  }

  function createThemeButton(def, activeTheme) {
    var btn = document.createElement("button");
    btn.className = "theme-btn" + (def.name === activeTheme ? " theme-btn-active" : "");
    btn.title = def.label;

    // Color swatch showing the theme's key colors
    var swatch = document.createElement("span");
    swatch.className = "theme-swatch";
    swatch.style.background = def.colors.background;

    var dot1 = document.createElement("span");
    dot1.className = "theme-dot";
    dot1.style.backgroundColor = def.colors.keyword;
    swatch.appendChild(dot1);

    var dot2 = document.createElement("span");
    dot2.className = "theme-dot";
    dot2.style.backgroundColor = def.colors.definition;
    swatch.appendChild(dot2);

    var dot3 = document.createElement("span");
    dot3.className = "theme-dot";
    dot3.style.backgroundColor = def.colors.function;
    swatch.appendChild(dot3);

    var dot4 = document.createElement("span");
    dot4.className = "theme-dot";
    dot4.style.backgroundColor = def.colors.string;
    swatch.appendChild(dot4);

    btn.appendChild(swatch);

    var label = document.createElement("span");
    label.className = "theme-label";
    label.textContent = def.label;
    btn.appendChild(label);

    return btn;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
