function uploadMedia(file, path) {
  const ref = storage.ref().child(path + "/" + Date.now());
  
  return ref.put(file).then(snap => {
    return snap.ref.getDownloadURL();
  });
}