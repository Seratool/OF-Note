class Connector
{
    #sendDelay = 1000;

    #note;

    #icons;

    #editorDoc;

    #timer = null;

    /**
     * initialise connector.
     * @param {HTMLElement} icons
     * @param {HTMLElement} editorDoc
     * @param {Note} note
     */
    constructor(icons, editorDoc, note)
    {
        this.#note = note;
        this.#icons = icons;
        this.#editorDoc = editorDoc;
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
        fetch("{{ $router->getQueryUrl(['event' => 'save']) }}", {
            method: "POST",
            headers: {"X-Requested-With": "XMLHttpRequest"},
            body: this.#getFormData()
        }).then(
            (response) => this.#viewStatus(response.status === 200 ? 'sent' : 'error')
        ).catch(() => this.#viewStatus('error'));
    }

    #getFormData()
    {
        const formData = new FormData();
        formData.append('text', this.#fetchContent());

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
        if (this.#note.isTitleExists(title)) {
            alert(_['Note with title "%s" already exists!'].replace('%s', title));
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
            this.#note.addNote(d.note, title);
            setTimeout(() => window.location.href = d.url, 100);

        }).catch(() => this.#viewStatus('error'));
    }

    /**
     * return filtered content.
     */
    #fetchContent()
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
