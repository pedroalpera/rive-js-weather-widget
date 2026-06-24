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
     const inputTextFocus = instance.boolean("inputTextFocus"); 

    // Get the "Search" trigger property
    const searchTrigger = instance.trigger("search");

    searchTrigger.on(() => {
      getWeather(textInput);
    });

    // Get the "DeleteAll" trigger property
    const deleteTrigger = instance.trigger("deleteAll");
    
    deleteTrigger.on(() => {
      riveInstance.setTextRunValue("InputTextRun", "");
      textInput = "";     
    });


    // Get the "InputFocus" trigger property
    const inputFocusTrigger = instance.trigger("inputFocus");
    
    inputFocusTrigger.on(() => {
      riveInstance.setTextRunValue("HintInputTextRun", "");
      inputFocus = true; 
    });


    // Get the "DeactivateInputFocus" trigger property
    const deactivateInputFocusTrigger = instance.trigger("deactivateInputFocus");
    
    deactivateInputFocusTrigger.on(() => {
        if (textInput.length == 0) {
          riveInstance.setTextRunValue("HintInputTextRun", "City Name");
        }
         inputFocus = false;
    });

    /////////////// -- Text Input -- ///////////////

    // If we click over the transparent html text
    document.getElementById("inputTextField").onfocus = function () {
      riveInstance.setTextRunValue("HintInputTextRun", "");

    
      inputTextFocus.value = true;  
      inputFocus = true;
    };

   

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
          
        inputTextFocus.value = false;        
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
            let temperature = instance.string("temperature");         
            temperature.value = Math.floor(data.main.temp) + "°C";

            let humidity = instance.string("humidity");         
            humidity.value = data.main.humidity + "%";
           
            let pressure = instance.string("pressure");         
            pressure.value = data.main.pressure + "";

            let description = instance.string("description");         
            description.value = data.weather[0].description;

            let wind = instance.string("wind");         
            wind.value = data.wind.speed + "";

            let city = instance.string("city");         
            city.value = data.name;

             let icon = instance.string("icon");         
            icon.value = data.weather[0].icon;
         

          });
        }
      });
    }

    getWeather("New York");

    // END //
  },
});
