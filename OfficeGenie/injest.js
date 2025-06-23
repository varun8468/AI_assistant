import axios from 'axios';

const prompt = 'what is duration for notice period?';

async function askMistral(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', response.data.response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

askMistral(prompt);
