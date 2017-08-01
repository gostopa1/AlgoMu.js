// Example showing how to produce a tone using Web Audio API.
var context;
var jsProcessor = 0;


// Variables used to control the tone generator.
var phase = 0.0;

var baseFrequency = 440.0;
var kSampleRate = 44100.0;
var kBufferSIze = 2048; // must be power of 2
//var phaseIncrement = 2.0 * Math.PI * window.event.clientX  / kSampleRate;
var phaseIncrement = 2.0 * Math.PI * baseFrequency / kSampleRate;
var kTwoPi = 2.0 * Math.PI;
//var soundEnabled = false;
var soundEnabled = true;
var randomness_factor=0;
var X=0;
var env_ind=1;

var notes_mat= new Array(1,1,1,4,4,4,8,8,8,3, 4, 6, 8, 9, 11, 13);
var notes;
var note;
var note_ind;
var reverb=0;

// Change HTML in a DIV or other element for debugging
function writeMessageToID(id,message)
{
    // Voodoo for browser compatibility.
    d=document;
    re = d.all ? d.all[id] : d.getElementById(id);
    re.innerHTML=message;
}

// Create an AudioCOntext and a JavaScriptNode.
function initAudio()
{

    if( window.AudioContext )
    {
        context = new AudioContext();
		var reverb = context.createConvolver();
		//reverb.buffer=new Array();
		//alert(reverb.length)
		
		
		
		
		//var volume = context.createGainNode();  // This was marked as obsolete in later version
		var volume = context.createGain();
        // This AudioNode will generate a tone.
        // Node has zero inputs and one output.
        
		//alert(var);
		//jsProcessor = context.createJavaScriptNode(kBufferSIze, 0, 1); // This was marked as obsolete in later version
		jsProcessor = context.createScriptProcessor(kBufferSIze, 0, 1);
        jsProcessor.onaudioprocess = process;
		
		
		var seconds=2;
		//var options;
		//options.decay=1;
		//var options.reverse=1;
		reverb=ReverbNodeFactory(context, 3);
		jsProcessor.connect(reverb);
		//reverb=1;
		reverb.connect(volume);
		//jsProcessor.connect(volume)
		volume.connect(context.destination);


        // Connect our process to the mixer of the context.
        jsProcessor.connect(context.destination);
        writeMessageToID( "soundStatus", "<p>Audio initialized.</p>");
		        alert("WebAudio API IS supported. Try using the Google Chrome or Safari browser.");

    }
    else
    {
        alert("Sorry. WebAudio API not supported. Try using the Google Chrome or Safari browser.");
    }
	
}
var n;

var akies_mat=1000;
var aksia=0;

var attack=0.5;

var vol;
// This function will be called repeatedly to fill an audio buffer and
// generate sound.
function process(event)
{

	
	
    // Get array associated with the output port.
    var outputArray = event.outputBuffer.getChannelData(0);
    n = outputArray.length;
    
    
	//phaseIncrement = 2.0 * Math.PI * SetValues() / kSampleRate; //added by tan
    
	
	//alert(n)
    
    if( soundEnabled )
    {
	
	
        for (var i = 0; i < n; ++i)
        {	
			aksia=aksia+1;
            // Generate a sine wave.
            var sample = Math.sin(phase);
			if (attack<1){
			attack=attack+0.0005;}
            // outputArray[i] = sample * 0.1+Math.random()*randomness_factor;
			env_ind=Math.abs(env_ind-0.00005);
            outputArray[i] = (sample*env_ind*attack)*0.2*vol;
            // Increment and wrap phase.
            phase += phaseIncrement;
            if (phase > kTwoPi)
            {
                phase -= kTwoPi;
            }
        }
		
		if (aksia>20000){
		aksia=0;
		changenote();
		attack=0.0;
		vol=Math.random();
		}
		
		for (var i = 0; i < n; ++i){
		reverb.buffer[i]=10000;
		
		}
    }
    else
    {
        // Output silence.
        for (var i = 0; i < n; ++i)
        {
            outputArray[i] = 0.0;
        }
    }
}

function changenote(){

note_ind=Math.floor((Math.random()*(notes_mat.length-1)));
//alert(notes_mat.length);
note=notes_mat[note_ind];
//note=note_ind;
nf=Math.pow(2,note/12)*440;
baseFrequency=nf;
phaseIncrement = 2.0 * Math.PI * baseFrequency / kSampleRate;
env_ind=1;
//soundEnabled = true;
}

// Enable a sound and update the frequency of the oscillator.
function startTone( frequency )
{
	
    frequency=baseFrequency;
  
   

    phaseIncrement = 2.0 * Math.PI * baseFrequency / kSampleRate;
    soundEnabled = true;
    writeMessageToID( "soundStatus", "<p>Start tone at frequency = " + frequency + ", phaseIncrement = " + phaseIncrement + "</p>");
}

function stopTone()
{
	//alert(n)
    soundEnabled = false;
    //writeMessageToID( "soundStatus", "<p>Stop tone.</p>");
}

function changeFreq(){
	soundEnabled = true;
	setTimeout(function(){soundEnabled = false;env_ind=1;},100) 
    
	
    writeMessageToID( "soundStatus", "<p>Start tone at frequency = " + frequency + ", phaseIncrement = " + phaseIncrement + "</p>");
}


function ReverbNodeFactory(context, seconds, options){
    options = options || {};
    var sampleRate = context.sampleRate;
    var length = sampleRate * seconds;
    var impulse = context.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);
    var decay = options.decay || 2;
    for (var i = 0; i < length; i++){
      var n = options.reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    var convolver = context.createConvolver();
    convolver.buffer = impulse;
    return convolver;
}



// init once the page has finished loading.
window.onload = initAudio;
