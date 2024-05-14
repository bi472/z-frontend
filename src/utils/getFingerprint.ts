export async function generateFingerprint (): Promise<string> {
    const userAgent = `${navigator.hardwareConcurrency} ${navigator.maxTouchPoints} ${navigator.userAgent}`;
  
    let fingerprint = userAgent;
  
    if (crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(userAgent);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      fingerprint = await hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  
    return fingerprint;
  }
  