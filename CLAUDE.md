# DJ Radu — site

Site static pentru DJ Radu (Radu Ghiorghiu), DJ român stabilit în Juelsminde,
Danemarca. Trei limbi: daneză, engleză, română.

- **Repo:** https://github.com/DjRadu/DjRadu.github.io
- **Domeniu:** djradu.com (`CNAME` în rădăcină)
- **Hosting:** GitHub Pages, servit direct din branch-ul `main`
- **Build:** niciunul. HTML/CSS/JS scrise de mână, fără generator, fără
  dependențe, fără CI. Ce e pe `main` e ce se vede pe site.

## Publicare

Se lucrează pe branch, se publică prin merge în `main`:

```
git checkout -b <branch>          # lucrul curent
git push -u origin <branch>
git checkout main && git merge --ff-only <branch> && git push origin main
```

Push-ul în `main` publică imediat. **Nu publica fără să ceri confirmarea
proprietarului.**

Atenție la o capcană întâlnită deja: după un merge rămâi pe `main`, iar un
`git push origin <branch>` ulterior e un no-op care pare că a reușit. Verifică
`git rev-parse --abbrev-ref HEAD` înainte de commit.

## Structură

Homepage-ul danez stă în **rădăcină**, nu în `/da/`. Doar subpaginile daneze
sunt sub `/da/`. E o asimetrie intenționată — daneza e limba implicită.

```
index.html          homepage DA        /ro/index.html     homepage RO
/da/<subpagini>                        /en/index.html     homepage EN
```

56 de pagini HTML: 3 homepage-uri, 42 de subpagini (dintre care 9 sunt
pagini de eveniment, câte trei limbi), 8 stub-uri de redirect, plus
`privacy.html`, `terms.html`, `thankyou.html`.

Paginile comune există în toate trei limbile, cu slug tradus:

| DA | EN | RO |
|---|---|---|
| `/da/min-historie/` | `/en/about/` | `/ro/povestea-mea/` |
| `/da/arrangementer/` | `/en/events/` | `/ro/evenimente/` |
| `/da/repertoire/` | `/en/music/` | `/ro/repertoriu/` |
| `/da/galleri/` | `/en/gallery/` | `/ro/galerie/` |
| `/da/faq/` | `/en/faq/` | `/ro/intrebari-frecvente/` |
| `/da/anmeldelser/` | `/en/reviews/` | `/ro/recenzii/` |
| `/da/kontakt/` | `/en/contact/` | `/ro/contact/` |

Pagini de aterizare specifice unei limbi, **fără echivalent** în celelalte:

- DA, pe ocazii: `dj-til-bryllup`, `dj-til-daab`, `dj-til-konfirmation`,
  `dj-til-foedselsdag`, `dj-til-firmafest`, `dj-til-julefrokost`
- RO, pe ocazii: `dj-nunta`, `dj-botez`, `dj-manele`, `dj-petreceri-romanesti`
- EN, pe țări: `romanian-dj-denmark`, `romanian-dj-germany`

Fișiere partajate: `style.css`, `site.js`, `sitemap.xml`, `robots.txt`.

## Stub-uri de redirect

Opt pagini pe orașe (`ro/dj-roman-{berlin,copenhaga,coventry,hamburg,londra,
milano,paris}`, `en/romanian-dj-uk`) au fost **golite, nu șterse**. Fiecare e
un fișier de ~800 de octeți cu `rel=canonical` spre destinație, `meta refresh`
cu întârziere zero, `location.replace()` și un link vizibil ca rezervă.

Motivul: erau pagini pe orașe fără evenimente reale în spate. URL-urile erau
deja indexate, iar ștergerea le-ar fi transformat în 404. Stub-urile RO duc
la `/ro/`, cel EN la `/en/`. Nu sunt în sitemap.

**Nu le șterge și nu le transforma înapoi în pagini** fără să discuți întâi.

## Imagini

Toate imaginile stau în **rădăcina repo-ului**, referite absolut (`/IMG_2980.JPG`).
Nu există folder de assets. Extensiile sunt inconsecutive (`.jpg`, `.JPG`,
`.PNG`) — folosește exact numele din disc.

