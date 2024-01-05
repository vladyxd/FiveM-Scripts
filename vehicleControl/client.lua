local inVehicleControl = false
local doors = {
    {name = "Front Left", id = 0}, {name = "Front Right", id = 1},
    {name = "Back Left", id = 2}, {name = "Back Right", id = 3},
    {name = "Hood", id = 4}, {name = "Trunk", id = 5}

}
local windowState1 = true
local windowState2 = true
local windowState3 = true
local windowState4 = true

local function WindowControl(window, door)
    local playerPed = GetPlayerPed(-1)
    if (IsPedSittingInAnyVehicle(playerPed)) then
        local vehicle = GetVehiclePedIsIn(playerPed, false)
        if window == 0 then
            if windowState1 == true and DoesVehicleHaveDoor(vehicle, door) then
                RollDownWindow(vehicle, window)
                windowState1 = false
            else
                RollUpWindow(vehicle, window)
                windowState1 = true
            end
        elseif window == 1 then
            if windowState2 == true and DoesVehicleHaveDoor(vehicle, door) then
                RollDownWindow(vehicle, window)
                windowState2 = false
            else
                RollUpWindow(vehicle, window)
                windowState2 = true
            end
        elseif window == 2 then
            if windowState3 == true and DoesVehicleHaveDoor(vehicle, door) then
                RollDownWindow(vehicle, window)
                windowState3 = false
            else
                RollUpWindow(vehicle, window)
                windowState3 = true
            end
        elseif window == 3 then
            if windowState4 == true and DoesVehicleHaveDoor(vehicle, door) then
                RollDownWindow(vehicle, window)
                windowState4 = false
            else
                RollUpWindow(vehicle, window)
                windowState4 = true
            end
        end
    end
end

local function toggleVehicleControl()
    local windows = {
        {name = "Front Left", id = 1}, {name = "Front Right", id = 2},
        {name = "Back Left", id = 3}, {name = "Back Right", id = 4}
    }
    local doors = {
        {name = "Front Left", id = 0}, {name = "Front Right", id = 1},
        {name = "Back Left", id = 2}, {name = "Back Right", id = 3},
        {name = "Hood", id = 4}, {name = "Trunk", id = 5}
    }
    local VehData = {
        engine = false,
        interiorLights = false,
        exteriorLights = false,
        vehicleParts = {
            doors = doors,
            windows = windows,
            seats = {
                frontLeft = false,
                frontRight = false,
                backLeft = false,
                backRight = false
            }
        },
        neons = {
            {name = "Left", id = 0}, {name = "Right", id = 1},
            {name = "Front", id = 2}, {name = "Back", id = 3}
        },
        fuel = 0
    };
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    if not IsPedInAnyVehicle(player, false) then return end
    if not GetPedInVehicleSeat(player) == -1 then return end
    for i, door in ipairs(VehData.vehicleParts.doors) do
        if GetVehicleDoorAngleRatio(vehicle, door.id) > 0 then
            door.open = true
        else
            door.open = false
        end
    end
    local function bitand(a, b)
        local result = 0
        local bitval = 1
        while a > 0 and b > 0 do
            if a % 2 == 1 and b % 2 == 1 then -- check if last bits are both 1
                result = result + bitval -- set the bit in result
            end
            bitval = bitval * 2 -- shift to next bit
            a = math.floor(a / 2) -- shift right
            b = math.floor(b / 2)
        end
        return result
    end

    local dashboardLights = GetVehicleDashboardLights(vehicle)
    local exteriorLights = (bitand(dashboardLights, 128) == 128 or
                               bitand(dashboardLights, 256) == 256) and 1 or 0

    local function GetPlayerVehicleSeat(playerPed)
        local vehicle = GetVehiclePedIsIn(playerPed, false)

        if DoesEntityExist(vehicle) then
            for seat = -1, GetVehicleMaxNumberOfPassengers(vehicle) do
                local occupant = GetPedInVehicleSeat(vehicle, seat)

                if occupant == playerPed then return seat end
            end
        end

        return nil
    end
    VehData = {
        engine = GetIsVehicleEngineRunning(vehicle),
        interiorLights = IsVehicleInteriorLightOn(vehicle) == true and 1 or 0,
        exteriorLights = exteriorLights,
        currentSeat = GetPlayerVehicleSeat(player),
        vehicleParts = {
            doors = doors,
            windows = windows,
            seats = {
                frontLeft = GetPedInVehicleSeat(vehicle, -1) == 0 and 0 or 1,
                frontRight = GetPedInVehicleSeat(vehicle, 0) == 0 and 0 or 1,
                backLeft = GetPedInVehicleSeat(vehicle, 1) == 0 and 0 or 1,
                backRight = GetPedInVehicleSeat(vehicle, 2) == 0 and 0 or 1
            }            
        },
        neons = {
            {name = "Left", id = 0}, {name = "Right", id = 1},
            {name = "Front", id = 2}, {name = "Back", id = 3}
        },
        fuel = exports["LegacyFuel"]:GetFuel(vehicle)
    }
    print(json.encode(VehData))
    if inVehicleControl then
        inVehicleControl = false
        SendNUIMessage({type = "closeAll"})
        SetNuiFocus(false, false)

    else
        inVehicleControl = true
        SetNuiFocus(true, true)
        SendNUIMessage({type = "openGeneral", data = VehData})
    end
