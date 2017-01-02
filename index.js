/* Imports */

// Hue, Dash, WeMo
var hue = require("node-hue-api"),
  async = require('async'),
  dash_button = require('node-dash-button'),
  HueApi = hue.HueApi,
  lightState = hue.lightState,
  wemo = require('wemo');

/* Settings */

// Set the wemo Search Timeout - 30 seconds for search
wemo.SearchTimeout = 30000;

// Import the automate.json file
var automate = require('./automate.json');

/* Functions */

// Function to loop through all Dash Buttons
function loopDashButtons() {
  console.log('Looping through all Dash Buttons');

  // Loop through all of the Dash buttons
  var x = dashButtons.length;
  for (var i = 0; i < x; i++) {

    // Get the button
    var dash = dashButtons[i];

    // Get the button MAC Address
    var dashMAC = dash.MAC;

    // Log the MAC Address and Name of the button we're monitoring
    console.log('Monitoring Dash Button MAC Address: ' + dashMAC + ' With Name: ' + dash.Name);

    // Start monitoring changes on the buttons
    var dashButton = new dash_button(dashMAC, null, 1000, 'all');

    // Dash button detected
    dashButton.on("detected", dashFunction);

  } // Done for loop

} // Done loopDashButtons Function

// Dash Function
var dashFunction = function (dash_id) {

  // Dash button pressed with MAC Address
  console.log('Dash Button with MAC Detected: ' + dash_id);

  // Make sure the dashButtons array is set up and valid
  if (dashButtons === undefined || !Array.isArray(dashButtons) || dashButtons.length < 1) {
    // dashButtons array is invalid
    console.log('Error: ' + 'dashButtons array is undefined or empty');
    return;
  }

  // Get the button from the dashButtons array filtered by MAC Address
  var matchingButton = dashButtons.filter(function (entry) { return entry.MAC == dash_id; });
  var button = matchingButton[0];

  // Check if button exists
  if (!button || button === undefined) {
    // Error, unable to find button in automate.json
    console.log('Error: ' + 'Unable to find a matching button in automate.json: ' + automate);
    return;
  }

  // Got the button
  //console.log('Found Button: ' + button.Name);

  // Check if there are any WeMo Devices to Toggle
  if (button.Wemo !== undefined && button.Wemo instanceof Array && button.Wemo.length > 0) {

    // Log it
    console.log('Toggling WeMo Devices for Button: ' + button.Name);

    // Get all wemo devices from automate.json
    var wemoDevices = button.Wemo;

    // Loop through all WeMo Devices
    loopWeMo(wemoDevices);

  } // Done checking for WeMo devices to toggle

  // Check if there are any Hue Devices to Toggle
  if (button.Hue !== undefined && button.Hue instanceof Array && button.Hue.length > 0) {

    // Log it
    console.log('Toggling Hue devices for Button: ' + button.Name);

    // Get the devices
    var hueDevices = button.Hue;

    // Load up the bridge from the device settings - passing the hueDevices variable into the function scope
    hue.nupnpSearch(hueBridgeSearchFunctionCallback(hueDevices));
    
  } // Done checking for Hue devices to toggle

}; // Done dashFunction

// Loop WeMo Devices Function
function loopWeMo(wemoDevices) {
  console.log('Looping through all WeMo Devices');

  // Get the length of the array
  var x = wemoDevices.length;

  // Run through all the wemo devices to toggle
  for (var i = 0; i < x; i++) {

    // WeMo Name
    wemoName = wemoDevices[i].Name;

    // WeMo ip
    var wemoIP = wemoDevices[i].IP;
    // WeMo port
    var wemoPort = wemoDevices[i].Port;

    // WeMo Toggle
    var wemoToggle = wemoDevices[i].Toggle;

    // Check if the wemo device settings already include an ip and port
    if (wemoIP !== undefined && wemoPort !== undefined) {

      // We already have the ip and port, let's create the switch and flip the binary state
      var wemoSwitch = new wemo(wemoIP, wemoPort);
      //console.log('Found WeMo Device: ' + JSON.stringify(wemoSwitch));

      // Set the state of the wemo device
      wemoSetState(wemoSwitch, wemoToggle);

    } else {

      // Otherwise, search for the device - passing the WemoToggle variable into the function scope
      (function (wemoToggle) {
        wemo.Search(wemoName, searchWeMoDeviceCallback);
      })(wemoToggle);

    } // Done else

  } // Done checking if IP/Port existed or if WeMo device needed to be found by Searching

} // Done Loop WeMo Devices Function

// WeMo setState Function
function wemoSetState(wemoSwitch, wemoToggle) {
  console.log('Setting WeMo Device State');

  // Check if the device should only be toggled one way
  if (wemoToggle !== undefined) {

    // Check if the device should be turned on or off only
    if (wemoToggle == "Off" || wemoToggle == "off" || wemoToggle === false) {
      // Toggle Off
      wemoSwitch.setBinaryState(0, wemoFunctionCallback);
    } else {
      // Toggle On
      wemoSwitch.setBinaryState(1, wemoFunctionCallback);
    }

  } else {

    // Flip the state of the WeMo Device
    wemoSwitch.getBinaryState(function (err, state) {
      if (err) console.error('Error: ' + 'Unable to get WeMo Device State: ' + err);
      console.log('Got state of wemo: ' + state);
      var newState = 1;
      if (state == 1) {
        var newState = 0;
      }

      // Set the state of the WeMo Device to the opposite of the current state
      wemoSwitch.setBinaryState(newState, wemoFunctionCallback);

    }); // Done Flipping the state of the WeMo device

  } // Done checking if WeMo devices should be toggled
} // Done WeMo setState Function

