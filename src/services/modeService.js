export function isDemoMode() {
  return (
    localStorage.getItem('gigsda_mode') === 'demo'
  );
}