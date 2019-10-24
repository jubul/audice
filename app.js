var ventanas = [];
var MAX_VENTANAS = 30;


var webaudio_tooling_obj = function() {
    console.log("arrancando");
    var audioContext = new AudioContext();

    console.log("audio is starting up ...");

    var BUFF_SIZE = 16384;
    //event.target.context.sampleRate



    var audioInput = null,
        microphone_stream = null,
        gain_node = null,
        script_processor_node = null,
        script_processor_fft_node = null,
        analyserNode = null;

    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true },
            function(stream) {
                start_microphone(stream);
            },
            function(e) {
                alert('Error capturing audio.');
            });
    } else { alert('getUserMedia not supported in this browser.'); }

    // ---


    function Mensaje1() {
        $(function() {
            // Your Twilio credentials
            var SID = "ACf5322aee1ddf663e25b4f60ec0785e03"
            var Key = "80977f9f1f8edc6d6b25a0598222140a"
            $.ajax({
                type: 'POST',
                url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
                data: {
                    "To": "+543564473251",
                    "From": "+14158519415",
                    "Body": "CONTACTO 91.5 CORTADA"
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(SID + ':' + Key));
                },
                success: function(data) {
                    console.log(data);
                },
                error: function(data) {
                    console.log(data);
                }
            });
        });
    }

    function Mensaje2() {
        $(function() {
            // Your Twilio credentials
            var SID = "ACb52bb7fa4fe0d1c79472f19edc3e5cbc"
            var Key = "c156b9a7c953b8ff373429ed83dc5ea6"
            $.ajax({
                type: 'POST',
                url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
                data: {
                    "To": "+543564622573",
                    "From": "+19282565862",
                    "Body": "CONTACTO 91.5 CORTADA"

                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(SID + ':' + Key));
                },
                success: function(data) {
                    console.log(data);
                },
                error: function(data) {
                    console.log(data);
                }
            });
        });
    }

    function Mensaje() {
        $(function() {
            // Your Twilio credentials
            var SID = "ACe8157999e161ba1c88a6870ab93f8d27"
            var Key = "e97d9bb8f546170e9fe3d76fc2198693"
            $.ajax({
                type: 'POST',
                url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
                data: {
                    "To": "+543564643431",
                    "From": "+15012679562",
                    "Body": "CONTACTO 91.5 CORTADA"
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(SID + ':' + Key));
                },
                success: function(data) {
                    console.log(data);
                },
                error: function(data) {
                    console.log(data);
                }
            });
        });
    }

    function show_some_data(given_typed_array, num_row_to_display, label) {

        var size_buffer = given_typed_array.length;
        var index = 0;
        var max_index = num_row_to_display;

        console.log("__________ " + label);

        for (; index < max_index && index < size_buffer; index += 1) {

            console.log(given_typed_array[index]);
        }
    }

    var puedeLanzarAlerta = true

    function process_microphone_buffer(event) { // invoked by event loop

        var i, N, inp, microphone_output_buffer;

        microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now

        // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE

        //show_some_data(microphone_output_buffer, 5, "from getChannelData");
        var sampleEnergy = 0;
        for (var i = 0; i < BUFF_SIZE; i++) {
            sampleEnergy = sampleEnergy + Math.abs(microphone_output_buffer[i]);
        }
        sampleEnergy = sampleEnergy / BUFF_SIZE;
        document.getElementById("barra-progreso").style.width = Math.floor(sampleEnergy * 100) + "%";

        if (ventanas.length >= MAX_VENTANAS) {
            ventanas.shift();
        }
        ventanas.push(sampleEnergy);
        //chart.render();

        var sumaVentanas = 0;
        for (var i = 0; i < ventanas.length; i++) {
            sumaVentanas = sumaVentanas + ventanas[i];
        }
        sumaVentanas = sumaVentanas / (MAX_VENTANAS * BUFF_SIZE);
        var sumaVentanasNormalizadas = Math.floor(sumaVentanas * 1000000);
        console.log(sumaVentanasNormalizadas)
        document.getElementById("barra-progreso2").style.width = sumaVentanasNormalizadas + "%";
        if (sumaVentanasNormalizadas < 1 && puedeLanzarAlerta) {
            console.log("SILENCIO")
            puedeLanzarAlerta = false
            Mensaje();
            //Mensaje1();
            //Mensaje2();
            setTimeout(function() { puedeLanzarAlerta = true }, 17000)
        }
    }

    function start_microphone(stream) {

        gain_node = audioContext.createGain();
        gain_node.gain.value = 800;
        microphone_stream = audioContext.createMediaStreamSource(stream);
        microphone_stream.connect(gain_node);

        script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_node.onaudioprocess = process_microphone_buffer;

        microphone_stream.connect(script_processor_node);
    }

}(); //  webaudio_tooling_obj = function()