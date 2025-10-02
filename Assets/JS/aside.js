/**
 * aside (doc-chooser and menu panel) manager
 */

class Aside
{
    #connector;
    #body = JSE.q('body');
    #btnAsideDoc = JSE.q('button.aside-menu');
    #btnAsideSetting = JSE.q('button.burger-menu');
    #asideMenu = JSE.q('aside.setting');
    #btnAdd = JSE.q('button.add-btn', this.#asideMenu);
    #btnPrint = JSE.q('button.print-btn', this.#asideMenu);
    #btnShare = JSE.q('button.share-btn', this.#asideMenu);
    #btnTheme = JSE.q('button.theme-btn', this.#asideMenu);
    #btnLang = JSE.q('button.lang-btn', this.#asideMenu);
    #cookies = new cookies();

    /**
     * initialise.
     * @param {Connector} connector
     */
    constructor(connector)
    {
        this.#connector = connector;
    }

    initialise()
    {
        JSE.ev('click', () => this.#addPage(), this.#btnAdd);

        JSE.ev('click', () => {
            if (this.#body.offsetWidth < 800 && this.#body.classList.contains('aside-setting-open')) {
                this.#togglePanel('aside-setting-open','aside-setting-close');
            }

            this.#togglePanel('aside-doc-open','aside-doc-close');
        }, this.#btnAsideDoc);
        JSE.ev('click', () => {
            if (this.#body.offsetWidth < 800 && this.#body.classList.contains('aside-doc-open')) {
                this.#togglePanel('aside-doc-open','aside-doc-close');
            }

            this.#togglePanel('aside-setting-open','aside-setting-close');
        }, this.#btnAsideSetting);
        JSE.ev('click', () => print(), this.#btnPrint);

        if (navigator.canShare) {
            this.#btnShare.classList.remove('hidden');
            JSE.ev('click', () => this.#pageShare(), this.#btnShare);
        }

        this.#initLangChooser();
        this.#initThemeChooser();
        this.#initSetting();
    }

    /**
     * opening/closing of aside panel.
     * @param {string} openClass
     * @param {string} closeClass
     */
    #togglePanel(openClass, closeClass)
    {
        if (this.#body.classList.contains(openClass)) {
            this.#body.classList.add(closeClass);
            this.#body.classList.remove(openClass);
            setTimeout(() => {
                this.#body.classList.remove(closeClass);
            },300);
        } else {
            this.#body.classList.add(openClass);
        }
    }

    #pageShare()
    {
        if (navigator.canShare) {
            navigator
                .share({title:document.title,url:window.location.href})
                .then(() => {} /* console.log('Share was successful.') */ )
                .catch(() => {} /* (er) => console.log('Sharing failed', er) */ );
        }
    }

    #initLangChooser()
    {
        const langChooser = JSE.q('.lang-chooser ul', this.#asideMenu),
            choosers = JSE.qs('button', langChooser);

        JSE.ev('click', () => langChooser.classList.toggle('hidden'), this.#btnLang);

        choosers.forEach((o) => {
            JSE.ev('click', () => {
                this.#saveSettingToCookies('l', o.getAttribute('data-lang'));

                langChooser.classList.add('hidden');
                setTimeout(() => location.reload(), 300);
            }, o);
        });
    }

    #initThemeChooser()
    {
        const body = JSE.q('body');

        JSE.ev('click', () => {
            body.classList.toggle('dark');

            this.#saveSettingToCookies('t', body.classList.contains('dark') ? 'd' : 'l');
        }, this.#btnTheme);
    }

    #initSetting()
    {
        const fields = JSE.qs('.setting-block .setting-element'),
            doc = JSE.q('main div.doc');

        fields.forEach((f) => {
            JSE.ev('change', () => {
                let cl = doc.classList,
                    opt = f.options;

                for (let i = 0, c = opt.length; i < c; i++) {
                    cl.remove(opt[i].value);
                }

                cl.add(f.value);

                // save doc with setting
                this.#connector.save();
            }, f);
        });
    }

    #saveSettingToCookies(key, value)
    {
        let v = {};

        try {
            v = JSON.parse(this.#cookies.get('setting') || '{}');
        } catch(e) {}

        v[key] = value;
        this.#cookies.set('setting', JSON.stringify(v));
    }

    #addPage()
    {
        let title = window.prompt(_dict['Give the note name']);

        if (title) {
            this.#connector.addNote(title);
        }
    }
}
