const filterInput = document.getElementById("filter");
const items = Array.from(document.querySelectorAll("[data-item]"));
const resultCount = document.getElementById("result-count");

const updateCount = (count) => {
  if (resultCount) {
    resultCount.textContent = String(count);
  }
};

const applyFilter = () => {
  const term = filterInput ? filterInput.value.trim().toLowerCase() : "";
  let visible = 0;

  items.forEach((item) => {
    const name = item.dataset.name || "";
    const tags = item.dataset.tags || "";
    const haystack = `${name} ${tags}`.toLowerCase();
    const matches = term.length === 0 || haystack.includes(term);
    item.hidden = !matches;
    if (matches) {
      visible += 1;
    }
  });

  updateCount(visible);
};

if (filterInput) {
  filterInput.addEventListener("input", applyFilter);
}

applyFilter();
