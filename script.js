const zones = {
  "IST": { tz: "Asia/Kolkata", label: "India Standard Time" },
  "GMT": { tz: "Europe/London", label: "Greenwich Mean Time" },
  "CET": { tz: "Europe/Rome", label: "Central European Time" },
  "EET": { tz: "Europe/Helsinki", label: "Eastern European Time" },
  "EST": { tz: "America/New_York", label: "Eastern Standard Time" },
  "CST": { tz: "America/Chicago", label: "Central Standard Time" },
  "MST": { tz: "America/Denver", label: "Mountain Standard Time" }
};


  function formatHM(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit"
    });
    return formatter.format(date);
  }

  function convertTimes() {
    const baseZone = document.getElementById("baseZone").value;
    const baseTime = document.getElementById("baseTime").value;

    if (!baseTime) {
      alert("Please enter a valid time.");
      return;
    }

    let [hours, minutes] = baseTime.split(":").map(Number);

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    function getLocalSeconds(utcSeconds, tz) {
      const testDate = new Date(todayUTC.getTime() + utcSeconds * 1000);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      });
      const parts = formatter.formatToParts(testDate);
      let h = 0, m = 0;
      for (const part of parts) {
        if (part.type === "hour") h = parseInt(part.value, 10);
        if (part.type === "minute") m = parseInt(part.value, 10);
      }
      return h * 3600 + m * 60;
    }

    const targetSeconds = hours * 3600 + minutes * 60;

    let low = 0, high = 86400;
    let foundUTCSeconds = 0;

    for (let i = 0; i < 25; i++) {
      let mid = Math.floor((low + high) / 2);
      let val = getLocalSeconds(mid, baseZone);

      if (val === targetSeconds) {
        foundUTCSeconds = mid;
        break;
      } else if (val < targetSeconds) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      foundUTCSeconds = mid;
    }

    const utcDate = new Date(todayUTC.getTime() + foundUTCSeconds * 1000);

    let resultHtml = `<strong>Base Time (${baseZone}):</strong> ${baseTime}<br><br>`;

   for (const [abbr, data] of Object.entries(zones)) {
  const timeStr = formatHM(utcDate, data.tz);
  resultHtml += `<strong>${abbr} (${data.label}):</strong> ${timeStr}<br>`;
}

    document.getElementById("results").innerHTML = resultHtml;
  }






// Fill hour and minute dropdowns on page load
window.onload = function () {
  const hourSelect = document.getElementById('baseHour');
  const minuteSelect = document.getElementById('baseMinute');

  for (let h = 1; h <= 12; h++) {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = h.toString().padStart(2, '0');
    hourSelect.appendChild(option);
  }

  for (let m = 0; m < 60; m++) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m.toString().padStart(2, '0');
    minuteSelect.appendChild(option);
  }

  // Add event listeners to update display
  hourSelect.addEventListener('change', updateDisplayTime);
  minuteSelect.addEventListener('change', updateDisplayTime);
  document.getElementById('basePeriod').addEventListener('change', updateDisplayTime);
};

function updateDisplayTime() {
  const hour = document.getElementById('baseHour').value;
  const minute = document.getElementById('baseMinute').value;
  const period = document.getElementById('basePeriod').value;

  if (hour && minute && period) {
    document.getElementById('displayTime').textContent = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
  }
}
 
// document.addEventListener('copy', function(event) {
//   event.clipboardData.setData('text/plain', 'U so lazy');
//   event.preventDefault();
// });
