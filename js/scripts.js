// Data from CSV
const data = [
    {
        "Date": "4/04/2023",
        "Home Team": "Brooklyn Nets",
        "Visitor Team": "Minnesota Timberwolves",
        "Home Team Predicted": 106,
        "Away Team Predicted": 109,
        "PredictedTotalGameScore": 215,
        "Winner": "Minnesota Timberwolves",
        "Margin": 3
    },
    {
        "Date": "27/02/2024",
        "Home Team": "Orlando Magic",
        "Visitor Team": "Sacramento Kings",
        "Home Team Predicted": 112,
        "Away Team Predicted": 110,
        "PredictedTotalGameScore": 212,
        "Winner": "Orlando Magic",
        "Margin": 2
    },
    {
        "Date": "27/02/2024",
        "Home Team": "Toronto Raptors",
        "Visitor Team": "Charlotte Hornets",
        "Home Team Predicted": 109,
        "Away Team Predicted": 122,
        "PredictedTotalGameScore": 221,
        "Winner": "Charlotte Hornets",
        "Margin": 13
    },
    {
        "Date": "27/02/2024",
        "Home Team": "Miami Heat",
        "Visitor Team": "Detroit Pistons",
        "Home Team Predicted": 113,
        "Away Team Predicted": 105,
        "PredictedTotalGameScore": 218,
        "Winner": "Miami Heat",
        "Margin": 8
    },
    // Add more records here...
];

const teams = [
    "Atlanta_Hawks", "Boston_Celtics", "Brooklyn_Nets", "Charlotte_Hornets",
    "Chicago_Bulls", "Cleveland_Cavaliers", "Dallas_Mavericks", "Denver_Nuggets",
    "Detroit_Pistons", "Golden_State_Warriors", "Houston_Rockets", "Indiana_Pacers",
    "LA_Clippers", "Los_Angeles_Lakers", "Memphis_Grizzlies", "Miami_Heat",
    "Milwaukee_Bucks", "Minnesota_Timberwolves", "New_Orleans_Pelicans",
    "New_York_Knicks", "Oklahoma_City_Thunder", "Orlando_Magic", "Philadelphia_76ers",
    "Phoenix_Suns", "Portland_Trail_Blazers", "Sacramento_Kings", "San_Antonio_Spurs",
    "Toronto_Raptors", "Utah_Jazz", "Washington_Wizards"
];

const gameDateSelect = document.getElementById('game-date');
const predictionsTable = document.getElementById('predictions-table');
const teamLogos = document.getElementById('team-logos');
const selectedDateSpan = document.getElementById('selected-date');

// Populate game dates
const dates = [...new Set(data.map(game => game.Date))];
dates.forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    gameDateSelect.appendChild(option);
});

// Populate team logos
teams.forEach(team => {
    const img = document.createElement('img');
    img.src = `assets/images/${team}.png`;
    img.alt = team.replace('_', ' ');
    img.title = team.replace('_', ' '); // Add tooltip
    img.addEventListener('click', () => filterGamesByTeam(team));
    teamLogos.appendChild(img);
});

function filterGamesByTeam(team) {
    const formattedTeam = team.replace('_', ' ');
    const selectedGames = data.filter(game => game['Home Team'] === formattedTeam || game['Visitor Team'] === formattedTeam);

    // Clear previous predictions
    predictionsTable.innerHTML = '';

    // Create table header
    const header = document.createElement('tr');
    header.innerHTML = `
        <th>Home Team</th>
        <th>Home Team Predicted Score</th>
        <th>Away Team</th>
        <th>Away Team Predicted Score</th>
        <th>Total Predicted Score</th>
        <th>Margin</th>
    `;
    predictionsTable.appendChild(header);

    // Create table rows for each game
    selectedGames.forEach(game => {
        const tableRow = createTableRow(game);
        predictionsTable.appendChild(tableRow);
    });

    // Apply fade-in animation to the table
    predictionsTable.classList.remove('fade-in');
    void predictionsTable.offsetWidth; // Trigger reflow
    predictionsTable.classList.add('fade-in');
}

// Function to create a table row for a prediction
function createTableRow(game) {
    const row = document.createElement('tr');
    row.className = 'fade-in'; // Apply fade-in animation
    
    const homeTeamCell = document.createElement('td');
    homeTeamCell.className = 'team-name';
    homeTeamCell.textContent = game['Home Team'];
    
    const homeScoreCell = document.createElement('td');
    homeScoreCell.className = 'score';
    homeScoreCell.textContent = game['Home Team Predicted'];
    
    const awayTeamCell = document.createElement('td');
    awayTeamCell.className = 'team-name';
    awayTeamCell.textContent = game['Visitor Team'];
    
    const awayScoreCell = document.createElement('td');
    awayScoreCell.className = 'score';
    awayScoreCell.textContent = game['Away Team Predicted'];
    
    const totalScoreCell = document.createElement('td');
    totalScoreCell.className = 'score';
    totalScoreCell.textContent = game['PredictedTotalGameScore'];
    
    const marginCell = document.createElement('td');
    marginCell.className = 'score';
    marginCell.textContent = game['Margin'];

    if (game['Winner'] === game['Home Team']) {
        homeTeamCell.classList.add('winner');
        homeTeamCell.innerHTML += '<div class="winner-label">Winner</div>';
    } else {
        awayTeamCell.classList.add('winner');
        awayTeamCell.innerHTML += '<div class="winner-label">Winner</div>';
    }
    
    row.appendChild(homeTeamCell);
    row.appendChild(homeScoreCell);
    row.appendChild(awayTeamCell);
    row.appendChild(awayScoreCell);
    row.appendChild(totalScoreCell);
    row.appendChild(marginCell);
    
    return row;
}

// Update scores based on selected date
gameDateSelect.addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    const selectedGames = data.filter(game => game.Date === selectedDate);

    // Update the displayed date
    selectedDateSpan.textContent = selectedDate;

    // Clear previous predictions
    predictionsTable.innerHTML = '';

    // Create table header
    const header = document.createElement('tr');
    header.innerHTML = `
        <th>Home Team</th>
        <th>Home Team Predicted Score</th>
        <th>Away Team</th>
        <th>Away Team Predicted Score</th>
        <th>Total Predicted Score</th>
        <th>Margin</th>
    `;
    predictionsTable.appendChild(header);

    // Create table rows for each game
    selectedGames.forEach(game => {
        const tableRow = createTableRow(game);
        predictionsTable.appendChild(tableRow);
    });

    // Apply fade-in animation to the table
    predictionsTable.classList.remove('fade-in');
    void predictionsTable.offsetWidth; // Trigger reflow
    predictionsTable.classList.add('fade-in');
});

// Trigger change event to initialize
gameDateSelect.dispatchEvent(new Event('change'));
