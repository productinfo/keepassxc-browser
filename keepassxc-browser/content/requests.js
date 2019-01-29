'use strict';

browser.runtime.onMessage.addListener(function(req, sender) {
    if ('action' in req) {
        if (req.action === 'fill_user_pass_with_specific_login') {
            if (kpxc.credentials[req.id]) {
                let combination = null;
                if (kpxc.u) {
                    kpxc.setValueWithChange(kpxc.u, kpxc.credentials[req.id].login);
                    combination = kpxcFields.getCombination('username', kpxc.u);
                    browser.runtime.sendMessage({
                        action: 'page_set_login_id', args: [ req.id ]
                    });
                    kpxc.u.focus();
                }
                if (kpxc.p) {
                    kpxc.setValueWithChange(kpxc.p, kpxc.credentials[req.id].password);
                    browser.runtime.sendMessage({
                        action: 'page_set_login_id', args: [ req.id ]
                    });
                    combination = kpxcFields.getCombination('password', kpxc.p);
                }

                let list = [];
                if (kpxc.fillInStringFields(combination.fields, kpxc.credentials[req.id].stringFields, list)) {
                    kpxcForm.destroy(false, { 'password': list.list[0], 'username': list.list[1] });
                }
            }
        } else if (req.action === 'fill_user_pass') {
            _called.manualFillRequested = 'both';
            kpxc.receiveCredentialsIfNecessary().then((response) => {
                kpxc.fillInFromActiveElement(false);
            });
        } else if (req.action === 'fill_pass_only') {
            _called.manualFillRequested = 'pass';
            kpxc.receiveCredentialsIfNecessary().then((response) => {
                kpxc.fillInFromActiveElement(false, true); // passOnly to true
            });
        } else if (req.action === 'fill_totp') {
            kpxc.receiveCredentialsIfNecessary().then((response) => {
                kpxc.fillInFromActiveElementTOTPOnly(false);
            });
        } else if (req.action === 'clear_credentials') {
            kpxcEvents.clearCredentials();
            return Promise.resolve();
        } else if (req.action === 'activated_tab') {
            kpxcEvents.triggerActivatedTab();
            return Promise.resolve();
        } else if (req.action === 'ignore-site') {
            kpxc.ignoreSite(req.args);
        } else if (req.action === 'check_database_hash' && 'hash' in req) {
            kpxc.detectDatabaseChange(req.hash);
        }
    }
});
