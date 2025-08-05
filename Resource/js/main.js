/**
 * start app.
 */
JSE.ready(() => {
    const nBbody = JSE.q('body'),
        nMain = JSE.q('main', nBbody),
        nMenuDocs = JSE.q('.docs-list', nBbody),
        nEditorDoc = JSE.q('.doc', nMain),
        nStatusIcons = JSE.q('.control .sync', nMain),
        currentNote = nMain.getAttribute('data-note');

    const connection = new Connector(nStatusIcons);
    const note = new Note(nMenuDocs, currentNote);
    const aside = new Aside();
    const editor = new Editor(nEditorDoc);

    editor.onChange((content) => connection.send(content));

    note.addNote(currentNote);
    note.showNotes();
})







/******************* OLD CODE ************************ /

(function(global) {
                        "use strict";

                        const tabs = function() {
                            this._tab = document.querySelector('.tab');
                            this._links = this._tab.querySelectorAll('.tab-links a.tab-link');
                            this._contents = this._tab.querySelectorAll('.tab-content');

                            this._activate = function(index) {
                                this._links.forEach((link) => {
                                    link.classList.remove('active');
                                });
                                this._links[index].classList.add('active');

                                this._contents.forEach((content) => {
                                    content.classList.remove('active');
                                });
                                this._contents[index].classList.add('active');
                            };

                            this.init = function() {
                                this._links.forEach((link, k) => {
                                    link.addEventListener('click', () => {
                                        this._activate(k);
                                    });
                                });

                                this._activate(0);
                            };
                        };

                         const editor = function(editor) {
                             this._editor = editor;
                             this._callback = () => {};

                             this.onChange = function(callback) {
                             this._callback = callback;
                             };

                             this.getContent = function() {
                             return this._editor.innerText;
                             };

                             this._fromClipboard = function(ev) {
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
                             };

                             this.init = function() {
                             this._editor.addEventListener('paste', (ev) => {
                             ev.preventDefault();

                             try {
                             const selection = document.getSelection();
                             let range;

                             if (selection.rangeCount) {
                             selection.deleteFromDocument();
                             range = selection.getRangeAt(0);
                             range.collapse(true);

                             this._fromClipboard(ev)
                             .then(text => {
                             let html = document.createElement('span');
                             html.innerHTML = text
                             .replaceAll(/</ig, '&lt;')
                             .replaceAll(/>/ig, '&gt;')
                             .replaceAll(/\t/ig, '    ')
                             .replaceAll(/\\n/ig, '<br>');
                             range.insertNode(html);

                             selection.collapseToEnd();
                             this._editor.dispatchEvent(new Event("input"));
                             })
                             .catch(() => {
                             document.execCommand('paste', false, null);
                             });
                             }
                             } catch {
                             document.execCommand('paste', false, null);
                             }
                             });

                             this._editor.addEventListener("input", () => {
                             this._callback(this.getContent());
                             }, false);

                             this._editor.setAttribute('contenteditable', true);
                             this._editor.focus();
                             };
                         };

                        const connector = function() {
                            this._timer = null;

                            this._connectionIcon = document.querySelector('.control .sync');

                            this._send = function(content) {
                                const formData = new FormData();
                                formData.append('text', content);

                                fetch("{{ url }}", {method: "POST", headers: {"X-Requested-With": "XMLHttpRequest"}, body: formData})
                                    .then((response) => {this._icon(response.status === 200 ? 'sent' : 'error');})
                                    .catch((error) => {this._icon('error');});
                            };

                            this._icon = function(mode) {
                                let cl = this._connectionIcon.classList;
                                cl.remove("edit");
                                cl.remove("error");
                                cl.remove("sent");

                                switch (mode) {
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
                            };

                            this.send = function(content) {
                                clearTimeout(this._timer);

                                this._icon('edit');
                                this._timer = setTimeout(() => {
                                    this._send(content);
                                }, 1000);
                            };
                        };






    const APP = function() {
        this._body = document.querySelector('body');
        this._editor = new editor(document.querySelector('div.doc'));
        this._menuBtn = document.querySelectorAll('button.menu-point');
        this._currentNote = document.querySelector('main').getAttribute('data-note');





        this._connection = new connector();

        this._menu = document.querySelector('aside.slide-in');
        this._menuDocs = this._menu.querySelector('.docs-list');
        this._btnPrint = this._menu.querySelector('button.print-btn');
        this._btnShare = this._menu.querySelector('button.share-btn');

                                    this._getStoredNote = function() {
                                        let storage = localStorage.getItem("note"),
                                            notes = [];

                                        try {
                                            if (storage !== null) {
                                                notes = JSON.parse(storage);
                                            }
                                        } catch (ev) {}

                                        return notes;
                                    };

                                    this._addNote = function(note) {
                                        let notes = this._getStoredNote();

                                        if (notes.indexOf(note) === -1) {
                                            notes.push(note);
                                        }

                                        localStorage.setItem("note", JSON.stringify(notes));
                                    };

                                    this._removeNotes = function(note) {
                                        let notes = this._getStoredNote(),
                                            index;

                                        if ((index = notes.indexOf(note)) !== -1) {
                                            notes.splice(index, 1);
                                        }

                                        localStorage.setItem("note", JSON.stringify(notes));
                                        this._showNotes();
                                    };

                                    this._showNotes = function() {
                                        let notes = this._getStoredNote(),
                                            node, link, remove;

                                        this._menuDocs.innerText = '';
                                        for (let n in notes) {
                                            if (notes.hasOwnProperty(n)) {
                                                let t = notes[n];
                                                node = document.createElement("div");

                                                link = document.createElement("a");
                                                link.setAttribute('href', '{{ baseUrl }}?note='+ t);
                                                link.classList.add('link');
                                                link.innerText = t;

                                                node.appendChild(link);

                                                if (this._currentNote === t) {
                                                    link.classList.add('active');
                                                } else {
                                                    remove = document.createElement("a");
                                                    remove.classList.add('delete');
                                                    remove.innerHTML = '&times;';
                                                    node.appendChild(remove);
                                                    remove.addEventListener('click', () => {
                                                        if (window.confirm(dict['Do you want to delete the link to "%s"?'].replace('%s', t))) {
                                                            this._removeNotes(t);
                                                        }
                                                    });
                                                }

                                                this._menuDocs.appendChild(node);
                                            }
                                        }
                                    };

        this._pageShare = function() {
            if (navigator.canShare) {
                navigator
                    .share({title:document.title,url:window.location.href})
                    .then(()=>console.log('Share was successful.'))
                    .catch((error)=>console.log('Sharing failed',error));
            }
        };

        this.init = function () {
            const _tab = new tabs();
            _tab.init();

            this._editor.init();

            this._editor.onChange((content) => {
                this._connection.send(content)
            });

            this._menuBtn[0].addEventListener("click", () => {
                this._body.classList.contains("open-menu")
                    ? this._body.classList.remove('open-menu')
                    : this._body.classList.add('open-menu');
            }, false);

            this._menuBtn[1].addEventListener("click", () => {
                this._body.classList.contains("open-menu")
                    ? this._body.classList.remove('open-menu')
                    : this._body.classList.add('open-menu');
            }, false);

            if (navigator.canShare) {
                this._btnShare.classList.remove('hidden');
                this._btnShare.addEventListener("click", () => {
                    this._pageShare();
                }, false);
            }

            this._btnPrint.addEventListener("click", () => {
                print();
            }, false);

            this._addNote(this._currentNote);
            this._showNotes();
        };
    };






    const app = new APP();
    app.init();
})(window || {});

 /**/
