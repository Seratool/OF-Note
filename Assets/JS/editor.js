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

        JSE.ev('input', () => this.#connector.send(), this.#editor);

        this.#editor.setAttribute('contenteditable', true);
        this.#editor.focus();
    }

    #onPaste(ev)
    {
        try {
            const selection = document.getSelection();
            let range;

            if (selection.rangeCount) {
                selection.deleteFromDocument();
                range = selection.getRangeAt(0);
                range.collapse(true);

                this.#fromClipboard(ev)
                    .then(text => {
                        let html = document.createElement('span');
                        html.innerHTML = text
                            .replaceAll(/</ig, '&lt;')
                            .replaceAll(/>/ig, '&gt;')
                            .replaceAll(/\t/ig, '    ')
                            .replaceAll(/\\n/ig, '<br>');
                        range.insertNode(html);

                        selection.collapseToEnd();
                        this.#editor.dispatchEvent(new Event("input"));
                    })
                    .catch(() => {
                        document.execCommand('paste', false, null);
                    });
            }
        } catch {
            document.execCommand("paste", false, null);
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
