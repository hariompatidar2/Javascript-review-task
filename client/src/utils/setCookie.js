export const setCookies=(token)=>{
    document.cookie = `token=${token}; path=/; expires=${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString()};`;
}