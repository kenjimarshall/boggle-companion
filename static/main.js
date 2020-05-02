$(document).ready(function () {

    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "qu", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    function randLetter() {
        var letter = letters[Math.floor(Math.random() * letters.length)];
        return letter
    }

    function validateGrid() {
        var valid = true
        $('.letter-input').each(function (index) {
            if ($(this).val() == "") {
                $(this).parent().addClass('has-error')
                valid = false
            }
            else if (!letters.includes($(this).val().toLowerCase())) {
                $(this).parent().addClass('has-error')
                valid = false
            }
            else {
                $(this).parent().removeClass('has-error')
            }
        })
        return valid
    }

    var h = $(".letter-input").css("width")
    $('.letter-row').css("height", h)

    $(window).on('resize', function () {
        var h = $(".letter-input").css("width")
        $('.letter-row').css("height", h)
    });



    $('.random-btn').on('click', function () {
        $(".letter-input").each(function (index) {
            var ltr = randLetter()
            $(this).val(ltr)
        });

    })


    $('.solve-btn').on('click', function () {
        if (validateGrid()) {
            var symbols = []
            $('.letter-input').each(function (index) {
                symbols.push($(this).val())
            })
            var msg = {
                size: 4,
                symbols: symbols
            }

            fetch(`${window.origin}/`, {
                method: "POST",
                body: JSON.stringify(msg),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"
                })
            })
                .then(function (response) {
                    response.json().then(function (data) {

                        var keys = Object.keys(data.solution)
                        $(".solution-word").remove()
                        $('.sol').each(function (index) {
                            var words = data.solution[keys[index]]
                            for (i = 0; i < words.length; i++) {
                                var word = words[i]
                                var definition = "https://www.merriam-webster.com/dictionary/" + word
                                $(this).append("<a class='solution-word', href=" + definition + "> " + word + "  </a > ")
                            }
                        })


                        var heatmap = data.board.usage_count
                        $(".letter-input").each(function (index) {
                            // TODO: Heatmap?
                        })
                    })
                })
        }
    })
})