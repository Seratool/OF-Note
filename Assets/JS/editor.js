class Editor {
    #editor;

    #connector;

    /**
     * init editor.
     * @param {HTMLElement} editor
     * @param {Connector} connector
     */
    constructor(editor, connector) {
        this.#editor = editor;
        this.#connector = connector;

        JSE.ev('paste', (ev) => {
            ev.preventDefault();

            this.#onPaste(ev);
        }, this.#editor);

        JSE.ev('keydown', (ev) => {
            if (ev.key.toLowerCase() === 'tab' || ev.ctrlKey === 9) { // Tab
                ev.preventDefault();

                this.#addTextToEditor('    ');
            }
        }, this.#editor);

        JSE.ev('input', () => this.#connector.send(), this.#editor);

        this.#editor.setAttribute('contenteditable', true);
        this.#editor.focus();
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
                this.#editor.dispatchEvent(new Event("input"));
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
}
