phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './tpl'
    },
    i18n: null // for this example, we do not use internationalization
});


var app = phonon.navigator();

/**
 * The activity scope can be defined inside the page tag, but it is not necessary in our example.
*/
app.on({page: 'home', preventClose: false, content: null});

/**
 * On the second page, we define the activity scope inside pagetwo.tag
 * You can use readyDelay to add a small delay between the OnCreate and the OnReady callbacks
 * preventClose is true, so we have to define the close event (see pagetwo.tag)
*/
app.on({page: 'pagetwo', preventClose: true, content: null, readyDelay: 1});

// Let's go!
app.start();