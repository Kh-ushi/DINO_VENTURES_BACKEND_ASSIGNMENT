import axios from "axios";

const walletId = "36a10193-ad2b-4288-884a-9617cdbf9a57";
const URL = `http://localhost:3000/wallets/${walletId}/spend`;

async function runTest() {
    const requests = [];

    for (let i = 0; i < 5; i++) {
        requests.push(
            axios.post(URL, { amount: 30 }).catch((err) => err.response?.data)
        );
    }

    const results = await Promise.all(requests);

}

runTest();