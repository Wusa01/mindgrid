document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&G.endAt)finish()});
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
load();applyTheme();home();
