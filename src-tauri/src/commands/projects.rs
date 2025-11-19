use std::fs;
use std::path;

use crate::config::read_yaml;
use crate::data::{load_projects, save_projects, SavedProject};
use crate::utils::check_path_exists;

#[tauri::command]
pub fn validate_folder(app: tauri::AppHandle, path: String) -> Result<SavedProject, String> {
    if !check_path_exists(&path) {
        return Err("The provided path is not a valid Flutter project.".into());
    }

    let l10n_scrapper_path = path::Path::new(&path).join("l10n_scrapper");
    if !l10n_scrapper_path.exists() {
        fs::create_dir(&l10n_scrapper_path)
            .map_err(|e| format!("Failed to create l10n_scrapper directory: {}", e))?;
    }
    let l10n_scrapper_yaml_path = l10n_scrapper_path.join("config.yaml");
    if !l10n_scrapper_yaml_path.exists() {
        fs::write(
            &l10n_scrapper_yaml_path,
            "# Configuration for l10n_scrapper\nscan_paths: ['lib/']\nlanguages: ['en', 'es', 'fr']\n",
        )
        .map_err(|e| format!("Failed to create config.yaml: {}", e))?;
    }

    let cfg = read_yaml(
        &path::Path::new(&path)
            .join("pubspec.yaml")
            .to_string_lossy(),
    )?;

    let prj = SavedProject {
        path: path.clone(),
        name: cfg.name,
        description: cfg.description.unwrap_or_default(),
    };
    save_projects(&app, &prj);

    Ok(prj)
}

#[tauri::command]
pub fn get_projects(app: tauri::AppHandle) -> Vec<SavedProject> {
    load_projects(&app)
}
