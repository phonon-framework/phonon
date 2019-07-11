function getLang() {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
}

phonon.options({
  navigator: {
    defaultPage: 'home',
    animatePages: true,
    templateRootDirectory: 'contents/',
    enableBrowserBackButton: true, // should be disabled on Cordova
  },

  i18n: {
    directory: 'lang/',
    localeFallback: 'en',
    localePreferred: getLang(),
  },
});

const app = phonon.navigator();

app.on({ page: 'home', content: 'home.html' });

app.on({ page: 'pagedialog', content: 'pagedialog.html' }, (activity) => {
  activity.onCreate(() => {
    document.querySelector('#show-alert').on('tap', () => {
      phonon.alert('Example', 'Hello');
    });

    document.querySelector('#show-confirm').on('tap', () => {
      const confirm = phonon.confirm('Example', 'Hello');
      confirm.on('confirm', () => {
        phonon.alert('Confirmed!');
      });
      confirm.on('cancel', (value) => {
        phonon.alert('Canceled!');
      });
    });

    document.querySelector('#show-prompt').on('tap', () => {
      const prompt = phonon.prompt('Example', 'Hello');
      prompt.on('confirm', (value) => {
        phonon.alert(value, 'Inserted Value');
      });
      prompt.on('cancel', () => {
        phonon.alert('Prompt Canceled');
      });
    });

    document.querySelector('#show-indicator').on('tap', () => {
      const indicator = phonon.indicator('Please wait 3 seconds', false);
      window.setTimeout(() => {
        indicator.close();
      }, 3000);
    });
  });
});

app.on({ page: 'pageform', content: 'pageform.html' });
app.on({ page: 'pagefla', content: 'pagefla.html' });
app.on({ page: 'pagegrid', content: 'pagegrid.html' });

app.on({ page: 'pagelist', content: 'pagelist.html' });
app.on({ page: 'pageaccordion', content: 'pageaccordion.html' });
app.on({ page: 'pageautocomplete', content: 'pageautocomplete.html' });

app.on({ page: 'pagenotif', content: 'pagenotif.html', readyDelay: 500 }, (activity) => {
  activity.onCreate(() => {
    document.querySelector('#show-auto-notif').on('tap', () => {
      phonon.notif('HELLO', 3000, false);
    });

    document.querySelector('#show-notif').on('tap', () => {
      phonon.notif('#notif-example').show();
    });

    document.querySelector('#show-notif-button').on('tap', () => {
      phonon.notif('HELLO', 3000, true, 'Bye');
    });
  });

  activity.onReady(() => {
    phonon.notif('Welcome!', 3000, true);
  });
});

app.on({ page: 'pagepanel', content: 'pagepanel.html' });
app.on({ page: 'pagepopover', content: 'pagepopover.html' });
app.on({ page: 'pagepreloader', content: 'pagepreloader.html' }, (activity) => {
  // Show preloaders when the page is visible
  activity.onReady(() => {
    phonon.preloader(document.querySelector('#my-circle')).show();
    phonon.preloader(document.querySelector('#my-determinate')).show();
  });

  // Hiden preloaders when the page is invisible
  activity.onHidden(() => {
    phonon.preloader(document.querySelector('#my-circle')).hide();
    phonon.preloader(document.querySelector('#my-determinate')).hide();
  });
});

app.on({ page: 'pagesidepanel', content: 'pagesidepanel.html' });


app.on({ page: 'pagetable', content: 'pagetable.html' });

app.on({ page: 'pagetabs', content: 'pagetabs.html' }, (activity) => {
  activity.onTabChanged((tabNumber) => {
    document.querySelector('.tab-number').innerHTML = tabNumber;
  });
});

app.start();
