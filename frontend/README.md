# Wispr Clone – Voice to Text Desktop App

This project is a functional clone of **Wispr Flow**, built as part of a technical
assignment to demonstrate cross-platform desktop application development using
**Tauri** and **React**, with a focus on voice input workflows.

The application implements a push-to-talk interface that captures microphone input
and manages recording state in a clean, minimal desktop UI.

---

## Tech Stack

- **Tauri** – Cross-platform desktop application framework
- **React + Vite** – Frontend UI and state management
- **JavaScript**
- **Web Media APIs** – Microphone access (`getUserMedia`)
- **Rust** – Backend (via Tauri)

---

## Features Implemented

- Push-to-talk voice recording interface
- Microphone permission handling
- Recording start / stop controls
- Clear recording status feedback
- Desktop application build using Tauri
- Clean and minimal UI focused on functionality
- Graceful error handling when microphone access is denied or unavailable

---

## Project Structure
frontend/
├── src/
│ └── App.jsx # Main React UI and recording logic
├── src-tauri/
│ ├── tauri.conf.json # Tauri configuration
│ └── entitlements.plist # macOS microphone entitlement
├── README.md
└── package.json

---

## How to Run (Development)

```bash
npm install
npm run dev


(That is **three backticks** on a new line)

---

## STEP 2 — Add Desktop run instructions

Now, **below that**, paste this exactly:

```md
This runs the frontend in the browser for quick testing.

---

## Run as Desktop App (Tauri)

```bash
npm run tauri dev


---

## STEP 3 — Add macOS microphone note (FINAL section)

Now scroll to the **very bottom** and paste this:

```md
---

## Microphone Permission Note (macOS)

On macOS (especially Ventura and Sonoma), microphone permission prompts may not
appear for Tauri applications running in development mode or unsigned local builds.

This is a known macOS limitation where the operating system does not register the
application as a microphone requester unless the app is code-signed with a valid
Apple Developer ID.

The application includes:
- Explicit microphone permission request using `navigator.mediaDevices.getUserMedia`
- Proper macOS entitlements (`com.apple.security.device.audio-input`)
- Graceful handling when permission is denied or blocked

In a signed production build, the microphone permission prompt would appear
correctly and function as expected.


