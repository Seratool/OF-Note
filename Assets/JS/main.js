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

    aside.initialise();

    editor.onChange((content) => connection.send(content));

    note.addNote(currentNote);
    note.showNotes();
})
