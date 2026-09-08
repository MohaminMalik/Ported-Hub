'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ placeholder, value, onChange, style }: any) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input 
        type={show ? 'text' : 'password'} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        style={style} 
      />
      <button 
        type="button"
        onClick={() => setShow(!show)} 
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
