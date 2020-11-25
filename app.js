//Array allocation in RAM
var ventanas = [];
var MAX_VENTANAS = 30;


var webaudio_tooling_obj = function() {
    console.log("arrancando");
    var audioContext = new AudioContext();
    //Testeo en consola
    console.log("audio is starting up ...");
    
    //Se abre espacio en memoria
    var BUFF_SIZE = 16384;
    //event.target.context.sampleRate


//Clear microphone variables
    var audioInput = null,
        microphone_stream = null,
        gain_node = null,
        script_processor_node = null,
        script_processor_fft_node = null,
        analyserNode = null;

        //Navigator media permissions 
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;


        //Checking microphone 
    if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true },
            function(stream) {
                start_microphone(stream);
            },
            function(e) {
                //If microphone isn't ready, don't allow to use and display an alert
                alert('Error capturing audio.');
            });
            //Display an alert when web browser isn't supported
    } else { alert('getUserMedia not supported in this browser.'); }

    // ---

//Send first message with Twillio __We have to encrypt this!!__
    
//Allocate memory spaces for Array
    function show_some_data(given_typed_array, num_row_to_display, label) {

        var size_buffer = given_typed_array.length;
        var index = 0;
        var max_index = num_row_to_display;

        console.log("__________ " + label);

        for (; index < max_index && index < size_buffer; index += 1) {

            console.log(given_typed_array[index]);
        }
    }
//Set true value for alert bool
    var puedeLanzarAlerta = true

    function process_microphone_buffer(event) { // invoked by event loop

        var i, N, inp, microphone_output_buffer;

        microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now

        // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE
        //Se usa un filtro pasa bajos y se normalizan los valores de la frecuencia
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
            MensajeJ();
            MensajeM();
            MensajeF();
            setTimeout(function() { puedeLanzarAlerta = true }, 30000)
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
