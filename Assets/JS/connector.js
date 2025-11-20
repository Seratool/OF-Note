class Connector
{
    #sendDelay = 1000;

    #dic;

    #icons;

    #timer = null;

    /**
     * initialise connector.
     * @param {HTMLElement} icons
     * @param {DIC} dic
     */
    constructor(dic, icons)
    {
        this.#dic = dic;
        this.#icons = icons;
    }

    /**
     * show connection status.
     */
    send() {
        clearTimeout(this.#timer);

        this.#viewStatus('edit');
        this.#timer = setTimeout(() => this.save(), this.#sendDelay);
    }

    /**
     * send routine.
     */
    save ()
    {
        if (!this.#dic.editor.isPassCorrect()) {
            this.#viewStatus('error');
            window.alert(__('It is not possible to save, a false password has been entered!'));
            return;
        }

        this.#getFormData().then((formData) => {
            fetch("{{ $router->getQueryUrl(['event' => 'save']) }}", {
                method: "POST",
                headers: {"X-Requested-With": "XMLHttpRequest"},
                body: formData
            }).then(
                (response) => this.#viewStatus(response.status === 200 ? 'sent' : 'error')
            ).catch(() => this.#viewStatus('error'));
        });
    }

    /**
     * create and rewrite to new note
     * @param {string} title
     */
    addNote(title)
    {
        if (!this.#dic.editor.isPassCorrect()) {
            this.#viewStatus('error');
            window.alert(__('It is not possible to save, a false password has been entered!'));
            return;
        }

        if (this.#dic.note.isTitleExists(title)) {
            window.alert(__('Note with title "%s" already exists!').replace('%s', title));
            return;
        }

        this.#getFormData().then((formData) => {
            fetch("{{ $router->getQueryUrl(['event' => 'add']) }}", {
                method: "POST",
                headers: {"X-Requested-With": "XMLHttpRequest"},
                body: formData
            }).then((r) => {
                if (!r.ok) {
                    throw new Error(`Response status: ${r.status}`);
                }
                return r.json();
            }).then(d => {
                this.#dic.note.addNote(d.note, title);
                setTimeout(() => window.location.href = d.url, 100);
            }).catch(() => this.#viewStatus('error'));
        });
    }

    #getFormData()
    {
        return (async () => {
            const formData = new FormData();

            formData.append('text', await this.#dic.editor.fetchContent());
            JSE.qs('.setting-block .setting-element').forEach((f) => {
                formData.append(f.name, f.value);
            });

            return formData;
        })();
    }

    /**
     * view transfer status.
     * @param {string} status
     */
    #viewStatus(status)
    {
        let cl = this.#icons.classList;
        cl.remove("edit");
        cl.remove("error");
        cl.remove("sent");

        switch (status) {
            case "error":
                cl.add("error");
                break;

            case "edit":
                cl.add("edit");
                break;

            case "sent":
                cl.add("sent");
                setTimeout(() => {
                    cl.remove("sent");
                }, 2000);
                break;
        }
    }
}
