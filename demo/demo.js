import { mathProgEditor, themeDefinitions } from "../src/index.ts";

// ====================================================================
//  5 Famous Physics Examples
// ====================================================================

var examples = [
  {
    name: "Brachistochrone",
    label: "Brachistochrone Curve",
    desc: "Find the fastest descent path between two points under gravity (Johann Bernoulli, 1696)",
    code: [
      "# Brachistochrone Problem — Discretized",
      "# Find the curve of fastest descent under gravity",
      "# Discretized into N segments as a linear program",
      "",
      "param N := 20;           # Number of segments",
      "param g := 9.81;         # Gravitational acceleration (m/s^2)",
      "param x_end := 1.0;      # Horizontal distance (m)",
      "param y_end := 0.5;      # Vertical drop (m)",
      "param dx := x_end / N;   # Horizontal step size",
      "",
      "set S := 1..N;           # Segments",
      "set P := 0..N;           # Points",
      "",
      "param y_start := 0;",
      "param y_final := y_end;",
      "",
      "var y{i in P} >= 0;               # Height at each point",
      "var v{i in P} >= 0;               # Speed at each point",
      "var t{s in S} >= 0;               # Time for each segment",
      "",
      "# Minimize total descent time",
      "minimize total_time: sum{s in S} t[s];",
      "",
      "# Conservation of energy: v = sqrt(2*g*y)",
      "# Linearized: v[i]^2 <= 2*g*y[i]",
      "s.t. energy{i in P}: v[i] <= 2 * g * y[i];",
      "",
      "# Time for each segment (linearized)",
      "# t[s] >= dx / v_avg where v_avg = (v[s-1] + v[s]) / 2",
      "s.t. segment_time{s in S}:",
      "    t[s] * (v[s-1] + v[s]) >= 2 * dx;",
      "",
      "# Boundary conditions",
      "s.t. start_height: y[0] = y_start;",
      "s.t. end_height:   y[N] = y_final;",
      "s.t. start_speed:  v[0] = 0;",
      "",
      "# Monotonicity: curve must descend",
      "s.t. descend{s in S}: y[s] >= y[s-1];",
      "",
      "solve;",
      "",
      "display: total_time;",
      "display {i in P}: i, y[i], v[i];",
      "",
      "end;",
    ].join("\n"),
  },
  {
    name: "Fermat",
    label: "Fermat's Principle (Snell's Law)",
    desc: "Light takes the path of least time through media of different refractive indices",
    code: [
      "# Fermat's Principle — Snell's Law Derivation",
      "# Light path through layered media minimizing travel time",
      "",
      "param N := 10;               # Number of layers",
      "param c := 3e8;              # Speed of light in vacuum (m/s)",
      "",
      "set L := 1..N;               # Layers",
      "set P := 0..N;               # Interface points",
      "",
      "param n{l in L};             # Refractive index of each layer",
      "param dy := 0.1;             # Layer thickness (m)",
      "param x_source := 0;         # Source x-position",
      "param x_target := 0.5;       # Target x-position",
      "",
      "var x{i in P};               # Horizontal position at each interface",
      "var seg{l in L} >= 0;        # Path length in each layer",
      "",
      "# Minimize total optical path length (proportional to time)",
      "minimize optical_path: sum{l in L} n[l] * seg[l];",
      "",
      "# Path length in each layer: seg >= sqrt(dx^2 + dy^2)",
      "# Linearized as seg[l]^2 >= (x[l] - x[l-1])^2 + dy^2",
      "s.t. path_len{l in L}:",
      "    seg[l] * seg[l] >= (x[l] - x[l-1]) * (x[l] - x[l-1]) + dy * dy;",
      "",
      "# Boundary conditions",
      "s.t. source: x[0] = x_source;",
      "s.t. target: x[N] = x_target;",
      "",
      "# Snell's law emerges at optimality:",
      "# n[l] * sin(theta[l]) = n[l+1] * sin(theta[l+1])",
      "",
      "solve;",
      "",
      "printf '\\nOptical path length: %g\\n', optical_path;",
      "display {i in P}: i, x[i];",
      "",
      "end;",
    ].join("\n"),
  },
  {
    name: "Ising",
    label: "Ising Model (Ground State)",
    desc: "Find the minimum energy spin configuration of a 2D lattice (Lenz & Ising, 1920-25)",
    code: [
      "# 2D Ising Model — Ground State Search",
      "# Find the spin configuration that minimizes total energy",
      "# on a square lattice with external field",
      "",
      "param Nx := 6;               # Lattice width",
      "param Ny := 6;               # Lattice height",
      "param J := 1.0;              # Coupling constant",
      "param h := 0.3;              # External magnetic field",
      "",
      "set X := 1..Nx;",
      "set Y := 1..Ny;",
      "set Sites := X cross Y;      # All lattice sites",
      "",
      "# Spin variables: s[i,j] in {-1, +1}",
      "# Encode as binary: b[i,j] in {0,1}, then s = 2*b - 1",
      "var b{(i,j) in Sites} binary;",
      "",
      "# Auxiliary variables for interaction terms",
      "var agree_h{i in X, j in Y : j < Ny} binary;",
      "var agree_v{i in X, j in Y : i < Nx} binary;",
      "",
      "# Minimize total energy: E = -J * sum(s_i * s_j) - h * sum(s_i)",
      "minimize energy:",
      "    -J * (sum{i in X, j in Y : j < Ny}",
      "              (4 * agree_h[i,j] - 2 * b[i,j] - 2 * b[i,j+1] + 1)",
      "        + sum{i in X, j in Y : i < Nx}",
      "              (4 * agree_v[i,j] - 2 * b[i,j] - 2 * b[i+1,j] + 1))",
      "    - h * sum{(i,j) in Sites} (2 * b[i,j] - 1);",
      "",
      "# Linearize s_i * s_j using agree variables",
      "s.t. ah1{i in X, j in Y : j < Ny}: agree_h[i,j] <= b[i,j];",
      "s.t. ah2{i in X, j in Y : j < Ny}: agree_h[i,j] <= b[i,j+1];",
      "s.t. ah3{i in X, j in Y : j < Ny}: agree_h[i,j] >= b[i,j] + b[i,j+1] - 1;",
      "",
      "s.t. av1{i in X, j in Y : i < Nx}: agree_v[i,j] <= b[i,j];",
      "s.t. av2{i in X, j in Y : i < Nx}: agree_v[i,j] <= b[i+1,j];",
      "s.t. av3{i in X, j in Y : i < Nx}: agree_v[i,j] >= b[i,j] + b[i+1,j] - 1;",
      "",
      "solve;",
      "",
      "# Display spin configuration",
      "printf '\\nGround state energy: %g\\n', energy;",
      "printf {j in Y} : '%s\\n',",
      "    if b[1,j] + b[2,j] + b[3,j] > 1 then '+' else '-';",
      "",
      "end;",
    ].join("\n"),
  },
  {
    name: "Kepler",
    label: "Kepler Orbit Transfer",
    desc: "Hohmann transfer orbit — minimize fuel for spacecraft orbital maneuver (Hohmann, 1925)",
    code: [
      "# Hohmann Transfer Orbit — Minimum Fuel Trajectory",
      "# Compute optimal two-impulse orbit transfer",
      "",
      "param G := 6.674e-11;        # Gravitational constant",
      "param M := 5.972e24;         # Earth mass (kg)",
      "param mu := G * M;           # Standard gravitational parameter",
      "",
      "param r1 := 6.678e6;         # LEO radius (m) ~300km altitude",
      "param r2 := 4.2164e7;        # GEO radius (m) ~35,786km altitude",
      "param pi := 3.14159265;",
      "",
      "# Orbital velocities (circular orbits)",
      "# v_circ = sqrt(mu / r)",
      "param v1_circ := sqrt(mu / r1);   # LEO velocity",
      "param v2_circ := sqrt(mu / r2);   # GEO velocity",
      "",
      "# Transfer orbit semi-major axis",
      "param a_transfer := (r1 + r2) / 2;",
      "",
      "# Velocities at transfer orbit periapsis and apoapsis",
      "# vis-viva: v^2 = mu * (2/r - 1/a)",
      "param v_transfer_1 := sqrt(mu * (2 / r1 - 1 / a_transfer));",
      "param v_transfer_2 := sqrt(mu * (2 / r2 - 1 / a_transfer));",
      "",
      "# Delta-v for each burn",
      "param dv1 := abs(v_transfer_1 - v1_circ);",
      "param dv2 := abs(v2_circ - v_transfer_2);",
      "",
      "# Transfer time (half orbital period)",
      "param T_transfer := pi * sqrt(a_transfer * a_transfer * a_transfer / mu);",
      "",
      "# Multi-impulse optimization with N possible burns",
      "param N := 5;",
      "set Burns := 1..N;",
      "",
      "var delta_v{k in Burns} >= 0;    # Magnitude of each burn",
      "var r{k in Burns} >= r1;          # Radius at each burn",
      "",
      "# Minimize total delta-v (fuel)",
      "minimize total_dv: sum{k in Burns} delta_v[k];",
      "",
      "# Must reach target orbit",
      "s.t. reach_target: r[N] >= r2;",
      "",
      "# Simplified energy constraint per burn",
      "s.t. energy_gain{k in Burns : k > 1}:",
      "    r[k] <= r[k-1] + delta_v[k] * r[k-1] * r[k-1] / mu;",
      "",
      "# Cannot exceed available fuel (Tsiolkovsky limit)",
      "param Isp := 300;             # Specific impulse (s)",
      "param mass_ratio := 5;        # Initial/final mass ratio",
      "param dv_max := Isp * 9.81 * log(mass_ratio);",
      "",
      "s.t. fuel_budget: sum{k in Burns} delta_v[k] <= dv_max;",
      "",
      "solve;",
      "",
      "printf '\\nHohmann reference dv: %g m/s\\n', dv1 + dv2;",
      "printf 'Optimized total dv:   %g m/s\\n', total_dv;",
      "printf 'Transfer time:        %g hours\\n', T_transfer / 3600;",
      "",
      "end;",
    ].join("\n"),
  },
  {
    name: "Kirchhoff",
    label: "Kirchhoff Circuit Network",
    desc: "Solve for optimal currents in a resistor network minimizing power dissipation (Kirchhoff, 1845)",
    code: [
      "# Kirchhoff's Laws — Minimum Power Dissipation",
      "# Find currents in a resistor network that minimize total power",
      "# while satisfying current conservation at every node",
      "",
      "set Nodes;                    # Circuit nodes",
      "set Edges within Nodes cross Nodes;  # Directed branches",
      "",
      "param R{(i,j) in Edges};      # Resistance of each branch (Ohms)",
      "param source{n in Nodes};     # External current injection (A)",
      "",
      "# Current flowing through each branch",
      "var I{(i,j) in Edges};",
      "",
      "# Power dissipated: P = I^2 * R",
      "# Linearized: minimize sum of |I| * R (L1 relaxation)",
      "var Iabs{(i,j) in Edges} >= 0;",
      "",
      "# Minimize total power dissipation",
      "minimize power: sum{(i,j) in Edges} R[i,j] * Iabs[i,j];",
      "",
      "# Kirchhoff's Current Law (KCL): conservation at each node",
      "# Sum of currents entering = sum of currents leaving + source",
      "s.t. KCL{n in Nodes}:",
      "    sum{(i,n) in Edges} I[i,n]",
      "    - sum{(n,j) in Edges} I[n,j]",
      "    = source[n];",
      "",
      "# Absolute value linearization",
      "s.t. abs_pos{(i,j) in Edges}: Iabs[i,j] >= I[i,j];",
      "s.t. abs_neg{(i,j) in Edges}: Iabs[i,j] >= -I[i,j];",
      "",
      "# Symmetry: if branch (i,j) exists, current is bounded",
      "s.t. max_current{(i,j) in Edges}: I[i,j] <= 100;",
      "s.t. min_current{(i,j) in Edges}: I[i,j] >= -100;",
      "",
      "solve;",
      "",
      "printf '\\nTotal power dissipation: %g W\\n', power;",
      "printf {(i,j) in Edges : abs(I[i,j]) > 0.01}:",
      "    'Branch %s -> %s: I = %6.3f A, P = %6.3f W\\n',",
      "    i, j, I[i,j], R[i,j] * Iabs[i,j];",
      "",
      "end;",
    ].join("\n"),
  },
];

