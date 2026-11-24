const images = [...document.querySelectorAll(".gallery a")];
const lightbox = document.getElementById("lightbox");
const viewerImage = document.getElementById("lightbox-image");
const counter = document.getElementById("image-counter");
let current = 0;
const showImage = index => {
  current = (index + images.length) % images.length;
  viewerImage.src = images[current].href;
  viewerImage.alt = images[current].querySelector("img").alt;
  counter.textContent = `Image ${current + 1} of ${images.length}`;
};
images.forEach((link, index) => {
  link.addEventListener("click", event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showImage(index);
    lightbox.showModal();
  });
});
document.getElementById("close-lightbox").addEventListener("click", () => lightbox.close());
document.getElementById("previous-image").addEventListener("click", () => showImage(current - 1));
document.getElementById("next-image").addEventListener("click", () => showImage(current + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showImage(current + (event.key === "ArrowRight" ? 1 : -1));
  }
});
