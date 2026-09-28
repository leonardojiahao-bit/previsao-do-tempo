const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusElement = document.querySelector("#status");
const weatherContent = document.querySelector("#weather-content");
const themeToggle = document.querySelector("#theme-toggle");
const locationName = document.querySelector("#location-name");
const locationDetails = document.querySelector("#location-details");
const weatherIcon = document.querySelector("#weather-icon");
const currentDescription = document.querySelector("#current-description");
const currentTemperature = document.querySelector("#current-temperature");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const updatedTime = document.querySelector("#updated-time");
const forecastList = document.querySelector("#forecast-list");
const favoriteButton = document.querySelector("#favorite-button");
const favoritesStatus = document.querySelector("#favorites-status");
const favoritesList = document.querySelector("#favorites-list");
const favoritesRepository = window.favoritesRepository;

let selectedCity = null;
let savedFavorites = [];

const weatherCodes = {
  0: { description: "Céu limpo", icon: "☀" },
  1: { description: "Predominantemente limpo", icon: "🌤" },
  2: { description: "Parcialmente nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁" },
  45: { description: "Neblina", icon: "🌫" },
  48: { description: "Neblina congelante", icon: "🌫" },
  51: { description: "Garoa fraca", icon: "🌦" },
  53: { description: "Garoa", icon: "🌦" },
  55: { description: "Garoa forte", icon: "🌧" },
  61: { description: "Chuva fraca", icon: "🌧" },
  63: { description: "Chuva moderada", icon: "🌧" },
  65: { description: "Chuva forte", icon: "🌧" },
  71: { description: "Neve fraca", icon: "🌨" },
  73: { description: "Neve moderada", icon: "🌨" },
  75: { description: "Neve forte", icon: "❄" },
  80: { description: "Pancadas fracas", icon: "🌦" },
  81: { description: "Pancadas de chuva", icon: "🌧" },
  82: { description: "Pancadas fortes", icon: "⛈" },
  95: { description: "Trovoada", icon: "⛈" },
  96: { description: "Trovoada com granizo", icon: "⛈" },
  99: { description: "Trovoada forte com granizo", icon: "⛈" }
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { description: "Condição desconhecida", icon: "—" };
}

function formatDay(dateString, index) {
  if (index === 0) return "Hoje";

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

function formatTime(timeString) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timeString));
}

function formatLocationDetails(city) {
  return [city.admin1 || city.estado, city.country || city.pais]
    .filter(Boolean)
    .join(" · ");
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
}

function setFavoritesStatus(message, isError = false) {
  favoritesStatus.textContent = message;
  favoritesStatus.classList.toggle("error", isError);
}

function setSearchLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.textContent = isLoading ? "Consultando..." : "Consultar clima";
}

function isSelectedCitySaved() {
  if (!selectedCity) return false;

  return savedFavorites.some((favorite) => (
    Number(favorite.latitude) === Number(selectedCity.latitude)
    && Number(favorite.longitude) === Number(selectedCity.longitude)
  ));
}

function updateFavoriteButton() {
  const saved = isSelectedCitySaved();
  favoriteButton.disabled = !selectedCity || !favoritesRepository.available || saved;
  favoriteButton.textContent = saved ? "★ Cidade salva" : "☆ Favoritar cidade";
}

async function findCity(city) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "pt",
    format: "json"
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("O serviço de localização está temporariamente indisponível.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Cidade não encontrada. Tente outro nome.");
  }

  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");

  url.search = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5"
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("O serviço de clima está temporariamente indisponível.");
  }

  return response.json();
}

function renderCurrentWeather(city, weather) {
  const current = weather.current;
  const info = getWeatherInfo(current.weather_code);

  locationName.textContent = city.name || city.nome;
  locationDetails.textContent = formatLocationDetails(city);
  weatherIcon.textContent = info.icon;
  currentDescription.textContent = info.description;
  currentTemperature.textContent = Math.round(current.temperature_2m);
  feelsLike.textContent = Math.round(current.apparent_temperature);
  humidity.textContent = `${current.relative_humidity_2m}%`;
  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  updatedTime.textContent = formatTime(current.time);
}

function renderForecast(weather) {
  const daily = weather.daily;

  forecastList.innerHTML = daily.time.map((date, index) => {
    const info = getWeatherInfo(daily.weather_code[index]);
    const maximum = Math.round(daily.temperature_2m_max[index]);
    const minimum = Math.round(daily.temperature_2m_min[index]);

    return `
      <article class="forecast-item">
        <span class="forecast-day">${formatDay(date, index)}</span>
        <span class="forecast-condition">${info.icon} ${info.description}</span>
        <span class="forecast-temperature">${maximum}° / ${minimum}°</span>
      </article>
    `;
  }).join("");
}

