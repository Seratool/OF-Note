
class Note
{
    #key = 'note';

    #menuDocs = null;

    #currentNote = '';

    /**
     * initialise.
     * @param {HTMLElement} menuDoc
     * @param {string} currentNote
     */
    constructor(menuDoc, currentNote)
    {
        this.#menuDocs = menuDoc;
        this.#currentNote = currentNote;

        this.addNote(currentNote);
    }

    /**
     * check, is title already exists.
     * @param {string} title
     */
    isTitleExists(title)
    {
        const notes = this.#getStoredNote();

        for (let key in notes) {
            if (notes[key] === title) {
                return true;
            }
        }

        return false;
    }

    /**
     * add note to storage.
     * @param {string} note
     * @param {string} title
     */
    addNote(note, title = '')
    {
        let notes = this.#getStoredNote();

        if (notes.constructor.name === "Array") {
            notes = this.#convertToObject(notes);
        }

        if (notes[note] === undefined) {
            notes[note] = title || note;
        }

        localStorage.setItem(this.#key, JSON.stringify(notes));
    }

    /**
     * remove note from storage.
     * @param {string} key
     */
    removeNotes(key)
    {
        let notes = this.#getStoredNote();

        if (notes[key] !== undefined) {
            delete notes[key];
        }

        localStorage.setItem(this.#key, JSON.stringify(notes));
        this.showNotes();
    }

    /**
     * rename text note.
     * @param {string} key
     * @param {string} title
     */
    renameNotes(key, title)
    {
        let notes = this.#getStoredNote();

        if (notes[key] !== undefined) {
            notes[key] = title;
        }

        localStorage.setItem(this.#key, JSON.stringify(notes));
        this.showNotes();
    }

    /**
     * show notes in doc aside.
     */
    showNotes()
    {
        let notes = this.#getStoredNote();
        this.#menuDocs.innerText = '';

        for (let key in notes) {
            if (notes.hasOwnProperty(key)) {
                let note = notes[key],
                    href = '{{ $router->getBaseUrl() }}?note=' + key,
                    uri = '{{ $router->getRelativeBaseUrl() }}?note=' + key,
                    node = document.createElement('li'),
                    cont = `<a class="link" href="${href}"><div>${note}</div><div><span>${uri}</span></div></a>`,
                    edit = `<button class="btn edit" type="button">
                            <svg class="icon" viewBox="0 0 24 24"><use xlink:href="#ocno-i-pencil"/></svg>
                        </button>`;

                if (this.#currentNote !== key) {
                    edit += `<button class="btn delete" type="button">
                            <svg class="icon" viewBox="0 0 24 24"><use xlink:href="#ocno-i-trash"/></svg>
                        </button>`;
                }

                node.innerHTML = `<div>${cont}</div><div class="control-line">${edit}</div>`;

                if (this.#currentNote === key) {
                    node.classList.add('active');
                } else {
                    JSE.ev('click', () => {
                        if (window.confirm(_dict['Do you want to delete the link to "%s"?'].replace('%s', note))) {
                            this.removeNotes(key);
                        }
                    }, JSE.q('.delete', node));
                }

                JSE.ev('click', () => {
                    let n = document.createElement('span'),
                        title;

                    n.innerHTML = window.prompt(_dict['Give the note "%s" a new name'].replace('%s', note), note);
                    title = n.innerText;

                    if (title.toLowerCase() !== "") {
                        this.renameNotes(key, title);
                    }
                }, JSE.q('.edit', node));

                this.#menuDocs.appendChild(node);
            }
        }
    }

    /**
     * load notes from localstorage.
     * @returns {object|{}}
     */
    #getStoredNote() {
        let storage = localStorage.getItem(this.#key);

        try {
            if (storage !== null) {
                return JSON.parse(storage);
            }
        } catch (ev) {}

        return {};
    }

    /**
     * convert array to object.
     * @param {object} arr
     * @returns {{}}
     */
    #convertToObject(arr)
    {
        let obj = {};

        for (let a in arr) {
            if (arr.hasOwnProperty(a)) {
                obj[arr[a]] = arr[a];
            }
        }

        return obj;
    }
}
