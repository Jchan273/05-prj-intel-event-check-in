// Intel Sustainability Summit Check-In App

const GOAL = 50;

// Get elements from the page
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const teamCounts = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount")
};

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables"
};


// Load saved information from local storage
let attendance = Number(localStorage.getItem("attendance")) || 0;

let teams = {
  water: Number(localStorage.getItem("waterCount")) || 0,
  zero: Number(localStorage.getItem("zeroCount")) || 0,
  power: Number(localStorage.getItem("powerCount")) || 0
};

let attendees = JSON.parse(localStorage.getItem("attendees")) || [];


// Create the attendee list
const attendeeListSection = document.createElement("div");
attendeeListSection.className = "attendee-list";

attendeeListSection.innerHTML = `
  <h3>Attendee List</h3>
  <ul id="attendeeList"></ul>
`;

document.querySelector(".team-stats").appendChild(attendeeListSection);

const attendeeList = document.getElementById("attendeeList");


// Create celebration message
const celebration = document.createElement("p");

celebration.id = "celebration";
celebration.style.display = "none";
celebration.style.marginTop = "20px";
celebration.style.padding = "16px";
celebration.style.borderRadius = "10px";
celebration.style.backgroundColor = "#e8f4fc";
celebration.style.color = "#003c71";
celebration.style.fontWeight = "700";

document.querySelector(".team-stats").appendChild(celebration);


// Update everything on the page
function updateDisplay() {

  // Update total attendance
  attendeeCount.textContent = attendance;

  // Calculate progress percentage
  const percentage = Math.min((attendance / GOAL) * 100, 100);

  // Update progress bar
  progressBar.style.width = `${percentage}%`;

  // Update team counts
  teamCounts.water.textContent = teams.water;
  teamCounts.zero.textContent = teams.zero;
  teamCounts.power.textContent = teams.power;

  // Update attendee list
  updateAttendeeList();

  // Check if goal was reached
  updateCelebration();
}


// Display the attendee list
function updateAttendeeList() {

  attendeeList.innerHTML = "";

  attendees.forEach(function(attendee) {

    const listItem = document.createElement("li");

    listItem.textContent =
      `${attendee.name} — ${teamNames[attendee.team]}`;

    attendeeList.appendChild(listItem);
  });
}


// Display celebration message
function updateCelebration() {

  if (attendance >= GOAL) {

    const winningTeam = Object.keys(teams).reduce(function(winner, team) {

      if (teams[team] > teams[winner]) {
        return team;
      }

      return winner;

    }, "water");


    celebration.textContent =
      `🎉 Attendance goal reached! ${teamNames[winningTeam]} is currently in the lead with ${teams[winningTeam]} attendees!`;

    celebration.style.display = "block";

  } else {

    celebration.style.display = "none";
  }
}


// Save progress to local storage
function saveProgress() {

  localStorage.setItem("attendance", attendance);

  localStorage.setItem("waterCount", teams.water);

  localStorage.setItem("zeroCount", teams.zero);

  localStorage.setItem("powerCount", teams.power);

  localStorage.setItem("attendees", JSON.stringify(attendees));
}


// Listen for the form being submitted
form.addEventListener("submit", function(event) {

  // Prevent the page from refreshing
  event.preventDefault();


  // Get the attendee's name and selected team
  const name = nameInput.value.trim();

  const team = teamSelect.value;


  // Make sure both values were entered
  if (!name || !team) {
    return;
  }


  // Increase total attendance
  attendance++;


  // Increase the selected team's count
  teams[team]++;


  // Add attendee to the attendee list
  attendees.push({
    name: name,
    team: team
  });


  // Display personalized greeting
  greeting.textContent =
    `Welcome, ${name}! You're checked in with ${teamNames[team]}.`;

  greeting.className = "success-message";

  greeting.style.display = "block";


  // Save progress
  saveProgress();


  // Update the page
  updateDisplay();


  // Clear the form
  form.reset();

});


// Add styling for the attendee list
const listStyles = document.createElement("style");

listStyles.textContent = `

  .attendee-list {
    margin-top: 30px;
    padding-top: 25px;
    border-top: 2px solid #f1f5f9;
    text-align: left;
  }

  .attendee-list h3 {
    color: #64748b;
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
  }

  #attendeeList {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #attendeeList li {
    padding: 10px 12px;
    margin-bottom: 8px;
    background: #f8fafc;
    border-radius: 8px;
    color: #475569;
  }

`;

document.head.appendChild(listStyles);


// Load saved information when the page opens
updateDisplay();
