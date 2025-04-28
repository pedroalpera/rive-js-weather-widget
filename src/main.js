// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

const riveInstance = new rive.Rive({
  src: "weather_widget.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  autoBind: true,
  automaticallyHandleEvents: true, // Automatically handle RiveHTTPEvents
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

     const instance = riveInstance.viewModelInstance;
   
    

    /////////////// -- Text Input -- ///////////////

    // If we click over the transparent html text
    document.getElementById("inputTextField").onfocus = function () {
      riveInstance.setTextRunValue("HintInputTextRun", "");
      inputTextFocus_Boolean.value = true;
      inputFocus = true;
    };

    // Inputs in Rive file
    const inputs = riveInstance.stateMachineInputs("State Machine 1");

    let inputTextFocus_Boolean = inputs.find(
      (i) => i.name === "inputTextFocus_Boolean"
    );
    let iconNumber = inputs.find((i) => i.name === "iconNumber");

    // Rive Events

    const onRiveEventReceived = (riveEvent) => {
      const eventData = riveEvent.data;
      const eventProperties = eventData.properties;

      if (eventData.type === rive.RiveEventType.General) {
        if (eventData.name == "Event Search") {
          getWeather(textInput);
        }
        if (eventData.name == "Event DeleteAll") {
          riveInstance.setTextRunValue("InputTextRun", "");
          textInput = "";
        }
        if (eventData.name == "Event InputFocus") {
          riveInstance.setTextRunValue("HintInputTextRun", "");
          inputFocus = true;
        }
        if (eventData.name == "Event DeactivateInputFocus") {
          if (textInput.length == 0) {
            riveInstance.setTextRunValue("HintInputTextRun", "City Name");
          }

          inputFocus = false;
        }
      }
    };

    riveInstance.on(rive.EventType.RiveEvent, onRiveEventReceived);

    // InputFocus
    let inputFocus = false;
    // Mouse Position
    const mouse = {
      x: null,
      y: null,
    };

    // Canvas position in the document
    let rect = canvas.getBoundingClientRect();

    // On Mouse Down
    document.addEventListener("mousedown", function (event) {
      detectPosition(event);
    });

    function detectPosition(event) {
      rect = canvas.getBoundingClientRect();

      // Calculate the position
      mouse.x = Math.floor(event.x - rect.x);
      mouse.y = Math.floor(event.y - rect.y);

      // Deactivate Input text if you click outside of the canvas

      if (mouse.x < 0 || mouse.x > 500 || mouse.y < 0 || mouse.y > 500) {
        if (textInput.length == 0) {
          riveInstance.setTextRunValue("HintInputTextRun", "City Name");
        }
        inputTextFocus_Boolean.value = false;
        inputFocus = false;
      }
    }

    riveInstance.setTextRunValue("InputTextRun", "");
    riveInstance.setTextRunValue("HintInputTextRun", "City Name");

    let textInput = "";

    document.onkeydown = handleEnter;

    function handleEnter(e) {
      var keyCode = e.keyCode;

      // If is a character add it to the text
      if (e.key.length === 1) {
        textInput += e.key;
      }
      // If Backspace delete one character
      if (e.key == "Backspace") {
        //  textInput = "";
        textInput = textInput.slice(0, -1);
      }
      riveInstance.setTextRunValue("InputTextRun", textInput);
    }

    /////////////// -- End Text Input -- ///////////////

    /////////////// -- Weather Data -- ///////////////

    let key = "7d5e74e7b112e34001dc87b79a2fc7c3";
    let apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    function getWeather(loc) {
      let url = apiUrl + loc + `&appid=${key}`;
      fetch(url).then((res) => {
        if (!res.ok) {
          console.log("ERROR - Not found");

       
        } else {
          res.json().then((data) => {
            
            // Send to values to the view model with data binding
            let temperature = instance.string("Temperature");         
            temperature.value = Math.floor(data.main.temp) + "°C";

            let humidity = instance.string("Humidity");         
            humidity.value = data.main.humidity + "%";
           
            let pressure = instance.string("Pressure");         
            pressure.value = data.main.pressure + "";

            let description = instance.string("Description");         
            description.value = data.weather[0].description;

            let wind = instance.string("Wind");         
            wind.value = data.wind.speed + "";

            let city = instance.string("City");         
            city.value = data.name;

            let iconData = data.weather[0].icon;
            iconData = iconData.substring(0, iconData.length - 1);
 
            let iconNumber = instance.number("IconNumber");
            iconNumber.value = iconData;             

          });
        }
      });
    }

    getWeather("New York");

    // END //
  },
});
