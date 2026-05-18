/**
 * Animation Engine — GBM CC Fase II Reports Dashboard
 * CSS transitions + requestAnimationFrame for 60fps performance.
 * Respects prefers-reduced-motion user preference.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade-in an element with a vertical slide.
 * @param {HTMLElement} element - Target element
 * @param {number} delay - Delay in ms before animation starts
 */
export function fadeIn(element, delay = 0) {
  if (!element) return;

  if (prefersReducedMotion) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    return;
  }

  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';

  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, delay);
}

/**
 * Animate a number from 0 to targetValue using requestAnimationFrame.
 * Uses ease-out quad easing for natural deceleration.
 * @param {HTMLElement} element - Element whose textContent will be updated
 * @param {number} targetValue - Final numeric value
 * @param {number} duration - Animation duration in ms
 */
export function countUp(element, targetValue, duration = 1500) {
  if (!element) return;

  if (prefersReducedMotion) {
    element.textContent = Math.round(targetValue);
    return;
  }

  const startTime = performance.now();

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuad(progress);
    const currentValue = Math.round(easedProgress * targetValue);

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Apply staggered fadeIn to a list of elements.
 * @param {NodeList|Array} elements - Collection of elements
 * @param {number} delay - Incremental delay between each element in ms
 */
export function staggerList(elements, delay = 75) {
  if (!elements || elements.length === 0) return;

  const list = Array.from(elements);
  list.forEach((el, index) => {
    fadeIn(el, index * delay);
  });
}

/**
 * Animate a progress bar fill from 0% to targetWidth%.
 * @param {HTMLElement} element - The progress fill element
 * @param {number} targetWidth - Target width percentage (0-100)
 * @param {number} duration - Transition duration in ms
 */
export function animateBar(element, targetWidth, duration = 800) {
  if (!element) return;

  if (prefersReducedMotion) {
    element.style.width = `${targetWidth}%`;
    return;
  }

  element.style.width = '0%';
  element.style.transition = `width ${duration}ms ease-out`;

  requestAnimationFrame(() => {
    element.style.width = `${targetWidth}%`;
  });
}

/**
 * Show skeleton loading placeholders inside a container.
 * Clones the #skeleton-template content and appends it.
 * @param {HTMLElement} container - Container to append skeletons to
 * @param {number} count - Number of skeleton cards to show
 */
export function showSkeleton(container, count = 4) {
  if (!container) return;

  const template = document.getElementById('skeleton-template');
  if (!template) return;

  for (let i = 0; i < count; i++) {
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
  }
}

/**
 * Remove all skeleton loader elements from a container.
 * @param {HTMLElement} container - Container to clear skeletons from
 */
export function hideSkeleton(container) {
  if (!container) return;

  const skeletons = container.querySelectorAll('.skeleton-card');
  skeletons.forEach((el) => el.remove());
}

/**
 * Observe elements matching a selector and trigger fadeIn when they
 * enter the viewport. Each element animates only once.
 * @param {string} selector - CSS selector for elements to observe
 */
export function observeElements(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  if (prefersReducedMotion) {
    elements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fadeIn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
}
