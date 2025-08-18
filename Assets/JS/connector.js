class Connector
{
    #sendDelay = 1000;

    #editorDoc;

    #icons;

    #timer = null;

    /**
     * initialise connector.
     * @param {Node} icons
     * @param {Node} editorDoc
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

        this.#icon('edit');
        this.#timer = setTimeout(() => this.save(), this.#sendDelay);
    }

    /**
     * send routine.
     */
    save()
    {
        const formData = new FormData(),
            fields = JSE.qs('.setting-block .setting-element');

        formData.append('text', this.#editorDoc.innerText);

        fields.forEach((f) => {
            formData.append(f.name, f.value);
        });

        fetch("{{ $router->getUrl() }}", {
            method: "POST",
            headers: {"X-Requested-With": "XMLHttpRequest"},
            body: formData
        }).then(
            (response) => this.#icon(response.status === 200 ? 'sent' : 'error')
        ).catch(() => this.#icon('error'));
    }

    /**
     * activate icon
     * @param {string} status
     */
    #icon(status)
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
