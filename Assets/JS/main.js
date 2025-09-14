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
        note = new Note(nMenuDocs, currentNote),
        connector = new Connector(nStatusIcons, nEditorDoc, note),
        aside = new Aside(connector);

    new Editor(nEditorDoc, connector);
    aside.initialise();

    note.addNote(currentNote);
    note.showNotes();
})
