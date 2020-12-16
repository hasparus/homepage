export function copyToClipboard(value: string | number) {
  void window.navigator.clipboard.writeText(String(value)).then(() => {
    // eslint-disable-next-line no-alert
    window.alert(`copied ${value} to clipboard`);
  });
}