// WeMo Device Search Callback
var searchWeMoDeviceCallback = function (err, device) {
  console.log('Found WeMo Device while searching');

  // Check for errors
  if (err) {
    // Error finding WeMo device
    console.log('Error: ' + 'Could not find WeMo Device: ' + err);
    throw err;
  }

  // Got the WeMo device IP and Port from search
  var wemoSwitch = new wemo(device.ip, device.port);
  //console.log('Found WeMo Device: ' + JSON.stringify(wemoSwitch));

  // Set the state of the wemo device
  wemoSetState(wemoSwitch, wemoToggle);
} // Done WeMo Device Search Callback

// WeMo SetState Function Callback
var wemoFunctionCallback = function (err, result) {
  // Check for an error
  if (err) {
    // Received an error
    console.error('Error: ' + 'Unable to set WeMo Device State: ' + err);
  } else {
    // No Error
    console.log('Success: Set state of WeMo Device: ' + result);
  }
} // Done WeMo SetState Function Callback

// Hue Bridge Search Function Callback
var hueBridgeSearchFunctionCallback = function (hueDevices) {
  return function (err, result) {
    console.log('Searching for Hue Bridge...');

    // Check for errors
    if (err) {
      // Error finding bridge
      console.log('Error: ' + 'Unable to find bridge: ' + err);
      throw err;
    }

    // Get the specific bridge from the array of bridges in settings        
    //console.log("Hue Bridges Found: " + JSON.stringify(result));
    var bridgesFound = result.filter(function (entry) { return entry.id.toLowerCase().indexOf(automate.Settings.Hue_Bridge_ID) > -1; });
    var bridge = bridgesFound[0];

    // Found the bridge
    //console.log('Bridge: ' + JSON.stringify(bridge));

    // Create the Hue API access from the settings and the bridge
    var api = new HueApi(bridge.ipaddress, automate.Settings.Hue_Username)
    //console.log('API: ' + JSON.stringify(api));

    // Run through all the Hue Devices to toggle
    for (var i = 0; i < hueDevices.length; i++) {

      // Get the name of the light at the current index
      var hueName = hueDevices[i].Name;

      // Get the toggle state of the device
      var hueToggle = hueDevices[i].Toggle;

      // Find the lights and get the one that matches the current index - passing in the Hue Name and Hue Toggle values to the function scope
        api.lights(hueLightSearchFunctionCallback(hueName, hueToggle, api));

    }
  }; // Done Hue Bridge Search Function Callback
  
} // Done Hue Bridge Search Function Callback

// Hue Light Search Function Callback
var hueLightSearchFunctionCallback = function (hueName, hueToggle, api) {
  return function (err, lights) {
    console.log('Found Hue Devices');

    // Check for errors
    if (err) {
      // Error getting lights
      console.log('Error: ' + 'Unable to find Hue Devices: ' + err);
      throw err;
    }

    //console.log('Found Lights from Bridge: ' + JSON.stringify(lights));
    //console.log("Name of Current Device: " + hueName);

    // Get the specific light from the array of lights
    var matchingDevice = lights.lights.filter(function (entry) { return entry.name == hueName; });
    var device = matchingDevice[0];

    // Found the light
    //console.log('Found Device: ' + JSON.stringify(device));

    // Get the light status
    api.getLightStatus(device.id, hueGetLightStatusFunctionCallback(hueToggle, device, api));

  }; // Done Hue Light Search Function Callback

} // Done Hue Light Search Function Callback

// Hue Get Light Status Function Callback
var hueGetLightStatusFunctionCallback = function (hueToggle, device, api) {
  return function (err, light) {
    console.log('Got Hue Device Status');

    // Check for errors
    if (err) {
      // Error getting Hue Device Status
      console.log('Error: ' + 'Unable to get Hue Device Status: ' + error(err.message));
      throw err;
    }

    // Check whether the device is on or off
    if (light.state.reachable == true) {
      console.log('Light is reachable');

      // Check if the device should only be toggled one way
      if (hueToggle !== undefined) {
        console.log("Setting Hue Device: " + device.name + ' ' + hueToggle);

        // Check if the device should be turned on or off only
        if (hueToggle == "Off" || hueToggle == "off" || hueToggle === false) {

          // Turn it off
          var state = lightState.create().off();
          api.setLightState(device.id, state, function (result) {
            console.log('Turning Light: ' + device.name + ': Off');
          });

        } else {

          // Turn it on
          var state = lightState.create().on().brightness(100);
          api.setLightState(device.id, state, function (result) {
            console.log('Turning Light: ' + device.name + ': On');
          });

        }

      } else {
        console.log("Toggling Hue Device: " + device.name);

        // Toggle the state
        if (light.state.on) {

          // Turn it off
          var state = lightState.create().off();
          api.setLightState(device.id, state, function (result) {
            console.log('Turning Light: ' + device.name + ' Off');
          });

        } else {

          // Turn it on
          var state = lightState.create().on().brightness(100);
          api.setLightState(device.id, state, function (result) {
            console.log('Turning Light: ' + device.name + ' On');
          });

        } // Done toggling light state

      } // Done checking if Hue device should be toggled

    } // Done checking if Hue device is reachable

  }; // Done Hue Get Light Status Function Callback

} // Done Hue Get Light Status Function Callback

/* Main */

// Welcome
console.log('Starting Dash Toggles...');

// Get all of the dash button MAC Addresses
if (!automate.Dash) return;
var dashButtons = automate.Dash;

// Loop through all the dash buttons
loopDashButtons();
