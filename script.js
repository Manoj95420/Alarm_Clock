document.addEventListener('DOMContentLoaded', function() {
    const setAlarmButton = document.getElementById('set-alarm');
    const alarmStatus = document.getElementById('alarm-status');
    const digitalClock = document.getElementById('digital-clock');
    const counter = document.getElementById('counter');
    const stopAlarmButton = document.getElementById('stop-alarm');
    const snoozeAlarmButton = document.getElementById('snooze-alarm');
    const alarmSound = document.getElementById('alarm-sound');
    const alarmsList = document.getElementById('alarms');
    const alarmControls = document.getElementById('alarm-controls');

    let alarms = [];
    let alarmInterval;
    let soundPlaying = false;
    let snoozeTime = 30000; // Snooze time in milliseconds (30 seconds)

    updateClock(); // Initial clock update
    setInterval(updateClock, 1000); // Update clock every second

    setAlarmButton.addEventListener('click', function() {
        const alarmInput = document.getElementById('alarm-time').value;
        const newAlarmTime = new Date();
        const alarmTimeArray = alarmInput.split(':');
        newAlarmTime.setHours(parseInt(alarmTimeArray[0]));
        newAlarmTime.setMinutes(parseInt(alarmTimeArray[1]));
        newAlarmTime.setSeconds(0);

        alarms.push(newAlarmTime);
        updateAlarmsList();
        updateAlarmStatus();
    });

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
    
        // Calculate angles for hands
        const hoursAngle = (hours % 12 + minutes / 60) * 30; // 30 degrees per hour
        const minutesAngle = (minutes + seconds / 60) * 6; // 6 degrees per minute
        const secondsAngle = seconds * 6; // 6 degrees per second
    
        // Rotate hands using CSS transform property
        document.getElementById('hour-hand').setAttribute('transform', `rotate(${hoursAngle}, 100, 100)`);
        document.getElementById('minute-hand').setAttribute('transform', `rotate(${minutesAngle}, 100, 100)`);
        document.getElementById('second-hand').setAttribute('transform', `rotate(${secondsAngle}, 100, 100)`);
    
        // Update digital clock display
        digitalClock.innerHTML = `<span>${hours.toString().padStart(2, '0')}</span>:<span>${minutes.toString().padStart(2, '0')}</span>:<span>${seconds.toString().padStart(2, '0')}</span>`;
    
        // Check alarms and update countdown
        checkAlarms(now);
        updateCountdown(now);
        updateAlarmStatus(); // Ensure alarm status is updated with clock update
    }
    

    function updateCountdown(now) {
        if (alarms.length > 0) {
            const nextAlarmTime = alarms[0];
            const timeDifference = nextAlarmTime.getTime() - now.getTime();

            if (timeDifference > 0) {
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                counter.textContent = `Time until alarm: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                counter.textContent = `Time until alarm: 00:00:00`;
                playAlarmSound(); // Play sound and alert here
            }
        } else {
            counter.textContent = `Time until alarm: -`;
        }
    }

    function updateAlarmsList() {
        alarmsList.innerHTML = ''; // Clear current list
        alarms.forEach((alarm, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${formatTime(alarm)} <button class="btn btn-sm btn-danger delete-alarm" data-index="${index}">Delete</button>`;
            alarmsList.appendChild(listItem);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-alarm');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                alarms.splice(index, 1); // Remove alarm from array
                updateAlarmsList(); // Update alarms list UI
                updateAlarmStatus(); // Update alarm status after deletion
            });
        });
    }

    function updateAlarmStatus() {
        if (alarms.length > 0) {
            alarmStatus.textContent = `Alarm is set for ${formatTime(alarms[0])}`;
            alarmControls.classList.remove('d-none'); // Show alarm controls
        } else {
            alarmStatus.textContent = `Alarm is currently not set.`;
            alarmControls.classList.add('d-none'); // Hide alarm controls
        }
    }

    function checkAlarms(now) {
        alarms.forEach((alarm, index) => {
            if (now.getHours() === alarm.getHours() && now.getMinutes() === alarm.getMinutes() && now.getSeconds() === 0) {
                // Remove alarm from array once it goes off
                alarms.splice(index, 1);
                updateAlarmsList(); // Update alarms list UI
                playAlarmSound();
            }
        });
    }

    function playAlarmSound() {
        if (!soundPlaying) {
            soundPlaying = true;
            alarmSound.play();
            alert('Alarm! Wake up!'); // Alert after playing sound
        }
    }

    stopAlarmButton.addEventListener('click', stopAlarm);
    snoozeAlarmButton.addEventListener('click', snoozeAlarm);

    function stopAlarm() {
        soundPlaying = false;
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmStatus.textContent = `Alarm stopped.`;
        counter.textContent = `Time until alarm: -`;
    }

    function snoozeAlarm() {
        soundPlaying = false; // Pause the alarm sound
        alarmSound.pause();
        alarmSound.currentTime = 0;

        // Snooze for specified time
        setTimeout(() => {
            soundPlaying = false; // Reset soundPlaying flag
            playAlarmSound(); // Resume alarm sound
        }, snoozeTime);

        alarmStatus.textContent = `Alarm snoozed for ${snoozeTime / 1000} seconds.`;
    }

    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
});

//Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const container = document.querySelector('.container'); // Get the main container
    let isDarkMode = false;

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        container.classList.toggle('dark-mode'); // Toggle dark mode class on container
    });

    function updateTheme() {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            container.classList.add('dark-mode'); // Add dark mode class to container
        } else {
            body.classList.remove('dark-mode');
            container.classList.remove('dark-mode'); // Remove dark mode class from container
        }
    }

    // Initial theme based on system preference or default
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode = true;
    }
    updateTheme();
});

