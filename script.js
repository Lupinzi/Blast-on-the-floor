const planks = document.querySelectorAll('.plank');
let currentIndex = 0;
let isTyping = false; // ← 新增：防止中断动画

function revealNextPlank() {
  if (isTyping || currentIndex >= planks.length) return;

  const plank = planks[currentIndex];

  if (plank.dataset.revealed) {
    currentIndex++;
    return;
  }
  plank.dataset.revealed = 'true';

  plank.style.opacity = '1';

  // 打字机效果 —— p4, p7, p15
  if (plank.matches('.p4, .p7, .p15')) {
    isTyping = true; // 锁定输入

    const rawHTML = plank.innerHTML;
    const lineHTMLs = rawHTML.split(/<br\s*\/?>/gi);
    plank.innerHTML = '';

    let lineIndex = 0;
    const speed = 50;

    function typeLine() {
      if (lineIndex >= lineHTMLs.length) {
        isTyping = false; // 打字结束，解锁
        currentIndex++;
        return;
      }

      const lineDiv = document.createElement('div');
      lineDiv.className = 'line';
      plank.appendChild(lineDiv);

      const text = lineHTMLs[lineIndex].replace(/<\/?[^>]+(>|$)/g, '').trim();
      let charIndex = 0;

      const tid = setInterval(() => {
        lineDiv.textContent += text[charIndex++];
        if (charIndex >= text.length) {
          clearInterval(tid);
          lineIndex++;
          setTimeout(typeLine, 200);
        }
      }, speed);
    }

    typeLine();
    return;
  }

  // 颗粒爆散 —— p9
  if (plank.classList.contains('p9')) {
    const text = plank.textContent.trim();
    plank.innerHTML = text
      .split('')
      .map(c => `<span class="char">${c}</span>`)
      .join('');

    plank.querySelectorAll('.char').forEach(span => {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      span.style.transform = `translate(${x}px, ${y}px)`;
      span.style.opacity = '0';
      span.style.filter = 'blur(4px)';
    });

    requestAnimationFrame(() => {
      plank.querySelectorAll('.char').forEach(span => {
        span.style.transition = 'transform 1s ease-out, opacity 1s ease-out, filter 1s ease-out';
        span.style.transform = 'translate(0, 0)';
        span.style.opacity = '1';
        span.style.filter = 'blur(0)';
      });
    });

    currentIndex++;
    return;
  }

  // 其它段落：直接淡入
  currentIndex++;
}

document.body.addEventListener('click', revealNextPlank);
window.addEventListener('DOMContentLoaded', revealNextPlank);