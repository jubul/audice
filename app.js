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

    function Mensaje() {
        $(function() {
            // Your Twilio credentials
            var SID = "AC4f8861e54df90e8f8bcac38442d9b690"
            var Key = "b571526c5999766d2ee6602471cc2bfa"
            $.ajax({
                type: 'POST',
                url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
                data: {
                    "To": "+543564643431",
                    "From": "+17173828528",
                    "Body": "CORTE"
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
        if (sumaVentanasNormalizadas <= 1 && puedeLanzarAlerta) {
            console.log("SILENCIO")
            puedeLanzarAlerta = false
            Mensaje();
            setTimeout(function() { puedeLanzarAlerta = true }, 10000)
        }
    }

    function start_microphone(stream) {

        gain_node = audioContext.createGain();

        microphone_stream = audioContext.createMediaStreamSource(stream);
        microphone_stream.connect(gain_node);

        script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_node.onaudioprocess = process_microphone_buffer;

        microphone_stream.connect(script_processor_node);
    }

}(); //  webaudio_tooling_obj = function()