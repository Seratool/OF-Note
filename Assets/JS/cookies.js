/**
 * cookies manager
 */

class cookies
{
    set(name, value, days = null, path='/')
    {
        let set = [name + '=' + (value || '')],
            date = new Date();

        if (days !== null) {
            date.setTime(date.getTime() + (days*24*60*60*1000));
            set.push('expires=' + date.toUTCString());
        }

        set.push('path='+path);

        document.cookie = set.join('; ');
    }

    get(name)
    {
        let key = name + '=',
            ca = document.cookie.split(';');

        for(let i=0, c; i < ca.length; i++) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(key) === 0) {
                return c.substring(key.length,c.length);
            }
        }

        return null;
    }

    erase(name)
    {
        document.cookie = name +'=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
}
