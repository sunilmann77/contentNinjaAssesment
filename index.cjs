const express = require('express');
const fetch = require('node-fetch');
const path = require('path'); 
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/checkContact', async (req, res) => {
    const { email, hapikey } = req.body;
    const searchUrl = `https://api.hubapi.com/contacts/v1/search/email?q=${email}&hapikey=${hapikey}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.total > 1) {
            res.json({ error: 'Duplicate contact found' });
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/mergeContact', async (req, res) => {
    const { contactId, hapikey } = req.body;
    const mergeUrl = `https://api.hubapi.com/contacts/v1/contact/merge-vids/${contactId}/?hapikey=${hapikey}`;

    try {
        const response = await fetch(mergeUrl, { method: 'POST' });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/sendEmail', async (req, res) => {
    const { email, hapikey } = req.body;
    const emailUrl = `https://api.hubapi.com/emails/v1/singleEmail/send?hapikey=${hapikey}`;

    const data = {
        "properties": {
            "to": email,
            "subject": "Welcome to our Company!",
            "text": "Here is the invite link to our Slack server: https://welcomeusers.slack.com/archives/C061PSAEHGB",
            "from": {
                "email": "sunilmann29@gmail.com"
            }
        }
    };

    try {
        const response = await fetch(emailUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        res.json(responseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/sendMessage', async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const webhookUrl = 'https://sendmail';

    const message = `Welcome ${firstName} ${lastName}. Email: ${email}`;

    const data = {
        text: message,
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.text();
        res.send(responseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
});
