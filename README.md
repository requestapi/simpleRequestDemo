### SimpleRequestDemo 

The SimpleRequestDemo provides an ability to generate payment requests "Just In Time", on behalf of a user.  

Alone, this isn't to powerful, but when used with a QR code or NDEF NFC tag, now anyone can collect payments from any other (Canadian) using their mobile phone, and Mobile Banking Application.  

However, it's also a great way to get familiar with the API, and the simplicity of the E-Transfer Request API.  


### :warning: **Before you begin** :warning:

In order to use the code example, you will need to get an API Key.  The best and fastest way to get one is to sign up using the following link:

https://bit.ly/interac_api

Sign up, confirm your email, get the API Key Material....(In Beta at least).

##### Clone project from repository

Clone the *simpleRequestDemo* project into a local directory.

```console
macbook34:home exampleUser$ git clone  https://github.com/Interac/simpleRequestDemo.git
Cloning into 'simpleRequestDemo'...
remote: Enumerating objects: 95, done.
remote: Counting objects: 100% (95/95), done.
remote: Compressing objects: 100% (74/74), done.
remote: Total 95 (delta 4), reused 95 (delta 4), pack-reused 0
Unpacking objects: 100% (95/95), done.
```

##### Install required project dependency files

```console
macbook34:home exampleUser$ npm install
added 336 packages from 379 contributors and audited 337 packages in 5.707s

21 packages are looking for funding
  run `npm fund` for details
```

##### Copy and edit the project environment file

First make a copy of the `.env.example` into `.env`

```console
macbook34:home exampleUser$ cp .env.example .env
```

Then add `ACCESS_TOKEN`, `THIRD_PARTY_ACCESS_ID`, and `API_REGISTRATION_ID` values into the `.env` file

```
ACCESS_TOKEN=123A456B-7890-12AB-A3BC-1234AB5C67D8

THIRD_PARTY_ACCESS_ID=CA1TAABC123def45

API_REGISTRATION_ID=CA1Abcd1efg2HIJK


BASE_URL=https://gateway-web.beta.interac.ca/publicapi/api/

EXPIRY_TIME_IN_MINUTES=10

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
CLOUD_WATCH_REGION=
LOG_GROUP=
SHOW_CLOUD_WATCH_DEBUG_LOGS=
```

##### Startup the sampleRequestDemo on your local machine

```console
macbook34:home exampleUser$ npm run start
> typescript-react-redux-boilerplate@1.0.0 start /Users/jcrombie/PublicAPI_Example_Projects/Github.com_Interac/testingChechouts/simpleRequestDemo
> npm run build && DEBUG=app node dist/server.js


> typescript-react-redux-boilerplate@1.0.0 build /Users/jcrombie/PublicAPI_Example_Projects/Github.com_Interac/testingChechouts/simpleRequestDemo
> tsc


  app Express web server started: http://localhost:8080 +0ms
  ```
  
  ##### Browse to the instance locally and Verify Application start-up
  
  Open your browser and enter http://localhost:8080 the address bar.
  
  
  
#### :warning: **Read Before Continuing** :warning:

The systems and tools that follow, just like the API the **SimpleRequestDemo** is interfacing with is **NOT A REAL MONEY MOVEMENT SYSTEM**.
With this in mind **DO NOT** enter real details (Like your password, client card, etc) into the tools listed below.  These tools are used for solution rendering, and demonstration.  While every effort is made to protect information placed within these Demo Tools, they are **NOT** Production systems.




  ##### Completing the Transaction Flow
  
 - Once on the sample codes page, select an amount ($2, $5, or $10) and then **Donate**.
  
 -  You will then be re-directed to the Beta Environment E-Transfer Gateway showcasing the list of available Issuers to complete the transaction.
  
 - Select "My Bank"
 
 - On the "My Bank" Issuer screen, enter an client card, account name or email address (referred to as **"login"** going forward) into the **Client Card/Account Name** input box. The password field is **NOT** required, as in fact not used by the **My Bank** Emulator.
 
- If this is your first time using the **My Bank** in with the emulator (or first time using this **login**, you will be prompted to provide some details about the fake user you have just created. This processes is analogous to the "Sign Up" process at an Issuer (Bank), and only needs to be done once (per login).

- You will then be presented with the details of the Request, and the option to fulfill or decline it.  Select an option, and your transaction is complete.
  
  
