const planks = document.querySelectorAll('.plank');
let currentIndex = 0;
let isTyping = false;

// 先把每个 plank 的原始内容缓存起来
const originalHTML = Array.from(planks).map(p => p.innerHTML);

// 重置函数：清空所有状态，相当于“刷新”
function resetAllPlanks() {
  planks.forEach((plank, i) => {
    plank.innerHTML = originalHTML[i];
    plank.style.opacity = '0';
    delete plank.dataset.revealed;
  });
  currentIndex = 0;
}

// 检查末尾并“刷新”——在 CodePen 用 resetAllPlanks
function checkEndAndReload() {
  if (currentIndex >= planks.length) {
    setTimeout(resetAllPlanks, 4000);
  }
}

function revealNextPlank() {
  if (isTyping || currentIndex >= planks.length) return;
  const plank = planks[currentIndex];

  if (plank.dataset.revealed) {
    currentIndex++;
    checkEndAndReload();
    return;
  }
  plank.dataset.revealed = 'true';
  plank.style.opacity = '1';

  // ——— 打字机效果 p4/p7/p15 ———
  if (plank.matches('.p4, .p7, .p15')) {
    isTyping = true;
    const lines = plank.innerHTML.split(/<br\s*\/?>/gi);
    plank.innerHTML = '';
    let li = 0, speed = 50;

    function typeLine() {
      if (li >= lines.length) {
        isTyping = false;
        currentIndex++;
        checkEndAndReload();
        return;
      }
      const div = document.createElement('div');
      div.className = 'line';
      plank.appendChild(div);
      const text = lines[li].replace(/<\/?[^>]+>/g, '').trim();
      let ci = 0;
      const id = setInterval(() => {
        div.textContent += text[ci++];
        if (ci >= text.length) {
          clearInterval(id);
          li++;
          setTimeout(typeLine, 200);
        }
      }, speed);
    }
    typeLine();
    return;
  }

  // ——— 颗粒爆散 p9 ———
  if (plank.classList.contains('p9')) {
    const txt = plank.textContent.trim();
    plank.innerHTML = txt.split('').map(c => `<span class="char">${c}</span>`).join('');
    plank.querySelectorAll('.char').forEach(span => {
      const x = (Math.random() - .5) * 200, y = (Math.random() - .5) * 200;
      span.style.transform = `translate(${x}px,${y}px)`;
      span.style.opacity = '0'; span.style.filter = 'blur(4px)';
    });
    requestAnimationFrame(() => {
      plank.querySelectorAll('.char').forEach(span => {
        span.style.transition = 'transform 1s ease-out, opacity 1s ease-out, filter 1s ease-out';
        span.style.transform = 'translate(0,0)'; span.style.opacity = '1'; span.style.filter = 'blur(0)';
      });
    });
    currentIndex++;
    checkEndAndReload();
    return;
  }

  // ——— 普通淡入段落 ———
  currentIndex++;
  checkEndAndReload();
}

document.body.addEventListener('click', revealNextPlank);
window.addEventListener('DOMContentLoaded', revealNextPlank);