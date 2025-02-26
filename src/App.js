import { useState } from 'react';
import './App.scss';

import "./styles/ColorThemes.scss"
import DrawingCanvas from './components/DrawingCanvas';

import ImageBackBlack from "./assets/images/image_back_black.png"
import ImageBackLight from "./assets/images/image_back_light.png"
import { ReactComponent as IconRefresh } from "./assets/images/icon_refresh.svg"

function App() {

  const colorThemeList = ["light-theme", "dark-theme"];
  const [colorTheme, setColorTheme] = useState(colorThemeList[1]);

  const [enabled, setEnabled] = useState(true);
  const [isClear, setClear] = useState(false);

  const onClear = () => {
    setClear(true);
    setEnabled(true);
  };

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
          <div className='explain'>{`가려운 부분을 표시한 뒤 친구에게 보여주세요 ٩( ᐛ )و`}</div>

          <button className='clear-button' onClick={() => onClear()}>
            <IconRefresh className='img' />
            {"초기화"}
          </button>

          <DrawingCanvas imageSrc={ImageBackLight} enabled={enabled} isClear={isClear} setClear={setClear} />

          <button className='bottom-button' onClick={() => setEnabled((prev) => !prev)}>
            {enabled ? "완료!" : "다시하기"}
          </button>

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
