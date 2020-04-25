const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const buttonSearch = document.getElementById("buttonSearch");
const resultsSection = document.getElementById("resultsSection");

searchForm.onsubmit = async (e) => {
  e.preventDefault();

  resultsSection.innerHTML = "";
  if (!searchInput.value) return;
  const url = `search/${encodeURIComponent(searchInput.value)}`;

  const results = await fetch(url).then((r) => r.json());
  results.forEach((r) => {
    resultsSection.innerHTML += `
      <div class="result">
        <a href="static/${r.link}">${r.link}</a>
        <p>${r.sample}...</p>
      </div>`;
  });
};
