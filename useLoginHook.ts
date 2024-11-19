import axios from 'axios';
import * as fs from 'fs';

async function doLogin(user: string, pass: string, pin: number = 0): Promise<any> {
    // doLogin('GiveawayBot', 'pass1234', 1234567890)
    
    const cache = JSON.parse(fs.readFileSync('loginData.json', 'utf8') || '{}');
    const fields = {
        DeviceId: cache.DeviceId || '',
        PassHash: cache.PassHash || '',
        YourEmail: user,
        password: pass,
        agree: 0,
        NameEmail: user,
        Login: 1,
        Pin: pin > 0 ? pin : undefined
    };

    const login = await axios.post('https://xat.com/web_gear/chat/register5.php', fields).then(res => res.data);

    if (login.Err?.login) return login.Err.login.replace(/[.\s]/g, '').split('</span>')[1];
    if (login.Err?.todo) {
        fs.writeFileSync('loginData.json', JSON.stringify(login.Err.todo), 'utf8');
        const mlogin2 = await axios.post('https://xat.com/web_gear/chat/mlogin2.php?v=1.68&m=7', {
            json: JSON.stringify({
                M: '0',
                P: login.Err.todo.PassHash,
                d: login.Err.todo.DeviceId,
                n: login.Err.todo.w_userno,
                nfy: '',
                oi: login.Err.todo.w_userno,
                p: '',
                pt: 3,
                t: ''
            })
        }).then(res => res.data);

        if (mlogin2.v) {
            login.Err.todo.data = mlogin2.v;
            login.Err.todo.lastLogin = Date.now();
            fs.writeFileSync('loginData.json', JSON.stringify(login.Err.todo), 'utf8');
            return true;
        }
        return mlogin2;
    }

    return false;
}
