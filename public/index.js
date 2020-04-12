const searchInput = document.getElementById("searchInput");
const buttonSearch = document.getElementById("buttonSearch");
const resultsSection = document.getElementById("resultsSection");

buttonSearch.onclick = async () => {
  resultsSection.innerHTML = "";
  const url = `search/${encodeURIComponent(searchInput.value)}`;

  const result = await fetch(url).then((r) => r.json());
  result.forEach((t) => {
    resultsSection.innerHTML += `<h3>${t.term}:</h3>`;

    t.docs.forEach((d) => {
      resultsSection.innerHTML += `<div><a href="static/${d.d}">${d.d}</a></div>`;
    });
  });
};
