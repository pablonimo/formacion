const dialog = document.querySelector('#photo-dialog');
const image = document.querySelector('#photo-image');
const title = document.querySelector('#photo-dialog-title');
const caption = document.querySelector('#photo-dialog-caption');
const counter = document.querySelector('#photo-counter');
const triggers = [...document.querySelectorAll('.photo-trigger')];
let activeIndex = 0;

function showPhoto(index) {
  activeIndex = (index + triggers.length) % triggers.length;
  const trigger = triggers[activeIndex];
  const source = trigger.querySelector('img');
  image.src = source.src;
  image.alt = source.alt;
  title.textContent = trigger.dataset.title || '';
  caption.textContent = trigger.dataset.caption || '';
  counter.textContent = `${activeIndex + 1} / ${triggers.length}`;
}

triggers.forEach((trigger, index) => {
  trigger.addEventListener('click', () => {
    showPhoto(index);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
});

document.querySelector('#photo-close').addEventListener('click', () => dialog.close());
document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(activeIndex - 1));
document.querySelector('#photo-next').addEventListener('click', () => showPhoto(activeIndex + 1));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(activeIndex + 1);
});
