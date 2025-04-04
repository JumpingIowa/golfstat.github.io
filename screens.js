const screens = {
    home: document.getElementById('homeScreen'),
    newLog: document.getElementById('newLogScreen'),
    tracking: document.getElementById('trackingScreen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}