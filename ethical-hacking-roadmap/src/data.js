// Content for the Ethical Hacking Roadmap — PAN Home Lab Edition.
// This is reference material only. Nothing on the site tracks completion —
// the journal questions are meant to be answered in your own notes while
// you work hands-on in your lab, not typed in here.

export const groundRule =
  "Only your devices, your VMs. No third-party targets. \n Test and Learn WE DON'T OWN ANY OF THE RIGHTS TO THESE INFO we only reference for personal use"

export const goal = {
  title: 'Your goal',
  items: [
    'Hands-on skills',
    'Real-world confidence',
    'Certifications',
    'Career opportunities',
  ],
}

export const phases = [
  {
    id: 'p0',
    number: '00',
    title: 'Foundations',
    status: 'done',
    summary: 'Networking and Nmap fundamentals, built on your own LAN.',
    objectives: [
      'Networking basics — addressing, subnetting, common ports and protocols',
      'Nmap fundamentals — scan types, timing templates, output formats',
      'NSE scripting basics — running and reading Nmap scripts',
      'THM Nmap intro, then a full 192.168.0.0/24 sweep of your own home network',
    ],
    notes: [
      {
        heading: 'Networking basics',
        paragraphs: [
          "Every device you'll test starts as an IP address on a network. Your home network almost certainly uses a private range like 192.168.0.0/24 or 192.168.1.0/24 — the /24 means the first three octets (192.168.0) are fixed and the last octet (0–255) identifies each host, giving you 254 usable addresses.",
          "You don't need deep subnetting math for this roadmap, but you do need to read a port list fluently. A port is a numbered door on a host: TCP is connection-based (HTTP, SSH, databases), UDP is connectionless (DNS, DHCP, SNMP). Learn these by sight, because you'll be reading nmap output constantly from here on: 22 SSH, 23 Telnet, 53 DNS, 80/443 HTTP/HTTPS, 445 SMB, 3306 MySQL, 3389 RDP.",
        ],
        commands: [
          { comment: 'Find your own IP and subnet', cmd: 'ip addr        # Linux\nipconfig       # Windows' },
        ],
      },
      {
        heading: 'Nmap fundamentals',
        paragraphs: [
          "Nmap has two jobs here: find out what's alive, then find out what's open on it. Do host discovery first and port scanning second — scanning dead addresses just wastes time.",
          '-sS (SYN scan) sends a SYN packet and never completes the handshake — fast and quieter, needs root/sudo. -sT (connect scan) completes the full TCP handshake — slower and noisier, but works without elevated privileges. -sU scans UDP ports, which is slower and less reliable because UDP often just stays silent when nothing is wrong.',
          'Timing templates (-T0 stealthy through -T5 fastest) trade speed for noise; -T4 is the usual choice on your own lab. For records, -oN saves normal text, -oX saves parseable XML, and -oA saves every format at once under one filename base.',
        ],
        commands: [
          { comment: 'Host discovery across your whole subnet', cmd: 'nmap -sn 192.168.0.0/24' },
          {
            comment: 'Full TCP range, service/version detection, save every output format',
            cmd: 'sudo nmap -p- -sV -sC -T4 -oA phase0_sweep 192.168.0.0/24',
          },
        ],
      },
      {
        heading: 'NSE scripting basics',
        paragraphs: [
          "NSE (Nmap Scripting Engine) scripts are Lua scripts nmap runs against open ports to pull extra information or probe for known issues. They're grouped into categories — default, safe, vuln, auth, brute, discovery. For a home lab, default and vuln are the two you'll reach for most.",
          "-sC runs the default set automatically for anything nmap already knows how to probe, like grabbing an HTTP page title or an SSH host key. --script=vuln checks specifically for fingerprints of known CVEs — treat a vuln hit as a lead to verify manually, not a confirmed finding; these scripts do produce false positives.",
        ],
        commands: [
          { comment: 'Version detection + default scripts on one host', cmd: 'nmap -sV -sC 192.168.0.15' },
          { comment: 'Run the vuln script category against one host', cmd: 'nmap --script vuln 192.168.0.15' },
        ],
      },
      {
        heading: 'Extra drill \u2014 scan-type comparison (cross-referenced from THM\u2019s Nmap room)',
        paragraphs: [
          "THM's \"Nmap\" room has you run each scan type once against a room-hosted target so you can see the syntax. The rep that actually sticks is running all three back to back against the same host on your own LAN and timing them, so you feel the SYN-vs-connect-vs-UDP trade-off instead of just reading about it.",
          "Exercise: pick one always-on host on your PAN (your router is a good choice since it's always up) and run a SYN scan, a full connect scan, and a UDP top-ports scan against it, wrapping each in time. Write down which finished fastest, whether the UDP scan actually told you anything definitive, and whether you noticed any change in the router's own admin-page responsiveness while the full-port scan ran.",
        ],
        commands: [
          {
            comment: 'Time all three scan types against the same host',
            cmd: 'time sudo nmap -sS -p- 192.168.0.1\ntime sudo nmap -sT -p- 192.168.0.1\ntime sudo nmap -sU --top-ports 20 192.168.0.1',
          },
        ],
      },
      {
        heading: 'Extra drill \u2014 NSE script categories beyond -sC',
        paragraphs: [
          "THM's \"Nmap\" room covers -sC as the default script set, but nmap ships with a dozen-plus categories (auth, broadcast, brute, default, discovery, dos, exploit, external, fuzzer, intrusive, malware, safe, version, vuln) and it's worth knowing which ones you're comfortable firing at your own gear without a second thought (safe, default, discovery) versus which ones you'd only ever run deliberately (brute, dos, intrusive).",
          "Exercise: list every script in the \"safe\" category, then pick two you haven't used yet and run them against a device on your PAN. Note in your journal what each one actually returned that -sC alone didn't.",
        ],
        commands: [
          { comment: 'List scripts in a category before running anything blind', cmd: 'ls /usr/share/nmap/scripts/ | grep -i safe\nnmap --script-help "safe and default" | less' },
          { comment: 'Run two specific scripts by name against one host', cmd: 'nmap --script=http-title,ssh-hostkey -p 22,80 192.168.0.15' },
        ],
      },
    ],
    thmRefs: ['Introduction to Networking', 'Nmap', 'Nmap Live Host Discovery'],
    journal: [
      'Which hosts answered your 192.168.0.0/24 sweep, and was any of them a surprise?',
      "What's the practical difference between a SYN scan and a full connect scan, in your own words?",
      'Which NSE scripts gave you genuinely useful output, and which were noise?',
      'Which ports are open on your own laptop right now, and do you know why each one is open?',
    ],
  },
  {
    id: 'p1',
    number: '01',
    title: 'Reconnaissance & Enumeration Deep Dive',
    status: 'in-progress',
    current: true,
    summary: 'Directory enumeration, fingerprinting, and packet capture across your PAN.',
    objectives: [
      'Directory and endpoint enumeration',
      'Banner grabbing and service fingerprinting',
      'Packet capture with tcpdump / Wireshark',
      "Practice: enumerate your trading bot\u2019s /api/ routes, then a full port scan across every PAN device",
    ],
    notes: [
      {
        heading: 'Passive vs. active reconnaissance',
        paragraphs: [
          "Passive recon gathers information without directly touching the target — reading DNS records, checking what's already public, looking at headers a normal visit would return anyway. Active recon means directly probing it: port scanning, directory brute-forcing, banner grabbing.",
          "On your own gear the legal line between passive and active barely matters — it's all yours to test. The habit still matters: start passive so you already know roughly what you're dealing with before you start hammering it with requests.",
        ],
      },
      {
        heading: 'Directory and endpoint enumeration',
        paragraphs: [
          "Web apps and APIs almost always have paths that aren't linked anywhere in the UI — old admin panels, debug routes, forgotten backups. Tools like gobuster or ffuf brute-force these by requesting each candidate from a wordlist and flagging anything that doesn't 404.",
        ],
        commands: [
          {
            comment: "Directory brute-force against your bot's API",
            cmd: 'gobuster dir -u http://localhost:3000/api -w /usr/share/wordlists/dirb/common.txt -x json',
          },
          {
            comment: 'Same idea with ffuf, filtering out 404 responses',
            cmd: 'ffuf -u http://localhost:3000/api/FUZZ -w /usr/share/wordlists/dirb/common.txt -fc 404',
          },
        ],
      },
      {
        heading: 'Banner grabbing and fingerprinting',
        paragraphs: [
          "A banner is whatever a service volunteers about itself the moment you connect — a version string, a server name, sometimes more. That one detail is what lets you jump straight to the right CVEs in Phase 4, so always capture it and write it down.",
        ],
        commands: [
          { comment: "Grab an HTTP response's headers only", cmd: 'curl -I http://192.168.0.15' },
          { comment: 'Connect to a raw TCP service by hand and read what it announces', cmd: 'nc -nv 192.168.0.15 22' },
        ],
      },
      {
        heading: 'Packet capture with tcpdump / Wireshark',
        paragraphs: [
          "A tool's summary output is a paraphrase; the packet capture is the ground truth. Capturing traffic while you scan or hit an endpoint shows exactly what left your machine and what came back — the way you catch things like plaintext credentials, an unexpected redirect, or a service behaving differently than its banner implied.",
        ],
        commands: [
          {
            comment: 'Capture only traffic to/from one target while you test it',
            cmd: 'sudo tcpdump -i eth0 host 192.168.0.15 -w phase1_capture.pcap',
          },
          { comment: 'Useful Wireshark display filter once the capture is open', cmd: 'http || tcp.port == 3000' },
        ],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s Gobuster room, applied to the trading bot',
        paragraphs: [
          "THM has a dedicated \"Gobuster\" room that walks through dir, dns, and vhost modes one at a time on a hosted target. The transferable habit worth practicing on your own bot: tune the thread count and extension list instead of running the tool on defaults, and actually read the status codes it returns instead of just the list of paths.",
          "Exercise: run gobuster against your bot's /api with a higher thread count and a couple of relevant extensions, then re-run it filtering out one status code you decide is noise. Record which paths came back 200, which came back 401/403 (interesting \u2014 they exist but need auth), and which extensions actually mattered for your stack.",
        ],
        commands: [
          { comment: 'Tuned run: more threads, relevant extensions', cmd: 'gobuster dir -u http://localhost:3000/api -w /usr/share/wordlists/dirb/common.txt -t 50 -x json,js' },
          { comment: 'Filter out a specific status code once you know what\'s noise', cmd: 'gobuster dir -u http://localhost:3000/api -w /usr/share/wordlists/dirb/common.txt -b 404,400' },
        ],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s Network Services rooms, applied to your PAN',
        paragraphs: [
          "THM's \"Network Services\" and \"Network Services 2\" rooms walk through enumerating FTP, SMB, and a handful of other classic services on purpose-built vulnerable boxes. Most home networks don't run FTP or SMB on purpose, which is itself worth confirming rather than assuming \u2014 a NAS, a printer, or an old Windows share can quietly expose SMB without anyone remembering it's on.",
          "Exercise: sweep your PAN for FTP (21) and SMB (139/445), and for anything that answers, check for anonymous/guest access before you check for anything else. A device with SMB open and guest access enabled is a bigger finding than most CVEs you'll turn up in Phase 5.",
        ],
        commands: [
          { comment: 'Find anything on your PAN answering on FTP or SMB ports', cmd: 'nmap -p 21,139,445 192.168.0.0/24' },
          { comment: 'Check for anonymous FTP', cmd: 'ftp 192.168.0.15\n# login as: anonymous / (blank password)' },
          { comment: 'List SMB shares without credentials, then a fuller sweep if that works', cmd: 'smbclient -L //192.168.0.15/ -N\nenum4linux -a 192.168.0.15' },
        ],
      },
    ],
    thmRefs: ['Passive Reconnaissance', 'Active Reconnaissance', 'Wireshark: The Basics', 'Gobuster', 'Network Services', 'Network Services 2'],
    journal: [
      "What did directory enumeration turn up on the trading bot that you didn't already know was exposed?",
      'Which service banners leaked version numbers, and what could that tell an attacker?',
      "What did the packet capture show you that the tool's own summary output didn't?",
      'Which device on your network has the largest open attack surface right now, and why?',
    ],
  },
  {
    id: 'p2',
    number: '02',
    title: 'Web App Security Basics (OWASP Top 10)',
    status: 'in-progress',
    current: true,
    summary: 'Auth, access control, and injection — tested against your own trading bot.',
    objectives: [
      'Broken Authentication — done',
      'Access Control / IDOR',
      'Injection (SQL / NoSQL)',
      'CSRF / XSS',
      'Security Misconfiguration',
      'Practice: curl-based tests and injection attempts on phone and password fields',
    ],
    notes: [
      {
        heading: 'Broken authentication',
        paragraphs: [
          "Authentication breaks in predictable ways: no password complexity or rate-limiting (so brute-forcing works), session tokens that never expire or never rotate on login, and JWTs that aren't actually verified server-side (or that accept alg: none). Test by trying to brute-force a login without triggering a lockout, then check whether a session token still works after you've logged out.",
        ],
      },
      {
        heading: 'Access control / IDOR',
        paragraphs: [
          "Insecure Direct Object Reference happens when an app trusts an ID you send it — like /api/orders/482 — without checking that resource 482 actually belongs to you. The test is almost embarrassingly simple: log in as one user, grab an ID that belongs to someone else, and swap it into the request.",
        ],
        commands: [
          {
            comment: 'Swap the ID in an authenticated request and see what comes back',
            cmd: 'curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/orders/482',
          },
        ],
      },
      {
        heading: 'Injection (SQL / NoSQL)',
        paragraphs: [
          "SQL injection happens when user input gets concatenated straight into a query instead of parameterized. The classic probe is a single quote to break the query's syntax, then a payload that forces it to always match. NoSQL databases have their own version — instead of breaking string syntax, you send an operator the query wasn't expecting.",
        ],
        commands: [
          { comment: 'Classic SQLi probe in a login form field', cmd: "' OR '1'='1' -- " },
          { comment: 'NoSQL operator injection in a JSON login body', cmd: '{ "username": "admin", "password": { "$ne": null } }' },
        ],
      },
      {
        heading: 'CSRF / XSS',
        paragraphs: [
          'XSS means the app renders attacker-supplied input as if it were code: reflected (bounced straight back in the response), stored (saved and served to other users later), or DOM-based (client-side JavaScript inserts it into the page unsafely). CSRF is different — it tricks a logged-in user\u2019s browser into firing a request they never intended, relying on cookies being attached automatically. A server-side-checked CSRF token is the standard fix; SameSite cookies help too.',
        ],
        commands: [{ comment: 'Minimal XSS probe for any reflected input field', cmd: '<script>alert(document.domain)</script>' }],
      },
      {
        heading: 'Security misconfiguration',
        paragraphs: [
          "This is the catch-all: default credentials never changed, verbose stack traces leaking file paths, a .env or .git folder still reachable over HTTP, CORS wide open to any origin. Boring to test, but often the actual way in.",
        ],
        commands: [
          { comment: 'Check for an exposed .env or .git folder', cmd: 'curl -s http://localhost:3000/.env\ncurl -s http://localhost:3000/.git/config' },
        ],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s Hydra room, applied to the bot\u2019s login (your own test account only)',
        paragraphs: [
          "THM's \"Hydra\" room teaches brute-forcing a login form against a hosted target. The point of repeating it on your own bot isn't to actually break in \u2014 it's to answer the question already asked in the broken-authentication notes above (does a lockout or rate limit actually trigger) with real data instead of a guess.",
          "Exercise: create a throwaway test account on the bot, then point Hydra at it with a small, deliberately-wrong wordlist (not the account's real password) and watch what happens after a handful of attempts \u2014 does the app lock the account, slow down, or just keep accepting guesses forever? Never run this against a real user's account or with a list large enough to actually hammer your own dev server.",
        ],
        commands: [
          {
            comment: 'Small, controlled brute-force against a throwaway test account',
            cmd: 'hydra -l testuser -P small-test-list.txt localhost -s 3000 http-post-form \\\n  "/api/login:username=^USER^&password=^PASS^:F=Invalid credentials"',
          },
        ],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s Burp Suite: The Basics room, applied to the bot',
        paragraphs: [
          "The curl-based tests earlier in this phase are great for a repeatable scripted check, but Burp Suite (covered start-to-finish in THM's \"Burp Suite: The Basics\" room) is what you'd actually reach for to explore a request interactively \u2014 intercept it once, then replay it in Repeater with one field changed at a time, watching the response diff instead of re-typing a curl command for every variation.",
          "Exercise: set Burp as your browser's proxy, log into the bot once so Burp captures the login request, then send that request to Repeater and try the SQLi and NoSQLi payloads from the Injection notes above by editing the field directly in Repeater instead of curl. Compare how much faster it is to iterate once the request is already loaded.",
        ],
        commands: [
          { comment: 'Point curl at Burp\'s listening proxy the same way your browser would be configured', cmd: 'curl -x http://127.0.0.1:8080 -k http://localhost:3000/api/login' },
        ],
      },
    ],
    thmRefs: ['OWASP Top 10', 'OWASP Juice Shop', 'SQL Injection', 'Cross-site Scripting', 'Hydra', 'Burp Suite: The Basics'],
    journal: [
      'What actually broke in the auth flow, and what was the root cause behind it?',
      "Can you reach another user's data just by changing an ID in the URL or request body?",
      'Which input fields accepted characters they should have rejected, and what happened when they did?',
      "Grading your own app's OWASP Top 10 posture today: what's the single biggest gap left?",
    ],
  },
  {
    id: 'p3',
    number: '03',
    title: 'Network & IoT Device Hardening',
    status: 'up-next',
    summary: 'Auditing the router, the smart speaker, and every service your phone exposes.',
    objectives: [
      'Router (Tenda) hardening',
      'Smart speaker checks',
      'Phone security and running services',
      'Practice: full Tenda router audit, then nmap --script vuln across the network',
    ],
    notes: [
      {
        heading: 'Router hardening',
        paragraphs: [
          "Start with the boring stuff, because it's what actually gets exploited: change the default admin password, disable WPS (it has known brute-force weaknesses), turn off remote/WAN-side management unless you genuinely need it, and check for a pending firmware update. Tenda routers specifically have a documented history of CVEs for command injection and default-credential issues in their web admin panel — checking your exact model and firmware version against a CVE database is exactly what Phase 4 is for.",
        ],
      },
      {
        heading: 'Smart speakers and phone services',
        paragraphs: [
          "A smart speaker usually doesn't expose much locally, but it's still a host on your network — the check is the same nmap sweep from Phase 0, aimed at that device's specific IP, to confirm nothing beyond its expected ports is listening. On your phone, check which apps have background network access, and on Android specifically, watch for any app binding a local debug port you never asked for.",
        ],
        commands: [{ comment: 'Aggressive scan + vuln scripts against one IoT device', cmd: 'nmap -sV -sC --script vuln 192.168.0.20' }],
      },
      {
        heading: 'Extra drill \u2014 SSDP/mDNS exposure on IoT gear',
        paragraphs: [
          "Smart speakers and a lot of consumer IoT gear announce themselves on the network by design, using SSDP (UDP 1900) and mDNS (UDP 5353) for device discovery \u2014 useful for \"find my device\" style features, but it also means anything listening on the same network can passively learn what's out there, and sometimes its model or firmware version, without sending a single scan packet.",
          "Exercise: sweep your PAN for SSDP and mDNS responders, then separately check your router's own admin page headers for a firmware version leak \u2014 you already have the practice from Phase 1's banner grabbing, this is the same move pointed at the router itself.",
        ],
        commands: [
          { comment: 'Find devices announcing themselves via SSDP or mDNS', cmd: 'nmap -sU -p 1900,5353 192.168.0.0/24' },
          { comment: 'Check the router admin page for a version disclosure in headers', cmd: 'curl -I http://192.168.0.1' },
        ],
      },
    ],
    thmRefs: ['Network Security', 'IoT? IoT!'],
    journal: [
      'What default settings did you find still enabled on the Tenda router?',
      'Did nmap --script vuln flag anything real, or was it a false positive — how did you tell the difference?',
      'Which device on your network would be hardest to patch if a real vulnerability dropped tomorrow?',
    ],

  },
  {
    id: 'p4',
    number: '04',
    title: 'Wireless & Bluetooth Attacks',
    status: 'up-next',
    summary: "Cracking your own Wi-Fi handshake and mapping what your Bluetooth gadgets actually expose.",
    objectives: [
      "Wi-Fi scanning on native Ubuntu vs. Ubuntu on WSL2, and why they behave differently",
      'WPA2 handshake capture and offline cracking',
      'WPS and evil-twin weaknesses',
      'Bluetooth and BLE discovery, plus GATT characteristic enumeration',
      "Practice: capture and crack your own network's handshake, then enumerate your BLE devices",
    ],
    notes: [
      {
        heading: 'Wi-Fi scanning — native Ubuntu',
        paragraphs: [
          "Wi-Fi scanning has two modes. Managed mode is what your NIC runs day to day — nmcli or iwlist will list nearby SSIDs, signal strength, and channel, which is enough for a basic inventory of what's around you. Monitor mode is different: the NIC stops trying to associate with anything and instead captures raw 802.11 frames from every network in range, which is what you need to actually see management frames, handshakes, and connected clients.",
          "Not every adapter supports monitor mode or packet injection — most built-in laptop cards (Intel especially) don't. Chipsets that reliably do: Atheros AR9271 (common in Alfa AWUS036NHA), Ralink RT3070, and most Realtek RTL8812AU-based adapters (Alfa AWUS036ACH and clones). If you're buying one for this, check the chipset against aircrack-ng's compatibility list before the model name.",
          "airmon-ng switches an adapter into monitor mode and spins up a new virtual interface (wlan0 becomes wlan0mon). Once you're in monitor mode, airodump-ng with no filters shows every AP and client in range; narrowing it to one BSSID and channel is what you'll actually use once you've picked a target — which, on this roadmap, is always a network you own.",
        ],
        commands: [
          { comment: 'Quick managed-mode inventory of nearby networks', cmd: 'nmcli device wifi list\nsudo iw dev wlan0 scan | grep -E "SSID|signal|freq"' },
          { comment: 'Check what your adapter actually supports before relying on it', cmd: 'iw list | grep -A 10 "Supported interface modes"' },
          { comment: 'Switch into monitor mode', cmd: 'sudo airmon-ng check kill\nsudo airmon-ng start wlan0' },
          { comment: 'See everything in range, then narrow to one target', cmd: 'sudo airodump-ng wlan0mon\nsudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon' },
        ],
      },
      {
        heading: 'Wi-Fi scanning — Ubuntu on WSL2 (on top of Windows)',
        paragraphs: [
          "This is the one that trips people up, so it's worth being blunt about it: stock WSL2 has no wireless radio at all, virtual or otherwise. WSL2 runs as a lightweight Hyper-V VM, and its only network interface is a virtual eth0 that's NAT'd through whatever connection your Windows host is using — Wi-Fi or wired, it doesn't matter, WSL2 just sees generic IP connectivity. Nothing in that setup lets nmcli or iw see nearby SSIDs, because there's no wireless NIC object presented to the guest to ask.",
          "The fix is usbipd-win — a USB/IP bridge that shares a specific USB device from Windows into WSL2. It only moves USB devices, though, and most laptops' built-in Wi-Fi cards are PCIe or M.2, not USB, so there's usually nothing to pass through unless you plug in an external USB Wi-Fi adapter (the same monitor-mode-capable ones from the native-Ubuntu section above).",
          "Even after a USB adapter shows up inside WSL2, monitor mode is a second hurdle: the default Microsoft-built WSL2 kernel ships a minimal driver set that generally doesn't include Wi-Fi drivers or the full mac80211/cfg80211 wireless stack. Getting real monitor-mode support means building a custom WSL2 kernel (from the microsoft/WSL2-Linux-Kernel source) with your adapter's driver module enabled — doable, but it's a genuine kernel-build project, not a package install.",
          "Given all that, the practical path for most people: do the actual capture (airodump-ng, handshake grabs) on real Linux — a dual-boot, a live USB session, or a spare machine/Raspberry Pi with a compatible adapter — then copy the resulting .cap file into WSL2 and do the analysis and cracking there with aircrack-ng or hashcat, since those only need CPU/GPU, not the radio itself. For a quick passive inventory with no monitor mode at all, Windows' own Wi-Fi stack can list nearby networks directly from PowerShell, no WSL involved.",
        ],
        commands: [
          { comment: 'On Windows (admin PowerShell) — install usbipd-win and list USB devices', cmd: 'winget install usbipd\nusbipd list' },
          { comment: 'Share a specific USB Wi-Fi adapter into WSL2 (BUSID from the list above)', cmd: 'usbipd bind --busid 2-4\nusbipd attach --wsl --busid 2-4' },
          { comment: 'Inside WSL2 — confirm the adapter arrived, and whether it can do monitor mode', cmd: 'lsusb\nip link show\nsudo airmon-ng\niw list | grep -A 10 "Supported interface modes"' },
          { comment: 'No WSL involved — passive SSID inventory straight from Windows', cmd: 'netsh wlan show networks mode=bssid' },
        ],
      },
      {
        heading: 'How Wi-Fi networks actually get exploited',
        paragraphs: [
          "The core attack against WPA2-Personal is capturing the 4-way handshake and cracking it offline. The handshake happens every time a client joins the network, so you don't have to wait for it — sending a deauthentication frame to an already-connected client kicks it off, and it reconnects automatically, handing you a fresh handshake to capture. Once you have it, the actual crack never touches the network again; it's a pure offline dictionary attack against the captured hash, which is exactly why a long, non-dictionary passphrase is the real defense, not hiding the SSID.",
          "WPS is a separate, older weakness: its 8-digit PIN is checked by the router in two 4-digit halves, which collapses the real search space from 10^8 to about 11,000 guesses — small enough to brute-force in hours with tools like reaver or bully. Some chipsets are also vulnerable to Pixie Dust, an offline variant of the same flaw that recovers the PIN almost instantly. If WPS is enabled on your router, this is usually the fastest way in — which is also why disabling WPS entirely is standard hardening advice, not just a Phase 3 checkbox.",
          "An evil twin attack clones your own SSID with a fake, more attractive access point (tools like airbase-ng or hostapd set this up) — combined with a deauth against the real AP, nearby clients will often auto-reconnect to whichever signal is strongest, landing on the fake one where you control the traffic or the captive portal. WPA3's SAE handshake closes the offline-cracking weakness WPA2 has (no more capture-and-crack against a strong password), though early WPA3 implementations had their own side-channel flaws (Dragonblood) — worth checking your router's firmware changelog for.",
        ],
        commands: [
          { comment: 'Force a handshake by deauthenticating a connected client', cmd: 'sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon' },
          { comment: 'Offline dictionary crack against the captured handshake', cmd: 'aircrack-ng capture-01.cap -w /usr/share/wordlists/rockyou.txt' },
          { comment: 'Faster GPU-based cracking via hashcat', cmd: 'hcxpcapngtool -o hash.22000 capture-01.cap\nhashcat -m 22000 hash.22000 rockyou.txt' },
          { comment: 'WPS PIN attack, if WPS is enabled', cmd: 'reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv' },
        ],
      },
      {
        heading: 'Bluetooth scanning — native Ubuntu and WSL2',
        paragraphs: [
          "Classic Bluetooth (BR/EDR) and Bluetooth Low Energy (BLE) are discovered slightly differently. bluetoothctl is the modern, interactive tool for both — power on the adapter, start a scan, and it lists everything nearby with an LE flag on BLE devices. Once you have a device's MAC, sdptool browse enumerates the classic services it exposes (audio profile, serial port profile, OBEX file transfer, and so on) — that service list tells you what's actually reachable on the device before you try anything further.",
          "BLE devices — most modern IoT gadgets, wearables, and smart-home sensors — organize their functionality into GATT services and characteristics rather than the older service model. gatttool lets you connect and list every characteristic a device exposes, along with whether each one is readable, writable, or notifiable. That list is the real map of what a BLE gadget lets you touch.",
          "WSL2 has the same fundamental blocker here as Wi-Fi: no virtual Bluetooth radio is presented to the guest by default, so hci0 simply doesn't exist inside WSL2 out of the box. The one wrinkle in Bluetooth's favor: many laptops' built-in Bluetooth radios are actually wired up internally as a USB device (even when the Wi-Fi half of the same combo chip is PCIe), so it's worth checking usbipd-win's device list before assuming you need an external dongle — look for anything named 'Bluetooth' in the output. Either way, the WSL2 kernel still needs BlueZ and the Bluetooth USB driver built in, which the default kernel typically doesn't include, so the same custom-kernel caveat from the Wi-Fi section applies. For anything beyond basic discovery, doing the work on native Ubuntu is the path of least resistance.",
        ],
        commands: [
          { comment: 'Interactive discovery — works for classic and BLE devices', cmd: 'bluetoothctl\npower on\nagent on\nscan on' },
          { comment: 'Enumerate classic Bluetooth services on a discovered device', cmd: 'sdptool browse AA:BB:CC:DD:EE:FF' },
          { comment: 'BLE-specific discovery (older tool, still common)', cmd: 'sudo hciconfig hci0 up\nsudo hcitool lescan' },
          { comment: 'Connect to a BLE device and list its GATT characteristics', cmd: 'gatttool -b AA:BB:CC:DD:EE:FF -I\nconnect\ncharacteristics' },
          { comment: 'Check Windows-side for a Bluetooth USB device before assuming you need a dongle', cmd: 'usbipd list' },
        ],
      },
      {
        heading: 'How Bluetooth gets exploited',
        paragraphs: [
          "The most common real-world issue on cheap BLE gadgets is simply missing authentication on GATT characteristics — a smart lock, plug, or sensor that lets anyone in range read or write a characteristic (like an 'unlock' or 'set password' value) with no pairing required at all. Enumerating characteristics with gatttool and checking each one's permissions is exactly how you'd catch this on your own devices; writing to a characteristic that shouldn't be writable is the practical proof.",
          "Pairing itself has had protocol-level weaknesses — KNOB-style attacks force a connection down to a shorter, brute-forceable encryption key during negotiation, and legacy \"Just Works\" pairing (still common on cheap IoT gear) provides no protection against a nearby attacker at all. BlueBorne, a 2017 vulnerability set, showed that some Bluetooth stacks could be exploited for code execution without any pairing or user interaction — the practical takeaway for your own gear is the boring one: check whether the device's Bluetooth firmware or host OS has a pending update.",
          "A quieter privacy issue worth checking on your own wearables and trackers: some BLE devices broadcast a fixed, non-randomized MAC address in their advertising packets, which makes them trackable across locations by anything listening — modern devices are supposed to rotate a random address periodically, so a static one during a scan is worth flagging.",
        ],
      },
      {
        heading: 'Extra drill \u2014 wordlist strength, cross-referenced from Wifi Hacking 101',
        paragraphs: [
          "THM's \"Wifi Hacking 101\" room has you crack a handshake against rockyou.txt so you get a result quickly. The more realistic lesson for your own network is comparing crack time across wordlists \u2014 it's the fastest way to feel, rather than just be told, why an 8-character all-lowercase passphrase is weak and a long random one isn't.",
          "Exercise: once you've captured your own handshake, crack it with rockyou.txt, then generate a small custom wordlist matching your actual passphrase's pattern (length and character set, not the real password) with crunch and time that run too. Compare the two times in your journal.",
        ],
        commands: [
          { comment: 'Generate a pattern-matched custom wordlist (example: 8-digit numeric)', cmd: 'crunch 8 8 0123456789 -o custom.txt' },
          { comment: 'Time a crack against each wordlist', cmd: 'time aircrack-ng capture-01.cap -w /usr/share/wordlists/rockyou.txt\ntime aircrack-ng capture-01.cap -w custom.txt' },
        ],
      },
    ],
    thmRefs: ['Wifi Hacking 101'],
    journal: [
      'What SSIDs and BSSIDs turned up in your scan, and which encryption type is each one actually using?',
      'If you tried this from WSL2: what was the real blocker — no passthrough, no driver, or no monitor-mode support?',
      'Could you capture a full WPA2 handshake on your own network? What made it succeed or fail?',
      "Is WPS enabled on your router — and now that you know why that matters, are you turning it off?",
      "What did GATT enumeration reveal about your own BLE devices — is anything readable or writable that shouldn't be?",
    ],
  },
  {
    id: 'p5',
    number: '05',
    title: 'Vulnerability Scanning Fundamentals',
    status: 'up-next',
    summary: 'Cross-checking installed versions against real CVEs with a proper scanner.',
    objectives: [
      'Cross-check installed versions against known CVEs',
      'Use OpenVAS or Nessus (free tier)',
      'Practice: a full CVE lookup across every device you own',
    ],
    notes: [
      {
        heading: 'From a banner to a CVE',
        paragraphs: [
          'Every CVE ID has a fixed shape: CVE-YYYY-NNNNN. Once you have a service name and version from Phase 1\u2019s banner grabbing, searching for that name and version against nvd.nist.gov (or a plain web search) tells you whether it maps to a known, scored vulnerability. The CVSS score runs 0\u201310 as a rough severity guide — treat anything 7 or above as worth prioritizing.',
        ],
      },
      {
        heading: 'Running an actual scanner',
        paragraphs: [
          "OpenVAS and Nessus (free/Essentials tier) do at scale what you were doing manually: fingerprint every service on a target and cross-reference a maintained CVE database automatically. The workflow is the same for either — install it, update its vulnerability feed, point it only at your own IP range, run the scan, then read the report critically. Automated scanners over-report; verify anything before you act on it.",
        ],
        commands: [{ comment: 'Scope every scan to your own lab range, nothing else', cmd: 'Target: 192.168.0.0/24   (your network only)' }],
      },
      {
        heading: 'Extra drill \u2014 running an actual OpenVAS/GVM scan end to end',
        paragraphs: [
          "The phase notes above describe the OpenVAS/Nessus workflow in general terms; here's the OpenVAS (Greenbone/GVM) version of it specifically, since it's the free option if you don't want to register for Nessus Essentials.",
          "Exercise: bring GVM up, confirm the feed has updated (a fresh install can take a while to sync CVE data \u2014 don't scan before it's ready), scope a scan to your PAN only, and once it's done, pick the single highest-severity finding and manually verify it the way you did in Phase 1 (banner grab, then look the version up yourself) before trusting the scanner's own severity rating.",
        ],
        commands: [
          { comment: 'First-time setup and check (Kali/Debian-based)', cmd: 'sudo gvm-setup\nsudo gvm-check-setup' },
          { comment: 'Start the service and check feed sync status', cmd: 'sudo gvm-start\nsudo gvm-feed-update' },
          { comment: 'Web UI once it\'s running', cmd: 'https://127.0.0.1:9392' },
        ],
      },
    ],
    thmRefs: ['Vulnerabilities 101', 'Nessus'],
    journal: [
      'Which device came back with the highest-severity CVE, and is it actually exploitable in your setup?',
      'How did the scanner\u2019s findings compare with what you found manually in Phases 00\u201301?',
      "What's your plan for anything the scan flagged that you can't patch right away?",
    ],
  },
  {
    id: 'p6',
    number: '06',
    title: 'Safe Exploitation Practice',
    status: 'up-next',
    summary: 'Metasploitable2 and DVWA — popping a shell in a box built to be broken.',
    objectives: [
      'Set up Metasploitable2 / DVWA VMs',
      'Metasploit basics',
      "Practice: work through DVWA\u2019s difficulty levels, low to high",
      'Practice: get a shell on Metasploitable2',
      'Practice: THM Linux PrivEsc rooms, then repeat on your own VMs',
    ],
    notes: [
      {
        heading: 'Metasploit basics',
        paragraphs: [
          "msfconsole is Metasploit's interface. The core loop is always the same: search for a module matching a known vulnerability, load it with use, set the options it asks for (RHOSTS for the target, often LHOST for your own IP if it needs to catch a callback), then run it. Reading what a module actually does before firing it is part of the skill — the info command inside a loaded module shows you the CVE and mechanism it's built on.",
        ],
        commands: [
          {
            comment: 'Typical msfconsole flow',
            cmd: 'msfconsole\nsearch <service or CVE>\nuse <module path>\nset RHOSTS 192.168.0.15\nset LHOST 192.168.0.10\nrun',
          },
        ],
      },
      {
        heading: "DVWA's difficulty levels",
        paragraphs: [
          "DVWA implements the same vulnerability at four security levels — low, medium, high, impossible — so you can watch what a real fix actually looks like. Low has no protection at all; medium adds partial, often-bypassable filtering (like blacklisting a single keyword); high gets much closer to a correct implementation; impossible uses parameterized queries and proper output encoding. Working the same bug across all four teaches you the difference between 'looks fixed' and 'actually fixed.'",
        ],
      },
      {
        heading: 'Metasploitable2',
        paragraphs: [
          "Metasploitable2 is an intentionally vulnerable Linux VM built for exactly this kind of practice — it ships with known-vulnerable service versions on purpose, so you can run the full loop end to end: scan it, identify the CVE from the banner, find the matching Metasploit module, get a shell, and write down what you did. Treat those notes as the first draft of the reporting skill you'll use in Phase 7.",
        ],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s Blue room pattern, replayed on your own isolated VM',
        paragraphs: [
          "THM's \"Blue\" room walks the full loop \u2014 scan, identify a known SMB CVE from the version banner, find the matching Metasploit module, get a shell \u2014 against a purpose-built Windows target. Replaying the same loop against your own outdated Windows VM (on an isolated, host-only virtual network, never bridged to your real LAN) is the version of this that's actually yours to keep practicing.",
          "Exercise: confirm the SMB version on your own VM with nmap first, look up whether it's actually vulnerable before touching Metasploit, then run the same search \u2192 use \u2192 set \u2192 run loop from the Metasploit basics notes above. Write down the CVE ID once you've confirmed it, the way you would for a real finding.",
        ],
        commands: [
          { comment: 'Confirm the SMB version before assuming anything', cmd: 'nmap -p 445 --script smb-os-discovery,smb-vuln* 192.168.56.10' },
        ],
      },
      {
        heading: 'Extra drill \u2014 a full recon-to-root chain on a standalone CTF box',
        paragraphs: [
          "Metasploitable2 and DVWA are good for drilling one vulnerability class at a time. THM's \"Pickle Rick\" room is worth doing separately as a capstone for this phase \u2014 it's a single box that chains enumeration, a content-discovery find, and a privesc step together, closer to how a real engagement actually flows. Note that this one runs on THM's own hosted VPN target, not a box on your PAN \u2014 keep it clearly separate in your notes from everything else in this roadmap, which is all your own gear.",
          "Exercise: work it end to end without a walkthrough first, then write it up using the same Finding \u2192 Evidence \u2192 Risk \u2192 Fix shape you'll use for the trading bot in Phase 8.",
        ],
      },
    ],
    thmRefs: ['Metasploit: Introduction', 'Vulnversity', 'Basic Pentesting', 'Blue', 'Pickle Rick'],
    journal: [
      'Which DVWA security level changed your approach the most, and why?',
      'What exact vulnerability got you a shell on Metasploitable2 — walk it step by step?',
      'What single configuration change would have stopped that exploit from working?',
    ],
  },
  {
    id: 'p7',
    number: '07',
    title: 'Privilege Escalation Basics',
    status: 'up-next',
    summary: 'SUID, cron, and sudo -l on Linux; services and tokens on Windows.',
    objectives: [
      'Linux: SUID binaries, cron jobs, permissions, sudo -l, LinPEAS',
      'Windows: services, unquoted service paths, tokens, WinPEAS',
      'Practice: THM Linux PrivEsc rooms, then repeat on your own VMs',
    ],
    notes: [
      {
        heading: 'Linux privilege escalation',
        paragraphs: [
          'Once you have any shell, the goal is finding a path from that user to root. The classics: SUID binaries (files that run as their owner rather than the caller — check GTFOBins for anything on the list with a known privesc trick), cron jobs running as root that call a script you happen to have write access to, and sudo -l showing commands you can already run as root, some of which can be abused to spawn a root shell directly.',
        ],
        commands: [
          { comment: 'Find SUID binaries', cmd: 'find / -perm -4000 -type f 2>/dev/null' },
          { comment: 'Check what you can run as root without a password', cmd: 'sudo -l' },
          { comment: 'Run LinPEAS for an automated sweep of all of the above', cmd: './linpeas.sh' },
        ],
      },
      {
        heading: 'Windows privilege escalation',
        paragraphs: [
          "Windows has its own version of the same idea: services with an unquoted path containing a space (Windows tries each path segment as an executable in order, so you can plant one earlier in the chain), services with weak file or registry permissions you can redirect to your own binary, and access tokens that can be impersonated to inherit SYSTEM privileges. WinPEAS automates checking for all of these at once.",
        ],
        commands: [{ comment: 'Run WinPEAS for an automated sweep', cmd: 'winPEASx64.exe' }],
      },
      {
        heading: 'Extra drill \u2014 THM\u2019s John the Ripper room, applied to your own VM',
        paragraphs: [
          "Privilege escalation often turns up a hash rather than a plaintext password \u2014 a copied /etc/shadow, a config file, a database dump. THM's \"John the Ripper\" room covers cracking those offline; the practice worth repeating here is doing it against a hash you pulled yourself during this phase's work, not a sample file.",
          "Exercise: on your own Metasploitable2 or lab VM, pull /etc/passwd and /etc/shadow (once you already have a shell, as part of the privesc work above), combine them, and crack whatever you can. Note which accounts cracked instantly against rockyou.txt \u2014 that's the same weak-password lesson from Phase 4, one layer deeper into the system.",
        ],
        commands: [
          { comment: 'Combine passwd and shadow, then crack', cmd: 'unshadow passwd.txt shadow.txt > combined.txt\njohn combined.txt --wordlist=/usr/share/wordlists/rockyou.txt' },
          { comment: 'Show cracked results once John finishes (or partway through)', cmd: 'john --show combined.txt' },
        ],
      },
    ],
    thmRefs: ['Linux PrivEsc', 'Windows PrivEsc', 'John the Ripper'],
    journal: [
      'What did LinPEAS or WinPEAS surface that you would have missed by hand?',
      'Which privilege escalation path actually worked on your VM, and why did it exist in the first place?',
      "Hardening this box afterward — what's the first fix you'd make?",
    ],
  },
  {
    id: 'p8',
    number: '08',
    title: 'Reporting & Remediation',
    status: 'up-next',
    summary: 'Turning findings on the trading bot into a report someone could act on.',
    objectives: [
      'Practice the flow: Finding \u2192 Evidence \u2192 Risk \u2192 Fix',
      'Practice: write a mini-report on the trading bot (you already have 4 findings)',
    ],
    notes: [
      {
        heading: 'The Finding \u2192 Evidence \u2192 Risk \u2192 Fix flow',
        paragraphs: [
          "A finding without evidence is just an opinion, and a finding without a fix isn't actionable. Every entry in a real report follows the same shape: what's wrong (Finding), proof it's real (Evidence — a request/response pair, a screenshot, a log line), how bad it actually is (Risk — who can exploit it and what they'd get), and what specifically closes it (Fix — not 'improve security', the actual change).",
        ],
        commands: [
          {
            comment: 'One finding, written out in full',
            cmd:
              'Finding: IDOR on GET /api/orders/{id}\n' +
              "Evidence: Authenticated as user A, changed {id} to a value belonging to user B, received B's full order data (200 OK)\n" +
              'Risk: Any authenticated user can read any other user\u2019s order history \u2014 no extra privilege required\n' +
              "Fix: Verify the requested order's user_id matches the authenticated session before returning data",
          },
        ],
      },
      {
        heading: 'Extra drill \u2014 a running findings ledger, in THM\u2019s reporting shape',
        paragraphs: [
          "THM's \"Pentesting Fundamentals\" room covers the Finding \u2192 Evidence \u2192 Risk \u2192 Fix shape in the abstract. The exercise worth doing here is turning it into an actual living file rather than a one-off report \u2014 something you append to every time this roadmap turns up something new, not just at the end.",
          "Exercise: create a findings.md in your notes, tagged by phase number, and back-fill it with everything you've already found on the trading bot so far. Keep it running forward from here instead of writing the whole report in one sitting at the end.",
        ],
        commands: [
          {
            comment: 'Markdown template for one row in the ledger',
            cmd:
              '## [Phase 2] IDOR on GET /api/orders/{id}\n' +
              '- Evidence: <request/response pair>\n' +
              '- Risk: <one sentence, plain language>\n' +
              '- Fix: <specific change>\n' +
              '- Status: open | fixed | accepted risk',
          },
        ],
      },
    ],
    thmRefs: ['Pentesting Fundamentals'],
    journal: [
      'For each of the 4 trading bot findings, can you state the risk in one sentence a non-technical reader would understand?',
      'What evidence — screenshot, request/response, log line — backs up each finding?',
      "What's the concrete fix for each issue, and roughly how long would it take to ship?",
    ],
  },
  {
    id: 'p9',
    number: '09',
    title: 'Formal Track (Parallel)',
    status: 'up-next',
    summary: 'THM learning paths and an optional certification to validate the reps.',
    objectives: [
      'THM Pre Security path — if you find gaps',
      'THM Jr Penetration Tester path',
      'Optional certs: PT1 or eJPT',
    ],
    notes: [
      {
        heading: 'What Pre Security actually covers',
        paragraphs: [
          "THM's Pre Security path is the on-ramp for anything that felt shaky in Phases 00\u201302: how the internet actually works, basic Linux/Windows fundamentals, and introductory security concepts. Worth doing selectively — skim straight to the modules covering your actual gaps rather than the whole path front to back if the fundamentals already feel solid.",
        ],
      },
      {
        heading: 'Jr Penetration Tester and certification',
        paragraphs: [
          'The Jr Penetration Tester path is structured almost identically to this roadmap \u2014 recon, scanning, exploitation basics, web app testing, privilege escalation, reporting \u2014 so most of Phases 00\u201307 double as prep for it directly. PT1 and eJPT are both entry-level, mostly practical (hands-on lab) certifications rather than pure multiple-choice exams, which is exactly why the reps from this roadmap transfer straight over.',
        ],
      },
      {
        heading: 'Extra drill \u2014 self-audit against the Jr Penetration Tester path',
        paragraphs: [
          "Rather than starting the Jr Penetration Tester path cold, it's worth mapping what you've already drilled in Phases 00\u201307 against its module list first \u2014 you'll likely fly through some sections and can slow down on the ones that are genuinely new.",
          "Exercise: for each module in the path, mark it as \"solid rep already\" or \"new to me\" based on this roadmap, then decide between PT1 and eJPT using that map \u2014 both are hands-on practical exams rather than multiple choice, so the deciding factor is usually cost and format, not which one \"teaches\" more.",
        ],
      },
    ],
    thmRefs: ['Pre Security path', 'Jr Penetration Tester path'],
    journal: [
      'Which Jr Penetration Tester topics do you already have solid hands-on reps in from Phases 00\u201307?',
      'Where did you hit a real knowledge gap that Pre Security would actually fill?',
      'Is a cert worth it for you right now, or does the hands-on portfolio already do the job?',
    ],
  },
]

export const statusLabel = {
  done: 'Done',
  'in-progress': 'In progress',
  'up-next': 'Up next',
}
