import { useState } from 'react';
import './App.scss';

import "./styles/ColorThemes.scss"

function App() {

  const colorThemeList = ["light-theme", "dark-theme"];
  const [colorTheme, setColorTheme] = useState(colorThemeList[1]);

  return (
    <div className={`App ${colorTheme}`} >

      <div className='content-container'>
        <div className='content'>

          <div className='color-btn-list'>
            {colorThemeList.map((item) =>
              <ColorThemeBtn key={item} colorTheme={item} selected={colorTheme} onClick={setColorTheme} />
            )}
          </div>

          <div className='title'>내 등을 부탁해!</div>
          <div className='explain'>{`긁고 싶은 영역을 선택한 뒤 친구에게 요청해보세요 :)`}</div>


        </div>
      </div>


    </div>
  );
}

const ColorThemeBtn = ({ colorTheme, selected, onClick }) => {
  return (
    <button
      onClick={() => onClick(colorTheme)}
      className={`${colorTheme} color-theme-btn ${selected === colorTheme ? "selected" : ""}`}>

    </button>
  )
}

export default App;
