class Cryptography
{
    #dic;

    /**
     * init editor.
     * @param {DIC} dic
     */
    constructor(dic) {
        this.#dic = dic;
    }

    /**
     * generate string hash.
     * @returns {string}
     */
    getHash(word)
    {
        let hash = 0;

        if (!word) {
            return '';
        }

        for (const char of word) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }

        return hash + '';
    }






    cipher (text)
    {

        return text;

    }

    decipher (text) {


        return text;

    }







    #arrayBufferToHex(buffer) {
        return [...new Uint8Array(buffer)]
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    #hexToArrayBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }

        return bytes.buffer;
    }


/*
https://dev.to/eddiegulay/secure-text-encryption-and-decryption-with-vanilla-javascript-1c23
https://stackoverflow.com/questions/62102034/javascript-how-to-encrypt-string-with-only-password-in-2020
https://coolaj86.com/articles/webcrypto-encrypt-and-decrypt-with-aes/
 */









    async #getCryptoKey() {
        const password = this.#dic.editor.getPassword(),
            encoder = new TextEncoder(),
            keyMaterial = encoder.encode(password);

        return crypto.subtle.importKey(
            'raw',
            keyMaterial,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
    }

    async #deriveKey(salt) {
        const keyMaterial = await this.#getCryptoKey();

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }



    async encryptText(text) {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.#deriveKey(salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encoder.encode(text)
        );

        return {
            cipherText: this.#arrayBufferToHex(encrypted),
            iv: this.#arrayBufferToHex(iv),
            salt: this.#arrayBufferToHex(salt)
        };
    }





    async decryptText(encryptedData) {
        const { cipherText, iv, salt } = encryptedData;
        const key = await this.#deriveKey(this.#hexToArrayBuffer(salt));

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: this.#hexToArrayBuffer(iv) },
            key,
            this.#hexToArrayBuffer(cipherText)
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }






/*

    async #deriveKey() {
        let password = this.#dic.editor.getPassword();




        const algo = {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt: new TextEncoder().encode('a-unique-salt'),
            iterations: 1000
        };

        return crypto.subtle.deriveKey(
            algo,
            await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(password),
                {
                    name: algo.name
                },
                false,
                ['deriveKey']
            ),
            {
                name: 'AES-GCM',
                length: 256
            },
            false,
            ['encrypt', 'decrypt']
        );
    }

*/













}