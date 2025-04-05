function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('logDate').value = today;
    console.log('Default date set to:', today);
}

function setFavoriteCourse() {
    const favoriteCourse = document.getElementById('favoriteCourse').value.trim();
    if (favoriteCourse) {
        localStorage.setItem('favoriteCourse', favoriteCourse);
        alert(`Favorite course set to: ${favoriteCourse}`);
        console.log('Favorite course saved:', favoriteCourse);
    } else {
        alert('Please enter a course name.');
    }
}

function setDefaultCourse() {
    const favoriteCourse = getFavoriteCourse();
    console.log('Retrieved favorite course:', favoriteCourse);
    if (favoriteCourse) {
        document.getElementById('course').value = favoriteCourse;
        document.getElementById('favoriteCourse').value = favoriteCourse;
        console.log('Default course set to:', favoriteCourse);
    }
}

function toggleLogs() {
    const pastLogs = document.getElementById('pastLogs');
    const toggleBtn = document.getElementById('toggleLogsBtn');
    if (pastLogs.style.display === 'none') {
        pastLogs.style.display = 'block';
        toggleBtn.textContent = 'Hide';
    } else {
        pastLogs.style.display = 'none';
        toggleBtn.textContent = 'Unhide';
    }
}

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
document.getElementById('setFavoriteCourseBtn').addEventListener('click', setFavoriteCourse);
document.getElementById('clearLogsBtn').addEventListener('click', clearLogsDisplay);
document.getElementById('toggleLogsBtn').addEventListener('click', toggleLogs);
document.getElementById('deleteLogsBtn').addEventListener('click', deleteLogs);

displayPastLogs();
if (localStorage.getItem('unfinishedRound') && localStorage.getItem('currentHole')) {
    document.getElementById('resumeRoundBtn').style.display = 'block';
}
setDefaultDate();
setDefaultCourse();