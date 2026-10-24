#!/usr/bin/env python3
"""
GATE ME Papers Packager and Verifier (2006 - 2025)
Packages authentic GATE Mechanical Engineering PDFs into assets/gate-papers.zip
with verification, session preservation, and an internal README manifest.
"""

import os
import sys
import zipfile
import re
from pathlib import Path

REQUIRED_YEARS = list(range(2006, 2026)) # 2006 to 2025 inclusive (20 years)

def is_valid_pdf(file_path: Path) -> bool:
    """Verifies that the file exists, has content, and starts with %PDF magic header."""
    if not file_path.is_file() or file_path.stat().st_size < 100:
        return False
    try:
        with open(file_path, 'rb') as f:
            header = f.read(5)
            return header.startswith(b'%PDF-')
    except Exception:
        return False

def scan_and_package(source_dir: str = "assets/gate_me_pdfs", output_zip: str = "assets/gate-papers.zip"):
    src_path = Path(source_dir)
    out_path = Path(output_zip)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("GATE Mechanical Engineering (ME) Papers Verifier & Packager")
    print(f"Checking target years: 2006 through 2025 ({len(REQUIRED_YEARS)} years)")
    print(f"Source folder: {src_path.resolve()}")
    print("=" * 60)

    if not src_path.exists():
        src_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory '{src_path}'. Place real GATE ME question paper PDFs here.")

    year_files = {year: [] for year in REQUIRED_YEARS}
    extra_files = []

    # Scan for PDF files
    for root, _, files in os.walk(src_path):
        for f in files:
            full_path = Path(root) / f
            if not f.lower().endswith(".pdf"):
                continue
            
            if not is_valid_pdf(full_path):
                print(f"[WARNING] Skipping non-PDF or corrupt file: {f}")
                continue

            # Identify year from filename (handles underscores, hyphens, spaces, etc.)
            match = re.search(r'(?:^|[^0-9])(200[6-9]|201[0-9]|202[0-5])(?:[^0-9]|$)', f)
            if match:
                year = int(match.group(1))
                year_files[year].append(full_path)
            else:
                extra_files.append(full_path)

    # Summary
    present_years = [y for y in REQUIRED_YEARS if len(year_files[y]) > 0]
    missing_years = [y for y in REQUIRED_YEARS if len(year_files[y]) == 0]

    print("\n--- Year-by-Year Verification ---")
    for y in REQUIRED_YEARS:
        files = year_files[y]
        if files:
            file_names = ", ".join([f.name for f in files])
            print(f"  [OK] {y}: {len(files)} file(s) ({file_names})")
        else:
            print(f"  [--] {y}: MISSING")

    print("\n--- Summary ---")
    print(f"Years Present: {len(present_years)} / {len(REQUIRED_YEARS)}")
    print(f"Years Missing: {len(missing_years)} / {len(REQUIRED_YEARS)}")

    if len(missing_years) > 0:
        print(f"\nMissing Years: {', '.join(map(str, missing_years))}")

    # Build README manifest for inside the ZIP
    manifest_lines = [
        "==================================================================",
        "GATE MECHANICAL ENGINEERING (ME) QUESTION PAPERS (2006 - 2025)",
        "Curated with love for Shivaani Thago ❤️",
        "Happy Birthday! Keep learning, keep growing, and chase your dreams!",
        "==================================================================",
        "",
        f"Verification Date: 2026",
        f"Total Target Years: {len(REQUIRED_YEARS)} (2006 to 2025)",
        f"Years Included: {len(present_years)}",
        f"Years Pending: {len(missing_years)}",
        "",
        "--- INCLUDED QUESTION PAPERS ---"
    ]

    for y in REQUIRED_YEARS:
        files = year_files[y]
        if files:
            manifest_lines.append(f"Year {y}:")
            for f in files:
                size_kb = f.stat().st_size / 1024
                manifest_lines.append(f"  - {f.name} ({size_kb:.1f} KB)")
        else:
            manifest_lines.append(f"Year {y}: Pending / Missing from source")

    if extra_files:
        manifest_lines.append("\n--- ADDITIONAL PAPERS / REFERENCE MATERIAL ---")
        for f in extra_files:
            manifest_lines.append(f"  - {f.name}")

    manifest_lines.extend([
        "",
        "==================================================================",
        "Instructions to add remaining years:",
        "Drop the missing year PDFs into the 'assets/gate_me_pdfs/' folder and",
        "run 'python package_gate_papers.py' to repackage this ZIP.",
        "=================================================================="
    ])

    readme_content = "\n".join(manifest_lines)

    # Only package into gate-papers.zip if at least one authentic PDF is provided
    total_found_pdfs = sum(len(v) for v in year_files.values()) + len(extra_files)

    if total_found_pdfs == 0:
        print("\n[NOTICE] No authentic GATE ME PDFs found yet in 'assets/gate_me_pdfs/'.")
        print("Per project requirements, an empty or fake ZIP will NOT be generated.")
        print("To package the ZIP:")
        print("  1. Copy your real GATE ME PDF papers (2006-2025) into 'assets/gate_me_pdfs/'")
        print("  2. Run 'python package_gate_papers.py'")
        print("The website will immediately detect and activate 'assets/gate-papers.zip'.")
        return False, present_years, missing_years

    print(f"\nPackaging {total_found_pdfs} verified PDF(s) into '{out_path}'...")
    with zipfile.ZipFile(out_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        # Write README manifest first
        zf.writestr("README_GATE_ME_PAPERS.txt", readme_content.encode("utf-8"))

        # Write each PDF
        for y, flist in year_files.items():
            for f in flist:
                arcname = f"GATE_ME_{y}/{f.name}"
                zf.write(f, arcname=arcname)
                print(f"  Added: {arcname}")

        for f in extra_files:
            arcname = f"GATE_ME_Other/{f.name}"
            zf.write(f, arcname=arcname)
            print(f"  Added: {arcname}")

    zip_size_mb = out_path.stat().st_size / (1024 * 1024)
    print(f"\n[SUCCESS] '{out_path}' created successfully ({zip_size_mb:.2f} MB)!")
    return True, present_years, missing_years

if __name__ == "__main__":
    scan_and_package()
