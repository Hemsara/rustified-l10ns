use crate::analyzer::dart_analyzer::ExtractedString;
use crate::analyzer::run_dart_analyzer;
use crate::scanner::dfs_traverse_dir;

use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProgressPayload {
    status: String,
    file: Option<String>,
    index: Option<usize>,
    total: Option<usize>,
    message: Option<String>,
}

pub struct ScanState {
    pub is_cancelled: AtomicBool,
}

impl Default for ScanState {
    fn default() -> Self {
        Self {
            is_cancelled: AtomicBool::new(false),
        }
    }
}

#[tauri::command]
pub fn stop_scan(app_handle: AppHandle) -> Result<(), String> {
    if let Some(state) = app_handle.try_state::<Arc<ScanState>>() {
        state.is_cancelled.store(true, Ordering::SeqCst);
        let _ = app_handle.emit(
            "scan-stopped",
            ProgressPayload {
                status: "stopped".into(),
                file: None,
                index: None,
                total: None,
                message: Some("Scan cancelled by user".into()),
            },
        );
    }
    Ok(())
}

#[tauri::command]
pub fn scan_dart_files(dir_path: String, app_handle: AppHandle) -> Result<(), String> {
    let app = app_handle.clone();

    // Reset the cancelled flag
    if let Some(state) = app_handle.try_state::<Arc<ScanState>>() {
        state.is_cancelled.store(false, Ordering::SeqCst);
    }

    let scan_state = app_handle
        .try_state::<Arc<ScanState>>()
        .map(|s| Arc::clone(&s));

    tauri::async_runtime::spawn_blocking(move || {
        if dir_path.is_empty() {
            let _ = app.emit(
                "scan-error",
                ProgressPayload {
                    status: "error".into(),
                    file: None,
                    index: None,
                    total: None,
                    message: Some("No directory provided".into()),
                },
            );
            return;
        }
        let _ = app.emit(
            "scan-started",
            ProgressPayload {
                status: "started".into(),
                file: None,
                index: None,
                total: None,
                message: Some(format!("Scanning {}", dir_path)),
            },
        );
        let lib_path = std::path::Path::new(&dir_path).join("lib");
        let mut dart_files: Vec<String> = Vec::new();
        dfs_traverse_dir(lib_path.to_string_lossy().to_string(), &mut dart_files);

        let total_files = dart_files.len();
        let mut all_extracted: Vec<ExtractedString> = Vec::new();

        for (index, file) in dart_files.iter().enumerate() {
            // Check if scan was cancelled
            if let Some(ref state) = scan_state {
                if state.is_cancelled.load(Ordering::SeqCst) {
                    let _ = app.emit(
                        "scan-stopped",
                        ProgressPayload {
                            status: "stopped".into(),
                            file: None,
                            index: Some(index),
                            total: Some(total_files),
                            message: Some("Scan cancelled by user".into()),
                        },
                    );
                    return;
                }
            }

            let _ = app.emit(
                "scan-file-started",
                ProgressPayload {
                    status: "scanning_file".into(),
                    file: Some(file.clone()),
                    index: Some(index + 1),
                    total: Some(total_files),
                    message: Some(format!(
                        "Scanning file {}/{}: {}",
                        index + 1,
                        total_files,
                        file
                    )),
                },
            );

            let extracted_strings = run_dart_analyzer(file);
            all_extracted.extend(extracted_strings);

            let _ = app.emit(
                "scan-file-done",
                ProgressPayload {
                    status: "file_done".into(),
                    file: Some(file.clone()),
                    index: Some(index + 1),
                    total: Some(total_files),
                    message: Some(format!(
                        "Completed file {}/{}: {}",
                        index + 1,
                        total_files,
                        file
                    )),
                },
            );
        }
        let _ = app.emit("scan-complete", all_extracted);
    });
    Ok(())
}
