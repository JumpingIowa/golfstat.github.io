let currentLog = {
    date: '',
    course: '',
    tees: '',
    holes: []
};
let currentHole = 1;

const holePars = Array(18).fill(0).map((_, i) => {
    if (i % 4 === 0) return 5;
    if (i % 2 === 0) return 4;
    return 3;
});

function saveLog() {
    const savedLogs = JSON.parse(localStorage.getItem('golfLogs') || '[]');
    savedLogs.push(currentLog);
    localStorage.setItem('golfLogs', JSON.stringify(savedLogs));
    displayPastLogs();
}

function displayPastLogs() {
    const pastLogsDiv = document.getElementById('pastLogs');
    const savedLogs = JSON.parse(localStorage.getItem('golfLogs') || '[]');
    
    // Sort logs by date, most recent first
    savedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
                        <th>Fairway Miss</th>
                        <th>GIR Miss</th>
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
                    <td>${fairwayMiss || '-'}</td>
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
            <p>Fairway Misses (Up/Down/Left/Right): ${
                log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.up).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.down).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.left).length
            }/${log.holes.filter(h => h.fairwayMiss && h.fairwayMiss.right).length}</p>
            <p>GIR Misses (Up/Down/Left/Right): ${
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

function getFavoriteCourse() {
    return localStorage.getItem('favoriteCourse') || '';
}

function clearLogsDisplay() {
    document.getElementById('pastLogs').innerHTML = '';
    // Placeholder for future "undo" functionality; logs remain in localStorage
}

function deleteLogs() {
    if (confirm('Are you sure you want to delete all logs? This cannot be undone.')) {
        localStorage.removeItem('golfLogs');
        displayPastLogs();
    }
}