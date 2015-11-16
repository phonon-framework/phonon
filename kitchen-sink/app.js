phonon.options({

	navigator: {
		defaultPage: 'home',
		animatePages: true,
		templateRootDirectory: 'contents/',
		enableBrowserBackButton: true // should be disabled on Cordova
	},

	i18n: {
		directory: 'lang/',
		localeFallback: 'en',
		localePreferred: 'en-US'
	}
});

var app = phonon.navigator();

app.on({page: 'home', content: 'home.html'});

app.on({page: 'pagedialog', content: 'pagedialog.html'}, function(activity) {

	activity.onCreate(function() {

		document.querySelector('#show-alert').on('tap', function() {
			phonon.alert('Example', 'Hello');
		});

		document.querySelector('#show-confirm').on('tap', function() {
			var confirm = phonon.confirm('Example', 'Hello');
			confirm.on('confirm', function() {
				phonon.alert('Confirmed!');
			});
			confirm.on('cancel', function(value) {
				phonon.alert('Canceled!');
			});
		});

		document.querySelector('#show-prompt').on('tap', function() {
			var prompt = phonon.prompt('Example', 'Hello');
			prompt.on('confirm', function(value) {
				phonon.alert(value, 'Inserted Value');
			});
			prompt.on('cancel', function() {
				phonon.alert('Prompt Canceled');
			});
		});

		document.querySelector('#show-indicator').on('tap', function() {
			var indicator = phonon.indicator('Please wait 3 seconds', false);
			window.setTimeout(function() {
				indicator.close();
			},3000);
		});
	});
});

app.on({page: 'pageform', content: 'pageform.html'});
app.on({page: 'pagefla', content: 'pagefla.html'});
app.on({page: 'pagegrid', content: 'pagegrid.html'});

app.on({page: 'pagelist', content: 'pagelist.html'});
app.on({page: 'pageaccordion', content: 'pageaccordion.html'});

app.on({page: 'pagenotif', content: 'pagenotif.html', readyDelay: 500}, function(activity) {

	activity.onCreate(function() {

		document.querySelector('#show-auto-notif').on('tap', function() {
			phonon.notif('HELLO', 3000, false);
		});

		document.querySelector('#show-notif').on('tap', function() {
			phonon.notif('#notif-example').show();
		});
	});

	activity.onReady(function() {

		phonon.notif('Welcome!', 3000, true);

	});
});

app.on({page: 'pagepanel', content: 'pagepanel.html'});
app.on({page: 'pagepopover', content: 'pagepopover.html'});
app.on({page: 'pagepreloader', content: 'pagepreloader.html'}, function(activity) {

	// Show preloaders when the page is visible
	activity.onReady(function() {
		phonon.preloader(document.querySelector('#my-circle')).show();
		phonon.preloader(document.querySelector('#my-determinate')).show();
	});

	// Hiden preloaders when the page is invisible
	activity.onHidden(function() {
		phonon.preloader(document.querySelector('#my-circle')).hide();
		phonon.preloader(document.querySelector('#my-determinate')).hide();
	});
});

app.on({page: 'pagesidepanel', content: 'pagesidepanel.html'});


app.on({page: 'pagetable', content: 'pagetable.html'});

app.on({page: 'pagetabs', content: 'pagetabs.html'}, function(activity) {
    activity.onTabChanged(function(tabNumber) {
        document.querySelector('.tab-number').innerHTML = tabNumber;
    });
});

app.start();
