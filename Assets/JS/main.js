/**
 * start app.
 */
JSE.ready(() => {
    const nBbody = JSE.q('body'),
        nMain = JSE.q('main', nBbody),
        nMenuDocs = JSE.q('.docs-list', nBbody),
        nEditorDoc = JSE.q('.doc', nMain),
        nStatusIcons = JSE.q('.control .sync', nMain),
        currentNote = nMain.getAttribute('data-note'),
        connector = new Connector(nStatusIcons, nEditorDoc),
        note = new Note(nMenuDocs, currentNote),
        editor = new Editor(nEditorDoc, connector),
        aside = new Aside(connector);

    aside.initialise();

    note.addNote(currentNote);
    note.showNotes();
})
