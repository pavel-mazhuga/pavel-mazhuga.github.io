import { isPhone } from '../src/js/modules/validator';

test('validates phone correctly', () => {
    expect(isPhone('89999999999')).toBe(true);
    expect(isPhone('+79999999999')).toBe(true);
    expect(isPhone('+7 (999) 999-99-99')).toBe(true);
    expect(isPhone('+7999999')).toBe(true);
    expect(isPhone('')).toBe(false);
    expect(isPhone('assd')).toBe(false);
    expect(isPhone('assd02')).toBe(false);
});
