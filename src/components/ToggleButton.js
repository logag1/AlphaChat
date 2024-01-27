import { useState } from 'react';

export default function ToggleButton() {
  const [isToggled, setToggled] = useState(false);
  const handleToggle = () => {
    if (isToggled) {
      setToggled(false);
    } else {
      setToggled(true);
    }
  }

  return (
    <div className={`switch-container ${isToggled ? 'toggled' : ''}`}>
      <label className="switch">
        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
        <span className="slider"></span>
      </label>
    </div>
  );
}