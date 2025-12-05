/**
 * aside (doc-chooser and menu panel) manager
 */

class Aside
{
    #dic;
    #body = JSE.q('body');
    #btnAsideDoc = JSE.q('button.aside-menu');
    #btnAsideSetting = JSE.q('button.burger-menu');
    #asideMenu = JSE.q('aside.setting');
    #btnAdd = JSE.q('button.add-btn', this.#asideMenu);
    #btnPrint = JSE.q('button.print-btn', this.#asideMenu);
    #btnShare = JSE.q('button.share-btn', this.#asideMenu);
    #btnTheme = JSE.q('button.theme-btn', this.#asideMenu);
    #btnLang = JSE.q('button.lang-btn', this.#asideMenu);
    #btnLock = JSE.q('button.lock-btn', this.#asideMenu);
    #cookies = new cookies();

    /**
     * initialise.
     * @param {DIC} dic
     */
    constructor(dic)
    {
        this.#dic = dic;
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
        this.#initPasswordLocking();
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
                .share({title:document.title, url:window.location.href})
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
                    opt = f.options,
                    name = f.name;

                if (['font', 'bg', 'size'].indexOf(name) > -1) {
                    for (let i = 0, c = opt.length; i < c; i++) {
                        cl.remove(opt[i].value);
                    }
                    cl.add(f.value);
                } else if (['spellcheck'].indexOf(name) > -1) {
                    doc.spellcheck = f.value === 'true';
                }

                // save doc with setting
                this.#dic.connector.save();
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
        let title = window.prompt(__('Give the note name'));

        if (title) {
            this.#dic.connector.addNote(title);
        }
    }

    #initPasswordLocking()
    {
        JSE.ev('click', () => {
            const cl = this.#btnLock.classList;

            if (cl.contains('unlocked')) {
                let pass = this.#promptPassword();

                if (pass) {
                    this.#dic.editor.setPassword(pass);

                    cl.add('locked');
                    cl.remove('unlocked');
                }
            } else if (window.confirm(__('Do you want to delete the password?'))) {
                let pass = window.prompt(__('Give the password'));

                if (pass && this.#dic.editor.isPassCorrect(pass)) {
                    this.#dic.editor.setPassword('');
                    this.#dic.editor.restoreContentIfNeeded(pass);

                    cl.add('unlocked');
                    cl.remove('locked');
                } else {
                    window.confirm(__('The given password seems to be incorrect!'));
                }
            }
        }, this.#btnLock);
    }

    /**
     * get password for note.
     * @returns {false|string}
     */
    #promptPassword()
    {
        let pass = window.prompt(__('Give the password'));

        if (pass) {
            let pass2 = window.prompt(__('Repeat the password'));

            if (pass2 && pass === pass2) {
                return pass2;
            } else {
                window.alert(__('The passwords do not match!'));
            }
        }

        return false;
    }
}