// ====================================================================
//  Demo initialization
// ====================================================================

var lightThemeList = themeDefinitions.filter(function (d) { return !d.dark; });
var darkThemeList = themeDefinitions.filter(function (d) { return d.dark; });

function init() {
  var editorContainer = document.getElementById("editor");
  var mathContainer = document.getElementById("math-panel");
  var themePalette = document.getElementById("theme-palette");
  var examplePicker = document.getElementById("example-picker");

  var currentTheme = "github-light";
  var currentExample = 0;
  var view = createEditor(currentTheme, examples[currentExample].code);

  buildThemePalette(themePalette, currentTheme);
  buildExamplePicker(examplePicker, currentExample);

  function createEditor(themeName, doc) {
    while (editorContainer.firstChild) editorContainer.removeChild(editorContainer.firstChild);
    while (mathContainer.firstChild) mathContainer.removeChild(mathContainer.firstChild);

    var isDark = themeDefinitions.some(function (d) { return d.name === themeName && d.dark; });
    document.body.className = isDark ? "dark" : "light";

    return mathProgEditor({
      parent: editorContainer,
      mathPanel: mathContainer,
      doc: doc,
      theme: themeName,
    });
  }

  function switchTheme(themeName) {
    var doc = view.state.doc.toString();
    view.destroy();
    currentTheme = themeName;
    view = createEditor(themeName, doc);
    buildThemePalette(themePalette, currentTheme);
  }

  function switchExample(idx) {
    view.destroy();
    currentExample = idx;
    view = createEditor(currentTheme, examples[idx].code);
    buildExamplePicker(examplePicker, currentExample);
  }

  function buildExamplePicker(container, activeIdx) {
    while (container.firstChild) container.removeChild(container.firstChild);

    examples.forEach(function (ex, idx) {
      var btn = document.createElement("button");
      btn.className = "example-btn" + (idx === activeIdx ? " example-btn-active" : "");
      btn.title = ex.desc;

      var name = document.createElement("span");
      name.className = "example-name";
      name.textContent = ex.name;
      btn.appendChild(name);

      var desc = document.createElement("span");
      desc.className = "example-desc";
      desc.textContent = ex.label;
      btn.appendChild(desc);

      btn.addEventListener("click", function () { switchExample(idx); });
      container.appendChild(btn);
    });
  }

  function buildThemePalette(container, activeTheme) {
    while (container.firstChild) container.removeChild(container.firstChild);

    var lightLabel = document.createElement("span");
    lightLabel.className = "theme-section-label";
    lightLabel.textContent = "Light";
    container.appendChild(lightLabel);

    lightThemeList.forEach(function (def) {
      var btn = createThemeButton(def, activeTheme);
      btn.addEventListener("click", function () { switchTheme(def.name); });
      container.appendChild(btn);
    });

    var sep = document.createElement("span");
    sep.className = "theme-separator";
    container.appendChild(sep);

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
