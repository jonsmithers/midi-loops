var recordTriggerPitch = 102;
var playTriggerPitch = 104;

var recordON = false;

var MyRecorder = (function() {

  var recordedEvents = null;
  var recordStart = null;

  return {
    startRecording: function() {
      recordedEvents = [];
      recordStart = null;
    },
    recordEvent: function(event) {
      if (!recordStart) {
        recordStart = new Date();
        Trace("recording starting now");
      }
      var delay = new Date() - recordStart;
      recordedEvents.push({
        event: event,
        delay: delay
      });
    },
    playRecordedEvents: function() {
    
      Trace("Starting Playback");
      for (i in recordedEvents) {
        var recordedEvent = recordedEvents[i];
    
        var event = recordedEvent.event;
        var delay = recordedEvent.delay;
    
        event.sendAfterMilliseconds(delay);
      }
      Trace("Playback finished");
      recordedEvents = [];
    }
  }
})();

function HandleMIDI(event)
{
  if ( ! event instanceof Note) {
    event.send();
    return;
  }
  if ([recordTriggerPitch, playTriggerPitch].indexOf(event.pitch) !== -1) {
    if ( event.constructor !== NoteOn) {
      return;
    }
    if (event.pitch === recordTriggerPitch) {
      recordON = true;
      if (recordON) {
        MyRecorder.startRecording();
        Trace("RECORD ENABLE");
      }
    }
    if (event.pitch === playTriggerPitch) {
      recordON = false;
      Trace("Recording stopped");
      MyRecorder.playRecordedEvents();
      }
    return;
  }

  if (recordON) {
    MyRecorder.recordEvent(event);
  }
  event.send();
}
