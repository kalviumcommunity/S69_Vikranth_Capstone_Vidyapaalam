const admin = require('firebase-admin'); 
require('dotenv').config(); 


const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPtmOT6r9XN2I/\nT7bYrDD9otevabkj+Lb0Gx8fKwAM7YTiE4xygeKHu+jq7bPRYslV7Ui7Suyo0Gwj\n8MBYo+dscIHfwpy+pYpjh5gvjZ3EODWue1+m368E5iNaXfSliMF46pEcPA0Upx+K\nvQDQnWTY3nh0E9tjMizzR2ulqxL5wPO7M/FvHZMKZHX5xLmdm9/GC93lmYpCKYVQ\nV2//bLFNlgxO8W6mecIGtL5f7n/HfGsninZTN46okZwZY66RIs0eVYGUPSEvP+Ke\nsj4br4IywuzONkkNRoS/o84d33VSa0j8YAwWwTuODrQ0aieEUfbdkW+YPIvYs5+g\nIA+JuRK7AgMBAAECggEADovt/RKdjDd37g6kjxQG4CAz6CExyKQBPijh9+auBPZP\nJWRzKpgJFPzT8Qu0et+en4r6z10geAn4wuk4nwBK3t1t1/dmpEmJ/inDIXUai2UL\n0f3SSx2IerIiJqCCBfYXbKTZoVusEJ4bVuYWB10XJc3cWsDedmZQHyPoj9wGz1mD\nYuMblgRvCJJBvnP1DdMsrpaKWmK5QaAd9zU1a68f1eofH/AumU02uUouOvt8LEEn\n2BV8OATDB4Q0+zSQUh5vb5lnv7GIJKxko+Ah+deTBSlOvR0xL95dQM5nFe3Chp6Y\n0Qwn6tejQAZMKR5RVxbvB72QyiY2fsd0isarE/Qf0QKBgQDGROl4hvSddjJJnW2m\nS4q4RHcGkvv5Rz9S7lVc5A5JjNr/hJ7EmaL+zHAWiw1p5rQRCtiVYUXlzShOKitC\nZ6d7g1+Pz7jGevqtaPkc7Q/bqJf/ZcW0JpGr3op2AJAMuEkM243p0l2JT5gCpPnU\nUW3lq9Fc/rxb4OFX46iK8yAiswKBgQC5jso95XiBnNeP787XqtFK1sgkymYp1q0i\nx49iMmmNB8Cux8BObePETTULdFXhsz7SmM3BZZOIw6sy3cGX4pLdFbZIEPR6++0R\nFAq+FNLXJh0+iSeewJ8doQnPHc4SkWuXqr8IXBn73OxJQik8SSW3/1CGLYkqxXzd\nqpC8giYz2QKBgQC/inmGr9IHgNVqGsWAXwBfrfzTBBKbKwJ5Cri66bMHySUUrrl3\nMvmtcDFlBebqhS82O6UrAvM043LpuIFcQKkjgLJES6e1T7924a+wCzFDwuc8m8RY\nmt4mDPL0tuxy7WHdIwpBdrJYYeV3wIt+W0BxHgE/9vRfSqxIbS45NlG4UwKBgGEZ\nHS9igrqgThSd0kj8s+RLnBPUbb16/sJyVs91vdH0upk7IaBo1IUGObmyuLYQS9F7\n8D9BXgB1E4Lck89c2qkiEW6IoMYySg1jxXNOBj5bTXZJ4xepiBnDCRT+bbU9r2WA\nDdLcDyTCqEp1eop3ZGtyCLsN3PcqvHpqJK7gFAmRAoGAHZUuNh6H3PmzxizfQf3x\ntKxehZflYjMYo3zgqwq7XwuDu/QkCUfOFqh9rYMBgvX44ApI9+LpQkbvX+QfrAti\npgEJIeY06SrTvpjtqpvMf9un7hcNTTEU+xLQwZcnGsD7RI94P8YYaXqvDfz73l4Z\nXQUyD/j6DN82QMXo8/CXIUs=\n-----END PRIVATE KEY-----\n" ,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
};

if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    console.error('⚠️ Missing Firebase service account credentials in environment variables.');
    console.error('Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set correctly.');
    process.exit(1); 
} else {

    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin SDK initialized successfully.');
        } catch (error) {
            console.error('❌ Error initializing Firebase Admin SDK:', error);
            process.exit(1);
        }
    } else {
        console.log('✅ Firebase Admin SDK already initialized.');
    }
}
