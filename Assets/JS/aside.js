/**
 * aside (doc-chooser and menu panel) manager
 */

class Aside
{
    #connector;
    #btnAside = JSE.q('button.aside-menu');
    #btnMenu = JSE.q('button.burger-menu');
    #asideNav = JSE.q('nav.docs-navigation');
    #asideMenu = JSE.q('aside.setting');
    #btnLang = JSE.q('button.lang-btn', this.#asideMenu);
    #btnPrint = JSE.q('button.print-btn', this.#asideMenu);
    #btnShare = JSE.q('button.share-btn', this.#asideMenu);
    #btnTheme = JSE.q('button.theme-btn', this.#asideMenu);
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
        JSE.ev('click', () => this.#togglePanel(this.#btnAside, this.#asideNav), this.#btnAside);
        JSE.ev('click', () => this.#togglePanel(this.#btnMenu, this.#asideMenu), this.#btnMenu);
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
     * @param {HTMLElement} btn
     * @param {HTMLElement} panel
     */
    #togglePanel(btn, panel)
    {
        if (btn.classList.contains('open')) {
            panel.classList.add('close');
            panel.classList.remove('open');
            setTimeout(() => {
                btn.classList.remove('open');
                panel.classList.remove('close');
            },300);
        } else {
            btn.classList.add('open');
            panel.classList.add('open');
        }
    }

    #pageShare()
    {
        if (navigator.canShare) {
            navigator
                .share({title:document.title,url:window.location.href})
                .then(()=>console.log('Share was successful.'))
                .catch((error)=>console.log('Sharing failed',error));
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
}
