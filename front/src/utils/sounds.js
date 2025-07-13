export function playSound(name) {
  const audio = new Audio(`/sounds/${name}.mp3`);
  audio.volume = 0.05;
  audio.play();
}
