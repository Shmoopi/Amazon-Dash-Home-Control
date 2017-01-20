# Amazon Dash Home Control
Easily control Phillips Hue or WeMo Devices with Amazon Dash Buttons

## Description
Using a simple JSON file, you can configure advanced automations and actions for [Amazon Dash Buttons](#Amazon-Dash-Buttons) to control your [Phillips Hue](#Phillips-Hue-Devices) or [WeMo](#WeMo-Devices) devices.  This application is written in node.js and works on the Raspberry Pi (tested on a Raspberry Pi Model 2 B).

## Installation
###### *This assumes you have an [Amazon Dash Button](#Amazon-Dash-Buttons) and at least one [Phillips Hue](#Phillips-Hue-Devices)/[WeMo](#WeMo-Devices) device to control
1. Follow the setup instructions for your Amazon Dash Button: [Amazon - Set Up Your Dash Button](https://www.amazon.com/gp/help/customer/display.html?nodeId=201746340) excluding choosing a product if you only intend to use for automation.
2. Find your Phillips Hue bridge IP address and get API access: [Hue API - Getting Started](http://www.developers.meethue.com/documentation/getting-started).
3. Enter the Phillips Hue Bridge IP Address and Username into "automate.json" under "Settings".
4. (Optional for WeMo Devices): Find the IP Address and usable Port of all WeMo devices intended to control.
5. Run ```npm install``` to install dependencies (see "Additional Steps" for troubleshooting).
6. Run ```sudo node node_modules/node-dash-button/bin/findbutton``` and press your Dash button. You should see the MAC address for your Dash button in the console output.
7. Input the MAC Address of your Dash Button into the "automate.json" file as a new object in the "Dash" array.
8. Configure the "automate.json" file with your Phillips Hue and WeMo devices and how to toggle them.  See "automate.json" for more information.
9. Run with ```npm start```.
10. Press your Dash Button and watch your lights toggle on/off.

## Additional Steps to Install
Some machines require an additional dependancy of libpcap for reading packets:

To install libpcap on a Raspberry Pi:  ```sudo apt-get install libpcap-dev```

## automate.json
The automate.json file is designed to take an array of Dash Button objects that include a "Name", "MAC" Address, "Hue" array, and "Wemo" array.  

Example Dash Button Object:

```
{
  "Name": "Example Button 1",
  "MAC": "1f:2e:3d:4c:5b:6a",
  "Hue": [
    {
      "Name": "Hue Light Name Here"
    }
  ],
  "Wemo": [
    {
      "Name": "WeMo Device Name Here",
      "IP": "192.168.1.3",
      "Port": "49153"
    }
  ]
}
```

In the "Hue" object, only a device "Name" is expected, with an optional "Toggle" state to toggle "On" or "Off", respectively.  

"Wemo" objects only expect a device "Name" but an optional "IP" address and "Port" are considered better practice as searching via UPnP does not work as expected on all devices (i.e. Raspberry Pi).  The optional "Toggle" state is also available.

The file also includes a "Settings" object that holds the "Hue\_Bridge\_ID" and the "Hue_Username".  

Example Settings:

```
"Settings": {
  "Hue_Bridge_ID": "123456",
  "Hue_Username": "1028d66426293e821ecfd9ef1a0731df"
}
```

See [automate.json](automate.json) for example setup.
    
## Amazon Dash Buttons
Amazon Dash Buttons are simple internet-connected buttons that order items from Amazon.com.  This application listens for network connections from these buttons and automates actions when connections are detected.

###### *Affiliate Links Below

<a href="https://www.amazon.com/gp/product/B01C3JBG5I/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01C3JBG5I&linkId=9343193df1c0439464319e6a5c270f7c"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01C3JBG5I&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[Coca-Cola Dash Button - $4.99](https://www.amazon.com/gp/product/B01C3JBG5I/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01C3JBG5I&linkId=9343193df1c0439464319e6a5c270f7c)

<br /> 

<a href="https://www.amazon.com/gp/product/B01F6ETRNA/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01F6ETRNA&linkId=ac68f155c394b1e40a926cc64ce39caf"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01F6ETRNA&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[All Laundry Detergent Dash Button - $4.99](https://www.amazon.com/gp/product/B01F6ETRNA/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01F6ETRNA&linkId=ac68f155c394b1e40a926cc64ce39caf)

<br /> 

<a href="https://www.amazon.com/gp/product/B01C3JARHQ/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01C3JARHQ&linkId=587b79a71c483d1f0666c353bf429a30"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01C3JARHQ&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[All Laundry Detergent Dash Button - $4.99](https://www.amazon.com/gp/product/B01C3JARHQ/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01C3JARHQ&linkId=587b79a71c483d1f0666c353bf429a30)

<br /> 

<a href="https://www.amazon.com/gp/product/B01KW6YCIM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01KW6YCIM&linkCode=as2&tag=shmoopi0f-20&linkId=4c0e57966917e8400e556e9065d19e1e"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01KW6YCIM&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[Amazon IoT Dash Button (2nd Generation) - $19.99](https://www.amazon.com/gp/product/B01KW6YCIM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01KW6YCIM&linkCode=as2&tag=shmoopi0f-20&linkId=4c0e57966917e8400e556e9065d19e1e)

 <br /> 
## Phillips Hue Devices
Phillips Hue Devices are HomeKit-enabled switches, lights, motion sensors, and plugs that work with Amazon Alexa, Siri and Apple HomeKit.  This application controls Hue devices by querying the connected Phillips Bridge and finding the Hue device by name.  Hue device search can be a little slow and may take up to 10 seconds to find a matching device, depending on how many devices are connected to the bridge.

Find your Phillips Hue bridge IP address and get API access: [Hue API - Getting Started](http://www.developers.meethue.com/documentation/getting-started).

###### *Affiliate Links Below
 <a href="https://www.amazon.com/gp/product/B01KJYSO68/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01KJYSO68&linkId=6515c7871551191cac28cf52205b35ae"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01KJYSO68&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[Phillips Hue White and Color Starter Kit (3rd Generation)](https://www.amazon.com/gp/product/B01KJYSO68/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01KJYSO68&linkId=6515c7871551191cac28cf52205b35ae)

<br /> 

<a href="https://www.amazon.com/gp/product/B01KJYSOHM/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01KJYSOHM&linkId=23d7ff81219633c2b0883934cc9794b9"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B01KJYSOHM&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[Phillips Hue White and Color Light (3rd Generation)](https://www.amazon.com/gp/product/B01KJYSOHM/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01KJYSOHM&linkId=23d7ff81219633c2b0883934cc9794b9)

 <br /> 

## WeMo Devices
WeMo Devices are internet-controlled switches, lights, or plugs that work with Amazon Alexa.  This application controls WeMo devices by searching the local network for the WeMo device name or by direct IP and Port.  To find the IP Address of all WeMo devices on the local network, this project seems to work best: [wemo-rest](https://github.com/absentmindedcoder/wemo-rest) 

###### *Affiliate Links Below
<a href="https://www.amazon.com/gp/product/B00DGEGJ02/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B00DGEGJ02&linkId=2b01e324bccfe13b13ef3edb1f89fa37"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B00DGEGJ02&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[WeMo Light Switch](https://www.amazon.com/gp/product/B00DGEGJ02/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B00DGEGJ02&linkId=2b01e324bccfe13b13ef3edb1f89fa37)

 <br /> 
 
 <a href="https://www.amazon.com/gp/product/B00BB2MMNE/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B00BB2MMNE&linkId=e87170d85ef58d75d19070abec2f1881"><img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=B00BB2MMNE&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=shmoopi0f-20" align="left" height="60" width="60" ></a>[WeMo Switch Smart Plug](https://www.amazon.com/gp/product/B00BB2MMNE/ref=as_li_tl?ie=UTF8&tag=shmoopi0f-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B00BB2MMNE&linkId=e87170d85ef58d75d19070abec2f1881)

 <br /> 


