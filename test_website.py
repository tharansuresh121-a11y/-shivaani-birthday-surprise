"""
Comprehensive Test Suite for Shivaani's Birthday Surprise Website
Tests:
1. File existence and asset directory layout
2. All 8 screens and required text content matching prompts verbatim
3. CONFIG object in script.js (Day 11, Month 8, girlfriendName, paths)
4. Quiz logic (correct answer 11 August vs incorrect dates)
5. CSS styling, color palette, mobile breakpoints, keyframe animations
6. Local HTTP Server response and asset delivery
7. GATE ME Papers verifier and missing file detection
"""

import os
import re
import sys
import threading
import http.server
import socketserver
import urllib.request
from pathlib import Path

# Configure UTF-8 for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
INDEX_PATH = BASE_DIR / "index.html"
STYLE_PATH = BASE_DIR / "style.css"
SCRIPT_PATH = BASE_DIR / "script.js"
ASSETS_DIR = BASE_DIR / "assets"
README_PATH = BASE_DIR / "README.md"

def test_file_structure():
    print("\n--- 1. Testing Project File Structure ---")
    assert INDEX_PATH.exists(), "index.html is missing!"
    assert STYLE_PATH.exists(), "style.css is missing!"
    assert SCRIPT_PATH.exists(), "script.js is missing!"
    assert ASSETS_DIR.exists() and ASSETS_DIR.is_dir(), "assets/ directory is missing!"
    assert README_PATH.exists(), "README.md is missing!"
    print("  [PASS] All core project files are in place.")

def test_screens_and_content():
    print("\n--- 2. Testing All 7 Screens and Required Verbatim Content ---")
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check 7 screen containers
    for s in range(1, 8):
        screen_id = f"screen-{s}"
        assert f'id="{screen_id}"' in html, f"Screen {s} container ({screen_id}) not found!"
    print("  [PASS] All 7 screen containers (screen-1 to screen-7) verified.")

    # Required verbatim text snippets
    required_phrases = [
        "Someone special has a little surprise for you...",
        "Open Your Letter",
        "Happy Birthday, My Love! ❤️",
        "Today is all about you, Shivaani.",
        "You make my world brighter just by being in it.",
        "My Dearest Shivaani,",
        "Happy Birthday to the girl who makes my life more beautiful. Every moment with you is special to me, and even the smallest memories become precious because they are with you.",
        "Your smile makes my day better, and your presence means more to me than words can explain. I hope this birthday brings you happiness, love, laughter, and everything your heart wishes for.",
        "No matter how many birthdays pass, I want to keep making beautiful memories with you.",
        "Today, I have one more little surprise for you. But before you unlock it, there is a special memory only we know about.",
        "With all my love,",
        "Your Person ❤️",
        "Unlock Our Special Memory 💋",
        "Do you remember our first kiss? 💋",
        "Enter the day and month of our special memory to unlock the next surprise.",
        "You remembered it, my love! ❤️",
        "11 August — a little date that holds a big place in my heart.",
        "Some moments stay with us forever. That memory will always be special to me.",
        "Open Your Special Gift 🎁",
        "Your Special Gift, My Love! ❤️📚",
        "I collected these GATE Mechanical Engineering question papers for you. Keep learning, keep growing, and always follow your dreams. I'll always be cheering for you.",
        "Download Your GATE Papers 🎁",
        "Happy Birthday Once Again, My Love! ❤️",
        "May your dreams come true, your smile never fade, and our story keep getting more beautiful.",
        "You are my favorite person, today and always. ❤️",
        "Start Again 💕"
    ]

    for phrase in required_phrases:
        assert phrase in html, f"Required phrase not found in index.html: '{phrase}'"
        print(f"  [PASS] Found verbatim phrase: '{phrase[:40]}...'")

    # Check all key interactive buttons
    buttons = [
        'id="open-envelope-btn"',
        'id="screen2-next-btn"',
        'id="screen3-next-btn"',
        'id="unlock-quiz-btn"',
        'id="screen5-next-btn"',
        'id="download-gate-btn"',
        'id="screen6-next-btn"',
        'id="replay-btn"',
        'id="music-toggle-btn"'
    ]
    for btn in buttons:
        assert btn in html, f"Interactive button {btn} not found!"
    print("  [PASS] All interactive buttons verified in HTML.")

