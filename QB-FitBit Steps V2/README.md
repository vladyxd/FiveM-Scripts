
# QBCore - Monitor Player Phisical Activity and FitBit App

### This is V2. For V1 please go to [main](https://github.com/vladyxd/FiveM-Scripts)


### Okay, so you are here because you want V2. Hopefully you already know how to install it, from V1. V2 is just a new version that comes with some improvements

# Changelog
- Added Real-Time update (.5s updating)
- Added a reset button in steps app
- Refactored the main code.

## Changes apply to the following files:
- `qb-fitbit/client/main.lua`
- `qb-fitbit/html/app.js`
- `qb-smallresources/client/running.lua` (From previous version)
- `qb-smallresources/server/main.lua`


******

# Installation Steps - For Newbies 
### If you are not sure wether you can do it yourself or not, just make sure you do step 1 from [here](https://github.com/vladyxd/FiveM-Scripts/tree/main/QB-FitBit%20Steps). After that download the release v2

# Update Steps - For advanced
Okay, so as I stated above, this is just an update, we will only modify the EXISTING files. These steps are for UPDATE. For clean installation, first install V1 and then update with these files. It will take maximum 5 minutes.
1. Changes in `qb-fitbit/client/main.lua`, simply add:
```lua
RegisterNUICallback('requestSteps', function(data, cb)
    local steps = QBCore.Functions.GetPlayerData().metadata['runDistance']
    cb(steps)
end)
```

2. Changes in `qb-fitbit/html/app.js`, I recommend directly using this, because it would be too much to be edited for step-by-step. Check app.js

3. Changes in `qb-smallresources/client/running.lua` - This was refactored, check running.lua
4. Changes in `qb-smallresources/server/main.lua` - Replace your existing `running:Save` event with:
```lua
resettingSteps = {}

RegisterNetEvent('running:Save', function(distance)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or resettingSteps[src] then return end

    Player.Functions.SetMetaData('runDistance', distance)
end)

RegisterNetEvent('running:ResetSteps', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    resettingSteps[src] = true

    if not Player then return end

    Player.Functions.SetMetaData('runDistance', 0)
    Citizen.Wait(5000)
    Player.Functions.SetMetaData('runDistance', 0)
    resettingSteps[src] = false
end)

```

And you should be done.


***
# Thank you

### These were the installation steps. Hope you guys will enjoy and hopefully this was helpful to you. Thanks again for using it. If you like what I do, you can star this repo.

For help, create an issue.