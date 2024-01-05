// Category.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Category = ({ name, subtext, icon, isSelected, onClick }) => {
  return (
    <div className={`category ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} className="category-icon" />
      <div>
        <strong>{name}</strong>
        <br />
        <span className="category-subtext">{subtext}</span>
      </div>
    </div>
  );
};

export default Category;
