use std::path;

pub fn check_path_exists(dir_path: &str) -> bool {
    path::Path::new(dir_path.trim()).is_dir()
        && path::Path::new(dir_path).join("pubspec.yaml").is_file()
        && path::Path::new(dir_path).join("lib").is_dir()
}
