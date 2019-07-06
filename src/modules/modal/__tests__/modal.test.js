import Modal from '../index';
import { withPrefix } from '../utils';

const element = document.createElement('div');
const name = 'test';
element.dataset.modal = name;

beforeEach(() => {
    document.body.appendChild(element);
});

afterEach(() => {
    document.body.innerHTML = '';
});

it('throws when no name provided', () => {
    expect(() => new Modal()).toThrow(withPrefix('Expected a name as a first argument.'));
});

it('throws when no DOM element found', () => {
    element.remove();
    expect(() => new Modal(name)).toThrow(withPrefix('Element not found.'));
});

it('inits properly', () => {
    Modal.prototype.init = jest.fn();

    const openButton = document.createElement('button');
    openButton.dataset.modalOpen = name;
    document.body.appendChild(openButton);

    const closeButton = document.createElement('button');
    closeButton.dataset.modalClose = name;
    document.body.appendChild(closeButton);

    const modal = new Modal(name);

    expect(modal.init).toHaveBeenCalledTimes(1);
    expect(modal.element).toEqual(element);
    expect(modal.isOpen).toEqual(false);
    expect(modal.elementContent).toBeNull();
    expect(modal.openButtons.length).toEqual(1);
    expect(modal.closeButtons.length).toEqual(1);
});
