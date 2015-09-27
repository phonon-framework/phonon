<pagetwo class="app-page"> 
    <header class="header-bar">
        <div class="left">
            <button class="btn pull-left icon icon-arrow-back" data-navigation="$previous-page"></button>
            <h1 class="title">Page Two</h1>
        </div>
    </header>

    <div class="content">
        <div class="padded-full">

            <h2>Order</h2>

            <p>1x Pizza: {pizza}</p>

            <button class="btn negative cancel" data-order="cancel">Cancel</button>
            <button class="btn btn-flat primary order" data-order="order">Order</button>
        </div>
    </div>

    <script>

        var self = this

        this.pizza = ''


        /**
         * On this page, we define the activity events directly on the tag object with "this"
         * [1] On the create callback, we add tap events on buttons. The OnCreate callback is called once.
         * [2] If the user does not tap on buttons, we cancel the page transition. preventClose => true
         * [3] The OnReady callback is called every time the user comes on this page,
         * here we did not implement it.
        */

        var action = null

        var onAction = function(evt) {
            var target = evt.target
            action = 'ok'
            
            if(target.getAttribute('data-order') === 'order') {
                phonon.alert('Thank you for your order!', 'Dear customer')

            } else {
                phonon.alert('Your order has been canceled.', 'Dear customer')
            }
        }

        this.on('create', function() {
            document.querySelector('.order').on('tap', onAction)
            document.querySelector('.cancel').on('tap', onAction)
        })

        this.on('close', function(self) {
            if(action !== null) {
                self.close()
            } else {
                phonon.alert('Before leaving this page, you must perform an action.', 'Action required')
            }
        })

        this.on('hidden', function() {
            action = null
        })

        this.on('hashchanged', function(pizza) {
            self.pizza = pizza
            self.update()
        })

    </script>
</pagetwo>