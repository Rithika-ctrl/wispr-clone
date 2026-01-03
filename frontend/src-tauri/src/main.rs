#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use std::env;
use std::fs::{self, File};
use std::io::Read;
use std::path::PathBuf;
use dotenvy::dotenv;

#[command]
fn save_audio_file(audio: Vec<u8>) -> Result<String, String> {
    // Save audio to temp directory
    let mut path = PathBuf::from(env::temp_dir());
    path.push("recording.wav");

    fs::write(&path, audio)
        .map_err(|e| format!("Failed to save audio file: {}", e))?;

    Ok(path.to_string_lossy().to_string())
}

#[command]
async fn transcribe_audio(file_path: String) -> Result<String, String> {
    // Load Deepgram API key
    let api_key = env::var("DEEPGRAM_API_KEY")
        .map_err(|_| "Deepgram API key not found in .env".to_string())?;

    // Read audio file
    let mut file = File::open(&file_path)
        .map_err(|e| format!("Failed to open audio file: {}", e))?;

    let mut audio_buffer = Vec::new();
    file.read_to_end(&mut audio_buffer)
        .map_err(|e| format!("Failed to read audio file: {}", e))?;

    // Send audio to Deepgram
    let client = reqwest::Client::new();
    let response = client
        .post("https://api.deepgram.com/v1/listen?model=nova-2&language=en")
        .header("Authorization", format!("Token {}", api_key))
        .header("Content-Type", "audio/wav")
        .body(audio_buffer)
        .send()
        .await
        .map_err(|e| format!("Deepgram request failed: {}", e))?;

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Deepgram response: {}", e))?;

    // Extract transcript
    let transcript = json["results"]["channels"][0]["alternatives"][0]["transcript"]
        .as_str()
        .unwrap_or("")
        .to_string();

    Ok(transcript)
}

fn main() {
    // Load environment variables from .env
    dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_audio_file,
            transcribe_audio
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
