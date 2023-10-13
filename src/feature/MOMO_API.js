const { v4: uuidv4 } = require('uuid');
const createAPiUser = async() => {
    try {
        const referenceId = "c27f8b6c-40ef-4360-a197-6db963d7f737"
        const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
        const callbackHost = 'https://webhook.site/de55348f-c6e2-4518-bc48-1661f1efeec9';

        const url = 'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);
        headers.append('Content-Type', 'application/json');

        const body = JSON.stringify({ providerCallbackHost: callbackHost });

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);

        if (response.ok) {
            console.log(response.status);
            return {
                success: true,
                referenceId,
            }
        } else {
            console.error(`Erreur lors de la requête : ${response.status} - ${response.statusText}`);
            return {
                success: false,
            }
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        return {
            success: false,
        }
    }
}
const createApiKey = async() => {
    try {
        const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
        const apiUserId = "c27f8b6c-40ef-4360-a197-6db963d7f737"
        const url = `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`;

        const headers = new Headers();
        headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);

        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);

        if (response.ok) {
            const result = await response.json();
            return result.apiKey
        } else {
            console.error(`Erreur lors de la requête : ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}
const createBearerToken = async() => {
    try {
        const referenceId = 'c27f8b6c-40ef-4360-a197-6db963d7f737';
        const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
        const password = await createApiKey();
        const base64Credentials = await Buffer.from(`${referenceId}:${password}`).toString('base64');
        const url = 'https://sandbox.momodeveloper.mtn.com/collection/token/';

        const headers = {
            'X-Reference-Id': referenceId,
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Authorization': `Basic ${base64Credentials}`,
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);

        if (response.ok) {
            const result = await response.json();
            return result.access_token
        } else {
            console.error(`Erreur lors de la requête : ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}
const paymentRequest = async({ montant, description, currency, callbackUrl }) => {
    try {
        const referenceId = uuidv4();
        console.log(referenceId);

        const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
        const targetEnvironment = 'sandbox';
        const bearerToken = await createBearerToken();
        const authorizationToken = `Bearer ${bearerToken}`;

        const url = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);
        headers.append('X-Target-Environment', targetEnvironment);
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', authorizationToken);

        const requestData = {
            amount: montant,
            currency: 'EUR',
            externalId: '097411065',
            payer: {
                partyIdType: 'MSISDN',
                partyId: '46733123451',
            },
            payerMessage: 'Sure thing!',
            payeeNote: 'Payback my money bro!',
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData),
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);
        console.log(response.status);

        if (response.ok) {
            return true
        } else {
            console.error(`Erreur lors de la requête : ${response.status} - ${response.statusText}`);
            return false
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        return false
    }
}
const getPaymentStatus = async(id) => {
        try {
            const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
            const targetEnvironment = 'sandbox';
            const bearerToken = await createBearerToken();
            const authorizationToken = `Bearer ${bearerToken}`;
            const url = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${id}`;
            const headers = {
                'X-Reference-Id': id,
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'X-Target-Environment': targetEnvironment,
                'Authorization': authorizationToken,
            };

            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
            };

            const response = await fetch(url, requestOptions);

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                return result
            } else {
                console.error(`Erreur lors de la requête: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    }
    // getPaymentStatus("ba72c51a-2256-4f77-8005-100a210587fa")
const transfertAmount = async(amount) => {
    try {
        const subscriptionKey = '19cf396a6a424df298b04ccf70c8fbc5';
        const targetEnvironment = 'sandbox';
        const bearerToken = await createBearerToken();
        const authorizationToken = `Bearer ${bearerToken}`;
        const referenceId = uuidv4();
        console.log(referenceId);
        const url = 'https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);
        headers.append('X-Target-Environment', targetEnvironment);
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', authorizationToken);
        const requestData = {
            amount: amount || "500",
            currency: 'EUR',
            externalId: '097411065',
            payer: {
                partyIdType: 'MSISDN',
                partyId: '46733123451',
            },
            payerMessage: 'Sure thing!',
            payeeNote: 'Payback my money bro!',
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData),
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);
        console.log(response.status);
    } catch (error) {

    }
}
module.exports = {
    paymentRequest,
    getPaymentStatus
}