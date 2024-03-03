local runningDistance = 0
local isRunning = false
local lastPos = vector3(0, 0, 0)
QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()
local initialRun = 0
local resetting = false

function updateRunningDistance()
    local ped = PlayerPedId()
    local playerCoords = GetEntityCoords(ped)

    local currentSpeed = GetEntitySpeed(ped)
    isRunning = (currentSpeed > 5.0 and not IsPedInAnyVehicle(ped, false))

    if isRunning then
        local distance = #(playerCoords - lastPos)
        runningDistance = runningDistance + distance
    end

    lastPos = playerCoords
end

function saveRunningDistance()
    initialRun = PlayerData.metadata['runDistance']
    local currentRun = runningDistance

    PlayerData.metadata['runDistance'] = initialRun + currentRun
    TriggerServerEvent('running:Save', initialRun + currentRun)

    runningDistance = 0
    initialRun = PlayerData.metadata['runDistance']
end

function start()
    updateRunningDistance()
    saveRunningDistance()
    if not resetting then
        Citizen.SetTimeout(1000, start)
    else
        if PlayerData.metadata['runDistance'] == 0 then
            resetting = false 
            start()
        end
    end
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

RegisterNUICallback('resetSteps', function(data, cb)
    print('resetting steps')
    resetting = true
    TriggerServerEvent('running:ResetSteps')
    PlayerData.metadata['runDistance'] = 0 
    cb('ok')
end)
