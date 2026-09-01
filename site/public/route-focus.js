function focusRouteHeading() {
  const heading = document.querySelector('main h1');
  if (!(heading instanceof HTMLHeadingElement)) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });

  let announcer = document.querySelector('#route-announcer');
  if (!(announcer instanceof HTMLElement)) {
    announcer = document.createElement('p');
    announcer.id = 'route-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    document.body.append(announcer);
  }
  announcer.textContent = `Page changed: ${heading.textContent?.trim() ?? document.title}`;
}

window.addEventListener('pageshow', () => requestAnimationFrame(focusRouteHeading));
