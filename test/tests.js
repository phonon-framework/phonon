
/*
QUnit.test('Bad init', function( assert ) {

    try {

        Phonon.i18n({directory: null, defaultLocale: null, preferredLocale: null});

        Phonon.i18n.getAll(function () {

            alert()

        });

    } catch(e) {

        console.log(e.message);

        assert.throws(
            function() {
                throw 'TypeError';
            },
            'throws with just a message, not using the expected argument'
        );  
    }
});
*/

QUnit.test('Good init', function( assert ) {

    expect(0);

    try {

        Phonon.i18n({directory: '../samples/i18n-sample/res/lang/', defaultLocale: 'en'});

        Phonon.i18n.bind('tg');

        Phonon.i18n.get(['a', 'b'] ,function () {

        });
        
    } catch(e) {

        console.error(e.message);

        assert.throws(
            function() {
                throw 'Error';
            },
            'throws with just a message, not using the expected argument'
        );  
    }

});
