const planks = document.querySelectorAll('.plank');
let currentIndex = 0;

function revealNextPlank() {
  if (currentIndex >= planks.length) return;
  const plank = planks[currentIndex];

  // 防重复
  if (plank.dataset.revealed) {
    currentIndex++;
    return;
  }
  plank.dataset.revealed = 'true';

  // 基础淡入
  plank.style.opacity = '1';

  // 1) 打字机 —— p4, p7, p15
  if (plank.matches('.p4, .p7, .p15')) {
    // 拿到原始含 <br> 的 HTML
    const rawHTML = plank.innerHTML;
    // 拆成多行数组
    const lineHTMLs = rawHTML.split(/<br\s*\/?>/gi);

    // 清空，为打字做准备
    plank.innerHTML = '';

    let lineIndex = 0;
    const speed = 50; // 每字符间隔 ms

    function typeLine() {
      if (lineIndex >= lineHTMLs.length) {
        // 一行都打完了，进入下一个
        currentIndex++;
        return;
      }

      // 新建一行容器
      const lineDiv = document.createElement('div');
      lineDiv.className = 'line';
      plank.appendChild(lineDiv);

      // 剥离所有标签，只保留纯文本
      const text = lineHTMLs[lineIndex]
        .replace(/<\/?[^>]+(>|$)/g, '')
        .trim();

      let charIndex = 0;
      const tid = setInterval(() => {
        lineDiv.textContent += text[charIndex++];
        if (charIndex >= text.length) {
          clearInterval(tid);
          lineIndex++;
          // 每行结束后稍微停顿
          setTimeout(typeLine, 200);
        }
      }, speed);
    }

    typeLine();
    return;
  }

  // 2) 颗粒爆散 —— p9
  if (plank.classList.contains('p9')) {
    const text = plank.textContent.trim();
    plank.innerHTML = text
      .split('')
      .map(c => `<span class="char">${c}</span>`)
      .join('');
    plank.querySelectorAll('.char').forEach(span => {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      span.style.transform = `translate(${x}px,${y}px)`;
      span.style.opacity = '0';
      span.style.filter = 'blur(4px)';
    });
    requestAnimationFrame(() => {
      plank.querySelectorAll('.char').forEach(span => {
        span.style.transition = 'transform 1s ease-out, opacity 1s ease-out, filter 1s ease-out';
        span.style.transform = 'translate(0,0)';
        span.style.opacity = '1';
        span.style.filter = 'blur(0)';
      });
    });
    currentIndex++;
    return;
  }

  // 3) 其余段落 —— 直接淡入
  currentIndex++;
}

document.body.addEventListener('click', revealNextPlank);
window.addEventListener('DOMContentLoaded', revealNextPlank);