document.getElementById('startNewLogBtn').addEventListener('click', startNewLog);
document.getElementById('resumeRoundBtn').addEventListener('click', resumeRound);
document.getElementById('beginTrackingBtn').addEventListener('click', beginTracking);
document.getElementById('teeShotInPlay').addEventListener('click', () => toggleStat('teeShotInPlay'));
document.getElementById('fairwayHit').addEventListener('click', () => toggleStat('fairwayHit'));
document.getElementById('fairwayUp').addEventListener('click', () => selectArrow('fairway', 'up'));
document.getElementById('fairwayDown').addEventListener('click', () => selectArrow('fairway', 'down'));
document.getElementById('fairwayLeft').addEventListener('click', () => selectArrow('fairway', 'left'));
document.getElementById('fairwayRight').addEventListener('click', () => selectArrow('fairway', 'right'));
document.getElementById('girHit').addEventListener('click', () => toggleStat('girHit'));
document.getElementById('girUp').addEventListener('click', () => selectArrow('gir', 'up'));
document.getElementById('girDown').addEventListener('click', () => selectArrow('gir', 'down'));
document.getElementById('girLeft').addEventListener('click', () => selectArrow('gir', 'left'));
document.getElementById('girRight').addEventListener('click', () => selectArrow('gir', 'right'));
document.getElementById('ngir').addEventListener('click', () => toggleStat('ngir'));
document.getElementById('twoWedgeShots').addEventListener('click', () => toggleStat('twoWedgeShots'));
document.getElementById('threePutt').addEventListener('click', () => toggleStat('threePutt'));
document.getElementById('badPar5').addEventListener('click', () => toggleStat('badPar5'));
document.getElementById('nextHoleBtn').addEventListener('click', nextHole);
document.getElementById('endRoundBtn').addEventListener('click', endRound);

displayPastLogs();
if (localStorage.getItem('unfinishedRound') && localStorage.getItem('currentHole')) {
    document.getElementById('resumeRoundBtn').style.display = 'block';
}