// ==== Durations (en secondes) ====
const MODE_DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };
  
  let currentMode = 'focus';
  let remainingTime = MODE_DURATIONS[currentMode];
  let timerInterval = null;
  let isRunning = false;
  
  // ==== Elements du DOM ====
  // Boutons de sélection de mode (dans <section class="mode-selector">)
  const modeButtons = document.querySelectorAll('.mode-selector .mode-button');
  
  // Affichage du timer
  const timeDisplay = document.querySelector('.timer_display .time');
  
  // Boutons Pause/Resume/Reset (après modification HTML)
  const pauseButton  = document.querySelector('.timer_controls .pause-button');
  const resumeButton = document.querySelector('.timer_controls .resume-button');
  const resetButton  = document.querySelector('.timer_controls .reset-button');
  
  
  // ==== Utilitaire : formate “seconds” en “MM:SS” ====
  function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs    = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  }
  
  // Met à jour ce qu’on voit à l’écran
  function updateDisplay() {
    timeDisplay.textContent = formatTime(remainingTime);
  }
  
  // Change de mode (focus, shortBreak, longBreak)
  function switchMode(modeName) {
    // Si un timer est en cours, on l’arrête
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
  
    // Mise à jour du mode et du temps restant
    currentMode = modeName;
    remainingTime = MODE_DURATIONS[modeName];
    updateDisplay();
  
    // Mise en surbrillance du bouton de mode actif
    modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === modeName);
    });
  
    // Après un changement de mode, on désactive Pause, on active Resume
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  }
  
  // Lancement ou reprise du compte à rebours
  function startTimer() {
    if (isRunning) return;
    isRunning = true;
  
    // Pendant l’exécution, on désactive Resume et on active Pause
    resumeButton.disabled = true;
    pauseButton.disabled = false;
  
    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        // Lorsque ça atteint zéro : on désactive Pause, on réactive Resume
        pauseButton.disabled = true;
        resumeButton.disabled = false;
      }
    }, 1000);
  }
  
  // Mettre le timer en pause
  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
  
    // Quand c’est en pause, on désactive Pause et on active Resume
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  }
  
  // Remet le timer à la valeur complète du mode en cours
  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
    remainingTime = MODE_DURATIONS[currentMode];
    updateDisplay();
  
    // Après reset, on désactive Pause et on active Resume
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  }
  
  
  // ==== Attacher les évènements ====
  // 1) Changement de mode :
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenMode = btn.dataset.mode; // "focus", "shortBreak" ou "longBreak"
      switchMode(chosenMode);
    });
  });
  
  // 2) Pause / Resume / Reset :
  pauseButton.addEventListener('click', pauseTimer);
  resumeButton.addEventListener('click', startTimer);
  resetButton.addEventListener('click', resetTimer);
  
  // ==== Initialisation au chargement de la page ====
  switchMode(currentMode);   // Par défaut sur “focus”
  