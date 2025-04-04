function startNewLog() {
    localStorage.removeItem('unfinishedRound');
    localStorage.removeItem('currentHole');
    document.getElementById('resumeRoundBtn').style.display = 'none';
    showScreen('newLog');
}

function resumeRound() {
    const unfinishedRound = JSON.parse(localStorage.getItem('unfinishedRound'));
    const savedHole = parseInt(localStorage.getItem('currentHole'));

    if (unfinishedRound && savedHole) {
        currentLog = unfinishedRound;
        currentHole = savedHole;
        const lastSavedHole = currentLog.holes.length > 0 ? 
            currentLog.holes[currentLog.holes.length - 1].hole : 0;
        if (lastSavedHole >= currentHole) {
            currentHole = lastSavedHole + 1;
        }
        updateTrackingScreen();
        showScreen('tracking');
    }
}

function beginTracking() {
    const date = document.getElementById('logDate').value;
    const course = document.getElementById('course').value;
    const tees = document.getElementById('tees').value;
    const roundLength = parseInt(document.getElementById('roundLength').value);

    if (!date || !course) {
        alert('Please fill in all fields.');
        return;
    }

    currentLog = {
        date,
        course,
        tees,
        roundLength,
        holes: []
    };
    currentHole = 1;
    updateTrackingScreen();
    showScreen('tracking');
}

function endRound() {
    const dialog = document.getElementById('endRoundDialog');
    const message = document.getElementById('endRoundMessage');
    message.textContent = `Are you sure you want to end the round? You have completed ${currentLog.holes.length} holes, and the current hole (Hole ${currentHole}) can be included.`;
    
    dialog.showModal();

    return new Promise((resolve) => {
        document.getElementById('endRoundYes').onclick = () => {
            dialog.close();
            resolve('yes');
        };
        document.getElementById('endRoundNo').onclick = () => {
            dialog.close();
            resolve('no');
        };
        document.getElementById('endRoundContinue').onclick = () => {
            dialog.close();
            resolve('continue');
        };
    }).then(choice => {
        if (choice === 'continue') {
            return;
        }

        if (choice === 'yes') {
            if (!saveCurrentHole()) {
                return;
            }
        }

        if (currentLog.holes.length > 0 || choice === 'yes') {
            if (currentHole < currentLog.roundLength) {
                localStorage.setItem('unfinishedRound', JSON.stringify(currentLog));
                localStorage.setItem('currentHole', currentHole + 1);
                document.getElementById('resumeRoundBtn').style.display = 'block';
            } else {
                localStorage.removeItem('unfinishedRound');
                localStorage.removeItem('currentHole');
                document.getElementById('resumeRoundBtn').style.display = 'none';
            }
            saveLog();
        }
        showScreen('home');
    });
}