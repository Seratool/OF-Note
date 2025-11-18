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
    save()
    {
        if (this.#dic.editor.isPassCorrect()) {
            fetch("{{ $router->getQueryUrl(['event' => 'save']) }}", {
                method: "POST",
                headers: {"X-Requested-With": "XMLHttpRequest"},
                body: this.#getFormData()
            }).then(
                (response) => this.#viewStatus(response.status === 200 ? 'sent' : 'error')
            ).catch(() => this.#viewStatus('error'));
        } else {
            this.#viewStatus('error');
            window.alert(__('It is not possible to save, a false password has been entered!'));
        }
    }

    #getFormData()
    {
        const formData = new FormData();
        formData.append('text', this.#dic.editor.fetchContent());

        JSE.qs('.setting-block .setting-element').forEach((f) => {
            formData.append(f.name, f.value);
        });

        return formData;
    }

    /**
     * create and rewrite to new note
     * @param {string} title
     */
    addNote(title)
    {
        if (this.#dic.note.isTitleExists(title)) {
            window.alert(__('Note with title "%s" already exists!').replace('%s', title));
            return;
        }

        fetch("{{ $router->getQueryUrl(['event' => 'add']) }}", {
            method: "POST",
            headers: {"X-Requested-With": "XMLHttpRequest"},
            body: this.#getFormData()
        }).then((r) => {
            if (!r.ok) {
                throw new Error(`Response status: ${r.status}`);
            }
            return r.json();
        }).then(d => {
            this.#dic.note.addNote(d.note, title);
            setTimeout(() => window.location.href = d.url, 100);

        }).catch(() => this.#viewStatus('error'));
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
