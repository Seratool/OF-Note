/**
 * start app.
 */
JSE.ready(() => {
    const nBbody = JSE.q('body'),
        nMain = JSE.q('main', nBbody),
        dic = new DIC();

    dic.pwa = new Pwa(JSE.q('aside.setting'));
    dic.note = new Note(JSE.q('.docs-list', nBbody), nMain.getAttribute('data-note'));
    dic.aside = new Aside(dic);

    dic.connector = new Connector(JSE.q('.control .sync', nMain), dic);
    dic.editor = new Editor(dic, nMain);

    dic.editor.initialiseContent();
    dic.aside.initialise();
    dic.note.showNotes();
})
