// Screen management
const screens = {
    home: document.getElementById('homeScreen'),
    newLog: document.getElementById('newLogScreen'),
    tracking: document.getElementById('trackingScreen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Log data
let currentLog = {
    date: '',
    course: '',
    tees: '',
    holes: []
};
let currentHole = 1;

// Simulated par for each hole (for simplicity, alternate between Par 3, 4, 5)
const holePars = Array(18).fill(0).map((_, i) => {
    if (i % 4 === 0) return 5; // Par 5 every 4th hole
    if (i % 2 === 0) return 4; // Par 4 otherwise
    return 3; // Par 3
});

function startNewLog() {
    // Clear any previous unfinished round
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

        // Check if the current hole was already saved
        const lastSavedHole = currentLog.holes.length > 0 ? 
            currentLog.holes[currentLog.holes.length - 1].hole : 0;
        if (lastSavedHole >= currentHole) {
            currentHole = lastSavedHole + 1; // Move to next hole if current was saved
        }

        updateTrackingScreen();
        showScreen('tracking');
    }
}

// Update the beginTracking function
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
        roundLength, // Store the round length
        holes: []
    };
    currentHole = 1;
    // Adjust holePars based on roundLength
    // holePars = Array(roundLength).fill(0).map((_, i) => {
    //     if (i % 4 === 0) return 5; // Par 5 every 4th hole
    //     if (i % 2 === 0) return 4; // Par 4 otherwise
    //     return 3; // Par 3
    // });
    updateTrackingScreen();
    showScreen('tracking');
}

