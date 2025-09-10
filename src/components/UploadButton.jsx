import React, { useRef, useState } from "react";

export default function UploadButton({ onFiles }) {
  const ref = useRef();
  const [previews, setPreviews] = useState([]);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setPreviews(arr.map(f => ({ name: f.name, url: URL.createObjectURL(f) })));
    onFiles?.(arr);
  };

  return (
    <div>
      <input ref={ref} type="file" multiple accept="image/*" className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
      <button onClick={() => ref.current.click()} className="px-3 py-2 bg-[var(--accent)] rounded text-white">Choose Images</button>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {previews.map((p,i) => (
          <div key={i} className="w-full h-24 bg-[var(--bg)] rounded overflow-hidden">
            <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
          </div>
        ))}
      </div>
    </div>
  );
}
