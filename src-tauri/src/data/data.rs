use std::fs;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SavedProject {
    pub path: String,
    pub name: String,
    pub description: String,
}

fn projects_file_path(_app: &tauri::AppHandle) -> PathBuf {
    let dir = std::env::current_dir().unwrap();
    fs::create_dir_all(&dir).ok();

    dir.join("projects.json")
}

pub fn load_projects(app: &tauri::AppHandle) -> Vec<SavedProject> {
    let path = projects_file_path(app);

    if !path.exists() {
        return vec![];
    }

    let content = fs::read_to_string(path).unwrap_or("{}".to_string());
    serde_json::from_str(&content).unwrap_or(vec![])
}

pub fn save_projects(app: &tauri::AppHandle, p: &SavedProject) {
    let path = projects_file_path(app);

    let mut items = load_projects(app);
    items.push(p.clone());
    let content = serde_json::to_string_pretty(&items).unwrap();

    fs::write(path, content).unwrap();
}
