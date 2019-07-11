$(() => {
    Stripe.setPublishableKey('pk_test_ZihyJaLZi7Z2Lkb1E4fpPEfa00hURU5REV');

    function stripeReponseHandler(status, response) {
        let $form = $('#payment-form');

        if(response.error) {
            console.log(`Stripe error: ${response.error.message}`);

            debugger

            $form.find('.payment-errors').text(response.error.message)
            $('#card-submit').prop('disabled', false);
        } else {
            let token = response.id;

            $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

            $form.get(0).submit()
        }
    }

    $('#payment-form').submit((event) => {
        let cardNumber = $('#card-number').val()
        let cvcCode = $('#card-cvc').val()
        let expMonth = $('#card-expiry-month-year').val().slice(0, 2)
        let expYear = $('#card-expiry-month-year').val().slice(2 ,4)

        $('#card-submit').prop('disabled', true);

        Stripe.card.createToken({
            number: cardNumber,
            cvc: cvcCode,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeReponseHandler)

        return false
    })
})