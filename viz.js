/* ══════════════════════════════════════════════════════════
   viz.js · hover illustrations for module cards
   One tiny animated SVG sketch per module id, raft style:
   2px ink strokes · candy fills · hard shadows · zero radius.
   Animation classes (driven by CSS in index.html, play on hover):
     ap pop-in    ad draw stroke   ar rise (scaleY)   af flow dot
     ab blink     aw swing         as spin (--deg)    at type   ax slide (--fx/--fy)
   Timing per element via style="--d:<sec>s".
   ══════════════════════════════════════════════════════════ */
(() => {
    const I = '#0F1A14', C = '#4FC8EC', P = '#FF8FA3', Y = '#FFD23F', G = '#98D9A0', V = '#C7B5FF',
        W = '#FFFFFF', F = '#D9D2C2', K = '#FAF6EE';
    const MONO = 'ui-monospace,Menlo,Consolas,monospace';

    // ── primitives ──────────────────────────────────────────
    const d = s => s ? ` style="--d:${s}s"` : '';
    const cl = c => c ? ` class="${c}"` : '';
    const R = (x, y, w, h, fill = W, cls = '', dl = 0, extra = '') =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${cl(cls)}${d(dl)} ${extra}/>`;
    const Ci = (cx, cy, r, fill = W, cls = '', dl = 0, extra = '') =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${cl(cls)}${d(dl)} ${extra}/>`;
    const Pth = (dd, fill = 'none', cls = '', dl = 0, extra = '') =>
        `<path d="${dd}" fill="${fill}"${cl(cls)}${d(dl)} ${cls === 'ad' ? 'pathLength="100" ' : ''}${extra}/>`;
    const Ln = (x1, y1, x2, y2, extra = '') =>
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
    const L = (x1, y1, x2, y2, dl = 0, extra = '') =>
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="100" class="ad"${d(dl)} ${extra}/>`;
    // placeholder "text" line: faint, thick, drawn in
    const Ph = (x1, y, x2, dl = 0, col = F) => L(x1, y, x2, y, dl, `stroke="${col}" stroke-width="4"`);
    const T = (x, y, s, size = 8, fill = I, anchor = 'middle', extra = '') =>
        `<text x="${x}" y="${y}" font-size="${size}" font-family="${MONO}" font-weight="800" fill="${fill}" stroke="none" text-anchor="${anchor}" ${extra}>${s}</text>`;
    const Dot = (x, y, dx, dy, dl = 0, fill = I) =>
        `<circle cx="${x}" cy="${y}" r="3.2" fill="${fill}" stroke="none" class="af" style="--dx:${dx}px;--dy:${dy}px;--d:${dl}s"/>`;
    // window chrome: title bar + 3 candy dots
    const Win = (x, y, w, h, dark = false) =>
        R(x, y, w, h, dark ? I : W) +
        Ln(x, y + 14, x + w, y + 14, dark ? `stroke="${K}" stroke-opacity=".35"` : '') +
        [P, Y, G].map((c, i) => Ci(x + 9 + i * 11, y + 7, 3, c)).join('');
    const wrap = inner =>
        `<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<g stroke="${I}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
    const spin = (cx, cy, deg, dl, inner) =>
        `<g class="as" style="transform-origin:${cx}px ${cy}px;transform-box:view-box;--deg:${deg}deg;--d:${dl}s">${inner}</g>`;

    // ── data-source binding: <glyph> → @Erupt → table ───────
    const bind = glyph => wrap(
        glyph +
        L(80, 60, 96, 60, .1) + Dot(80, 60, 16, 0, .5) +
        R(96, 48, 48, 24, Y, 'ap', .3) + T(120, 64, '@Erupt', 8) +
        L(144, 60, 160, 60, .5) + Dot(144, 60, 16, 0, .9) +
        R(160, 22, 70, 76, W) + R(160, 22, 70, 14, C) +
        Ln(183, 36, 183, 98, `stroke-opacity=".25"`) + Ln(206, 36, 206, 98, `stroke-opacity=".25"`) +
        [0, 1, 2, 3].map(i => Ph(166, 50 + i * 12, 224, .7 + i * .15)).join('')
    );

    const VIZ = {};

    // ═══ AI ══════════════════════════════════════════════════
    VIZ['erupt-ai'] = wrap(
        [['GPT', C], ['CLAUDE', G], ['DEEPSEEK', V]].map((p, i) =>
            R(12, 16 + i * 32, 52, 22, p[1], 'ap', i * .12) + T(38, 31 + i * 32, p[0], 7)).join('') +
        [0, 1, 2].map(i => L(64, 27 + i * 32, 96, 60, .2 + i * .1) + Dot(64, 27 + i * 32, 32, 33 - i * 32, .6 + i * .25)).join('') +
        R(96, 40, 48, 40, Y, 'ap', .35) + T(120, 66, 'AI', 15) +
        L(144, 60, 176, 60, .5) + Dot(144, 60, 32, 0, 1) +
        R(176, 44, 52, 32, W, 'ap', .6) + T(202, 64, 'erupt', 8)
    );

    VIZ['erupt-ai-claw'] = wrap(
        Win(12, 14, 124, 92, true) +
        T(20, 50, '&gt; restart nginx', 8, C, 'start', 'class="at" style="--d:.1s"') +
        T(20, 70, '✓ nginx restarted', 8, G, 'start', 'class="ap" style="--d:1.1s"') +
        T(20, 90, '&gt; _', 8, K, 'start', 'class="ab" style="--d:1.3s"') +
        L(136, 60, 160, 60, .9) + Dot(136, 60, 24, 0, 1) +
        R(160, 26, 66, 68, W) +
        [0, 1, 2].map(i => Ph(168, 42 + i * 18, 204, .3 + i * .1) + Ci(216, 42 + i * 18, 3, i ? F : G, i ? '' : 'ab', 1.2)).join('')
    );

    VIZ['erupt-ai-canvas'] = wrap(
        Pth('M12 30 H96 V64 H30 L20 74 V64 H12 Z', Y, 'ap', 0) +
        Ph(22, 42, 84, .2, I) + Ph(22, 52, 66, .35, I) +
        L(96, 47, 116, 47, .4) + Dot(96, 47, 20, 0, .6) +
        R(116, 12, 112, 96, W) + R(116, 12, 112, 12, C, 'ap', .6) +
        R(122, 32, 26, 70, V, 'ap', .75) +
        L(156, 100, 222, 100, .8) +
        [30, 48, 38, 56].map((h, i) => R(156 + i * 16, 100 - h, 10, h, [C, G, P, Y][i], 'ar', .9 + i * .1)).join('')
    );

    VIZ['erupt-ai-rag'] = wrap(
        [0, 1, 2].map(i => R(14 + i * 7, 18 + i * 7, 40, 52, W, 'ap', i * .12)).join('') +
        Ph(34, 44, 62, .4) + Ph(34, 52, 62, .5) + Ph(34, 60, 54, .6) +
        L(68, 58, 92, 58, .5) + Dot(68, 58, 24, 0, .8) +
        R(92, 12, 88, 96, W) +
        [[104, 30], [120, 44], [140, 26], [160, 40], [110, 70], [150, 62], [168, 88], [126, 92], [100, 96], [166, 70]]
            .map((p, i) => Ci(p[0], p[1], 3.5, F, 'ap', .6 + i * .06)).join('') +
        [[120, 44], [140, 26], [150, 62]].map((p, i) => Ci(p[0], p[1], 5, C, 'ap', 1.5 + i * .12)).join('') +
        R(190, 46, 38, 28, Y, 'ap', 1) + T(209, 66, '?', 13) +
        Dot(190, 60, -48, -8, 1.2)
    );

    VIZ['erupt-ai-staff'] = wrap(
        R(12, 18, 60, 84, V) +
        Ci(42, 46, 13, W, 'ap', 0) + Pth('M22 92 Q22 66 42 66 Q62 66 62 92 Z', W, 'ap', .15) +
        L(72, 60, 98, 60, .3) + Dot(72, 60, 26, 0, .6) +
        Ci(120, 60, 22, W) +
        Ln(120, 42, 120, 46) + Ln(138, 60, 134, 60) + Ln(120, 78, 120, 74) + Ln(102, 60, 106, 60) +
        spin(120, 60, 360, .4, Ln(120, 60, 120, 46)) + spin(120, 60, 30, .4, Ln(120, 60, 130, 60)) +
        Ci(120, 60, 2.5, I) +
        L(142, 60, 168, 60, .9) + Dot(142, 60, 26, 0, 1.2) +
        R(168, 18, 60, 84, W, 'ap', .8) +
        [0, 1, 2, 3].map(i => Ph(176, 36 + i * 12, 220 - (i % 2) * 14, 1.3 + i * .15)).join('') +
        R(200, 82, 20, 12, G, 'ap', 2) + T(210, 91, '✓', 9)
    );

    // ═══ Plugins ═════════════════════════════════════════════
    VIZ['erupt-designer'] = wrap(
        R(12, 12, 64, 96, W) + T(44, 26, 'FIELDS', 7) +
        R(20, 34, 48, 14, C) + R(20, 54, 48, 14, G) + R(20, 74, 48, 14, V) +
        R(94, 12, 134, 96, W) + T(161, 26, 'FORM', 7) +
        R(104, 34, 114, 14, C) +
        `<rect x="104" y="74" width="114" height="14" fill="none" stroke-dasharray="4 3" stroke-opacity=".5"/>` +
        R(104, 54, 48, 14, G, 'ax', 0, 'style="--d:.3s;--fx:-84px;--fy:0px"') +
        `<g class="ax" style="--d:.3s;--fx:-84px;--fy:0px">` +
        Pth('M0 0 L0 13 L3.6 10 L6.2 15 L8.4 14 L5.8 9 L10.5 9 Z', W, '', 0, 'transform="translate(146 58)"') + `</g>`
    );

    VIZ['erupt-print'] = wrap(
        `<defs><clipPath id="vz-print-clip"><rect x="0" y="0" width="240" height="50"/></clipPath></defs>` +
        `<g clip-path="url(#vz-print-clip)"><g class="ax" style="--d:.2s;--fx:0px;--fy:46px">` +
        R(86, 6, 68, 44, W) + Ph(96, 18, 144, .6) + Ph(96, 28, 136, .75) + Ph(96, 38, 144, .9) +
        `</g></g>` +
        R(50, 50, 140, 44, W) + R(80, 44, 80, 10, I) +
        R(70, 94, 100, 10, W) +
        R(60, 62, 18, 8, P) + Ci(172, 66, 3.5, G, 'ab', 1) +
        Ph(90, 80, 150, .3)
    );

    VIZ['erupt-terminal'] = wrap(
        Win(24, 12, 192, 96, true) +
        T(34, 44, '$ ssh root@prod', 9, K, 'start', 'class="at" style="--d:.1s"') +
        T(34, 62, 'Welcome to Ubuntu 24.04', 8, G, 'start', 'class="ap" style="--d:1.1s"') +
        T(34, 80, 'root@prod:~#', 8, C, 'start', 'class="ap" style="--d:1.3s"') +
        R(104, 72, 7, 10, K, 'ab', 1.4, 'stroke="none"')
    );

    VIZ['erupt-notice'] = wrap(
        `<g class="aw" style="--d:.1s;transform-origin:78px 24px;transform-box:view-box">` +
        Ln(78, 22, 78, 30) +
        Pth('M60 68 L60 52 Q60 30 78 30 Q96 30 96 52 L96 68 L104 76 L52 76 Z', Y) +
        Ci(78, 82, 5, I) + `</g>` +
        Ci(100, 36, 9, P, 'ap', .6) + T(100, 39.5, '3', 9) +
        L(108, 60, 152, 60, .5) + Dot(108, 60, 44, 0, .8) +
        R(152, 14, 60, 92, W) + R(158, 24, 48, 66, W) + Ci(182, 98, 3, I) +
        R(163, 32, 38, 20, C, 'ap', 1.2) + Ph(168, 40, 196, 1.5, I) + Ph(168, 46, 188, 1.6, I)
    );

    VIZ['erupt-magic-api'] = wrap(
        Win(12, 12, 132, 96) +
        [[C, 60], [P, 40], [G, 70], [C, 30], [V, 56], [G, 48]].map((c, i) =>
            Ph(i ? 30 : 22, 36 + i * 11, (i ? 30 : 22) + c[1], .2 + i * .12, c[0])).join('') +
        R(160, 30, 68, 20, C, 'ap', .6) + T(194, 44, 'GET /api', 8) +
        L(194, 50, 194, 72, 1) + Dot(194, 50, 0, 22, 1.1) +
        R(160, 72, 68, 20, G, 'ap', 1.4) + T(194, 86, '200 OK', 8)
    );

    VIZ['erupt-cloud-server'] = wrap(
        [30, 100, 170].map((x, i) => L(118, 50, x + 20, 82, .3 + i * .1) + Dot(118, 50, x + 20 - 118, 32, .8 + i * .2)).join('') +
        Pth('M72 50 A18 18 0 0 1 88 24 A24 24 0 0 1 134 16 A18 18 0 0 1 160 34 A13 13 0 0 1 164 50 Z', C, 'ap', 0) +
        T(118, 41, 'cloud', 8) +
        [30, 100, 170].map((x, i) => R(x, 82, 40, 24, W, 'ap', .5 + i * .15) + T(x + 20, 97, 'node', 7)).join('')
    );

    VIZ['erupt-job'] = wrap(
        Ci(56, 60, 38, W) +
        Array.from({length: 12}, (_, k) => {
            const a = k * Math.PI / 6, r1 = k % 3 ? 34 : 31;
            return Ln((56 + r1 * Math.sin(a)).toFixed(1), (60 - r1 * Math.cos(a)).toFixed(1),
                (56 + 38 * Math.sin(a)).toFixed(1), (60 - 38 * Math.cos(a)).toFixed(1));
        }).join('') +
        spin(56, 60, 360, .2, Ln(56, 60, 56, 34)) + spin(56, 60, 60, .2, Ln(56, 60, 72, 60)) + Ci(56, 60, 3, I) +
        L(112, 78, 228, 78, .2) +
        [124, 152, 180, 208].map((x, i) => Ln(x, 74, x, 82) + L(x, 66, x, 74, .4 + i * .3) +
            R(x - 12, 44, 24, 22, [C, G, V, P][i], 'ap', .5 + i * .3) + T(x, 59, ['00', '15', '30', '45'][i], 8)).join('')
    );

    VIZ['erupt-monitor'] = wrap(
        Win(12, 12, 132, 96) +
        Ln(20, 50, 136, 50, `stroke="${F}"`) + Ln(20, 72, 136, 72, `stroke="${F}"`) +
        Pth('M20 84 L36 70 L52 76 L68 52 L84 60 L100 40 L116 48 L136 34', 'none', 'ad', .2, `stroke="${C}" stroke-width="3"`) +
        Ci(136, 34, 4, C, 'ap', 1) +
        Ln(156, 96, 228, 96) +
        [['CPU', C, 44], ['MEM', G, 62], ['DISK', P, 30]].map((b, i) =>
            R(160 + i * 24, 96 - b[2], 16, b[2], b[1], 'ar', .3 + i * .15) + T(168 + i * 24, 107, b[0], 6)).join('')
    );

    VIZ['erupt-websocket'] = wrap(
        Ln(76, 52, 164, 52) + Ln(76, 68, 164, 68) +
        Dot(76, 52, 88, 0, 0, C) + Dot(76, 52, 88, 0, .7, C) +
        Dot(164, 68, -88, 0, .35, P) + Dot(164, 68, -88, 0, 1.05, P) +
        Win(12, 34, 64, 52) + T(44, 68, 'web', 8) +
        R(164, 34, 64, 52, W) + Ph(172, 50, 220, .1) + Ph(172, 60, 220, .2) + T(196, 78, 'server', 7) +
        Pth('M124 36 L112 62 L122 62 L114 84 L132 54 L122 54 L130 36 Z', Y, 'ap', .4)
    );

    VIZ['erupt-generator'] = wrap(
        spin(48, 60, 90, .1,
            Array.from({length: 8}, (_, k) => `<rect x="44" y="34" width="8" height="10" fill="${V}" transform="rotate(${k * 45} 48 60)"/>`).join('') +
            Ci(48, 60, 20, V) + Ci(48, 60, 7, W)) +
        L(76, 60, 96, 60, .3) + Dot(76, 60, 20, 0, .6) +
        R(96, 46, 60, 28, Y, 'ap', .4) + T(126, 64, '@Erupt', 8) +
        L(156, 60, 172, 60, .7) + Dot(156, 60, 16, 0, .9) +
        [['.java', 14], ['.ts', 44], ['.sql', 74]].map((f, i) =>
            Pth(`M176 ${f[1]} H208 L216 ${f[1] + 8} V${f[1] + 26} H176 Z`, W, 'ap', 1 + i * .2) + T(196, f[1] + 19, f[0], 7)).join('')
    );

    VIZ['erupt-tpl'] = wrap(
        R(28, 12, 184, 96, W) +
        R(28, 12, 184, 16, C, 'ap', 0) + T(120, 23.5, '&lt;header/&gt;', 7) +
        R(28, 28, 44, 80, V, 'ap', .2) + T(50, 71, 'nav', 7) +
        R(80, 36, 124, 30, G, 'ap', .4) + T(142, 55, '{{ slot }}', 8) +
        R(80, 72, 58, 28, Y, 'ap', .6) + T(109, 90, '{{ a }}', 7) +
        R(146, 72, 58, 28, P, 'ap', .7) + T(175, 90, '{{ b }}', 7)
    );

    VIZ['erupt-report'] = wrap(
        R(12, 18, 64, 20, Y, 'ap', 0) + T(44, 32, 'SELECT', 8) +
        Pth('M44 38 V60 H96', 'none', 'ad', .3) + Pth('M92 55 L100 60 L92 65 Z', I, 'ap', .8) +
        L(104, 100, 228, 100, .4) + L(104, 100, 104, 20, .4) +
        [[112, 40, C], [136, 62, G], [160, 30, V], [184, 76, P], [208, 52, Y]].map((b, i) =>
            R(b[0], 100 - b[1], 16, b[1], b[2], 'ar', .6 + i * .12)).join('') +
        Pth('M120 66 L144 46 L168 74 L192 30 L216 52', 'none', 'ad', 1.2, 'stroke-width="3"')
    );

    // ═══ Data sources ════════════════════════════════════════
    VIZ['erupt-data-mongodb'] = bind(
        Pth('M45 20 C18 40 20 82 45 100 C70 82 72 40 45 20 Z', G, 'ap', 0) +
        Pth('M45 34 Q41 60 45 98', 'none', 'ad', .4)
    );
    VIZ['erupt-data-jdbc'] = bind(
        Pth('M19 34 V84 A26 8 0 0 0 71 84 V34', W, 'ap', 0) +
        Pth('M19 50 A26 8 0 0 0 71 50', 'none', 'ad', .3) + Pth('M19 66 A26 8 0 0 0 71 66', 'none', 'ad', .45) +
        `<ellipse cx="45" cy="34" rx="26" ry="8" fill="${C}" class="ap"/>` + T(45, 37, 'JDBC', 7)
    );
    VIZ['erupt-data-es'] = bind(
        Ln(55, 67, 74, 88, 'stroke-width="7"') +
        Ci(40, 52, 20, C, 'ap', 0) + Ci(40, 52, 11, W) + Ci(40, 52, 3.5, I, 'ab', .5)
    );
    VIZ['erupt-data-redis'] = bind(
        [2, 1, 0].map(i => Pth(`M45 ${26 + i * 16} L75 ${38 + i * 16} L45 ${50 + i * 16} L15 ${38 + i * 16} Z`, P, 'ap', (2 - i) * .15)).join('')
    );
    VIZ['erupt-data-http'] = bind(
        Ci(45, 60, 28, C, 'ap', 0) +
        `<ellipse cx="45" cy="60" rx="12" ry="28" fill="none"/>` + Ln(17, 60, 73, 60) +
        Pth('M22 46 Q45 54 68 46', 'none', 'ad', .3) + Pth('M22 74 Q45 66 68 74', 'none', 'ad', .3) +
        R(28, 20, 34, 14, Y, 'ap', .5) + T(45, 30.5, 'GET', 7)
    );
    VIZ['erupt-data-file'] = bind(
        Pth('M20 20 H58 L70 32 V100 H20 Z', W, 'ap', 0) + Pth('M58 20 V32 H70', 'none') +
        Ph(28, 46, 62, .3) + Ph(28, 58, 56, .4) + Ph(28, 70, 62, .5) +
        R(30, 80, 30, 12, G, 'ap', .7) + T(45, 89, 'CSV', 7)
    );
    VIZ['erupt-data-memory'] = bind(
        Array.from({length: 6}, (_, i) => R(24 + i * 8, 28, 4, 8, I) + R(24 + i * 8, 84, 4, 8, I)).join('') +
        R(20, 36, 50, 48, G, 'ap', 0) + R(30, 48, 30, 24, W) + T(45, 63.5, 'RAM', 8) +
        Ci(64, 42, 2.5, Y, 'ab', .4)
    );
    VIZ['erupt-data-ldap'] = bind(
        L(45, 38, 45, 48, .2) + L(20, 48, 70, 48, .3) + L(20, 48, 20, 58, .4) + L(70, 48, 70, 58, .4) + L(70, 74, 70, 84, .8) +
        R(33, 22, 24, 16, V, 'ap', 0) + T(45, 33, 'ou', 7) +
        R(8, 58, 24, 16, C, 'ap', .6) + T(20, 69, 'cn', 7) + R(58, 58, 24, 16, C, 'ap', .7) + T(70, 69, 'cn', 7) +
        R(58, 84, 24, 16, G, 'ap', 1) + T(70, 95, 'uid', 6)
    );
    VIZ['erupt-data-k8s'] = bind(
        spin(45, 60, 51, .1,
            Ci(45, 60, 28, C) +
            Array.from({length: 7}, (_, k) => {
                const a = k * 2 * Math.PI / 7 - Math.PI / 2;
                return Ln(45, 60, (45 + 28 * Math.cos(a)).toFixed(1), (60 + 28 * Math.sin(a)).toFixed(1));
            }).join('') + Ci(45, 60, 7, W))
    );
    VIZ['erupt-data-s3'] = bind(
        Pth('M18 34 H72 L65 98 H25 Z', Y, 'ap', 0) +
        [[33, 56, C], [50, 56, G], [42, 72, V]].map((o, i) =>
            `<g class="ax" style="--d:${.4 + i * .25}s;--fx:0px;--fy:-42px;--fo:0">` + R(o[0] - 6, o[1] - 6, 12, 12, o[2]) + `</g>`).join('') +
        `<ellipse cx="45" cy="34" rx="27" ry="7" fill="${W}"/>`
    );
    VIZ['erupt-data-feishu'] = bind(
        R(16, 28, 58, 64, W) + R(16, 28, 58, 16, C, 'ap', 0) + T(45, 39.5, 'bitable', 7) +
        Ln(35, 44, 35, 92) + Ln(55, 44, 55, 92) +
        L(16, 60, 74, 60, .3) + L(16, 76, 74, 76, .4) +
        R(36, 45, 18, 14, G, 'ap', .6) + R(56, 61, 17, 14, V, 'ap', .8) + R(17, 77, 17, 14, Y, 'ap', 1)
    );
    VIZ['erupt-data-notion'] = bind(
        R(20, 20, 50, 80, W, 'ap', 0) + T(45, 72, 'N', 34, I, 'middle', 'class="ap" style="--d:.2s"') +
        Ph(28, 86, 62, .5)
    );

    // ═══ Commercial ══════════════════════════════════════════
    VIZ['erupt-flow'] = wrap(
        Ci(22, 60, 10, G, 'ap', 0) + L(32, 60, 50, 60, .2) +
        R(50, 48, 40, 24, W, 'ap', .35) + T(70, 64, 'task', 8) + L(90, 60, 108, 60, .5) +
        Pth('M130 40 L152 60 L130 80 L108 60 Z', Y, 'ap', .65) + T(130, 64, '?', 11) +
        Pth('M152 60 H166 V30 H180', 'none', 'ad', .9) + Pth('M152 60 H166 V90 H180', 'none', 'ad', .9) +
        R(180, 18, 46, 24, C, 'ap', 1.3) + T(203, 34, '✓ pass', 7) +
        R(180, 78, 46, 24, P, 'ap', 1.4) + T(203, 94, '✗ reject', 7)
    );

    VIZ['erupt-tenant'] = wrap(
        R(56, 20, 128, 88, W) +
        [['A', C], ['B', G], ['C', V]].map((t, i) => R(64, 28 + i * 22, 112, 16, t[1], 'ap', .2 + i * .2) + T(120, 39.5 + i * 22, 'tenant ' + t[0], 7)).join('') +
        R(56, 94, 128, 14, I) + T(120, 104, 'erupt core', 7, K)
    );

    VIZ['erupt-cube'] = wrap(
        Pth('M120 16 L164 38 L120 60 L76 38 Z', C, 'ap', 0) +
        Pth('M76 38 L120 60 L120 104 L76 82 Z', V, 'ap', .2) +
        Pth('M120 60 L164 38 L164 82 L120 104 Z', G, 'ap', .4) +
        T(120, 41, 'CUBE', 8) +
        [['SUM', 20], ['AVG', 48], ['COUNT', 76]].map((m, i) => R(180, m[1], 48, 18, Y, 'ap', .7 + i * .2) + T(204, m[1] + 13, m[0], 7)).join('') +
        [['dim', 20], ['fact', 48], ['sql', 76]].map((m, i) => R(12, m[1], 48, 18, W, 'ap', .8 + i * .2) + T(36, m[1] + 13, m[0], 7)).join('')
    );

    window.VIZ = VIZ;
})();
