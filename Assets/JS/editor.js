class Editor {
    #dic;

    #editorDoc;

    #shadowDoc;

    #iptLock;

    #iptPasshash;

    #password = '';

    #passHash = '';

    /**
     * init editor.
     * @param {DIC} dic
     * @param {HTMLElement} nMain
     */
    constructor(dic, nMain)
    {
        this.#dic = dic;

        this.#editorDoc = JSE.q('.doc', nMain);
        this.#shadowDoc = JSE.q('.shadow-doc', nMain);
        this.#iptLock = JSE.q('aside.setting input[name="lock"]', nMain);
        this.#iptPasshash = JSE.q('aside.setting input[name="proof"]', nMain);
        this.#passHash = this.#iptPasshash.value;

        JSE.ev('paste', (ev) => {
            ev.preventDefault();

            this.#onPaste(ev);
        }, this.#editorDoc);

        JSE.ev('keydown', (ev) => {
            if (ev.key.toLowerCase() === 'tab' || ev.ctrlKey === 9) { // Tab
                ev.preventDefault();

                this.#addTextToEditor('    ');
                this.#editorDoc.dispatchEvent(new Event("input"));
            }
        }, this.#editorDoc);

        JSE.ev('input', () => this.#dic.connector.send(), this.#editorDoc);

        this.#editorDoc.setAttribute('contenteditable', true);
        this.#editorDoc.focus();
    }

    /**
     * set password for note.
     * @param {string} password
     */
    setPassword(password)
    {
        this.#password = password;
        this.#passHash = password === '' ? '' : this.#dic.cryptography.getHash(this.#password);

        this.#iptLock.value = password === '' ? 'false' : 'true';
        this.#iptPasshash.value = this.#passHash;

        this.#iptLock.dispatchEvent(new Event("change"));
    }

    /**
     * get password.
     * @returns {string} password
     */
    getPassword()
    {
        return this.#password;
    }

    /**
     * return true if password not set or given password is correct.
     * @returns {boolean}
     */
    isPassCorrect(pass = null)
    {
        pass = pass === null ? this.#password : pass;

        return pass === '' || this.#dic.cryptography.getHash(pass) === this.#passHash;
    }

    /**
     * return filtered content.
     * @returns {Promise<unknown>|string}
     */
    fetchContent()
    {
        let c = this.#getContent();

        if (this.#iptLock.value === 'true') {
            return this.#dic.cryptography.encrypt(c, this.#password);
        } else {
            return c;
        }
    }

    initialiseContent()
    {
        let c = this.#shadowDoc.innerHTML;
        this.#shadowDoc.innerHTML = '';

        if (this.#iptLock.value === 'true') {
            let pass = window.prompt(__('Give the password'));

            if (this.#dic.editor.isPassCorrect(pass)) {
                this.#password = pass;

                this.#dic.cryptography.decrypt(c, this.#password)
                    .then(c => {
                        this.#setContent(c);
                    });
            } else {
                window.confirm(__('The given password seems to be incorrect!'));
                this.#setContent('');
            }
        } else {
            this.#setContent(c);
        }
    }

    #setContent(content)
    {
        content = (content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

        this.#editorDoc.innerHTML = content;
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
