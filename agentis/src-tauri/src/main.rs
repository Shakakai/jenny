// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use std::thread;
use std::time::Duration;
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandChild;

struct SidecarState(Mutex<Option<CommandChild>>);

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .manage(SidecarState(Mutex::new(None)))
        .setup(|app| {
            // Spawn the backend sidecar
            let shell = app.shell();
            let (_, child) = shell
                .sidecar("agentis-backend")
                .expect("failed to create sidecar command")
                .spawn()
                .expect("failed to spawn sidecar");

            // Store the child handle
            let state = app.state::<SidecarState>();
            *state.0.lock().unwrap() = Some(child);

            // Get a handle to show window after health check
            let app_handle = app.handle().clone();

            // Poll health endpoint in a background thread
            thread::spawn(move || {
                let mut attempts = 0;
                let max_attempts = 10;
                let mut healthy = false;

                while attempts < max_attempts {
                    thread::sleep(Duration::from_secs(1));
                    attempts += 1;

                    match reqwest::blocking::get("http://localhost:57431/health") {
                        Ok(response) if response.status().is_success() => {
                            healthy = true;
                            break;
                        }
                        _ => {
                            eprintln!("Health check attempt {}/{} failed", attempts, max_attempts);
                        }
                    }
                }

                if healthy {
                    // Show the main window
                    if let Some(window) = app_handle.get_webview_window("main") {
                        window.show().expect("failed to show window");
                    }
                } else {
                    // Show error dialog and exit
                    eprintln!("Backend failed to start after {} attempts", max_attempts);
                    std::process::exit(1);
                }
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Kill the sidecar process
                let state = window.state::<SidecarState>();
                let mut guard = state.0.lock().unwrap();
                if let Some(child) = guard.take() {
                    let _ = child.kill();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
