use crate::analyzer::dart_analyzer::ExtractedString;
use crate::analyzer::run_dart_analyzer;
use crate::scanner::dfs_traverse_dir;

#[tauri::command]
pub fn scan_dart_files(dir_path: String) -> Vec<ExtractedString> {
    let mut dart_files: Vec<String> = Vec::new();

    let lib_path = std::path::Path::new(&dir_path).join("lib");
    dfs_traverse_dir(lib_path.to_string_lossy().to_string(), &mut dart_files);

    let mut all_extracted_strings: Vec<ExtractedString> = Vec::new();

    for file in &dart_files {
        let extracted_strings = run_dart_analyzer(file);
        all_extracted_strings.extend(extracted_strings);
    }

    all_extracted_strings
}
