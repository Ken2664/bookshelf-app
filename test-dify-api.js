const axios = require('axios');
require('dotenv').config(); // .envファイルから環境変数を読み込む


async function testDifyAPI() {
    const url = 'https://api.dify.ai/v1/workflows/run';
    const headers = {
        'Authorization': `Bearer app-xQ6vpxUTX4R63PMBLcaGjIZO`,
        'Content-Type': 'application/json'
    };

    const payload = {
        inputs: {},
        response_mode: 'blocking',
        user: "user-1234567890",
        files: [{
            type: "image",
            transfer_method: "base64",
            url: "https://m.media-amazon.com/images/I/91QkTL0yQAL._SY522_.jpg"
        }]
    };

    try {
        console.log('Sending request to Dify API...');
        const response = await axios.post(url, payload, { headers });
        console.log('Dify API Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error calling Dify API:', error.response ? error.response.data : error.message);
    }
}

testDifyAPI();