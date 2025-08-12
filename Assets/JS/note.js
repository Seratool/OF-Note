
class Note
{
    #key = 'note';

    #menuDocs = null;

    #currentNote = '';

    /**
     * initialise.
     * @param {Node} menuDoc
     * @param {string} currentNote
     */
    constructor(menuDoc, currentNote)
    {
        this.#menuDocs = menuDoc;
        this.#currentNote = currentNote;
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
    #renameNotes(key, title)
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

        for (let k in notes) {
            if (notes.hasOwnProperty(k)) {
                let note = notes[k],
                    href = '{{ $router->getBaseUrl() }}?note=' + k,
                    node = document.createElement("li"),
                    cont = `<div><a class="link" href="${href}">${note}</a></div><div><span>${k}</span></div>`,
                    edit = `<button class="btn edit" type="button">
                            <svg class="icon" viewBox="0 0 24 24"><use xlink:href="#ocno-i-pencil"/></svg>
                        </button>`;

                if (this.#currentNote !== note) {
                    edit += `<button class="btn delete" type="button">
                            <svg class="icon" viewBox="0 0 24 24"><use xlink:href="#ocno-i-trash"/></svg>
                        </button>`;
                }

                node.innerHTML = `<div>${cont}</div><div class="control-line">${edit}</div>`;

                if (this.#currentNote === note) {
                    JSE.q('.link', node).classList.add('active');

                } else {
                    JSE.ev('click', () => {
                        if (window.confirm(_['Do you want to delete the link to "%s"?'].replace('%s', note))) {
                            this.removeNotes(k);
                        }
                    }, JSE.q('.delete', node));
                }

                JSE.ev('click', () => {
                    let n = document.createElement('span'),
                        title;

                    n.innerHTML = window.prompt(_['Give the note "%s" a new name'].replace('%s', note), note);
                    title = n.innerText;

                    if (title.toLowerCase() !== "") {
                        this.#renameNotes(k, title);
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
