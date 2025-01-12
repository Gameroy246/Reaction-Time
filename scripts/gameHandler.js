class GameHandler {
    constructor() {
        this.attemptLimit = 5;
        this.currentAttempt = 0;
        this.times = [];
        this.timeout = null;
        this.isWaiting = true;

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
        document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
        this.box.addEventListener('click', () => this.handleClick());
    }

    showScreen(screenName) {
        for (const screen of Object.values(this.screens)) {
            screen.classList.toggle('active', screen === this.screens[screenName]);
        }
    }

    startGame() {
        this.currentAttempt = 0;
        this.times = [];
        this.showScreen('game');
        this.startNewRound();
    }

    startNewRound() {
        if (this.currentAttempt >= this.attemptLimit) {
            this.showResults();
            return;
        }

        this.currentAttemptDisplay.textContent = this.currentAttempt + 1;
        this.resetBox();
        this.setWaitingState();

        const delay = Math.random() * 2000 + 1000;
        setTimeout(() => this.setReadyState(), delay);

        this.timeout = setTimeout(() => this.handleTimeout(), 10000);
    }

    resetBox() {
        const size = Math.random() * 100 + 50;
        const top = Math.random() * (400 - size);
        const left = Math.random() * (600 - size);
        const isCircle = Math.random() > 0.5;

        Object.assign(this.box.style, {
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}px`,
            left: `${left}px`,
            backgroundColor: '#f44336',
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
        this.startTimestamp = Date.now();
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
        alert('Too slow! Try again.');
        this.currentAttempt++;
        this.startNewRound();
    }

    handleValidClick() {
        clearTimeout(this.timeout);
        const time = (Date.now() - this.startTimestamp) / 1000;
        this.times.push(time);
        this.updateStats(time);
        this.currentAttempt++;
        this.startNewRound();
    }

    updateStats(time) {
        this.displays.lastTime.textContent = `${time.toFixed(3)}s`;
        const bestTime = Math.min(...this.times);
        const avgTime = this.times.reduce((a, b) => a + b, 0) / this.times.length;

        this.displays.bestTime.textContent = `${bestTime.toFixed(3)}s`;
        this.displays.avgTime.textContent = `${avgTime.toFixed(3)}s`;
    }

    showResults() {
        const avgTime = this.times.reduce((a, b) => a + b, 0) / this.times.length;
        const bestTime = Math.min(...this.times);

        this.displays.finalAverage.textContent = `${avgTime.toFixed(3)}s`;
        this.displays.finalBest.textContent = `${bestTime.toFixed(3)}s`;
        this.showScreen('results');
    }
}

const gameHandler = new GameHandler();
