class Connector
{
    #sendDelay = 1000;

    #icons = null;

    #timer = null;

    /**
     * initialise connector.
     * @param {Node} icons
     */
    constructor(icons)
    {
        this.#icons = icons;
    }

    /**
     * show connection status.
     * @param content
     */
    send(content) {
        clearTimeout(this.#timer);

        this.#icon('edit');
        this.#timer = setTimeout(() => this.#send(content), this.#sendDelay);
    }

    /**
     * send routine.
     * @param {string} content
     */
    #send(content)
    {
        const formData = new FormData();
        formData.append('text', content);

        fetch("{{ url }}", {
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
