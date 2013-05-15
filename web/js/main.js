var parse = function(text) {
	text = text.toLowerCase();

	console.log("Parse: ", text);

	if(text == 'connexion') {
		$.get('http://localhost:3000/connect', function(res) {
			$(".console").append(res.status);
		});
	}

	if(text.indexOf('couleur') > -1) {
		if(text.indexOf('aléatoire') > -1) {
			$.get('http://localhost:3000/randomColor', function(res) {});
		}
	}

	if(text.indexOf('diode') > -1) {
		if(text.indexOf('allume') > -1) {
			$.get('http://localhost:3000/setBackLed/1', function(res) {});
		}

		if(text.indexOf('étein') > -1) {
			$.get('http://localhost:3000/setBackLed/0', function(res) {});
		}
	}

	if(text == 'déconnexion') {
		$.get('http://localhost:3000/close', function(res) {});
	}

}



$(document).ready(function() {

	var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
    //$(".console").append("End: " + final_transcript);
    //parse(final_transcript);
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
        console.log(final_transcript);
        $(".console").append("Result: "+final_transcript);
        parse(final_transcript);
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    // final_transcript = capitalize(final_transcript);

    // final_span.innerHTML = linebreak(final_transcript);
    // interim_span.innerHTML = linebreak(interim_transcript);
    // if (final_transcript || interim_transcript) {
    //   showButtons('inline-block');
    // }
  };
}

	$("#start").click(function() {
		if (recognizing) {
			recognition.stop();
			return;
		}
		final_transcript = '';
		recognition.lang = 'FR-fr';
		recognition.start();
		ignore_onend = false;
		start_timestamp = event.timeStamp;
	});

});