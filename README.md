# Twerkulator

creating visuals with an accelerometer

## development


### OpenSSL Setup (Windows Only)

Windows users will need to install openssl. Here are detailed instructions if needed.

#### Downloading and unzipping the binaries

- You need to download the openssl binaries. Click on this link and the download will begin.

https://mirror.firedaemon.com/OpenSSL/openssl-1.1.1h-dev.zip

- Now, unzip your file on some folder (i recommend you to do this on C:\ directory) and rename the unzipped folder to openssl just for organization.

#### Updating the PATH

- Go to your environment's variables, you can just search this on Windows menu;
- On this window, you will do all on User's Variables, NOT on System's Variables. Scroll to the 'path' option and click on it;
- Select the Edit option on bottom side and then Select the New option on right side;
- If you did as suggested (unzip the openssl folder on C:\ directory), then you will paste C:\openssl\x64\bin. Otherwise, add the path to your openssl bin folder.
- Select New to add another environment variable in the User section
- Variable Name: OPENSSL_CONF
- Variable Value: C:\openssl\ssl\openssl.cnf (or wherever your openssl.cnf file sits)
- Click Ok on all windows, reopen your terminal and type openssl version to confirm it was installed. If you are able to run the respository (below), everything should be configured correctly.

### install and run

`npm ci`
`npm start`


### Export GIF

To start / stop recording, press ctrl (or cmd) + shift + s

Once the recording is done, it will be saved to the output folder.

### bypass cert error (MacOS)

type 'thisisunsafe' in the browser to bypass the cert error

## useful links

-   [Circuit Python API Docs 6.3.x](https://circuitpython.readthedocs.io/en/6.3.x/README.html)
-   [Circuit Python Made Easy](https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express)
-   [Welcome to Circuit Python (debugging)](https://learn.adafruit.com/welcome-to-circuitpython/overview)
