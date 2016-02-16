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
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
app.on({page: 'home', preventClose: false, content: null});

/**
 * However, on the second page, we want to define the activity scope.
 * [1] On the create callback, we add tap events on buttons. The OnCreate callback is called once.
 * [2] If the user does not tap on buttons, we cancel the page transition. preventClose => true
 * [3] The OnReady callback is called every time the user comes on this page,
 * here we did not implement it, but if you do, you can use readyDelay to add a small delay
 * between the OnCreate and the OnReady callbacks
*/
app.on({page: 'pagetwo', preventClose: true, content: 'pagetwo.html', readyDelay: 1}, function(activity) {

    var action = null;

    var onAction = function(evt) {
        var target = evt.target;
        action = 'ok';

        if(target.getAttribute('data-order') === 'order') {
            phonon.alert('Thank you for your order!', 'Dear customer');

        } else {
            phonon.alert('Your order has been canceled.', 'Dear customer');
        }
    };

    activity.onCreate(function() {
        document.querySelector('.order').on('tap', onAction);
        document.querySelector('.cancel').on('tap', onAction);
    });

    activity.onClose(function(self) {
        if(action !== null) {
            self.close();
        } else {
            phonon.alert('Before leaving this page, you must perform an action.', 'Action required');
        }
    });

    activity.onHidden(function() {
        action = null;
    });

    activity.onHashChanged(function(pizza) {
        document.querySelector('.pizza').textContent = pizza;
    });
});

// Let's go!
app.start();

document.on('pagecreated', function(event) {
	console.error('global state pagecreated: ' + event.detail.page)
})
document.on('pageopened', function(event) {
	console.error('global state pageopened: ' + event.detail.page)
})
document.on('pagetransitionend', function(event) {
	console.error('global state pagetransitionend: ' + event.detail.page)
})
document.on('pagehidden', function(event) {
	console.error('global state pagehidden: ' + event.detail.page)
})
document.on('pagetabchanged', function(event) {
	console.error('global state pagetabchanged: ' + event.detail.page)
})
document.on('pageclosed', function(event) {
	console.error('global state pageclosed: ' + event.detail.page)
})
document.on('pagehash', function(event) {
	console.error('global state pagehash: ' + event.detail.page)
	console.log('global a ' + event.detail.req[0]);
	console.log('global b ' + event.detail.req[1]);
	console.log('global c ' + event.detail.req[2]);
})
