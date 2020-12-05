export function copyToClipboard(value: string | number) {
  window.navigator.clipboard.writeText(String(value)).then(() => {
    // eslint-disable-next-line no-alert
    window.alert(`copied ${value} to clipboard`);
  });
}
