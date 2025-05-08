require('dotenv').config();
const { createClient } = require('@sanity/client'); 

// Log environment variables to ensure the token is loaded
console.log('SANITY_WRITE_TOKEN:', process.env.SANITY_WRITE_TOKEN ? 'Present' : 'Missing');

const client = createClient({
  projectId: 'b5nbf67p',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

exports.handler = async (event, context) => {
  try {
    // Log the incoming event body
    console.log('Event body:', event.body);

    // Parse the body
    const body = JSON.parse(event.body || '{}');
    const { fname, lname, email, subject, message } = body;

    // Validate required fields
    if (!fname || !lname || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Create document in Sanity
    const result = await client.create({
      _type: 'contact',
      firstName: fname,
      lastName: lname,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully', result }),
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Function error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};