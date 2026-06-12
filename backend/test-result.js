const { streamText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
require('dotenv').config({path: '.env'});

async function run() {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = google("gemini-2.5-flash");

  const result = streamText({
    model,
    messages: [{role: 'user', content: 'hello'}],
  });

  let proto = Object.getPrototypeOf(result);
  console.log(Object.getOwnPropertyNames(proto));
  
  let methods = [];
  for (let prop in result) {
    if (typeof result[prop] === 'function') {
      methods.push(prop);
    }
  }
  console.log('All functions:', methods);
}
run();
