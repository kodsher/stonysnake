import React, { useState, useEffect } from 'react';
import './App.css';

const CELL_SIZE = 40; // Increased size of the individual squares
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const getRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * WIDTH / CELL_SIZE),
    y: Math.floor(Math.random() * HEIGHT / CELL_SIZE),
  };
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        case ' ':
          if (isGameOver) {
            resetGame();
          }
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isGameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver) {
        moveSnake();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
      setScore(score + 1);
      if (score + 1 > highScore) {
        setHighScore(score + 1);
      }
    } else {
      newSnake.pop();
    }

    if (checkCollision(head, newSnake)) {
      setIsGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const checkCollision = (head, snake) => {
    if (head.x < 0 || head.x >= Math.floor(WIDTH / CELL_SIZE) || head.y < 0 || head.y >= Math.floor(HEIGHT / CELL_SIZE)) {
      return true;
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-area">
      {isGameOver ? (
        <div className="game-over">
          <div>Game Over</div>
          <div>Press Spacebar to Play Again</div>
          <div>High Score: {highScore}</div>
        </div>
      ) : (
        <div className="grid">
          {snake.map((segment, index) => (
            index === 0 ? (
              <img key={index} src="/snake-head.jpg" alt="Snake Head" className="snake-head" style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px`, left: `${segment.x * CELL_SIZE}px`, top: `${segment.y * CELL_SIZE}px` }} />
            ) : (
              <div key={index} className="snake" style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px`, left: `${segment.x * CELL_SIZE}px`, top: `${segment.y * CELL_SIZE}px` }}></div>
            )
          ))}
          <div className="food" style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px`, left: `${food.x * CELL_SIZE}px`, top: `${food.y * CELL_SIZE}px` }}></div>
        </div>
      )}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default App;
