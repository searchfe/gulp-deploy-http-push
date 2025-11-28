/*
 * @Author: qiansc
 * @Date: 2019-05-07 14:17:18
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-05-09 11:22:43
 */
import * as prompt from 'prompt';
import { fetch } from './fetch';
import { getToken, writeToken } from './token';

type Callback = (error?: Error) => void;

const waiting: Callback[] = [];
prompt.start();

function resolve (err?: Error) {
    while (waiting.length) {
    waiting.pop()!(err);
    }
}

export function requireEmail (authApi, validateApi, receiver, prevError, cb: Callback) {
    if (!authApi || !validateApi) {
        throw new Error('options.authApi and options.validateApi is required!');
    }

    waiting.push(cb);

    if (waiting.length > 1) { // already getting
        return;
    }

    const info = getToken(receiver);
    if (info.email) {
        console.error('\nToken is invalid: ', prevError.errmsg, '\n');
    }

    prompt.get({
        properties: {
            email: {
                default: info.email,
                description: 'Enter your email',
                message: 'The specified value must be a valid email address.',
                // eslint-disable-next-line
                pattern: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
                required: true
            }
        }
    }, (error, ret) => {
        if (error) {
            return resolve(error);
        }

        info.email = ret.email;
        writeToken(receiver, info);

        fetch(authApi, {
            email: ret.email
        }, (err) => {
            if (err) {
                return resolve(error);
            }

            console.log('We\'re already sent the code to your email.');

            requireToken(validateApi, receiver, info, resolve);
        });
    });
}

function requireToken (validateApi, receiver, info, cb) {
    prompt.get({
        properties: {
            code: {
                description: 'Enter your code',
                hide: true,
                required: true
            }
        }
    }, (error, ret) => {
        if (error) {
            return cb(error);
        }

        info.code = ret.code;
        writeToken(receiver, info);
        fetch(validateApi, {
            code: info.code,
            email: info.email
        }, (err, rs) => {
            if (err) {
                return cb(err);
            }

            info.token = rs.data.token;
            writeToken(receiver, info);
            cb(null, info);
        });
    });
}

export const Text = {
    blod,
    green,
    grey,
    yellow
};

function green (str: string) {
    return '\u001b[32m' + str + '\u001b[39m';
}

function blod (str: string) {
    return '\u001b[1m' + str + '\u001b[22m';
}

function yellow (str: string) {
    return '\u001b[33m' + str + '\u001b[39m';
}

function grey (str: string) {
    return '\u001b[90m' + str + '\u001b[39m';
}
