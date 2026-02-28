const m = require('./dist/tiktik.cjs');
console.log('Keys:', Object.keys(m));
console.log('Tiktik type:', typeof m.Tiktik);
if (m.Tiktik) {
  m.Tiktik.configure({});
  console.log('configure() - PASSED');
  const id = m.Tiktik.showToast({ message: 'test' });
  console.log('showToast() returned:', id, '- PASSED');
  console.log('SSR SAFETY TEST: ALL PASSED');
} else {
  console.log('SSR test FAILED - Tiktik not found');
}
