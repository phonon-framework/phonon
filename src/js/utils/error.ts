function onError() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('error', (event: ErrorEvent) => {
    console.error('-- Phonon Error --');
    console.error('An error has occured!'
      + ' ' + 'You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
    console.error(JSON.stringify(event));
  });
}

export default onError;
