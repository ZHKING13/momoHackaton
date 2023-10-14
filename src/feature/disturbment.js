const { v4: uuidv4 } = require('uuid');
const { MOMO_HOST, DISTURBMENT_KEY, ENVIRONMENT } = process.env;
const createAPiUser = async() => {
    try {
        const referenceId = "3aa2f0e7-9bdb-4a8d-ba14-091eaaf63030"
        const callbackHost = 'https://webhook.site/de55348f-c6e2-4518-bc48-1661f1efeec9';

        const url = 'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', DISTURBMENT_KEY);
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

        const apiUserId = "35e508ef-5847-4962-bdb3-d433ab32ffdb"
        const url = `${MOMO_HOST}/v1_0/apiuser/${apiUserId}/apikey`;

        const headers = new Headers();
        headers.append('Ocp-Apim-Subscription-Key', DISTURBMENT_KEY);

        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions);

        if (response.ok) {
            const result = await response.json();
            console.log(result);
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
        const referenceId = '35e508ef-5847-4962-bdb3-d433ab32ffdb';
        const password = await createApiKey();
        const base64Credentials = await Buffer.from(`${referenceId}:${password}`).toString('base64');
        const url = `${MOMO_HOST}/disbursement/token/`;

        const headers = {
            'X-Reference-Id': referenceId,
            'Ocp-Apim-Subscription-Key': DISTURBMENT_KEY,
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
const depositRequest = async() => {
    try {
        const referenceId = uuidv4();
        console.log(referenceId);
        const bearerToken = await createBearerToken();
        const authorizationToken = `Bearer ${bearerToken}`;

        const url = 'https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', DISTURBMENT_KEY);
        headers.append('X-Target-Environment', ENVIRONMENT);
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', authorizationToken);

        const requestData = {
            amount: "500",
            currency: 'EUR',
            externalId: '0974110jkk65',
            payer: {
                partyIdType: 'MSISDN',
                partyId: '46733123453',
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
const getDepositStatus = async(id) => {
        try {
            const bearerToken = await createBearerToken();
            const authorizationToken = `Bearer ${bearerToken}`;
            const url = `${MOMO_HOST}/collection/v1_0/requesttopay/${id}`;
            const headers = {
                'X-Reference-Id': id,
                'Ocp-Apim-Subscription-Key': DISTURBMENT_KEY,
                'X-Target-Environment': ENVIRONMENT,
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
const transfertAmount = async(amount, payee) => {
    try {
        const bearerToken = await createBearerToken();

        const authorizationToken = `Bearer ${bearerToken}`;
        const referenceId = uuidv4();
        console.log(referenceId);
        const url = 'https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer';

        const headers = new Headers();
        headers.append('X-Reference-Id', referenceId);
        headers.append('Ocp-Apim-Subscription-Key', DISTURBMENT_KEY);
        headers.append('X-Target-Environment', ENVIRONMENT);
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', authorizationToken);
        const requestData = {
            amount: amount,
            currency: 'EUR',
            externalId: '15234353',
            payee: {
                partyIdType: 'MSISDN',
                partyId: '0245565634',
            },
            payerMessage: 'June Salary',
            payeeNote: 'Anything we want to type.',
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
            return {
                success: true,
                referenceId,
            }
        } else {
            console.error(`Erreur lors de la requête : ${response.status} - ${response.statusText}`);
            return {
                success: false,
                error: response.statusText,
            }
        }

    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        return {
            success: false,
            error,
        }

    }
}
const transfertStatus = async(id) => {
    try {
        const bearerToken = await createBearerToken();
        const authorizationToken = `Bearer ${bearerToken}`;
        const url = `${MOMO_HOST}/disbursement/v1_0/transfer/${id}`;
        const headers = {
            'X-Reference-Id': id,
            'Ocp-Apim-Subscription-Key': DISTURBMENT_KEY,
            'X-Target-Environment': ENVIRONMENT,
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
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        throw new Error(error)
    }
}
module.exports = {
    depositRequest,
    getDepositStatus,
    transfertAmount,
    transfertStatus,
}