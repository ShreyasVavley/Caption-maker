const fs = require('fs');

async function test() {
  const formData = new FormData();
  formData.append('platform', 'Instagram Reels');
  formData.append('tone', 'Witty & Sarcastic');
  formData.append('prompt', 'A video about a cat learning to code in Javascript.');
  formData.append('creativity', '0.7');

  console.log('Sending request to API...');
  
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      console.error('API Error:', await res.text());
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let jsonString = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      process.stdout.write(chunk);
      jsonString += chunk;
    }
    console.log('\n\n--- Stream Completed ---');
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

test();
