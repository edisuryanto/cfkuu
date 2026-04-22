
import { connect } from "cloudflare:sockets";

let password = '';
let proxyIP = '';
//let sub = '';
let subConverter = atob('U1VCQVBJLkNNTGl1c3Nzcy5uZXQ=');
let subConfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvY29uZmlnL0FDTDRTU1JfT25saW5lX01pbmlfTXVsdGlNb2RlLmluaQ==');
let subProtocol = 'https';
let subEmoji = 'true';
let socks5Address = '';
let enableSocks = false;
let enableHttp = false;
const expire = false;//2099-12-31
let proxyIPs;
let socks5s;
let go2Socks5s = [
    '*tapecontent.net',
    '*cloudatacdn.com',
    '*.loadshare.org',
];
let addresses = [];
let addressesapi = [];
let addressescsv = [];
let DLS = 8;
let remarkIndex = 1;//CSV备注所在列偏移量
let FileName = 'edisuryanto';
let BotToken = '';
let ChatID = '';
let proxyhosts = [];
let proxyhostsURL = '';
let 请求CF反代IP = 'false';
let httpsPorts = ["2053", "2083", "2087", "2096", "8443"];
let sha224Password;
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let proxyIPPool = [];
let path = '/gacor';
let link = [];
let banHosts = [atob('c3BlZWQuY2xvdWRmbGFyZS5jb20=')];
let SCV = 'true';
let allowInsecure = '&allowInsecure=1';
export default {
    async fetch(request, env, ctx) {
        try {
            const UA = request.headers.get('User-Agent') || 'null';
            const userAgent = UA.toLowerCase();
            password = env.PASSWORD || env.pswd || env.UUID || env.uuid || env.TOKEN || password;
            if (!password) {
                return new Response('请设置你的PASSWORD变量，或尝试重试部署，检查变量是否生效？', {
                    status: 404,
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    }
                });
            }
            sha224Password = env.SHA224 || env.SHA224PASS || sha224(password);
            //console.log(sha224Password);

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // 设置时间为当天
            const timestamp = Math.ceil(currentDate.getTime() / 1000);
            const fakeUserIDMD5 = await MD5MD5(`${password}${timestamp}`);
            const fakeUserID = [
                fakeUserIDMD5.slice(0, 8),
                fakeUserIDMD5.slice(8, 12),
                fakeUserIDMD5.slice(12, 16),
                fakeUserIDMD5.slice(16, 20),
                fakeUserIDMD5.slice(20)
            ].join('-');

            const fakeHostName = `${fakeUserIDMD5.slice(6, 9)}.${fakeUserIDMD5.slice(13, 19)}`;

            proxyIP = env.PROXYIP || env.proxyip || proxyIP;
            proxyIPs = await ADD(proxyIP);
            proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
            proxyIP = proxyIP ? proxyIP.toLowerCase() : request.cf.colo + '.PrOxYiP.cMlIuSsSs.NeT';
            socks5Address = env.HTTP || env.SOCKS5 || socks5Address;
            socks5s = await ADD(socks5Address);
            socks5Address = socks5s[Math.floor(Math.random() * socks5s.length)];
            enableHttp = env.HTTP ? true : socks5Address.toLowerCase().includes('http://');
            socks5Address = socks5Address.split('//')[1] || socks5Address;
            if (env.GO2SOCKS5) go2Socks5s = await ADD(env.GO2SOCKS5);
            if (env.CFPORTS) httpsPorts = await ADD(env.CFPORTS);
            if (env.BAN) banHosts = await ADD(env.BAN);
            if (socks5Address) {
                try {
                    socks5AddressParser(socks5Address);
                    请求CF反代IP = env.RPROXYIP || 'false';
                    enableSocks = true;
                } catch (err) {
                    // @type {Error}
                    let e = err;
                    console.log(e.toString());
                    请求CF反代IP = env.RPROXYIP || !proxyIP ? 'true' : 'false';
                    enableSocks = false;
                }
            } else {
                请求CF反代IP = env.RPROXYIP || !proxyIP ? 'true' : 'false';
            }

            const upgradeHeader = request.headers.get("Upgrade");
            const url = new URL(request.url);
            if (!upgradeHeader || upgradeHeader !== "websocket") {
                if (env.ADD) addresses = await ADD(env.ADD);
                if (env.ADDAPI) addressesapi = await ADD(env.ADDAPI);
                if (env.ADDCSV) addressescsv = await ADD(env.ADDCSV);
                DLS = Number(env.DLS) || DLS;
                remarkIndex = Number(env.CSVREMARK) || remarkIndex;
                BotToken = env.TGTOKEN || BotToken;
                ChatID = env.TGID || ChatID;
                FileName = env.SUBNAME || FileName;
                subEmoji = env.SUBEMOJI || env.EMOJI || subEmoji;
                if (subEmoji == '0') subEmoji = 'false';
                if (env.LINK) link = await ADD(env.LINK);
                let sub = env.SUB || '';
                subConverter = env.SUBAPI || subConverter;
                if (subConverter.includes("http://")) {
                    subConverter = subConverter.split("//")[1];
                    subProtocol = 'http';
                } else {
                    subConverter = subConverter.split("//")[1] || subConverter;
                }
                subConfig = env.SUBCONFIG || subConfig;
                if (url.searchParams.has('sub') && url.searchParams.get('sub') !== '') sub = url.searchParams.get('sub').toLowerCase();

                if (url.searchParams.has('proxyip')) {
                    path = `/proxyip=${url.searchParams.get('proxyip')}`;
                    请求CF反代IP = 'false';
                } else if (url.searchParams.has('socks5')) {
                    path = url.searchParams.has('globalproxy') ? `/?socks5=${url.searchParams.get('socks5')}&globalproxy` : `/?socks5=${url.searchParams.get('socks5')}`;
                    请求CF反代IP = 'false';
                } else if (url.searchParams.has('socks')) {
                    path = url.searchParams.has('globalproxy') ? `/?socks5=${url.searchParams.get('socks')}&globalproxy` : `/?socks5=${url.searchParams.get('socks')}`;
                    请求CF反代IP = 'false';
                } else if (url.searchParams.has('http')) {
                    path = url.searchParams.has('globalproxy') ? `/?http=${url.searchParams.get('http')}&globalproxy` : `/?http=${url.searchParams.get('http')}`;
                    请求CF反代IP = 'false';
                }

                SCV = env.SCV || SCV;
                if (!SCV || SCV == '0' || SCV == 'false') allowInsecure = '';
                else SCV = 'true';
                switch (url.pathname) {
                    case '/':
                        if (env.URL302) return Response.redirect(env.URL302, 302);
                        else if (env.URL) return await proxyURL(env.URL, url);
                        else return new Response(await nginx(), {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html; charset=UTF-8',
                            },
                        });
                    case `/${fakeUserID}`:
                        const fakeConfig = await get特洛伊Config(password, request.headers.get('Host'), sub, 'CF-Workers-SUB', 请求CF反代IP, url, fakeUserID, fakeHostName, env);
                        return new Response(`${fakeConfig}`, { status: 200 });
                    case `/${password}/config.json`:
                        if (url.searchParams.get('token') === await MD5MD5(fakeUserID + UA)) return await config_Json(password, request.headers.get('Host'), sub, UA, 请求CF反代IP, url, fakeUserID, fakeHostName, env);
                    case `/${password}/edit`:
                        return await KV(request, env);
                    case `/${password}/bestip`:
                        return await bestIP(request, env);
                    case `/${password}`:
                        await sendMessage(`#获取订阅 ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${UA}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
                        const 特洛伊Config = await get特洛伊Config(password, request.headers.get('Host'), sub, UA, 请求CF反代IP, url, fakeUserID, fakeHostName, env);
                        const now = Date.now();
                        //const timestamp = Math.floor(now / 1000);
                        const today = new Date(now);
                        today.setHours(0, 0, 0, 0);
                        const UD = Math.floor(((now - today.getTime()) / 86400000) * 24 * 1099511627776 / 2);
                        let pagesSum = UD;
                        let workersSum = UD;
                        let total = 24 * 1099511627776;
                        if ((env.CF_EMAIL && env.CF_APIKEY) || (env.CF_ID && env.CF_APITOKEN)) {
                            const usage = await getUsage(env.CF_ID, env.CF_EMAIL, env.CF_APIKEY, env.CF_APITOKEN, env.CF_ALL);
                            pagesSum = usage[1];
                            workersSum = usage[2];
                            total = env.CF_ALL ? Number(env.CF_ALL) : (1024 * 100); // 100K
                        }
                        if (userAgent && (userAgent.includes('mozilla') || userAgent.includes('subconverter'))) {
                            return new Response(特洛伊Config, {
                                status: 200,
                                headers: {
                                    "Content-Type": "text/html;charset=utf-8",
                                    "Profile-Update-Interval": "6",
                                    "Subscription-Userinfo": `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${expire}`,
                                    "Cache-Control": "no-store",
                                }
                            });
                        } else {
                            return new Response(特洛伊Config, {
                                status: 200,
                                headers: {
                                    "Content-Disposition": `attachment; filename=${FileName}; filename*=utf-8''${encodeURIComponent(FileName)}`,
                                    //"Content-Type": "text/plain;charset=utf-8",
                                    "Profile-Update-Interval": "6",
                                    "Profile-web-page-url": request.url.includes('?') ? request.url.split('?')[0] : request.url,
                                    "Subscription-Userinfo": `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${expire}`,
                                }
                            });
                        }
                    default:
                        if (env.URL302) return Response.redirect(env.URL302, 302);
                        else if (env.URL) return await proxyURL(env.URL, url);
                        else return new Response('不用怀疑！你PASSWORD就是错的！！！', { status: 404 });
                }
            } else {
                socks5Address = url.searchParams.get('socks5') || url.searchParams.get('http') || socks5Address;
                enableHttp = url.searchParams.get('http') ? true : enableHttp;
                go2Socks5s = url.searchParams.has('globalproxy') ? ['all in'] : go2Socks5s;

                if (new RegExp('/socks5=', 'i').test(url.pathname)) socks5Address = url.pathname.split('5=')[1];
                else if (url.pathname.toLowerCase().includes('/socks://') || url.pathname.toLowerCase().includes('/socks5://') || url.pathname.toLowerCase().includes('/http://')) {
                    enableHttp = url.pathname.includes('http://');
                    socks5Address = url.pathname.split('://')[1].split('#')[0];
                    if (socks5Address.includes('@')) {
                        const lastAtIndex = socks5Address.lastIndexOf('@');
                        let userPassword = socks5Address.substring(0, lastAtIndex).replaceAll('%3D', '=');
                        const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
                        if (base64Regex.test(userPassword) && !userPassword.includes(':')) userPassword = atob(userPassword);
                        socks5Address = `${userPassword}@${socks5Address.substring(lastAtIndex + 1)}`;
                    }
                    go2Socks5s = ['all in'];//开启全局SOCKS5
                }

                if (socks5Address) {
                    try {
                        socks5AddressParser(socks5Address);
                        enableSocks = true;
                    } catch (err) {
                        // @type {Error}
                        let e = err;
                        console.log(e.toString());
                        enableSocks = false;
                    }
                } else {
                    enableSocks = false;
                }

                if (url.searchParams.has('proxyip')) {
                    proxyIP = url.searchParams.get('proxyip');
                    enableSocks = false;
                } else if (new RegExp('/proxyip=', 'i').test(url.pathname)) {
                    proxyIP = url.pathname.toLowerCase().split('/proxyip=')[1];
                    enableSocks = false;
                } else if (new RegExp('/proxyip.', 'i').test(url.pathname)) {
                    proxyIP = `proxyip.${url.pathname.toLowerCase().split("/proxyip.")[1]}`;
                    enableSocks = false;
                } else if (new RegExp('/pyip=', 'i').test(url.pathname)) {
                    proxyIP = url.pathname.toLowerCase().split('/pyip=')[1];
                    enableSocks = false;
                }

                return await 特洛伊OverWSHandler(request);
            }
        } catch (err) {
            let e = err;
            return new Response(e.toString());
        }
    }
};

async function 特洛伊OverWSHandler(request) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();
    let address = "";
    let portWithRandomLog = "";
    const log = (info, event) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
    };
    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
    let remoteSocketWapper = {
        value: null
    };
    let udpStreamWrite = null;
    readableWebSocketStream.pipeTo(new WritableStream({
        async write(chunk, controller) {
            if (udpStreamWrite) {
                return udpStreamWrite(chunk);
            }
            if (remoteSocketWapper.value) {
                const writer = remoteSocketWapper.value.writable.getWriter();
                await writer.write(chunk);
                writer.releaseLock();
                return;
            }
            const {
                hasError,
                message,
                portRemote = 443,
                addressRemote = "",
                rawClientData,
                addressType
            } = await parse特洛伊Header(chunk);
            address = addressRemote;
            portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
            if (hasError) {
                throw new Error(message);
                return;
            }
            if (!banHosts.includes(addressRemote)) {
                log(`处理 TCP 出站连接 ${addressRemote}:${portRemote}`);
                handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, log, addressType);
            } else {
                throw new Error(`黑名单关闭 TCP 出站连接 ${addressRemote}:${portRemote}`);
            }
        },
        close() {
            log(`readableWebSocketStream is closed`);
        },
        abort(reason) {
            log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        }
    })).catch((err) => {
        log("readableWebSocketStream pipeTo error", err);
    });
    return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client
    });
}

async function parse特洛伊Header(buffer) {
    if (buffer.byteLength < 56) {
        return {
            hasError: true,
            message: "invalid data"
        };
    }
    let crLfIndex = 56;
    if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
        return {
            hasError: true,
            message: "invalid header format (missing CR LF)"
        };
    }
    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    if (password !== sha224Password) {
        return {
            hasError: true,
            message: "invalid password"
        };
    }

    const socks5DataBuffer = buffer.slice(crLfIndex + 2);
    if (socks5DataBuffer.byteLength < 6) {
        return {
            hasError: true,
            message: "invalid SOCKS5 request data"
        };
    }

    const view = new DataView(socks5DataBuffer);
    const cmd = view.getUint8(0);
    if (cmd !== 1) {
        return {
            hasError: true,
            message: "unsupported command, only TCP (CONNECT) is allowed"
        };
    }

    const atype = view.getUint8(1);
    // 0x01: IPv4 address
    // 0x03: Domain name
    // 0x04: IPv6 address
    let addressLength = 0;
    let addressIndex = 2;
    let address = "";
    switch (atype) {
        case 1:
            addressLength = 4;
            address = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            ).join(".");
            break;
        case 3:
            addressLength = new Uint8Array(
                socks5DataBuffer.slice(addressIndex, addressIndex + 1)
            )[0];
            addressIndex += 1;
            address = new TextDecoder().decode(
                socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            );
            break;
        case 4:
            addressLength = 16;
            const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            address = ipv6.join(":");
            break;
        default:
            return {
                hasError: true,
                message: `invalid addressType is ${atype}`
            };
    }

    if (!address) {
        return {
            hasError: true,
            message: `address is empty, addressType is ${atype}`
        };
    }

    const portIndex = addressIndex + addressLength;
    const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
    const portRemote = new DataView(portBuffer).getUint16(0);
    return {
        hasError: false,
        addressRemote: address,
        portRemote,
        rawClientData: socks5DataBuffer.slice(portIndex + 4),
        addressType: atype
    };
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, log, addressType) {
    async function useSocks5Pattern(address) {
        if (go2Socks5s.includes(atob('YWxsIGlu')) || go2Socks5s.includes(atob('Kg=='))) return true;
        return go2Socks5s.some(pattern => {
            let regexPattern = pattern.replace(/\*/g, '.*');
            let regex = new RegExp(`^${regexPattern}$`, 'i');
            return regex.test(address);
        });
    }
    const 启用SOCKS5全局反代 = (go2Socks5s.length > 0 && enableSocks) ? await useSocks5Pattern(addressRemote) : null;
    async function connectAndWrite(address, port) {
        let tcpSocket2;
        if (启用SOCKS5全局反代) {
            tcpSocket2 = enableHttp ? await httpConnect(address, port) : await socks5Connect(address, port);
        } else {
            try {
                tcpSocket2 = connect({ hostname: address, port });
                await tcpSocket2.opened;
            } catch {
                if (enableSocks) {
                 
