# ❤️ Happy Birthday Shivaani! — Birthday Surprise Website

A cute, romantic, cartoon-style animated birthday website handcrafted with love for **Shivaani Thago**.

---

## 🌟 Features & Highlights

1. **Screen 1: The Birthday Envelope 💌**  
   - Interactive 3D envelope with a heart wax seal that unseals and reveals a letter on click.
2. **Screen 2: Birthday Greeting 🎂**  
   - Animated 3-tier birthday cake with a flickering candle, bobbing balloons, celebratory confetti, and staggered romantic messages.
3. **Screen 3: Personal Love Letter 💕**  
   - Vintage textured stationery card featuring the heartfelt personal birthday letter.
4. **Screen 4: First-Kiss Date Quiz 🔐**  
   - Animated heart-shaped lock. Shivaani enters the special date: **11 August** to unlock the surprise. Includes gentle hints for incorrect tries and unlimited attempts.
5. **Screen 5: First-Kiss Memory 💋**  
   - Glowing pulsing heart with orbital sparkles celebrating **11 August** and the unforgettable memory.
6. **Screen 6: Animated GATE Gift Box 🎁**  
   - Cute 3D bouncing gift box with golden ribbon. Clicking opens the lid with a burst of sparkles and confetti.
7. **Screen 7: GATE ME Papers Download 📚**  
   - Dedicated GATE Mechanical Engineering (2006–2025) download card with encouraging quotes and intelligent ZIP verification.
8. **Screen 8: One Last Hug ❤️**  
   - Adorable cartoon couple illustration with swirling hearts and a "Start Again 💕" button to replay the experience.
9. **Delightful Details:**  
   - 60 FPS HTML5 Canvas particle system (floating hearts, stars, petals, tap bursts).  
   - Romantic Web Audio API chime synthesizer (plays music-box arpeggios when toggled ON, muted by default).  
   - Top progress bar tracking each step.  
   - 100% mobile-friendly and responsive across Android smartphones, tablets, and desktops.

---

## 📁 Project File Structure

```text
shivaani-birthday-surprise/
├── index.html               # Main HTML5 application
├── style.css                # Romantic cartoon theme & responsive styling
├── script.js                # CONFIG, logic, quiz validation, particle canvas & audio
├── package_gate_papers.py   # GATE ME PDFs verifier and ZIP packager
├── README.md                # Project documentation & deployment guide
└── assets/                  # Assets directory
    ├── gate-papers.zip      # The packaged GATE ME question papers ZIP
    ├── music.mp3            # (Optional) Custom background music
    └── gate_me_pdfs/        # Folder to drop your original GATE ME PDF files
```

---

## ⚙️ Configuration (`script.js`)

At the top of `script.js`, you will find the `CONFIG` object:

```javascript
const CONFIG = {
  girlfriendName: "Shivaani Thago",
  firstKissDay: 11,
  firstKissMonth: 8, // 8 = August
  gateZipPath: "assets/gate-papers.zip",
  musicPath: "",     // e.g. "assets/music.mp3" if you want to use a specific song
  musicEnabled: false
};
```

---

## 🚀 How to Run the Website Locally

### Option 1: Simple Local Server (Recommended)
Open PowerShell or your terminal in this project folder and run:
```powershell
python -m http.server 8000
```
Then open your browser and go to:
[http://localhost:8000](http://localhost:8000)

### Option 2: Direct File Open
You can also directly double-click `index.html` to open it in Chrome, Edge, or Firefox.

---

## 📚 Packaging the GATE ME Question Papers (2006–2025)

To prepare the 20-year collection of GATE Mechanical Engineering question papers:

1. Copy your real GATE ME PDF files into the `assets/gate_me_pdfs/` folder.
2. Ensure filenames contain their corresponding year (e.g. `GATE_ME_2006.pdf`, `GATE_ME_2020_Set1.pdf`, `GATE_ME_2025.pdf`). All sessions/sets are preserved.
3. Run the automated verifier:
   ```powershell
   python package_gate_papers.py
   ```
4. The script will:
   - Verify every PDF's header and integrity.
   - Check off each year from 2006 through 2025.
   - Generate an internal `README_GATE_ME_PAPERS.txt` with a birthday message for Shivaani and a manifest of all papers.
   - Create `assets/gate-papers.zip`.
5. The website's download button will immediately detect `assets/gate-papers.zip` and enable the download!

> **Note on Verification**: The website will never trigger fake downloads or generate dummy files. If `gate-papers.zip` is not yet placed in `assets/`, a clear reminder notice is displayed to guide you.

---

## 🎵 (Optional) Adding Your Favorite Romantic Song

The website includes a built-in music box synthesizer that plays gentle chime notes when the visitor taps the **Music** button.

If you have a special romantic song (MP3) you both love:
1. Place the song file in the `assets/` folder (e.g. `assets/our-song.mp3`).
2. In `script.js`, update `CONFIG.musicPath`:
   ```javascript
   musicPath: "assets/our-song.mp3",
   ```
3. The website will play your song when music is toggled on!

---

## 🌐 Free Deployment Guide

You can host this website online for free so Shivaani can open it on her phone from anywhere.

### Method A: GitHub Pages (Free & Recommended)
1. Create a free account at [github.com](https://github.com) if you haven't already.
2. Click **New Repository** and name it `shivaani-surprise` (set it to **Public**).
3. Upload all files from this folder (`index.html`, `style.css`, `script.js`, `assets/`, etc.).
4. Go to **Settings** > **Pages** in your repository.
5. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
6. In 1–2 minutes, GitHub will provide your live link:
   `https://<your-username>.github.io/shivaani-surprise/`

### Method B: Netlify Drop (Instant Drag-and-Drop, No Code)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `shivaani-birthday-surprise` folder into the Netlify drop box.
3. Netlify will give you a live HTTPS link instantly (e.g. `https://sweet-shivaani-surprise.netlify.app`).
4. You can customize the site name for free in **Site configuration** > **Change site name**.

---

❤️ **Made with love for Shivaani Thago's Birthday!**
