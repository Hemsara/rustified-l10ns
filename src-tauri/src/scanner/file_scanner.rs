use std::path;

pub fn dfs_traverse_dir(dir_path: String, dart_files: &mut Vec<String>) {
    let lib_dir = path::Path::new(&dir_path);

    let entries = lib_dir.read_dir();
    if entries.is_err() {
        println!("Error reading directory: {:?}", entries.err());
        return;
    }
    for entry in lib_dir
        .read_dir()
        .unwrap_or_else(|_| panic!("Failed to read directory: {}", dir_path))
    {
        if let Ok(entry) = entry {
            let path = entry.path();
            if is_dart_file(&path) {
                dart_files.push(path.to_str().unwrap().to_string());
            } else if path.is_dir() {
                if let Some(path_str) = path.to_str() {
                    dfs_traverse_dir(path_str.to_string(), dart_files);
                }
            }
        }
    }
}

fn is_dart_file(file_path: &path::Path) -> bool {
    if let Some(extension) = file_path.extension() {
        return extension == "dart";
    }
    false
}
