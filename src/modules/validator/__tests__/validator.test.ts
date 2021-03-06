import { isPhone, isEmail } from '../index';

it('validates phone correctly', () => {
    expect(isPhone('89999999999')).toBe(true);
    expect(isPhone('+79999999999')).toBe(true);
    expect(isPhone('+7 (999) 999-99-99')).toBe(true);
    expect(isPhone('+7999999')).toBe(true);
    expect(isPhone('')).toBe(false);
    expect(isPhone('text')).toBe(false);
});

it('validates email correctly', () => {
    expect(isEmail('example@domain.com')).toBe(true);
    expect(isEmail('example@domain')).toBe(false);
});
