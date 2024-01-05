import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import carImg from './assets/car2.png';
import './NeonControl.css';

const Neons = () => {
    const [neons, setNeons] = useState({
        front: false,
        back: false,
        left: false,
        right: false,
    });

    const [neonColor, setNeonColor] = useState('#ff0000');
    const toggleNeon = (neon) => {
        setNeons((prev) => {
            return {
                ...prev,
                [neon]: !prev[neon],
            };
        });
    };
    const toggleAllNeons = () => {
        setNeons((prev) => {
            return {
                ...prev,
                front: !prev.front,
                back: !prev.back,
                left: !prev.left,
                right: !prev.right,
            };
        });
    }
    function changeColor(e) {
        const color = e.target.value;
        setNeonColor(color);
    }

    return (
        <div className='vehicle-control-panel'>
            <div className='vehicleimg'>
                <div className='image-container'>
                    <img src={carImg} alt='car' className='vehicle-image' />
                </div>
                <div className='neon-container'>
                    <div
                        className={`neon left ${neons.left ? 'active' : 'inactive'}`}
                        style={{ '--neon-color': neonColor }}
                        onClick={() => toggleNeon('left')}
                    ></div>
                    <div
                        className={`neon right ${neons.right ? 'active' : 'inactive'}`}
                        style={{ '--neon-color': neonColor }}
                        onClick={() => toggleNeon('right')}
                    ></div>
                    <div
                        className={`neon back ${neons.back ? 'active' : 'inactive'}`}
                        style={{ '--neon-color': neonColor }}
                        onClick={() => toggleNeon('back')}
                    ></div>
                    <div
                        className={`neon front ${neons.front ? 'active' : 'inactive'}`}
                        style={{ '--neon-color': neonColor }}
                        onClick={() => toggleNeon('front')}
                    ></div>
                </div>
                <div className='control-panel'>
                    {/* Change neon color*/}
                    <input type='color' className='color-picker' onChange={(e) => changeColor(e)} defaultValue={"#ff0000"}/>
                    <button className='button-36' onClick={toggleAllNeons}>{Array.from(Object.values(neons)).every(x => x==1) ? 'Stinge' : 'Aprinde'} Toate Neoanele</button>
                </div>
            </div>
        </div>
    );
};

export default Neons;
