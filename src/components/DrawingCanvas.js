import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ imageSrc, enabled, isClear, setClear }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // 부모 요소 참조 추가
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // 이미지가 로드된 후 캔버스 설정 및 이미지 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current; // 부모 요소 참조

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      if (!canvas || !container) return;

      // 부모 요소 크기에 맞게 캔버스 크기 설정
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // 이미지 크기 비율에 맞게 그리기
      const aspectRatio = img.width / img.height;
      const canvasAspectRatio = container.offsetWidth / container.offsetHeight;

      let drawWidth, drawHeight;
      if (aspectRatio > canvasAspectRatio) {
        drawWidth = container.offsetWidth;
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawHeight = container.offsetHeight;
        drawWidth = drawHeight * aspectRatio;
      }

      // 이미지 가운데 정렬을 위해 좌표 계산
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      // 캔버스에 이미지를 그리기
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
  }, [imageSrc]);

  // `isClear` 값 변경 시 캔버스를 초기화하고 이미지 다시 그리기
  useEffect(() => {
    if (isClear) {
      clearCanvas();
      setClear(false);
    }
  }, [isClear]);

  // 캔버스 지우기 (이미지는 그대로 두고 그린 선만 지움)
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 선만 지우고 이미지는 다시 그리기
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 이미지를 다시 그리기
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          const container = containerRef.current;
          if (!container) return;

          // 부모 요소 크기에 맞게 캔버스 크기 설정
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;

          // 이미지 크기 비율에 맞게 그리기
          const aspectRatio = img.width / img.height;
          const canvasAspectRatio = container.offsetWidth / container.offsetHeight;

          let drawWidth, drawHeight;
          if (aspectRatio > canvasAspectRatio) {
            drawWidth = container.offsetWidth;
            drawHeight = drawWidth / aspectRatio;
          } else {
            drawHeight = container.offsetHeight;
            drawWidth = drawHeight * aspectRatio;
          }

          // 이미지 가운데 정렬을 위해 좌표 계산
          const offsetX = (canvas.width - drawWidth) / 2;
          const offsetY = (canvas.height - drawHeight) / 2;

          // 이미지 다시 그리기
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };
      }
    }
  };

  // 그리기 시작
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getPosition(e);
    setIsDrawing(true);
    setLastPosition({ x: offsetX, y: offsetY });

    // 터치로 그릴 때 스크롤 방지
    if (e.touches) {
      e.preventDefault();
    }
  };

  // 그리기 종료
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 그리기
  const draw = (e) => {
    if (!isDrawing || !enabled) return;
    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getPosition(e);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setLastPosition({ x: offsetX, y: offsetY });

    // 터치로 그릴 때 스크롤 방지
    if (e.touches) {
      e.preventDefault();
    }
  };

  // 터치와 마우스 이벤트의 공통된 처리 함수
  const getPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let offsetX = 0;
    let offsetY = 0;

    if (e.touches) {
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }

    return { offsetX, offsetY };
  };

  // 페이지 스크롤 방지 (그리기 중)
  useEffect(() => {
    const preventDefault = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.addEventListener('mousemove', preventDefault, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('mousemove', preventDefault);
    };
  }, [isDrawing]);

  return (
    <div className="canvas-parent" ref={containerRef}>
      <canvas
        className="canvas"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
      />
    </div>
  );
};

export default DrawingCanvas;