end

RegisterCommand("vehiclecontrol", function() toggleVehicleControl() end)

RegisterKeyMapping("vehiclecontrol", "Vehicle Control", "keyboard", "Z")

RegisterNUICallback("close", function(data, cb)
    inVehicleControl = false
    SetNuiFocus(false, false)
end)
RegisterNUICallback('engine', function(data)
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    if data.engine then
        SetVehicleEngineOn(vehicle, true, false, true)
    else
        SetVehicleEngineOn(vehicle, false, false, true)
    end
end)

RegisterNUICallback('interiorLights', function(data)
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    if data.interiorLights then
        SetVehicleInteriorlight(vehicle, true)
    else
        SetVehicleInteriorlight(vehicle, false)
    end
end)

RegisterNUICallback('exteriorLights', function(data)
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    if data.exteriorLights then
        SetVehicleLights(vehicle, 0)
    else
        SetVehicleLights(vehicle, 1)
    end
end)
local function FilterDoors(door)
    if door == 'frontLeft' then
        return 0
    elseif door == 'frontRight' then
        return 1
    elseif door == 'backLeft' then
        return 2
    elseif door == 'backRight' then
        return 3
    elseif door == 'hood' then
        return 4
    elseif door == 'trunk' then
        return 5
    end
end

RegisterNUICallback('doors', function(data)
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    print(json.encode(data))
    data.door = FilterDoors(data.door)
    print(data.door)
    print(data.open)

    if data.door == 0 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 0, false, false)
        else
            SetVehicleDoorShut(vehicle, 0, false)
        end
    elseif data.door == 1 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 1, false, false)
        else
            SetVehicleDoorShut(vehicle, 1, false)
        end
    elseif data.door == 2 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 2, false, false)
        else
            SetVehicleDoorShut(vehicle, 2, false)
        end
    elseif data.door == 3 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 3, false, false)
        else
            SetVehicleDoorShut(vehicle, 3, false)
        end
    elseif data.door == 4 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 4, false, false)
        else
            SetVehicleDoorShut(vehicle, 4, false)
        end
    elseif data.door == 5 then
        if data.open then
            SetVehicleDoorOpen(vehicle, 5, false, false)
        else
            SetVehicleDoorShut(vehicle, 5, false)
        end
    end
end)

RegisterNUICallback('seats', function(seat)
    local player = PlayerPedId();
    local vehicle = GetVehiclePedIsIn(player, false)
    local function checkIfSeatAvailable(vehicle, seat)
        return GetPedInVehicleSeat(vehicle, seat) == 0 and true or false
    end
    local availability = checkIfSeatAvailable(vehicle, seat.seat)
    if availability then
        SetPedIntoVehicle(player, vehicle, seat.seat)
    end
    

end)