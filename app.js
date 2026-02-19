window.toggleRC = function() {
  const rc = document.getElementById("rcOptions");
  rc.style.display = rc.style.display === "flex" ? "none" : "flex";
};

window.toggleACC = function() {
  const acc = document.getElementById("accOptions");
  acc.style.display = acc.style.display === "flex" ? "none" : "flex";
};
