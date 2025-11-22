mod analyzer;
mod commands;
mod config;
mod data;
mod scanner;
mod utils;

use std::sync::Arc;

use crate::commands::scanner::ScanState;
use crate::commands::{get_projects, greet, scan_dart_files, stop_scan, validate_folder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(Arc::new(ScanState::default()))
        .invoke_handler(tauri::generate_handler![
            greet,
            validate_folder,
            get_projects,
            scan_dart_files,
            stop_scan
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
