document.addEventListener('DOMContentLoaded', function() {
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

    const playerGameDateSelect = document.getElementById('player-game-date');
    const playerPredictionsTable = document.getElementById('player-predictions-table');
    const playerSelectedDateSpan = document.getElementById('player-selected-date');

    // Function to populate the table with data
    function populateTable(data) {
        const dates = [...new Set(data.map(game => game["Date"]))];
        dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            gameDateSelect.appendChild(option);
        });

        teams.forEach(team => {
            const img = document.createElement('img');
            img.src = `assets/images/${team}.png`;
            img.alt = team.replace('_', ' ');
            img.title = team.replace('_', ' '); // Add tooltip
            img.addEventListener('click', () => filterGamesByTeam(team, data));
            teamLogos.appendChild(img);
        });

        // Function to filter and display games by team
        function filterGamesByTeam(team, data) {
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
            const selectedGames = data.filter(game => game["Date"] === selectedDate);

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
    }

    function formatDateString(dateString) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }

    function loadPlayerPredictions(date) {
        Papa.parse('assets/data/predictions_playerlevel.csv', {
            download: true,
            header: true,
            complete: function(results) {
                console.log("Parsed player data:", results.data); // Debug log
                const filteredData = results.data.filter(row => {
                    const formattedRowDate = formatDateString(row.Date);
                    console.log("Row Date:", formattedRowDate, " | Selected Date:", date); // Debug log
                    return formattedRowDate === date;
                });
                console.log("Filtered player data for date", date, ":", filteredData); // Debug log
                displayPlayerPredictions(filteredData);
            }
        });
    }

    function displayPlayerPredictions(data) {
        playerPredictionsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Rebounds</th>
                    <th>Assists</th>
                    <th>Points</th>
                    <th>3 Points</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(player => `
                    <tr>
                        <td>
                            ${getPlayerImage(player['Player Name'])}
                            ${player['Player Name']}
                        </td>
                        <td>${player.PredictedRebounds}</td>
                        <td>${player.PredictedAssists}</td>
                        <td>${player.PredictedPoints}</td>
                        <td>${player.Predicted3Points}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }

    function getPlayerImage(playerName) {
        const playerImageName = playerName.split(' ').join('_') + '.png';
        const imagePath = `assets/images/players/${playerImageName}`;
        return `
            <img src="${imagePath}" onerror="this.style.display='none'" alt="${playerName}" class="player-headshot">
        `;
    }

    // Load the CSV file and parse it
    Papa.parse('assets/data/nba_predictions.csv', {
        download: true,
        header: true,
        complete: function(results) {
            populateTable(results.data);
        },
        error: function(error) {
            console.error("Error loading CSV:", error); // Log any errors
        }
    });

    // Initialize with today's date for player predictions
    const today = new Date().toISOString().split('T')[0];
    playerGameDateSelect.value = today;
    playerSelectedDateSpan.textContent = today;
    loadPlayerPredictions(today);

    playerGameDateSelect.addEventListener('change', function() {
        const selectedDate = playerGameDateSelect.value;
        playerSelectedDateSpan.textContent = selectedDate;
        loadPlayerPredictions(selectedDate);
    });
});
