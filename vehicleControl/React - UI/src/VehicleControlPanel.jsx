// VehicleControlPanel.js
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faGasPump } from "@fortawesome/free-solid-svg-icons";
import LiquidProgressBar from './LiquidProgress';
import headLight from './assets/headlight.png';
import carImg from './assets/car2.png';
import VehPart from './VehiclePart';

const VehicleControlPanel = ({ data }) => {
    const [dummyVehicleData, setDummyVehicleData] = useState({
        engine: 0,
        fuel: 90,
        speed: 0,
        seats: 2,
        currentSeat: 1,
        interiorLights: 0,
        exteriorLights: 0,
        gas: 127.93,  // out of 200
        vehicleParts: {
            doors: {
                frontLeft: 0,
                frontRight: 0,
                backLeft: 0,
                backRight: 0,
                trunk: 0,
                hood: 0,
            },
            windows: {
                frontLeft: 0,
                frontRight: 0,
                backLeft: 0,
                backRight: 0,
            },
            tires: {
                frontLeft: 1,
                frontRight: 1,
                backLeft: 1,
                backRight: 1,
            },
            seats: {
                frontLeft: 0,
                frontRight: 0,
                backLeft: 0,
                backRight: 0,
            },
            engineStatus: 900, // out of 1000
        }
    });
    useEffect(() => {
        setDummyVehicleData(data);
    }, [data]);


    const toggleEngine = () => {
        setDummyVehicleData((prevData) => ({ ...prevData, engine: prevData.engine === 1 ? 0 : 1 }))
        fetch('http://vehiclecontrol/engine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                engine: dummyVehicleData.engine === 1 ? false : true,
            }),
        })
    }
    const toggleInteriorLights = () => {
        setDummyVehicleData((prevData) => ({ ...prevData, interiorLights: prevData.interiorLights === 1 ? 0 : 1, }))
        fetch('http://vehiclecontrol/interiorLights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                interiorLights: dummyVehicleData.interiorLights === 1 ? false : true,
            }),
        })
    }

    const toggleExteriorLights = () => {
        setDummyVehicleData((prevData) => ({ ...prevData, exteriorLights: prevData.exteriorLights === 1 ? 0 : 1, }))
        fetch('http://vehiclecontrol/exteriorLights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                exteriorLights: dummyVehicleData.exteriorLights === 1 ? false : true,
            }),
        })
    }
    const toggleDoors = (door) => {
        setDummyVehicleData((prevData) => ({ ...prevData, vehicleParts: { ...prevData.vehicleParts, doors: { ...prevData.vehicleParts.doors, [door]: prevData.vehicleParts.doors[door] === 1 ? 0 : 1, }, }, }))
        fetch('http://vehiclecontrol/doors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                door: door,
                open: dummyVehicleData.vehicleParts.doors[door] === 1 ? false : true,
            }),
        })
    };
    const toggleWindows = (window) => { setDummyVehicleData((prevData) => ({ ...prevData, vehicleParts: { ...prevData.vehicleParts, windows: { ...prevData.vehicleParts.windows, [window]: prevData.vehicleParts.windows[window] === 1 ? 0 : 1, }, }, })) };
    const toggleSeats = (seat) => { setDummyVehicleData((prevData) => ({ ...prevData, vehicleParts: { ...prevData.vehicleParts, seats: { ...prevData.vehicleParts.seats, [seat]: prevData.vehicleParts.seats[seat] === 1 ? 0 : 1, }, }, })) };
    const toggleTrunk = () => {
        setDummyVehicleData((prevData) => ({ ...prevData, vehicleParts: { ...prevData.vehicleParts, doors: { ...prevData.vehicleParts.doors, trunk: prevData.vehicleParts.doors.trunk === 1 ? 0 : 1, }, }, }))
        fetch('http://vehiclecontrol/doors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                door: 'trunk',
                open: dummyVehicleData.vehicleParts.doors.trunk === 1 ? false : true,
            }),
        })
    };
    const toggleHood = () => {
        setDummyVehicleData((prevData) => ({ ...prevData, vehicleParts: { ...prevData.vehicleParts, doors: { ...prevData.vehicleParts.doors, hood: prevData.vehicleParts.doors.hood === 1 ? 0 : 1, }, }, }))
        fetch('http://vehiclecontrol/doors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                door: 'hood',
                open: dummyVehicleData.vehicleParts.doors.hood === 1 ? false : true,
            }),
        })
    };
    const changeSeat = (seat) => {
        let currentSeat = dummyVehicleData.currentSeat;
        const currentSeatToPart = {
            [-1]: 'frontLeft',
            0: 'frontRight',
            1: 'backLeft',
            2: 'backRight',
        }
        if (currentSeat === seat) return;
        setDummyVehicleData((prevData) => ({ ...prevData, currentSeat: seat, }));
        toggleSeats(currentSeatToPart[currentSeat]);
        toggleSeats(currentSeatToPart[seat]);
        console.log(seat)
        fetch('http://vehiclecontrol/seats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                seat: seat,
            }),
        })

    };
    return (
        <div className='vehicle-control-panel'>
            <div className='vehicleimg'>
                <div className='image-container'>
                    <img src={carImg} alt='car' className='vehicle-image' />
                </div>
            </div>


            <div className='wrapper'>
                <div className='vehicle-engine' onClick={toggleEngine}>
                    <div className="engine-row">
                        <div className={dummyVehicleData.engine === 1 ? 'vehicle-engine-status-on' : 'vehicle-engine-status-off'}></div>
                    </div>
                    <div className='vehicle-engine-text'><strong>MOTOR</strong></div>
                    <div className='vehicle-engine-state'>{dummyVehicleData.engine === 1 ? 'PORNIT' : 'OPRIT'}</div>
                </div>

                <div className='interior-lights-wrapper'>
                    <div className={`interior-lights ${dummyVehicleData.interiorLights === 1 ? 'on' : 'off'}`} onClick={toggleInteriorLights}>
                        <FontAwesomeIcon icon={faLightbulb} style={{ width: '60px', height: '60px' }} className={`interior-light-icon ${dummyVehicleData.interiorLights === 1 ? 'on' : 'off'}`} />
                    </div>
                </div>

                <div className='exterior-lights-wrapper'>
                    <div className={`exterior-lights ${dummyVehicleData.exteriorLights === 1 ? 'on' : 'off'}`} onClick={toggleExteriorLights}>
                        <img src={headLight} alt='headlight' className={`exterior-light-icon ${dummyVehicleData.exteriorLights === 1 ? 'on' : 'off'}`} />
                    </div>
                </div>

                <div className='fuel-wrapper'>
                    <div className='gascan'>
                        <LiquidProgressBar value={dummyVehicleData.fuel / 2} />
                        <div className='fuel-text'><FontAwesomeIcon icon={faGasPump} /></div>
                    </div>
                </div>
                <div className='vehicle-parts-wrapper'>
                    <div className="vehicle-parts-wrapping LFD">
                        <VehPart name="frontLeft" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.frontLeft === 1} onClick={() => {
                            toggleDoors('frontLeft');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping RFD">
                        <VehPart name="frontRight" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.frontRight === 1} onClick={() => {
                            toggleDoors('frontRight');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping LRD">
                        <VehPart name="backLeft" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.backLeft === 1} onClick={() => {
                            toggleDoors('backLeft');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping RRD">
                        <VehPart name="backRight" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.backRight === 1} onClick={() => {
                            toggleDoors('backRight');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping TR">
                        <VehPart name="trunk" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.trunk === 1} onClick={() => {
                            toggleTrunk();
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping HD">
                        <VehPart name="hood" icon="doors" isOpen={dummyVehicleData.vehicleParts.doors.hood === 1} onClick={() => {
                            toggleHood();
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping FLW">
                        <VehPart name="frontLeft" icon="windows" isOpen={dummyVehicleData.vehicleParts.windows.frontLeft === 1} onClick={() => {
                            toggleWindows('frontLeft');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping FRW">
                        <VehPart name="frontRight" icon="windows" isOpen={dummyVehicleData.vehicleParts.windows.frontRight === 1} onClick={() => {
                            toggleWindows('frontRight');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping BLW">
                        <VehPart name="backLeft" icon="windows" isOpen={dummyVehicleData.vehicleParts.windows.backLeft === 1} onClick={() => {
                            toggleWindows('backLeft');
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping BRW">
                        <VehPart name="backRight" icon="windows" isOpen={dummyVehicleData.vehicleParts.windows.backRight === 1} onClick={() => {
                            toggleWindows('backRight');

                        }} />
                    </div>
                    {/* seats */}
                    <div className="vehicle-parts-wrapping FLS">
                        <VehPart name="frontLeft" icon="seats" isOpen={dummyVehicleData.vehicleParts.seats.frontLeft === 1} onClick={() => {
                            changeSeat(-1);
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping FRS">
                        <VehPart name="frontRight" icon="seats" isOpen={dummyVehicleData.vehicleParts.seats.frontRight === 1} onClick={() => {
                            changeSeat(0);
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping BLS">
                        <VehPart name="backLeft" icon="seats" isOpen={dummyVehicleData.vehicleParts.seats.backLeft === 1} onClick={() => {
                            changeSeat(1);
                        }} />
                    </div>
                    <div className="vehicle-parts-wrapping BRS">
                        <VehPart name="backRight" icon="seats" isOpen={dummyVehicleData.vehicleParts.seats.backRight === 1} onClick={() => {
                            changeSeat(2);
                        }} />
                    </div>
                    {/* Add more VehPart components for other parts */}
                </div>
            </div>
        </div>
    );
};

export default VehicleControlPanel;
