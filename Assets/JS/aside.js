/**
 * aside (doc-chooser and menu panel) manager
 */

class Aside
{
    #btnAside = JSE.q('button.aside-menu');
    #btnMenu = JSE.q('button.burger-menu');
    #asideNav = JSE.q('nav.docs-navigation');
    #asideMenu = JSE.q('aside.setting');
    #btnLang = JSE.q('button.lang-btn', this.#asideMenu);
    #btnPrint = JSE.q('button.print-btn', this.#asideMenu);
    #btnShare = JSE.q('button.share-btn', this.#asideMenu);
    #btnTheme = JSE.q('button.theme-btn', this.#asideMenu);
    #cookies = new cookies();

    initialise()
    {
        JSE.ev('click', () => {
            this.#btnAside.classList.toggle('open');
            this.#asideNav.classList.toggle('open');
        }, this.#btnAside);

        JSE.ev('click', () => {
            this.#btnMenu.classList.toggle('open');
            this.#asideMenu.classList.toggle('open');
        }, this.#btnMenu);

        JSE.ev('click', () => print(), this.#btnPrint);

        if (navigator.canShare) {
            this.#btnShare.classList.remove('hidden');
            JSE.ev('click', () => this.#pageShare(), this.#btnShare);
        }

        this.#initLangChooser();
        this.#initThemeChooser();
        this.#initSetting();
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


                // save doc setting


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