function updateTrackingScreen() {
    document.getElementById('holeTitle').textContent = `Hole ${currentHole} - Par ${holePars[currentHole - 1]}`;
    const par5Stat = document.querySelector('.par5-stat');
    par5Stat.style.display = holePars[currentHole - 1] === 5 ? 'flex' : 'none';
    const nextHoleBtn = document.getElementById('nextHoleBtn');
    nextHoleBtn.textContent = currentHole === currentLog.roundLength ? 'Finish Round' : 'Next Hole';

    // Reset buttons and arrows
    document.querySelectorAll('.stat-button').forEach(button => {
        button.classList.remove('active');
        if (button.classList.contains('negative-default')) {
            button.textContent = 'No'; // Negative stats default to No
        } else {
            button.textContent = 'Yes'; // Positive stats (Tee Shot, Fairway Hit, GIR, NGIR) default to Yes
        }
    });
    document.querySelectorAll('.arrow-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById('holeScore').value = holePars[currentHole - 1];

    // Hide miss rows by default
    document.getElementById('fairwayMissRow').style.display = 'none';
    document.getElementById('girMissRow').style.display = 'none';
    document.getElementById('ngirRow').style.display = 'none';
}

function selectArrow(stat, direction) {
    const directions = ['up', 'down', 'left', 'right'];
    let anyActive = false;
    directions.forEach(dir => {
        const btn = document.getElementById(`${stat}${dir.charAt(0).toUpperCase() + dir.slice(1)}`);
        if (dir === direction) {
            btn.classList.toggle('active');
        } else {
            btn.classList.remove('active');
        }
        if (btn.classList.contains('active')) anyActive = true;
    });
    // No need to toggle visibility here since it's handled by toggleStat
}

function toggleStat(statId) {
    console.log(`Toggling stat: ${statId}`);
    const button = document.getElementById(statId);
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    if (button.classList.contains('negative-default')) {
        button.textContent = isActive ? 'Yes' : 'No';
    } else {
        button.textContent = isActive ? 'No' : 'Yes';
    }

    if (statId === 'fairwayHit') {
        document.getElementById('fairwayMissRow').style.display = isActive ? 'flex' : 'none';
    } else if (statId === 'girHit') {
        document.getElementById('girMissRow').style.display = isActive ? 'flex' : 'none';
        document.getElementById('ngirRow').style.display = isActive ? 'flex' : 'none';
    }
}

function selectArrow(stat, direction) {
    const directions = ['up', 'down', 'left', 'right'];
    let anyActive = false;
    directions.forEach(dir => {
        const btn = document.getElementById(`${stat}${dir.charAt(0).toUpperCase() + dir.slice(1)}`);
        if (dir === direction) {
            btn.classList.toggle('active');
        } else {
            btn.classList.remove('active');
        }
        if (btn.classList.contains('active')) anyActive = true;
    });
    if (stat === 'gir') {
        document.getElementById('ngirRow').style.display = anyActive ? 'flex' : 'none';
    }
}

function saveCurrentHole() {
    const scoreInput = document.getElementById('holeScore').value;
    const score = scoreInput ? parseInt(scoreInput) : null;

    if (!scoreInput) return true;
    if (score < 1) {
        alert('Please enter a valid score (1 or higher) for this hole.');
        return false;
    }

    const par = holePars[currentHole - 1];
    const calculatedBadPar5 = par === 5 && score >= par + 1;
    const manualBadPar5 = document.getElementById('badPar5').classList.contains('active');

    const holeStats = {
        hole: currentHole,
        teeShotInPlay: document.getElementById('teeShotInPlay').classList.contains('active'),
        fairwayHit: !document.getElementById('fairwayHit').classList.contains('active'), // Yes = not active
        fairwayMiss: {
            up: document.getElementById('fairwayUp').classList.contains('active'),
            down: document.getElementById('fairwayDown').classList.contains('active'),
            left: document.getElementById('fairwayLeft').classList.contains('active'),
            right: document.getElementById('fairwayRight').classList.contains('active')
        },
        gir: !document.getElementById('girHit').classList.contains('active'), // Yes = not active
        girMiss: {
            up: document.getElementById('girUp').classList.contains('active'),
            down: document.getElementById('girDown').classList.contains('active'),
            left: document.getElementById('girLeft').classList.contains('active'),
            right: document.getElementById('girRight').classList.contains('active')
        },
        ngir: document.getElementById('ngir').classList.contains('active'),
        twoWedgeShots: document.getElementById('twoWedgeShots').classList.contains('active'),
        threePutt: document.getElementById('threePutt').classList.contains('active'),
        badPar5: par === 5 ? manualBadPar5 || calculatedBadPar5 : false,
        score: score
    };
    currentLog.holes.push(holeStats);
    return true;
}

function nextHole() {
    // Save the current hole's stats
    if (!saveCurrentHole()) {
        return;
    }

    currentHole++;
    if (currentHole > currentLog.roundLength) { // Use roundLength instead of hardcoding 18
        // Clear unfinished round data
        localStorage.removeItem('unfinishedRound');
        localStorage.removeItem('currentHole');
        document.getElementById('resumeRoundBtn').style.display = 'none';
        saveLog();
        showScreen('home');
    } else {
        // Save the current state for resuming
        localStorage.setItem('unfinishedRound', JSON.stringify(currentLog));
        localStorage.setItem('currentHole', currentHole);
        document.getElementById('resumeRoundBtn').style.display = 'block';
        updateTrackingScreen();
    }
}

function endRound() {
    const dialog = document.getElementById('endRoundDialog');
    const message = document.getElementById('endRoundMessage');
    message.textContent = `Are you sure you want to end the round? You have completed ${currentLog.holes.length} holes, and the current hole (Hole ${currentHole}) can be included.`;
    
    // Show the dialog
    dialog.showModal();

    // Return a promise to handle the user's choice
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
            return; // Do nothing, continue the round
        }

        // Handle saving based on the choice
        if (choice === 'yes') {
            if (!saveCurrentHole()) {
                return;
            }
        }

        // Save the round and return to home screen
        if (currentLog.holes.length > 0 || choice === 'yes') {
            // Save the current state for resuming if the round is not complete
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

function saveLog() {
    const savedLogs = JSON.parse(localStorage.getItem('golfLogs') || '[]');
    savedLogs.push(currentLog);
    localStorage.setItem('golfLogs', JSON.stringify(savedLogs));
    displayPastLogs();
}

function displayPastLogs() {
    const pastLogsDiv = document.getElementById('pastLogs');
    const savedLogs = JSON.parse(localStorage.getItem('golfLogs') || '[]');
    pastLogsDiv.innerHTML = '';

    savedLogs.forEach((log, index) => {
        const totalScore = log.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
        const holesPlayed = log.holes.length;
        const logDiv = document.createElement('div');
        logDiv.className = 'log-entry';
        let holeDetails = `
            <div class="hole-details" id="holeDetails-${index}">
                <h4>Hole-by-Hole Breakdown</h4>
                <table>
                    <tr>
                        <th>Hole</th>
                        <th>Par</th>
                        <th>Score</th>
                        <th>Fairway Hit</th>
                        <th>Fairway Miss</th>
                        <th>GIR</th>
                        <th>Green Miss</th>
                        <th>NGIR</th>
                        <th>Two+ Wedges</th>
                        <th>Three Putt</th>
                        <th>Bogey+ Par 5</th>
                    </tr>
        `;
        log.holes.forEach(hole => {
            const fairwayMiss = hole.fairwayMiss ? 
                `${hole.fairwayMiss.up ? 'Up' : ''}${hole.fairwayMiss.down ? 'Down' : ''}${hole.fairwayMiss.left ? 'Left' : ''}${hole.fairwayMiss.right ? 'Right' : ''}` : '-';
            const girMiss = hole.girMiss ? 
                `${hole.girMiss.up ? 'Up' : ''}${hole.girMiss.down ? 'Down' : ''}${hole.girMiss.left ? 'Left' : ''}${hole.girMiss.right ? 'Right' : ''}` : '-';
            holeDetails += `
                <tr>
                    <td>${hole.hole}</td>
                    <td>${holePars[hole.hole - 1]}</td>
                    <td>${hole.score}</td>
                    <td>${hole.fairwayHit ? 'Yes' : 'No'}</td>
                    <td>${fairwayMiss || '-'}</td>
                    <td>${hole.gir ? 'Yes' : 'No'}</td>
                    <td>${girMiss || '-'}</td>
                    <td>${hole.ngir ? 'Yes' : 'No'}</td>
                    <td>${hole.twoWedgeShots ? 'Yes' : 'No'}</td>
                    <td>${hole.threePutt ? 'Yes' : 'No'}</td>
                    <td>${hole.badPar5 ? 'Yes' : '-'}</td>
                </tr>
            `;
        });
        holeDetails += '</table></div>';

        logDiv.innerHTML = `
            <h3>Log ${index + 1}: ${log.date} at ${log.course} (${log.tees} tees)</h3>
            <p>Holes Played: ${holesPlayed}/${log.roundLength}</p>
            <p>Total Score: ${totalScore}</p>
            <p>Tee Shots in Play: ${log.holes.filter(h => h.teeShotInPlay).length}/${holesPlayed}</p>
            <p>Fairway Hits: ${log.holes.filter(h => h.fairwayHit).length}/${holesPlayed}</p>
            <p>Fairway Misses (Up/Down/Left/Right): ${
                log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.up).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.down).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.left).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.right).length}</p>
            <p>GIR: ${log.holes.filter(h => h.gir).length}/${holesPlayed}</p>
            <p>Green Misses (Up/Down/Left/Right): ${
                log.holes.filter(h => h.girMiss && h.girMiss.up).length
            }/${log.holes.filter(h => h.girMiss && h.girMiss.down).length
            }/${log.holes.filter(h => h.girMiss && h.girMiss.left).length
            }/${log.holes.filter(h => h.girMiss && h.girMiss.right).length}</p>
            <p>NGIR: ${log.holes.filter(h => h.ngir).length}/${holesPlayed}</p>
            <p>Two+ Wedge Shots: ${log.holes.filter(h => h.twoWedgeShots).length}</p>
            <p>Three Putts: ${log.holes.filter(h => h.threePutt).length}</p>
            <p>Bogey+ on Par 5s: ${log.holes.filter(h => h.badPar5).length}</p>
            <button class="collapsible-btn" id="toggleDetails-${index}">Show Hole Details</button>
            ${holeDetails}
        `;
        pastLogsDiv.appendChild(logDiv);

        const toggleButton = document.getElementById(`toggleDetails-${index}`);
        toggleButton.addEventListener('click', () => {
            const details = document.getElementById(`holeDetails-${index}`);
            details.classList.toggle('active');
            toggleButton.textContent = details.classList.contains('active') ? 'Hide Hole Details' : 'Show Hole Details';
        });
    });
}

function addListener(id, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', callback);
    } else {
        console.error(`Element with ID '${id}' not found`);
    }
}

addListener('teeShotInPlay', () => toggleStat('teeShotInPlay'));
addListener('fairwayHit', () => toggleStat('fairwayHit'));
addListener('fairwayUp', () => selectArrow('fairway', 'up'));
addListener('fairwayDown', () => selectArrow('fairway', 'down'));
addListener('fairwayLeft', () => selectArrow('fairway', 'left'));
addListener('fairwayRight', () => selectArrow('fairway', 'right'));
addListener('girHit', () => toggleStat('girHit'));
addListener('girUp', () => selectArrow('gir', 'up'));
addListener('girDown', () => selectArrow('gir', 'down'));
addListener('girLeft', () => selectArrow('gir', 'left'));
addListener('girRight', () => selectArrow('gir', 'right'));
addListener('ngir', () => toggleStat('ngir'));
addListener('twoWedgeShots', () => toggleStat('twoWedgeShots'));
addListener('threePutt', () => toggleStat('threePutt'));
addListener('badPar5', () => toggleStat('badPar5'));
addListener('nextHoleBtn', nextHole);
addListener('endRoundBtn', endRound);

// Initialize
displayPastLogs();

// Check for an unfinished round on load
if (localStorage.getItem('unfinishedRound') && localStorage.getItem('currentHole')) {
    document.getElementById('resumeRoundBtn').style.display = 'block';
}
