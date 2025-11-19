use std::env;
use std::process::Command;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct ExtractedString {
    key: String,
    value: String,
    file_name: String,
}

pub fn run_dart_analyzer(file_path: &str) -> Vec<ExtractedString> {
    let mut extracted_strings: Vec<ExtractedString> = Vec::new();

    let dart_path = get_dart_path();

    let output = Command::new("dart")
        .arg("run")
        .arg(format!("{}/bin/extract_strings.dart", dart_path))
        .arg(file_path)
        .output()
        .expect("Failed to run Dart script");
    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout);
        for line in result.lines() {
            if line.starts_with('$') || line.len() <= 1 {
                continue;
            }
            extracted_strings.push(ExtractedString {
                key: generate_translation_key(line),
                value: line.to_string(),
                file_name: file_path.to_string(),
            });
        }
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        println!("Error running Dart script on {}:\n{}", file_path, error);
    }
    extracted_strings
}

fn generate_translation_key(text: &str) -> String {
    text.split_whitespace()
        .take(3)
        .map(|word| {
            word.chars()
                .filter(|c| c.is_alphanumeric())
                .collect::<String>()
                .to_lowercase()
        })
        .filter(|word| !word.is_empty())
        .collect::<Vec<String>>()
        .join(".")
}

fn get_dart_path() -> String {
    let exe_path = env::current_exe().expect("Failed to get current executable path");

    let exe_dir = exe_path
        .parent()
        .expect("Failed to get executable directory");

    let project_root = exe_dir
        .parent()
        .expect("Failed to get target directory")
        .parent()
        .expect("Failed to get project root");

    let dart_path = project_root.join("extract_strings");

    dart_path
        .to_str()
        .expect("Failed to convert path to string")
        .to_string()
}