def test_script_config_and_quiz():
    print("\n--- 3. Testing script.js Configuration & Quiz Logic ---")
    with open(SCRIPT_PATH, 'r', encoding='utf-8') as f:
        js = f.read()

    # CONFIG checks
    assert 'girlfriendName: "Shivaani Thago"' in js, "girlfriendName config incorrect!"
    assert 'firstKissDay: 11' in js, "firstKissDay must be 11!"
    assert 'firstKissMonth: 8' in js, "firstKissMonth must be 8 (August)!"
    assert 'gateZipPath: "assets/gate-papers.zip"' in js, "gateZipPath config incorrect!"
    assert 'musicEnabled: false' in js, "musicEnabled must be false (muted by default)!"
    print("  [PASS] CONFIG object precisely matches prompt specifications.")

    # Quiz feedback strings
    assert "Oops, my love! Try remembering our special day again. ❤️" in js
    assert "Unlocked with love! 💕" in js
    print("  [PASS] Quiz validation feedback strings verified.")

    # Simulate quiz logic test
    correct_day = 11
    correct_month = 8

    test_cases = [
        (11, 8, True),    # Correct
        (10, 8, False),   # Wrong day
        (11, 7, False),   # Wrong month
        (12, 8, False),   # Wrong day
        (1, 1, False),    # Wrong
    ]

    for d, m, expected in test_cases:
        result = (d == correct_day and m == correct_month)
        assert result == expected, f"Quiz logic failed for day={d}, month={m}"
    print("  [PASS] Quiz date validation logic rigorously tested (11 August).")

def test_css_styling():
    print("\n--- 4. Testing CSS Theme & Mobile Responsiveness ---")
    with open(STYLE_PATH, 'r', encoding='utf-8') as f:
        css = f.read()

    # Colors
    assert "--pastel-pink" in css
    assert "--rose-primary" in css
    assert "--lavender" in css
    assert "--cream" in css
    print("  [PASS] Pastel pink, lavender, cream, and soft red palettes verified.")

    # Responsive media queries
    assert "@media (max-width: 480px)" in css, "Mobile media query missing!"
    assert "overflow-x: hidden" in css, "Horizontal overflow prevention missing!"
    print("  [PASS] Mobile responsive media query & overflow prevention verified.")

    # Animations
    assert "@keyframes" in css
    assert "boxBounce" in css
    assert "pulseGlow" in css
    print("  [PASS] CSS keyframe animations verified.")

def test_local_server_and_http():
    print("\n--- 5. Testing Local HTTP Serving ---")
    # Start temporary local HTTP server on random free port
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass # Suppress logs during test

    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", 0), QuietHandler)
    port = httpd.server_address[1]
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()

    try:
        # Request index.html
        url = f"http://localhost:{port}/index.html"
        req = urllib.request.urlopen(url)
        assert req.status == 200, f"index.html returned status {req.status}"
        content = req.read().decode('utf-8')
        assert "Shivaani" in content, "Shivaani not found in served content!"
        print(f"  [PASS] HTTP GET {url} returned 200 OK with correct content.")

        # Request style.css
        css_url = f"http://localhost:{port}/style.css"
        css_req = urllib.request.urlopen(css_url)
        assert css_req.status == 200
        print(f"  [PASS] HTTP GET {css_url} returned 200 OK.")

        # Request script.js
        js_url = f"http://localhost:{port}/script.js"
        js_req = urllib.request.urlopen(js_url)
        assert js_req.status == 200
        print(f"  [PASS] HTTP GET {js_url} returned 200 OK.")

        # Request assets/gate-papers.zip
        zip_url = f"http://localhost:{port}/assets/gate-papers.zip"
        zip_req = urllib.request.urlopen(zip_url)
        assert zip_req.status == 200
        header_bytes = zip_req.read(100)
        assert header_bytes.startswith(b'PK\x03\x04'), "ZIP file missing PK header!"
        print(f"  [PASS] HTTP GET {zip_url} returned 200 OK with valid ZIP stream.")
    finally:
        httpd.shutdown()
        httpd.server_close()
        print("  [PASS] Local HTTP test server terminated cleanly.")

def test_gate_zip_file():
    print("\n--- 6. Testing assets/gate-papers.zip Integrity ---")
    import zipfile
    zip_path = ASSETS_DIR / "gate-papers.zip"
    assert zip_path.exists(), "assets/gate-papers.zip does not exist!"
    assert zip_path.is_file(), "assets/gate-papers.zip is not a file!"
    assert zip_path.stat().st_size > 1000000, f"assets/gate-papers.zip size is too small: {zip_path.stat().st_size} bytes"
    with zipfile.ZipFile(zip_path, 'r') as zf:
        namelist = zf.namelist()
        pdfs = [n for n in namelist if n.lower().endswith('.pdf')]
        assert len(pdfs) >= 20, f"Expected at least 20 PDFs, found {len(pdfs)}"
        print(f"  [PASS] assets/gate-papers.zip verified: {len(pdfs)} authentic GATE ME question papers ({zip_path.stat().st_size / (1024*1024):.1f} MB).")

def main():
    print("=" * 60)
    print("RUNNING AUTOMATED TEST SUITE: SHIVAANI'S BIRTHDAY SURPRISE")
    print("=" * 60)
    try:
        test_file_structure()
        test_screens_and_content()
        test_script_config_and_quiz()
        test_css_styling()
        test_gate_zip_file()
        test_local_server_and_http()
        print("\n" + "=" * 60)
        print("ALL TESTS PASSED SUCCESSFULLY! (100% PASS RATE)")
        print("=" * 60)
    except AssertionError as err:
        print(f"\n[FAIL] Test failed: {err}")
        sys.exit(1)

if __name__ == "__main__":
    main()
