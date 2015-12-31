# To Do

- Got exifReader and filenameReader working.  They can extract the date from
  a specified file.
  
- Analyze the subdirectories in libraryDir.
- Build a hash of the date each subfolder represents to the folder's path.
- When importing images, we should lookup the date in this hash and (if found)
  copy the file into that directory (if it doesn't already exist).

- Need to recursively scan a directory structure and see if the folder names
  match what we think it should.
  
- Do not import files that are already in the library (named the same and potentially
  modified).