import './index.css';

const showNotification = (message) => {
  const notificationContainer = document.createElement('div');
  notificationContainer.classList.add('notification');
  notificationContainer.textContent = message;

  document.body.appendChild(notificationContainer);

  setTimeout(() => {
    notificationContainer.remove();
  }, 3000);
};

const getScores = async (gameId) => {
  const response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`);
  const data = await response.json();
  return data.result;
};

const saveScore = async (gameId, userName, userScore) => {
  const response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: userName,
      score: userScore,
    }),
  });

  const data = await response.json();
  return data.result;
};

const customGameId = 'GameByLuis';

document.getElementById('refresh-btn').addEventListener('click', async () => {
  const scores = await getScores(customGameId);

  const scoresContainer = document.getElementById('scores');
  scoresContainer.innerHTML = '';

  scores.forEach((score) => {
    const scoreRow = document.createElement('div');
    scoreRow.classList.add('scores-row');
    if (scores.indexOf(score) % 2 === 1) {
      scoreRow.classList.add('odd-row');
    }
    const scoreDescription = document.createElement('p');
    scoreDescription.classList.add('row-description');
    scoreDescription.textContent = `${score.user}: ${score.score}`;
    scoreRow.appendChild(scoreDescription);
    scoresContainer.appendChild(scoreRow);
  });
});

document.getElementById('add-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const scoreInput = document.getElementById('score');

  const userName = nameInput.value;
  const userScore = parseInt(scoreInput.value, 10);

  if (Number.isNaN(userScore) || userScore <= 0) {
    showNotification('Please enter a valid score.');
    return;
  }

  await saveScore(customGameId, userName, userScore);
  nameInput.value = '';
  scoreInput.value = '';
  showNotification('Score submitted successfully!');
});