function createFavoriteCard(favorite) {
  const card = document.createElement("article");
  card.className = "favorite-card";

  const content = document.createElement("div");
  const title = document.createElement("h3");
  const details = document.createElement("p");
  title.textContent = favorite.nome;
  details.textContent = formatLocationDetails(favorite) || "Localização salva";
  content.append(title, details);

  const actions = document.createElement("div");
  actions.className = "favorite-actions";

  const consultButton = document.createElement("button");
  consultButton.type = "button";
  consultButton.className = "secondary-button";
  consultButton.textContent = "Consultar";
  consultButton.addEventListener("click", () => searchFavorite(favorite));

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "danger-button";
  removeButton.textContent = "Remover";
  removeButton.addEventListener("click", () => removeFavorite(favorite.id, removeButton));

  actions.append(consultButton, removeButton);
  card.append(content, actions);
  return card;
}

function renderFavorites() {
  favoritesList.replaceChildren();

  if (savedFavorites.length === 0) {
    setFavoritesStatus("Nenhuma cidade favorita ainda. Consulte uma cidade e salve-a aqui.");
    updateFavoriteButton();
    return;
  }

  const fragment = document.createDocumentFragment();
  savedFavorites.forEach((favorite) => fragment.append(createFavoriteCard(favorite)));
  favoritesList.append(fragment);
  setFavoritesStatus(`${savedFavorites.length} cidade${savedFavorites.length === 1 ? "" : "s"} salva${savedFavorites.length === 1 ? "" : "s"}.`);
  updateFavoriteButton();
}

async function loadFavorites() {
  if (!favoritesRepository.available) {
    setFavoritesStatus("Configure o Supabase em config.js para ativar a persistência.", true);
    updateFavoriteButton();
    return;
  }

  setFavoritesStatus("Carregando favoritos...");

  try {
    savedFavorites = await favoritesRepository.list();
    renderFavorites();
  } catch (error) {
    console.error("Erro ao listar favoritos:", error);
    setFavoritesStatus("Não foi possível carregar as cidades favoritas.", true);
  }
}

async function addSelectedCityToFavorites() {
  if (!selectedCity || !favoritesRepository.available) return;

  favoriteButton.disabled = true;
  favoriteButton.textContent = "Salvando...";

  try {
    await favoritesRepository.add(selectedCity);
    await loadFavorites();
    setFavoritesStatus(`${selectedCity.name} foi adicionada aos favoritos.`);
  } catch (error) {
    console.error("Erro ao salvar favorito:", error);

    if (error.code === "23505") {
      setFavoritesStatus("Esta cidade já está nos favoritos.", true);
    } else {
      setFavoritesStatus("Não foi possível salvar esta cidade.", true);
    }
  } finally {
    updateFavoriteButton();
  }
}

async function removeFavorite(id, button) {
  button.disabled = true;
  button.textContent = "Removendo...";

  try {
    await favoritesRepository.remove(id);
    await loadFavorites();
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    button.disabled = false;
    button.textContent = "Remover";
    setFavoritesStatus("Não foi possível remover esta cidade.", true);
  }
}

async function displayWeather(city) {
  const weather = await getWeather(city.latitude, city.longitude);
  selectedCity = {
    name: city.name || city.nome,
    admin1: city.admin1 || city.estado || null,
    country: city.country || city.pais || null,
    latitude: Number(city.latitude),
    longitude: Number(city.longitude)
  };

  renderCurrentWeather(selectedCity, weather);
  renderForecast(weather);
  weatherContent.classList.remove("is-hidden");
  updateFavoriteButton();
  setStatus("");
}

async function searchWeather(cityName) {
  const city = await findCity(cityName);
  await displayWeather(city);
}

async function searchFavorite(favorite) {
  weatherContent.classList.add("is-hidden");
  setSearchLoading(true);
  setStatus(`Consultando o clima em ${favorite.nome}...`);

  try {
    await displayWeather(favorite);
    cityInput.value = favorite.nome;
    weatherContent.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setStatus(error.message || "Não foi possível realizar a consulta.", true);
  } finally {
    setSearchLoading(false);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    setStatus("Digite o nome de uma cidade.", true);
    return;
  }

  weatherContent.classList.add("is-hidden");
  setSearchLoading(true);
  setStatus("Consultando o clima...");

  try {
    await searchWeather(city);
  } catch (error) {
    setStatus(error.message || "Não foi possível realizar a consulta.", true);
  } finally {
    setSearchLoading(false);
  }
});

favoriteButton.addEventListener("click", addSelectedCityToFavorites);

document.querySelectorAll(".city-chip").forEach((button) => {
  button.addEventListener("click", () => {
    cityInput.value = button.dataset.city;
    form.requestSubmit();
  });
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  themeToggle.textContent = nextTheme === "dark" ? "☀" : "◐";
  localStorage.setItem("weather-theme", nextTheme);
});

const savedTheme = localStorage.getItem("weather-theme");
document.documentElement.dataset.theme = savedTheme
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
themeToggle.textContent = document.documentElement.dataset.theme === "dark" ? "☀" : "◐";

setStatus("Escolha uma cidade para consultar o clima.");
loadFavorites();
