/**
 * FICTIONAL TEST DATA (dev only): lets the store finder be checked with
 * content. These shops do not exist. Used only when import.meta.env.DEV and
 * ?stores=test, so the production build never contains them.
 */
export const testStores = [
  {
    id: 'test-1',
    name: 'Test Shop One (fictional)',
    wilaya: '16',
    address: 'Test address 1',
    phone: null,
    type: 'retail',
    source: { url: 'test', confidence: 'reported' },
  },
  {
    id: 'test-2',
    name: 'Test Wholesale Two (fictional)',
    wilaya: '31',
    address: 'Test address 2',
    phone: null,
    type: 'wholesale',
    source: { url: 'test', confidence: 'reported' },
  },
  {
    id: 'test-3',
    name: 'Test Kiosk Three (fictional)',
    wilaya: '16',
    address: 'Test address 3',
    phone: null,
    type: 'retail',
    source: { url: 'test', confidence: 'reported' },
  },
];
