// VehicleControl.js
import React, { useEffect, useState } from 'react';
import Category from './Category';
import './VehicleControl.css';
import { faCar, faLightbulb, faMusic } from "@fortawesome/free-solid-svg-icons";
import VehicleControlPanel from './VehicleControlPanel';
import MusicPlayer from './VehicleMusic';
import Neons from './NeonControl';
import $ from 'jquery'
const VehicleControl = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handleMessage = (event) => {
        if (event.data.type === 'openGeneral') {
          setDummyVehicleData(event.data.data)
          setIsVisible(true);
          console.log(event.data.data)
        } else if (event.data.type === 'closeAll') {
          setIsVisible(false);
        }

      };
  
      window.addEventListener('message', handleMessage);
      window.addEventListener('keydown', (e) => {
          if(e.code === 'KeyZ'){
              setIsVisible(false);
              document.body.style.display = 'none';
              $.post('http://vehiclecontrol/close', JSON.stringify({}));
              
          }
      })
  
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, []);
    if(isVisible){
        document.body.style.display = 'block';

    }
    else{
        document.body.style.display = 'none';
    }
    const [selectedCategory, setSelectedCategory] = useState('Vehicle');
    const [dummyVehicleData, setDummyVehicleData] = useState({
        engine: 0,
        fuel: 0,
        speed: 0,
        seats: 2,
        currentSeat: 0,
        interiorLights: 0,
        exteriorLights: 0,
        gas: 0,  // out of 200
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

            seats: {
                frontLeft: 1,
                frontRight: 0,
                backLeft: 0,
                backRight: 0,
            },
            engineStatus: 0, // out of 1000
        }
    });
    const [contentOpacity, setContentOpacity] = useState(1);
    console.log(dummyVehicleData.vehicleParts.seats)
    const handleCategoryClick = (category) => {
        setContentOpacity(0);
        setTimeout(() => {
            setSelectedCategory(category);
            setContentOpacity(1);
        }, 500); // Adjust this delay to match the transition duration
    };

    return (
        <div className="vehicle-control">
            <div className="categories">
                <Category name="Control" subtext={'Vehicul'} icon={faCar} isSelected={selectedCategory === 'Vehicle'} onClick={() => handleCategoryClick('Vehicle')} />
                <Category name="Control" subtext={'Neoane'} icon={faLightbulb} isSelected={selectedCategory === 'Neon'} onClick={() => handleCategoryClick('Neon')} />
            </div>
            <div className="content">
                <div className='content-header'>
                    <span style={{ color: '#49ffcc' }}>VEHICLE</span> Control Panel
                </div>
                <div className='content-body' style={{ opacity: contentOpacity, transition: 'opacity 0.5s ease-in-out' }}>
                    {selectedCategory === 'Vehicle' && <VehicleControlPanel data={dummyVehicleData} />}
                    {selectedCategory === 'Media' && <MusicPlayer />}
                    {selectedCategory === 'Neon' && <Neons />}
                </div>
            </div>
        </div>
    );
};

export default VehicleControl;
