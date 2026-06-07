function compressImage(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const img = new Image();
    
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = 800;
      canvas.height = (img.height / img.width) * 800;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      callback(canvas.toDataURL("image/jpeg", 0.7));
    };
    
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}