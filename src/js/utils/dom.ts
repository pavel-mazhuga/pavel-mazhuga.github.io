export function getOffsetTop(el: Element, windowScrollY = window.scrollY, heightOffset = 0): number {
    return el.getBoundingClientRect().top + windowScrollY - heightOffset;
}