Logo-ul principal (nav, hero, footer, og:image, JSON-LD `image`/`logo`) e
`/logo-site.jpg`, 1300px lățime, JPEG. Până pe 24 septembrie 2026 era un PNG
de 1762×892, 1.3MB, sub un nume criptic (`352170B5-...PNG`) — cauza unui LCP
de 9.6s pe mobil, găsit printr-un web-check extern. A fost comprimat și
redenumit; toate cele 44 de referințe au fost actualizate odată. Dacă mai
adaugi vreodată o versiune nouă a logo-ului, păstrează dimensiunea sub
~150KB — orice PNG cu conținut fotografic (poza cu neon) comprimă prost.

Legătura cu evenimentele: sunt 12 evenimente pe fiecare din cele trei pagini
(`/ro/evenimente/`, `/da/arrangementer/`, `/en/events/`). Cele fără poză au un
`<img>` **comentat**, cu `alt` scris în limba paginii:

```html
<div class="event">
<!-- Foto: pune numele fișierului în src și scoate semnele de comentariu din jurul rândului.
<img alt="DJ Radu la un botez în Wittenberge, Germania" class="event-photo" loading="lazy" src="/FOTO.jpg"/> -->
<h3 class="event-title">Botez</h3>
<p class="event-place">Wittenberge, Germania</p>
</div>
```

Cu o singură poză: pui numele fișierului în `src` și scoți `<!--` și `-->`.
CSS-ul așază cardurile identic cu sau fără imagine.

### Pagini de eveniment

Un eveniment cu mai multe poze sau filmulețe primește pagină proprie, în cele
trei limbi, iar cardul devine `<a class="event" href="...">`. Există trei:

| Eveniment | Slug | Conținut |
|---|---|---|
| Petrecere aniversară 40 de ani, Tørring | `torring-40` | 6 poze, 1 video |
| Petrecere de Dragobete, Point Cafe, Horsens | `dragobete-point-cafe` | 1 poză, afișul |
| Latino Party, Kalkbrænderiet, Vejle | `latino-party-vejle` | 4 poze, 3 filmulețe, text |

Slug-urile stau sub `/ro/evenimente/`, `/da/arrangementer/`, `/en/events/`.
Cel mai complet șablon e `latino-party-vejle` (text de descriere + poze +
filmulețe): copiază-l, nu construi de la zero.

- Fișierele stau în rădăcină, cu numele `<slug>-N.jpg` și
  `<slug>-video-N.mp4` + `<slug>-video-N.jpg` (poster). Tørring are nume mai
  vechi (`torring-40-fodselsdag*.jpg`); pentru evenimente noi, folosește schema asta.
- Pozele: JPG, latura lungă 1600 px (`sips -s format jpeg -s formatOptions 82 -Z 1600`).
- Filmulețele originale sunt de zeci de MB. Se recodifică la 720p, H.264 + AAC,
  ținta 2–4 MB: `ffmpeg -i in.MOV -vf scale=1280:-2 -c:v libx264 -crf 28
  -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart out.mp4`.
  Tag-ul `<video>` are `preload="none"`, `poster` și `aria-label`.
- Fiecare pagină nouă intră în `sitemap.xml` cu blocul complet de alternative.
- Textul e la persoana I, scris separat în fiecare limbă, nu tradus.

**O poză stă într-un singur loc.** Fie în galerie, fie la un eveniment, nu în
amândouă. Proprietarul vrea ca galeria și evenimentele să ajungă la un moment
dat una și aceeași secțiune: evenimentul își arată pozele și povestea, iar
vizitatorul înțelege din titlu că are ce vedea acolo. Până atunci, înainte de
a pune o poză la un eveniment, verifică dacă nu e deja în `galleri/`,
`galerie/` sau `gallery/`, și scoate-o de acolo (fișierul rămâne pe disc
dacă îl folosește evenimentul).

## Convenții

**Canonical.** Fiecare pagină are un singur `rel=canonical` absolut, spre
propriul URL. Stub-urile fac excepție: al lor arată spre destinație.

**Hreflang — stă în `sitemap.xml`, nu în HTML.** Doar cele 3 homepage-uri au
`<link rel="alternate" hreflang>` în `<head>`. Pentru restul, alternativele
sunt declarate prin `xhtml:link` în sitemap: 33 din cele 47 de URL-uri au
alternative, restul de 14 sunt paginile specifice unei limbi și cele legale,
care corect nu au. Dacă adaugi o pagină care există în toate trei limbile,
adaug-o în sitemap cu blocul de alternative complet (`da`, `en`, `ro`,
`x-default` → varianta daneză).

