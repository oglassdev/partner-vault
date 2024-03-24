// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_http::reqwest;

#[tauri::command]
async fn report_email(team_id: String, token: String) -> Result<(), String> {
    let client = reqwest::Client::new();
    let response = client
        .post("https://jmdvrevzgaryrzhlzpgd.supabase.co/functions/v1/report_email")
        .bearer_auth(token)
        .json(&serde_json::json!({
            "teamId": team_id,
        }))
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                Ok(())
            } else {
                Err(format!("Server returned an error: {}", res.status()))
            }
        }
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![report_email])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
