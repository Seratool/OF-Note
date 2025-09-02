class Connector
{
    #sendDelay = 1000;

    #editorDoc;

    #icons;

    #timer = null;

    /**
     * initialise connector.
     * @param {HTMLElement} icons
     * @param {HTMLElement} editorDoc
     */
    constructor(icons, editorDoc)
    {
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
        fetch("{{ $router->getUrl() }}", {
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
