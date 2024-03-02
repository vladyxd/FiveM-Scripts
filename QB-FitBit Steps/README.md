
# QBCore - Monitor Player Phisical Activity and FitBit App

### Hey. You have probably seen my work, but you are not sure how to do it yourself.


## Screenshots

### Want this too, right?
![App Screenshot](https://media.discordapp.net/attachments/1212759230503976980/1213112415739322408/image.png?ex=65f449fa&is=65e1d4fa&hm=5c7decc30f08ccb1b58291c36334bf147f3d5d7f59838d989868e2a06bac4f8c&=&format=webp&quality=lossless)


Then you came to the right place.

******

# Installation Steps - For Newbies 
### If you are not sure wether you can do it yourself or not, just download the resources in the release tab. But it is essential to do steps 1, 2, 3 and 4 from below.

# Instalation Steps - For advanced
1. Before we begin, we must add the `runDistance` to the metadata. To do this we head to `qb-core/server/player.lua`, CTRL+F to search, look for `PlayerData.metadata` and where you see things that look familiar to you, example `PlayerData.metadata['thirst'] = PlayerData.metadata['thirst'] or 100`, then we know we are in the right place. Add a new entry, like this:
```lua
    PlayerData.metadata['runDistance'] = PlayerData.metadata['runDistance'] or 0
```


2. First, we need to implement the phisical monitor. To do this, we head to `qb-smallresources/client` and create a new file called `running.lua` or whatever you like.


3. Use this code:
```lua
local runningDistance = 0
local isRunning = false
local lastPos = vector3(0, 0, 0)
QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()
local initialRun = 0
function start()
    Citizen.CreateThread(function()
        while true do

            Citizen.Wait(1000)
            local ped = PlayerPedId()
            local playerCoords = GetEntityCoords(ped)

            local currentSpeed = GetEntitySpeed(ped)
            isRunning = (currentSpeed > 5.0 and
                            not IsPedInAnyVehicle(ped, false))

            if isRunning then
                local distance = #(playerCoords - lastPos)
                runningDistance = runningDistance + distance
            end

            lastPos = playerCoords
        end
    end)

    Citizen.CreateThread(function()
        initialRun = PlayerData.metadata['runDistance']
        while true do
            Citizen.Wait(5000)
            local currentRun = runningDistance
            if (initalRun or 0) + currentRun == 0 then
                runningDistance = 0
                initialRun = PlayerData.metadata['runDistance']
            end
            
            PlayerData.metadata['runDistance'] = initialRun + currentRun
            TriggerServerEvent('running:Save',
                               initialRun + currentRun)
            
            TriggerServerEvent('ak4y-battlepass:taskCountAdd:standart', 8,
                               currentRun)
            runningDistance = 0
            initialRun = PlayerData.metadata['runDistance'] -- Update initialRun value
        end
    end)
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded')
AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
    start()
end)
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    PlayerData = QBCore.Functions.GetPlayerData()
    start()
end)
```


4. After this was successfully implemented, we must save the data to our Database. In order to do this, we must create a server-side script, head to `qb-smallresources/server/` and look for the `main.lua` file. Once found, add this wherever you like, but make sure it is NOT inside another function :)
```lua
RegisterNetEvent('running:Save', function(distance)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then return end

    Player.Functions.SetMetaData('runDistance', distance)
end)
```

5. Nice! Now we have it ready, but... how to see it on FitBit? To do this we have to move to `qb-fitbit` directory. 
Once there, head to `/client/main.lua`. There you will see a `openWatch` function.
Modify it accordingly
```lua
local function openWatch()
    SendNUIMessage({
        action = "openWatch",
        watchData = {},
        steps = QBCore.Functions.GetPlayerData().metadata['runDistance']
    })
    SetNuiFocus(true, true)
end
```
This snipped will send our steps to the FitBit


6. Here's the part where things get tricky, but don't worry. Follow these steps and you'll get through it!
Head to `qb-fitbit/html/` directory.
Once there, we will firstly modify the `index.html`
- We need to make the app visible on the watch screen. To do this, in `<div class="main-screen">` we add 
```html
<div class="fitbit-app steps" data-app="steps"><i class="fa fa-walking"></i></div>
``` 
right after the food and thirst apps.
- Now the app itself is quite simple, after the `thirst-app` div ends, add:
```html 
<div class="steps-app">
                <span class="app-title">Steps</span>
                <div class="alert-setting">
                    <p>Your steps: <br><span id="stepsdata"></span></p>
                </div>
                <div class="app-buttons">
                    <div class="app-button back-steps-settings">
                        <p>Back</p>
                    </div>
                </div>
            </div>
        </div>
```
once this is done, we only have a few steps to complete our app.
- In `style.css` we just add 
```css
.steps-app{
    display: none;
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;
}
#stepsdata{
    color: white;
    font-size: 1.5vh;
}
```
and now we have the css.

- Now the trickiest part, JavaScript.
In app.js on line 4, you will see an empty space. fill it with:
```js
let steps = 0;
```
Right after that, you will see a function, the `$(document).ready(function() {` function, in which you will see a function being called: `qbFitbit.Open()`. Right below that line, add:
```js
steps = Math.floor(event.data.steps);

```

Now, we need to replace the default `$(document).on('click', '.fitbit-app', function(e) {` function with:
```js

$(document).on('click', '.fitbit-app', function(e) {
    e.preventDefault();

    const pressedApp = $(this).data('app');

    $(openedApp).css({ display: 'none'});
    $(`.${pressedApp}-app`).css({ display: 'block'});
    openedApp = pressedApp;
    if (pressedApp === 'steps') {
        $('#stepsdata').text(steps);
    }
});

```
and lastly, to make the back button work, we add this:
```js
$(document).on('click', '.back-steps-settings', function(e) {
    e.preventDefault();

    $('.steps-app').css({ display: 'none' });
    $('.main-screen').css({ display: 'block'});

    openedApp = '.main-screen';
});
```

***
# Thank you

### These were the installation steps. Hope you guys will enjoy and hopefully this was helpful to you. Thanks again for using it. If you like what I do, you can star this repo.

For help, create an issue.