/*
This code allows the client application to pop up a window at the point of authorization
 */
import { toParams, toQuery } from '../utils';

class PopupWindow {
    constructor(id, url, options = {}) {
        this.id = id;
        this.url = url;
        this.options = options;
    }

    open() {
        const { url, id, options } = this;

        this.window = window.open(url, id, toQuery(options, ','));
    }

    close() {
        this.cancel();
        this.window.close();
    }

    poll() {
        this.promise = new Promise((resolve, reject) => {
            this._iid = window.setInterval(() => {
                try {
                    const popup = this.window;

                    if (!popup || popup.closed !== false) {
                        this.close();

                        reject(new Error('The popup was closed'));

                        return;
                    }

                    if (popup.location.href === this.url || popup.location.pathname === 'blank') {
                        return;
                    }

                    //replace the url character values with a space
                    const params = toParams(popup.location.search.replace(/^\?/, ''));

                    resolve(params);

                    this.close();
                } catch (error) {
                    console.log(error);
                }
            }, 500);
        });
    }

    cancel() {
        if (this._iid) {
            window.clearInterval(this._iid);
            this._iid = null;
        }
    }

    //response after function executes
    then(...args) {
        return this.promise.then(...args);
    }

    //catch for errors
    catch(...args) {
        return this.promise.then(...args);
    }

    static open(...args) {
        const popup = new this(...args);

        popup.open();
        popup.poll();

        return popup;
    }
}

export default PopupWindow;