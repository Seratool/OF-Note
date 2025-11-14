class Editor {
    #editorDoc;

    #shadowDoc;

    #iptLock;

    #dic;

    #password = 'salt';

    /**
     * init editor.
     * @param {DIC} dic
     * @param {HTMLElement} nMain
     */
    constructor(dic, nMain) {
        this.#editorDoc = JSE.q('.doc', nMain);

        this.#shadowDoc = JSE.q('.shadow-doc', nMain);

        this.#iptLock = JSE.q('aside.setting input[name="lock"]', nMain);

        this.#dic = dic;

        JSE.ev('paste', (ev) => {
            ev.preventDefault();

            this.#onPaste(ev);
        }, this.#editorDoc);

        JSE.ev('keydown', (ev) => {
            if (ev.key.toLowerCase() === 'tab' || ev.ctrlKey === 9) { // Tab
                ev.preventDefault();

                this.#addTextToEditor('    ');
            }
        }, this.#editorDoc);

        JSE.ev('input', () => this.#dic.connector.send(), this.#editorDoc);

        this.#editorDoc.setAttribute('contenteditable', true);
        this.#editorDoc.focus();
    }

    /**
     * return filtered content.
     */
    fetchContent()
    {
        let c = this.#getContent();


        // wenn locked, and no password, so connector save inactive!!!



        // encode, if needed

        c = this.#cipher(c);




        return c;
    }

    initialiseContent()
    {
        let text = this.#shadowDoc.innerHTML;


        // nach pass fragen



        // decode, if needed


        text = this.#decipher(text);



        this.#shadowDoc.innerHTML = '';
        this.#editorDoc.innerHTML = text;
    }













    async #cipher (text)
    {

        return text;



        const algo = {
            name: 'AES-GCM',
            length: 256,
            iv: crypto.getRandomValues(new Uint8Array(12))
        };

        return {
            cipherText: await crypto.subtle.encrypt(
                algo,
                await this.#deriveKey(this.#password),
                text /*  new TextEncoder().encode(text)  */
            ),
            iv: algo.iv
        };
    }

    async #decipher (text) {


        return text;



        if (text === '') {
            return '';
        }

        const algo = {
            name: 'AES-GCM',
            length: 256,
            iv: text.iv
        };

        return new TextDecoder().decode(
            await crypto.subtle.decrypt(
                algo,
                await this.#deriveKey(this.#password),
                text  /* . cipherText */
            )
        );
    }












    async #deriveKey(password) {
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







    #onPaste(ev)
    {
        this.#fromClipboard(ev)
            .then(text => {
                text = text
                    .replaceAll(/</ig, '&lt;')
                    .replaceAll(/>/ig, '&gt;')
                    .replaceAll(/\t/ig, '    ')
                    .replaceAll(/\\n/ig, '<br>');

                this.#addTextToEditor(text);
                this.#editorDoc.dispatchEvent(new Event("input"));
            })
            .catch(() => {
                document.execCommand('paste', false, null);
            });
    }

    #addTextToEditor(text)
    {
        const selection = document.getSelection();

        if (selection.rangeCount) {
            let range= selection.getRangeAt(0),
                html = document.createElement('span');

            html.innerHTML = text;
            range.collapse(true);
            range.insertNode(html);

            selection.collapseToEnd();
        }
    }

    #fromClipboard(ev)
    {
        return new Promise (function(resolve, reject) {
            let obj;

            if ((obj = (ev.clipboardData || window.clipboardData)) !== undefined) {
                resolve (obj.getData('text/plain'));

            } else if (navigator.clipboard !== undefined && navigator.clipboard.readText !== undefined) {
                navigator.clipboard.readText()
                    .then(text => {
                        resolve (text);
                    })
                    .catch(() => {
                        reject('Failed to read from clipboard.');
                    });

            } else {
                reject('Failed to read from clipboard.');
            }
        });
    }

    /**
     * fix editor content.
     * @returns {string}
     */
    #getContent()
    {
        let p = document.createElement('p'),
            text;

        p.innerHTML = this.#editorDoc.innerHTML
            .replace(/\n/ig, '')
            .replace(/<div><br><\/div>/ig, '<br>')
            .replace(/<div[^>]+><br><\/div>/ig, '<br>')
            .replace(/<div>/ig, '<br>')
            .replace(/<div[^>]+>/ig, '<br>')
            .replace(/<\/div>/ig, '')

            .replace(/<p><br><\/p>/ig, '<br>')
            .replace(/<p[^>]+><br><\/p>/ig, '<br>')
            .replace(/<p>/ig, '<br>')
            .replace(/<p[^>]+>/ig, '<br>')
            .replace(/<\/p>/ig, '')

            .replace(/<br>/ig, "<br>\n");

        text = p.innerText;

        return text === '\n' ? '' : text;
    }
}
