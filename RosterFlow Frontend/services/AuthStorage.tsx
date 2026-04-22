import * as SecureStore from 'expo-secure-store';



async function saveToken(token: unknown) {
    if (typeof token !== 'string') {
        throw new Error('Token must be a string');
    }

    try {
        await SecureStore.setItemAsync('userToken', token);
        console.log('Token saved securely!');
    } catch (error) {
        console.error('Error saving token:', error);
    }
}

async function getToken() {         //Error retrieving token: TypeError: _ExpoSecureStore.default.getValueWithKeyAsync is not a function
    try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        console.log('Retrieved token:', token);
        return token;
    } else {
        console.log('No token found.');
        return null;
    }
    } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
    }
}

async function deleteToken() {
    try {
    await SecureStore.deleteItemAsync('userToken');
    console.log('Token deleted securely!');
    } catch (error) {
    console.error('Error deleting token:', error);
    }
}

export {
    deleteToken, getToken, saveToken
};

