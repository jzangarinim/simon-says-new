export const createRipple = (e) => {
  const btn = e.currentTarget;
  const span = document.createElement("span");
  const size = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  span.className = "ripple";
  span.style.width = span.style.height = size + "px";
  span.style.left = e.clientX - rect.left - size / 2 + "px";
  span.style.top = e.clientY - rect.top - size / 2 + "px";
  btn.appendChild(span);
  setTimeout(() => span.remove(), 25);
};
