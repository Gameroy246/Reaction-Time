class GameHandler {
  constructor() {
      this.attemptLimit = 5;
      this.attemptNumber = 0;
      this.times = [];
      this.timeout = null;
      this.startTimestamp = 0;
      this.waiting = true;

      this.initializeElements();
      this.setupEventListeners();
  }

  initializeElements() {
      this.screens = {
          start: document.getElementById('startScreen'),
          game: document.getElementById('gameScreen'),
          results: document.getElementById('resultsScreen'),
      };

      this.box = document.getElementById('box');
      this.currentAttemptDisplay = document.getElementById('currentAttempt');
      this.displays = {
          lastTime: document.getElementById('lastTime'),
          bestTime: document.getElementById('bestTime'),
          avgTime: document.getElementById('avgTime'),
          finalAverage: document.getElementById('finalAverage'),
          finalBest: document.getElementById('finalBest'),
      };
  }

  setupEventListeners() {
      document.getElementById('startBtn').addEventListener('click', () => this.startGame());
      document.getElementById('retryBtn').addEventListener('click', () => this.startGame());
      document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
      document.body.classList.toggle('dark');
  }

  showScreen(screenName) {
      Object.values(this.screens).forEach((screen) => screen.classList.remove('active'));
      this.screens[screenName].classList.add('active');
  }

  startGame() {
      this.currentAttempt = 0;
      this.times = [];
      this.showScreen('game');
      this.startNewRound();
  }

  startNewRound() {
      if (this.currentAttempt >= this.maxAttempts) {
          this.showResults();
          return;
      }

      this.currentAttemptDisplay.textContent = this.currentAttempt + 1;
      this.resetBox();
      this.setWaitingState();

      const delay = Math.random() * 3000 + 1000;
      setTimeout(() => this.setReadyState(), delay);

      this.timeout = setTimeout(() => this.handleTimeout(), 10000);
  }

  resetBox() {
      const size = Math.random() * 150 + 50;
      const top = Math.random() * (400 - size);
      const left = Math.random() * (700 - size);
      const isCircle = Math.random() > 0.5;

      Object.assign(this.box.style, {
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}px`,
          left: `${left}px`,
          backgroundColor: '#f44336',
          position: 'relative',
          borderRadius: isCircle ? '50%' : '0',
          display: 'block',
      });
  }

  setWaitingState() {
      this.box.style.backgroundColor = '#f44336';
      this.isWaiting = true;
  }

  setReadyState() {
      this.box.style.backgroundColor = '#4CAF50';
      this.startTime = Date.now();
      this.isWaiting = false;
  }

  handleClick() {
      if (this.isWaiting) {
          this.handleEarlyClick();
      } else {
          this.handleValidClick();
      }
  }

  handleEarlyClick() {
      alert('Too early! Wait for green.');
      clearTimeout(this.timeout);
      this.currentAttempt++;
      this.startNewRound();
  }

  handleTimeout() {
      alert('Too slow! Try to react faster.');
      this.currentAttempt++;
      this.startNewRound();
  }

  handleValidClick() {
      clearTimeout(this.timeout);
      const time = (Date.now() - this.startTime) / 1000;
      this.times.push(time);
      this.updateStats(time);
      this.currentAttempt++;
      this.startNewRound();
  }

  updateStats(time) {
      this.displays.lastTime.textContent = `${time.toFixed(3)}s`;

      const bestTime = Math.min(...this.times);
      this.displays.bestTime.textContent = `${bestTime.toFixed(3)}s`;

      const avgTime = this.times.reduce((a, b) => a + b) / this.times.length;
      this.displays.avgTime.textContent = `${avgTime.toFixed(3)}s`;
  }

  showResults() {
      const avgTime = this.times.reduce((a, b) => a + b) / this.times.length;
      const bestTime = Math.min(...this.times);

      this.displays.finalAverage.textContent = `${avgTime.toFixed(3)}s`;
      this.displays.finalBest.textContent = `${bestTime.toFixed(3)}s`;

      this.showScreen('results');
  }
}

const gameHandler = new GameHandler();
