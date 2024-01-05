// VehiclePart.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './VehiclePart.css'
import doorLeft1 from './assets/doorL1.png';
import doorLeft2 from './assets/doorL2.png';
import doorRight1 from './assets/doorR1.png';
import doorRigh2 from './assets/doorR2.png';
import windowLeft1 from './assets/windowL1.png';
import windowLeft2 from './assets/windowL2.png';
import windowRight1 from './assets/windowR1.png';
import windowRight2 from './assets/windowR2.png';
import trunk from './assets/trunk.png';
import hood from './assets/hood.png';
import wheel from './assets/wheel.png';
import seat from './assets/seat.png';
const icons = {
    doors: {
        frontLeft: doorLeft1,
        frontRight: doorRight1,
        backLeft: doorLeft2,
        backRight: doorRigh2,
        trunk: trunk,
        hood: hood,
    },
    windows: {
        frontLeft: windowLeft1,
        frontRight: windowRight1,
        backLeft: windowLeft2,
        backRight: windowRight2,
    },
    tires: {
        frontLeft: wheel,
        frontRight: wheel,
        backLeft: wheel,
        backRight: wheel,
    },
    seats: {
        frontLeft: seat,
        frontRight: seat,
        backLeft: seat,
        backRight: seat,

    }
}
const VehPart = ({ name, icon, isOpen, onClick }) => {
  return (
    <div className={`veh-part ${isOpen ? 'open' : ''}`} onClick={onClick}>
        <div>
            <img src={icons[icon][name]} alt={name} className='icon' />
        </div>
      <div>
      </div>
    </div>
  );
};

export default VehPart;
