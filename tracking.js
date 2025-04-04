function updateTrackingScreen() {
    document.getElementById('holeTitle').textContent = `Hole ${currentHole} - Par ${holePars[currentHole - 1]}`;
    const par5Stat = document.querySelector('.par5-stat');
    par5Stat.style.display = holePars[currentHole - 1] === 5 ? 'flex' : 'none';
    const nextHoleBtn = document.getElementById('nextHoleBtn');
    nextHoleBtn.textContent = currentHole === currentLog.roundLength ? 'Finish Round' : 'Next Hole';

    document.querySelectorAll('.stat-button').forEach(button => {
        button.classList.remove('active');
        if (button.classList.contains('negative-default')) {
            button.textContent = 'No';
        } else {
            button.textContent = 'Yes';
        }
    });
    document.querySelectorAll('.arrow-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById('holeScore').value = holePars[currentHole - 1];
    document.getElementById('ngirRow').style.display = 'none';
    document.getElementById('fairwayMissRow').style.display = 'none';
    document.getElementById('girMissRow').style.display = 'none';
}

function toggleStat(statId) {
    const button = document.getElementById(statId);
    button.classList.toggle('active');
    if (button.classList.contains('negative-default')) {
        button.textContent = button.classList.contains('active') ? 'Yes' : 'No';
    } else {
        button.textContent = button.classList.contains('active') ? 'No' : 'Yes';
    }
    if (statId === 'fairwayHit') {
        document.getElementById('fairwayMissRow').style.display = button.classList.contains('active') ? 'flex' : 'none';
    }
    if (statId === 'girHit') {
        document.getElementById('girMissRow').style.display = button.classList.contains('active') ? 'flex' : 'none';
        document.getElementById('ngirRow').style.display = button.classList.contains('active') ? 'flex' : 'none';
    }
}

function selectArrow(stat, direction) {
    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
        const btn = document.getElementById(`${stat}${dir.charAt(0).toUpperCase() + dir.slice(1)}`);
        if (dir === direction) {
            btn.classList.toggle('active');
        } else {
            btn.classList.remove('active');
        }
    });
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
        fairwayHit: !document.getElementById('fairwayHit').classList.contains('active'),
        fairwayMiss: {
            up: document.getElementById('fairwayUp').classList.contains('active'),
            down: document.getElementById('fairwayDown').classList.contains('active'),
            left: document.getElementById('fairwayLeft').classList.contains('active'),
            right: document.getElementById('fairwayRight').classList.contains('active')
        },
        girHit: !document.getElementById('girHit').classList.contains('active'),
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
    if (!saveCurrentHole()) {
        return;
    }

    currentHole++;
    if (currentHole > currentLog.roundLength) {
        localStorage.removeItem('unfinishedRound');
        localStorage.removeItem('currentHole');
        document.getElementById('resumeRoundBtn').style.display = 'none';
        saveLog();
        showScreen('home');
    } else {
        localStorage.setItem('unfinishedRound', JSON.stringify(currentLog));
        localStorage.setItem('currentHole', currentHole);
        document.getElementById('resumeRoundBtn').style.display = 'block';
        updateTrackingScreen();
    }
}