Subpaginile au avut hreflang greșit în HTML, copiat din homepage, prin care
pretindeau că sunt variante de limbă ale paginii principale. A fost scos,
nu reparat — sitemap-ul e sursa de adevăr. Nu-l reintroduce în HTML.

**Titluri.** Fără brand la final. Google adaugă singur numele site-ului din
`og:site_name`, iar `| DJ Radu` apărea de două ori în același rezultat.

**Singular la tipurile de eveniment.** Cine caută un DJ are un singur
eveniment, deci scrie „DJ nuntă", nu „DJ nunți". Titlurile, `h1`, meta
descriptions, cardurile de servicii și `makesOffer` sunt la singular în toate
trei limbile. Pluralul rămâne acolo unde fraza îl cere: enumerări
retrospective („pozele de la petrecerile unde a pus muzică"), intervale
(„fra runde fødselsdage til guldbryllupper"), întrebări FAQ despre practica
generală („Faceți nunți în afara Danemarcei?") și **toate listele din
engleză**, unde „DJ for weddings" e corect iar „DJ for wedding" e agramat.

**Structured data.** JSON-LD în `<head>`, ca `@graph`. Business-ul e definit
complet doar în `index.html`, `ro/index.html` și `en/index.html`, ca
`LocalBusiness` cu `@id: https://djradu.com/#business`. Restul paginilor îl
referă prin acel `@id` și adaugă doar propriul nod `WebPage`. Deci o
modificare la datele de firmă se face în trei fișiere.

**Program.** `openingHoursSpecification` pe business e non-stop, 7 zile,
`00:00–23:59`, fiindcă rezervările se fac oricând online. Orele pe zile sunt
fereastra în care Radu răspunde la telefon și stau pe `contactPoint`
(`contactType: reservations`): Lu–Jo 16:00–20:00, Vi 15:30–19:30,
Sâ 10:00–16:00, duminica absent.

Nu muta orele pe zile în `openingHoursSpecification`. Ar spune lui Google că
firma e închisă sâmbătă seara și toată duminica — adică exact când au oamenii
petrecerile și exact când un DJ lucrează.

**Fără `aggregateRating` sau `review`.** Recenziile sunt strânse pe Trustpilot
și Google. Politica Google interzice ca o firmă să marcheze recenzii despre
sine în structured data propriu, iar riscul e acțiune manuală. Testul Rich
Results le listează ca recomandate — se ignoră intenționat.

**`areaServed`.** Danemarca (`Country`), nordul Germaniei
(`AdministrativeArea`), Europa (`Continent`, după negociere pentru transport
și cazare). Nu mai există noduri `City` nicăieri — au fost scoase odată cu
paginile pe orașe.

**`sameAs`** — trebuie să corespundă cu iconițele din subsol:

| | |
|---|---|
| Facebook | `https://www.facebook.com/DJRaduG/` |
| Instagram | `https://www.instagram.com/djradudk` |
| Pinterest | `https://dk.pinterest.com/djradudk/` |
| YouTube | `https://youtube.com/@djradudk` |
| TikTok | `https://www.tiktok.com/@djradudk` |
| Threads | `https://www.threads.com/@djradudk` |
| Snapchat | `https://www.snapchat.com/@djradudk` |
| SoundCloud | `https://soundcloud.com/djradudk` |
| Trustpilot | `https://www.trustpilot.com/review/djradu.com` |

SoundCloud e doar iconiță în footer + `sameAs`, fără pagină proprie și fără
conținut încărcat — kontul există, dar upload-ul cere un abonament de 25
kr/lună, pe care proprietarul nu-l are încă. Nu construi o pagină „Mixuri"
sau vreun embed de player până nu se confirmă că are conținut de arătat.

Facebook e singurul rămas pe handle-ul vechi (`DJRaduG`). Restul au migrat pe
`djradudk`, ales ca să lege identitatea de Danemarca — în România sunt mulți
DJ Radu.

**Amprentă de conținut pe CSS și JS.** `style.css` și `site.js` sunt referite
cu `?v=<primele 8 caractere din sha1>`. Există ca să nu mai servească
telefoanele o versiune veche din cache.

**Dacă modifici `style.css` sau `site.js`, recalculează amprenta pe toate
paginile, în același commit:**

```bash
for f in style.css site.js; do
  old=$(grep -ho "$f?v=[a-f0-9]*" index.html | head -1 | sed 's/.*v=//')
  new=$(sha1sum $f | cut -c1-8)
  [ "$old" = "$new" ] || find . -name '*.html' -not -path './.git/*' \
    -exec sed -i '' "s|$f?v=$old|$f?v=$new|g" {} +
done
```

(`sed -i ''` e forma de pe macOS; pe Linux e `sed -i`.)

**Fonturi și Font Awesome, găzduite local, nu de la Google/cdnjs.** Trăiesc
în `/fonts/`: `fonts.css` (Bebas Neue + Montserrat, doar subseturile latin
și latin-ext, Montserrat e variabil deci un singur fișier acoperă toate
grosimile 300-800) și `fontawesome.css` (doar `fab` + `fas`, cele 9 iconițe
folosite pe site). Motivul e GDPR: încărcarea necondiționată de la Google
Fonts/cdnjs trimitea IP-ul vizitatorului către terți înainte de acceptul de
cookie-uri, o problemă documentată legal în Germania. Dacă adaugi vreodată
o iconiță Font Awesome nouă, verifică întâi dacă glyph-ul există în
`fa-solid-900.woff2`/`fa-brands-400.woff2` deja incluse; dacă nu, mai
trebuie descărcat fișierul corespunzător de pe cdnjs și adăugat în `/fonts/`.

**Headerul de atribuire din `fontawesome.css` nu se șterge.** Comentariul
`/*! Font Awesome Free 6.7.2 by @fontawesome ... */` de la începutul
fișierului e cerut de licența CC BY 4.0 a iconițelor. Din momentul în care
fonturile au ajuns în repo, nu mai e un comentariu de curățat la minificare —
e o obligație. La fel pentru fonturile din `fonts.css`: Bebas Neue și
Montserrat sunt sub SIL Open Font License 1.1. `LICENSE` le enumeră pe toate
și le scoate explicit de sub „all rights reserved", ca revendicarea să nu
acopere ce nu ne aparține.

Verificare: `grep -rho '\(style.css\|site.js\)?v=[a-f0-9]*' --include='*.html' .
| sort | uniq -c` trebuie să arate o singură valoare pentru fiecare fișier.

## Date de contact

Telefon `+4550246280` (și WhatsApp Business, același număr), email
`booking@djradu.com`, CVR 46538560, adresa Skrænten 21, Hosby, 7130 Juelsminde.

Numărul apare în text vizibil, în linkuri `tel:`, în `telephone` din JSON-LD
**și în câmpul ascuns `_autoresponse` din formularul de rezervare**, ca să
ajungă corect în emailul automat. La o schimbare de număr, toate patru.

## Reguli de lucru

**Nu schimba URL-uri.** Paginile sunt indexate, iar site-ul încă se reașază
după repararea canonical-urilor. Textul vizibil și metadatele se pot schimba;
`href`, `canonical`, `og:url` și numele de foldere, nu. Verificare după orice
modificare în masă:

```bash
python3 - <<'EOF'
import subprocess, re, pathlib
pat = re.compile(r'(?:href|src|content)="((?:https?://|/)[^"]*)"')
old_all, new_all = set(), set()
for f in sorted(pathlib.Path('.').rglob('*.html')):
    if '.git' in f.parts: continue
    old = subprocess.run(['git','show',f'HEAD:{f}'],capture_output=True,text=True).stdout
    old_all |= set(pat.findall(old))
    new_all |= set(pat.findall(f.read_text(encoding='utf-8')))
print("disparute:", sorted(old_all - new_all) or "niciunul")
print("aparute  :", sorted(new_all - old_all) or "niciunul")
EOF
```

Ambele liste trebuie să fie goale, cu excepția unei schimbări de link social
făcute intenționat.

**Modificările în masă se fac cu un script în scratchpad**, cu potriviri
exacte de șiruri și un raport de câte ocurențe a prins fiecare, nu cu
`sed` orb pe tot repo-ul. Un `sed` pe „djradug" a schimbat din greșeală și
Instagram, și Facebook, când doar YouTube trebuia atins.

**Validează JSON-LD după orice atingere:**

```bash
python3 -c "
import re,json,pathlib
for f in pathlib.Path('.').rglob('*.html'):
    if '.git' in f.parts: continue
    for m in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',
                        f.read_text(encoding='utf-8'), re.S):
        try: json.loads(m)
        except Exception as e: print(f, e)
"
```

45 de blocuri, toate trebuie să treacă.

**Mesajele de commit se scriu în engleză**, explicând *de ce*, nu *ce* —
diff-ul arată deja ce. Istoricul e consecvent așa; uită-te la `git log` înainte
de primul commit.

**Conținutul e în trei limbi, scrise de vorbitori.** Nu traduce automat dintr-o
limbă în alta; daneza și româna au formulări proprii, nu calchiate din engleză.

## Deschis acum

Nimic în lucru. Ultima sesiune (24 septembrie 2026) a rezolvat, pe rând, o
listă de probleme găsite printr-un web-check extern (krak.dk) plus câteva
cereri separate ale proprietarului:

- **Fonturi și Font Awesome autogăzduite** — vezi convenția de mai sus.
  Rezolvă alerta GDPR de încărcare necondiționată înainte de consimțământ.
- **Logo comprimat și redenumit** la `/logo-site.jpg` — vezi secțiunea
  Imagini. Era cauza unui LCP de 9.6s pe mobil.
- **`llms.txt`** adăugat la rădăcină, un rezumat scurt al site-ului pentru
  agenți/crawlere AI.
- **IndexNow configurat** pentru Bing (cheia e fișierul
  `f0704445d9544e1cb40e5276623cd3a6.txt` la rădăcină) și toate cele 47 de
  URL-uri din sitemap trimise o dată, manual.
- **SoundCloud** adăugat în footer și `sameAs` — doar iconiță, fără pagină,
  vezi nota de la SoundCloud în tabelul de social media.
- Card nou de serviciu **„Ungdomsfest"** pe pagina daneză (plus `makesOffer`
  corespunzător), și câteva cuvinte lucrate natural în text danez
  (mobildiskotek, lounge, havefest, entertainer, „andre DJs" în FAQ) —
  potriviri cu termeni de căutare reali, găsite prin Google Business Profile
  și krak.dk. Toate doar pe pagina daneză; engleza a rămas neatinsă
  intenționat (pluralul e corect gramatical acolo, vezi convenția de mai jos
  despre singular/plural).
- Tagline-ul din `ro/index.html` corectat la singular, ca să fie consecvent
  cu daneza.
- Am auditat contrastul de culoare (axe-core, instrumentul din spatele
  Lighthouse) pe 8 pagini — zero probleme reale găsite. Ce raportase
  krak.dk era o limitare a scannerului lor (elemente cu fundal degradé sau
  imagine, unde un instrument riguros cere verificare manuală, nu declară
  eroare automat).

**Pus pe pauză, nu uitat:**

- **Pagina „Mixuri"** (RO) / „Mixes" (EN) / „Mixtapes" (DA), cu player
  SoundCommunity încorporat — amânată până proprietarul are abonamentul
  plătit de SoundCloud (25 kr/lună) și chiar poate încărca mixuri. Când
  revine subiectul, textele pentru pagină și pentru un banner pe homepage
  („Cauți inspirație... Ascultă ultimul meu mix") au fost deja discutate și
  aprobate în conversația din 23-24 septembrie 2026, doar de reluat.

**Rămân, dacă se cer, mai vechi:**

- `geo` (coordonate) în JSON-LD — opțional, inofensiv, ~`55.7144, 10.0115`
  pentru Juelsminde, de confirmat cu proprietarul
- textul pentru Google Business Profile, unde programul pe zile chiar produce
  „Închis" vizibil sâmbătă seara și duminica. E o decizie a proprietarului,
  în afara repo-ului.

**În afara repo-ului, acțiuni ale proprietarului, nu ale acestui site:**

- Bing Places for Business — cont nou de creat (diferit de Bing Webmaster
  Tools, deja configurat), rezolvă vizibilitatea zero găsită pe Bing într-un
  citation-check (Net-tjek krak.dk)
- Adresa pe Krak/De Gule Sider nu include „Hosby" (spre deosebire de Google
  Business Profile) — proprietarul a confirmat că formularul Krak nu
  acceptă acea formă, deci inconsecvența rămâne intenționat neschimbată
